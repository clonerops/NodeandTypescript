import UserController from "../../controllers/userController";
import express from "express"

const router = express.Router()

router.post('/createSuperUser', UserController.createSuperUser)
router.post('/createUser', UserController.createUser)
router.put('/verify', UserController.verifyUser)
router.post('/login', UserController.loginUser)
router.get('/', UserController.listOfUser)
router.get('/:id', UserController.getUserById)
export default router;