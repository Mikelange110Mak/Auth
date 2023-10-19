import Router from "express";
import controller from "./controllers/authController.js"
import { check } from "express-validator";
import userData from "./middleware/authMiddleware.js";
import checkUser from "./middleware/roleMiddleware.js";

const router = new Router();


router.post('/login', controller.login)
router.post('/registration', [
   check("username", "Имя пользователя не может быть пустым").notEmpty(),
   check("username", "Имя пользователя должно быть больше 1 символа и меньше 20").isLength({ min: 2, max: 20 }),
   check("username", "Имя пользователя должно быть на латиннице").matches(/[a-zA-Z]/),
   check("password", "Пароль должен быть больше 3 и меньше 14 символов").isLength({ min: 4, max: 14 }),
   check("password", "Пароль должен быть на латинице ЗАЕБАЛ!").matches(/[a-zA-Z]/)
], controller.registration)
router.get('/users', checkUser(["ADMIN"]), controller.getUser)

export default router