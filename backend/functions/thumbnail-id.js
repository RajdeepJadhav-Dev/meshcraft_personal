const connectToDatabase = require('../config/db');
const Thumbnail = require('../models/Thumbnail');
const mongoose = require('mongoose');
const { Readable } = require('stream');
const parser = require('lambda-multipart-parser');

const createResponse = (statusCode, body, headers = { 'Content-Type': 'application/json' }) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

const uploadToGridFS = async (fileBuffer, fileName) => {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'thumbnails',
  });
  const readableFile = new Readable();
  readableFile.push(fileBuffer);
  readableFile.push(null);
  const uploadStream = bucket.openUploadStream(fileName);
  return new Promise((resolve, reject) => {
    uploadStream.on('error', (error) => {
      console.error('GridFS Upload Error:', error);
      reject(new Error('Error uploading file to GridFS'));
    });
    uploadStream.on('finish', () => resolve(uploadStream.id));
    readableFile.pipe(uploadStream);
  });
};

const deleteFromGridFS = async (fileId) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'thumbnails',
  });
  return new Promise((resolve, reject) => {
    bucket.delete(fileId, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('GridFS Delete Error:', err);
        reject(new Error('Error deleting file from GridFS'));
      } else {
        resolve();
      }
    });
  });
};

exports.handler = async (event, context) => {
  try {
    await connectToDatabase();
  } catch (dbError) {
    console.error("DB Connection Error in Function:", dbError);
    return createResponse(500, { error: 'Database connection failed' });
  }

  const { httpMethod, queryStringParameters } = event;

  // --- Get ID from query parameter ---
  const thumbId = queryStringParameters?.id;

  if (!thumbId || !mongoose.Types.ObjectId.isValid(thumbId)) {
    return createResponse(400, { error: 'Invalid or missing thumbnail ID in query parameters' });
  }
  // --- End ID change ---

  if (httpMethod === 'GET') {
    try {
      const thumbDoc = await Thumbnail.findById(thumbId);
      if (!thumbDoc) {
        return createResponse(404, { error: 'Thumbnail document not found' });
      }
      return createResponse(200, thumbDoc);
    } catch (err) {
      console.error('Error fetching thumbnail doc:', err);
      return createResponse(500, { error: 'Internal server error fetching thumbnail doc' });
    }
  }

  if (httpMethod === 'PUT') {
    try {
      const thumbDoc = await Thumbnail.findById(thumbId);
      if (!thumbDoc) {
        return createResponse(404, { error: 'Thumbnail document not found' });
      }
      const result = await parser.parse(event);
      if (!result.files || result.files.length === 0) {
        return createResponse(400, { error: 'No new file provided. Ensure field name is "imageFile".' });
      }
      const file = result.files[0];
      const oldFileId = thumbDoc.fileId;
      try {
        await deleteFromGridFS(oldFileId);
      } catch (deleteErr) {
        console.warn(`Could not delete old GridFS file ${oldFileId}:`, deleteErr);
      }
      const fileName = file.filename || `thumbnail-${Date.now()}`;
      const fileBuffer = file.content;
      const newFileId = await uploadToGridFS(fileBuffer, fileName);
      thumbDoc.fileId = newFileId;
      thumbDoc.originalFileName = fileName;
      await thumbDoc.save();
      return createResponse(200, {
        message: 'Thumbnail replaced successfully',
        thumbnail: thumbDoc,
      });
    } catch (err) {
        if (err.message.includes('GridFS')) {
             return createResponse(500, { error: err.message });
        }
        if (err instanceof parser.MultipartError) {
             console.error('Parsing error:', err);
             return createResponse(400, { error: `File parsing error: ${err.message}` });
        }
      console.error('Error updating thumbnail:', err);
      return createResponse(500, { error: 'Internal server error updating thumbnail' });
    }
  }

  if (httpMethod === 'DELETE') {
    try {
      const thumbDoc = await Thumbnail.findById(thumbId);
      if (!thumbDoc) {
        return createResponse(200, { message: 'Thumbnail not found, considered deleted.' });
      }
      const fileIdToDelete = thumbDoc.fileId;
      await Thumbnail.deleteOne({ _id: thumbId });
      await deleteFromGridFS(fileIdToDelete);
      return createResponse(200, { message: 'Thumbnail doc and file removed successfully' });
    } catch (err) {
        if (err.message.includes('GridFS')) {
             return createResponse(500, { error: err.message });
        }
      console.error('Error deleting thumbnail:', err);
      return createResponse(500, { error: 'Internal server error deleting thumbnail' });
    }
  }

  return createResponse(405, { error: `HTTP method ${httpMethod} not allowed on this path` });
};