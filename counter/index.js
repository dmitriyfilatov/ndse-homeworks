const express = require('express')
const cors = require('cors')
const app = express()

const indexRouter = require('./routers/index')
const counterRouter = require('./routers/counter')

app.use(cors())

app.use('/counter', counterRouter)
app.use('', indexRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

