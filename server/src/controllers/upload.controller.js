import { successResponse, errorResponse } from '../utils/response.js';

export async function handleFileUpload(req, res, next) {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file was uploaded.', 400, 'NO_FILE_UPLOADED');
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    return successResponse(
      res,
      {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        sizeBytes: req.file.size,
        url: fileUrl,
      },
      'File uploaded successfully',
      201
    );
  } catch (err) {
    next(err);
  }
}
