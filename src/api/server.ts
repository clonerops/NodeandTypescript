import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import api from './routes/index'

const app = express()


export function runServer(){

    app.use(cookieParser())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))

    app.use(cors())

    app.use('/api', api)

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server Is Run On Port: ${process.env.PORT || 8000}`)
    })
}
