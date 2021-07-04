import multer from 'multer'
import {Request, Response} from 'express'

const storage = multer.diskStorage({
    destination(req: Request, file:any, cb: any) {
        cb(null, 'uploads/books')
    },
    filename(req: Request, file: any, cb: any) {
        let date = new Date().toISOString().replace(/:/g, '-')
        cb(null, `${date}-${file.originalname}`)
    }
})

const allowedTypes = ['application/pdf']

const fileFilter = (req: Request, file: any, cb: any) => {
    cb(null, allowedTypes.includes(file.mimetype))
}

export default multer({
    storage, fileFilter
})