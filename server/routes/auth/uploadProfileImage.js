const express = require('express')
const router = express.Router()
const middleware = require('../middlewares')
const auth = require('../../models/auth')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ProfileImages',
    transformation: [
      {
        width: 250,
        height: 250,
        crop: 'limit',
      },
    ],
    public_id: (req) => {
      return req.username
    },
    // since username is unique, only the latest profile image for a user would be stored
    // even when the user uploads profile image multiple times
  },
})

const imageFilter = function (req, file, cb) {
  // accept image files only
  var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png']
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb('Invalid file type. Only jpg, png image files are allowed.', false)
  }
}

const uploadImage = multer({ storage: storage, fileFilter: imageFilter })

router.post(
  '/upload_profile_image',
  middleware.verifyUserAccessToken,
  uploadImage.single('profileImage'),
  async (request, response) => {
    auth
      .uploadProfileImage(request)
      .then((results) => {
        return response.status(200).json({
          success: true,
          results,
          error: null,
        })
      })
      .catch((error) => {
        return response.status(400).json({
          success: false,
          results: null,
          error,
        })
      })
  }
)

module.exports = router
