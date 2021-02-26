const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/books')
    },
    filename(req, file, cb) {
        let date = new Date().toISOString().replace(/:/g, '-')
        cb(null, `${date}-${file.originalname}`)
    }
})

const allowedTypes = ['application/pdf']

const fileFilter = (req, file, cb) => {
    cb(null, allowedTypes.includes(file.mimetype))
}

module.exports = multer({
    storage, fileFilter
})