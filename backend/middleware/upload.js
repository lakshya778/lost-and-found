const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lost-and-found',
    allowed_formats: ['jpg', 'jpeg', 'png', 'avif', 'webp'],
  },
});

const upload = multer({ storage });

module.exports = upload;