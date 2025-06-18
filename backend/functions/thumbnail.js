const connectToDatabase = require('../config/db');
const Thumbnail = require('../models/Thumbnail');
const Asset = require('../models/Assets');
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

    uploadStream.on('finish', () => {
      resolve(uploadStream.id);
    });

    readableFile.pipe(uploadStream);
  });
};

exports.handler = async (event, context) => {
  try {
    await connectToDatabase();
  } catch (dbError) {
    console.error("DB Connection Error in Function:", dbError);
    return createResponse(500, { error: 'Database connection failed' });
  }

  const { httpMethod } = event;

  if (httpMethod === 'GET') {
    try {
      const thumbs = await Thumbnail.find();
      return createResponse(200, thumbs);
    } catch (err) {
      console.error('Error fetching thumbnails:', err);
      return createResponse(500, { error: 'Internal server error fetching thumbnails' });
    }
  }

  if (httpMethod === 'POST') {
    try {
      const result = await parser.parse(event);

      if (!result.files || result.files.length === 0) {
        return createResponse(400, { error: 'No file uploaded. Ensure the field name is "imageFile".' });
      }
      const file = result.files[0];

      const { assetId } = result;
      if (!assetId) {
        return createResponse(400, { error: 'assetId is required' });
      }

      const assetDoc = await Asset.findById(assetId);
      if (!assetDoc) {
        return createResponse(404, { error: 'Asset not found' });
      }

      const fileName = file.filename || `thumbnail-${Date.now()}`;
      const fileBuffer = file.content;

      const fileId = await uploadToGridFS(fileBuffer, fileName);

      const newThumb = new Thumbnail({
        assetId: assetId,
        fileId: fileId,
        originalFileName: fileName,
      });
      const savedThumb = await newThumb.save();

      return createResponse(201, {
        message: 'Thumbnail uploaded successfully',
        thumbnail: savedThumb,
      });

    } catch (err) {
        if (err.message.includes('GridFS')) {
             return createResponse(500, { error: err.message });
        }
        if (err instanceof parser.MultipartError) {
             console.error('Parsing error:', err);
             return createResponse(400, { error: `File parsing error: ${err.message}` });
        }
      console.error('Error creating thumbnail:', err);
      return createResponse(500, { error: 'Internal server error creating thumbnail' });
    }
  }

  return createResponse(405, { error: `HTTP method ${httpMethod} not allowed on this path` });
};