import mongoose, { ConnectOptions } from "mongoose"
import { MONGODB_CONFIG } from "./config"
import { runServer } from "./src/api/server"
import dotenv from "dotenv"

dotenv.config()

function init() {
    mongoose.connect(`${process.env.MONGO_DB}`, MONGODB_CONFIG as ConnectOptions)
    .then(() => {
        console.log("MongoDb Connected!!!")
    })
    .then(() => {
        runServer()
    })
    .catch((err) => {
        console.log(err)
    })

}

init()