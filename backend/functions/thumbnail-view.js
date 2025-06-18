const connectToDatabase = require('../config/db');
const Thumbnail = require('../models/Thumbnail');
const mongoose = require('mongoose');

const createResponse = (statusCode, body, headers = {}, isBase64Encoded = false) => ({
  statusCode,
  headers,
  body,
  isBase64Encoded,
});

const getContentType = (filename) => {
  if (!filename) return 'application/octet-stream';
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'jpg': case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
};

const readFromGridFS = async (fileId) => {
  return new Promise((resolve, reject) => {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'thumbnails',
    });
    const downloadStream = bucket.openDownloadStream(fileId);
    const chunks = [];
    downloadStream.on('data', chunk => chunks.push(chunk));
    downloadStream.on('error', (error) => {
      console.error('GridFS Download Error:', error);
      if (error.code === 'ENOENT') {
        reject(new Error('FileNotFound'));
      } else {
        reject(new Error('Error streaming file from GridFS'));
      }
    });
    downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

exports.handler = async (event, context) => {
  try {
    await connectToDatabase();
  } catch (dbError) {
    console.error("DB Connection Error in Function:", dbError);
    return createResponse(500, JSON.stringify({ error: 'Database connection failed' }), { 'Content-Type': 'application/json' });
  }

  const { httpMethod, queryStringParameters } = event;

  if (httpMethod !== 'GET') {
    return createResponse(405, JSON.stringify({ error: 'Method Not Allowed' }), { 'Content-Type': 'application/json' });
  }

  // --- Get ID from query parameter ---
  const thumbId = queryStringParameters?.id;

  if (!thumbId || !mongoose.Types.ObjectId.isValid(thumbId)) {
    return createResponse(400, JSON.stringify({ error: 'Invalid or missing thumbnail ID in query parameters' }), { 'Content-Type': 'application/json' });
  }
  // --- End ID change ---

  let thumbDoc;
  try {
    thumbDoc = await Thumbnail.findById(thumbId);
    if (!thumbDoc) {
      return createResponse(404, JSON.stringify({ error: 'Thumbnail metadata not found' }), { 'Content-Type': 'application/json' });
    }
    const fileBuffer = await readFromGridFS(thumbDoc.fileId);
    const contentType = getContentType(thumbDoc.originalFileName);
    return createResponse(
        200,
        fileBuffer.toString('base64'),
        { 'Content-Type': contentType },
        true
    );
  } catch (err) {
    if (err.message === 'FileNotFound') {
        console.error(`GridFS file not found for Thumbnail ${thumbId}, fileId ${thumbDoc?.fileId}`);
        return createResponse(404, JSON.stringify({ error: 'Thumbnail image file not found' }), { 'Content-Type': 'application/json' });
    }
    console.error('Error viewing thumbnail:', err);
    return createResponse(500, JSON.stringify({ error: 'Internal server error viewing thumbnail' }), { 'Content-Type': 'application/json' });
  }
};