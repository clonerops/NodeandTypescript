import {readdirSync} from "fs"
import express from "express"
import userRouter from "./user"

const router = express.Router()

router.use("./user", userRouter)

readdirSync("src/api/routes").map(async(route) => {
    const {default: handler} = await import(`./${route}`)
    router.use(`/${route.slice(0, -3)}`, handler)
})

export default router