import express from 'express'
import {Request, Response} from 'express'

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
    console.log('ГЛАВНАЯ')
    res.render('index', {
        title: 'Главная'
    })
})

export default router