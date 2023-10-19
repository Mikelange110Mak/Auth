import UserSchema from "../models/User.js";
import Role from "../models/Role.js";
import { SECRET_KEY } from "../config.js";
import bcrypt from "bcryptjs"
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken"

const generateToken = (id, username, roles) => {
   const payload = { id, username, roles }
   return jwt.sign(payload, SECRET_KEY, { expiresIn: "2 days" })
}

class AuthController {

   async login(req, res) {
      try {
         //Переменные username и password
         const { username, password } = req.body

         //Поиск пользователя из бд с введеным username
         const user = await UserSchema.findOne({ username })

         //Если пользователя с таким username нет, шлем пользователя нахуй
         if (!user) return res.status(400).json({ message: `Пользователь ${username} не зарегестрирован` })

         //Если пользователь существует, проверяем пароль, в этом поможет функция compareSync от bcrypt
         //Первым параметром обычный пароль, вторым захешированный
         const validPassword = bcrypt.compareSync(password, user.password)

         //Если пароль неправильный, возвращаем ошибку клиенту:
         if (!validPassword) return res.status(400).json({ message: `Неверный пароль для пользователя ${username}` })

         const token = generateToken(user._id, user.username, user.roles)

         return res.json({ token })
      } catch (e) {
         console.log(e);
         res.status(400).json({ message: "Login error" })
      }
   }

   async registration(req, res) {
      try {
         //Это мой обработчик ошибок, если пользователь ввел хуйню, ему придет ответ какую хуйню он ввел:
         //Список хуйни которую пользователь ввел, можно посмотреть в router.js функции check в post.registration

         //Получаю ошибки
         const errors = validationResult(req)

         //Если массив ошибок не пуст
         if (!errors.isEmpty()) {

            //Пустой массив куда буду складывать сообщения ошибок
            let errorList = []

            //Перебор ошибок, вытаскиваю сообщения из них и помещаю в массив
            for (let i in errors.errors) errorList.push(errors.errors[i].msg);

            //Возвращаю на клиент сообщение ошибки
            return res.status(400).send(errorList)
         }

         //Переменные username и password
         const { username, password } = req.body

         //Следующий шаг, надо проверить есть ли юзер с таким именем, поиск кандидата по бд
         const candidate = await UserSchema.findOne({ username })

         //Если нашлось, то отправляем на клиент ошибку
         if (candidate) return res.status(400).res.json({ message: "Пользователь с таким именем уже существует" })

         //Если нет, хэширую его пароль, первый аргумент пароль, второй степень хеширования
         const hashPassword = bcrypt.hashSync(password, 7);

         //Перед созданием юзера, надо обозначить ему роль
         const userRole = await Role.findOne({ value: "USER" })

         //Создаю модельку пользователя, как пароль передаю туда захешированный пароль, и роль из той роли которую получил выше
         const user = new UserSchema({ username, password: hashPassword, roles: [userRole.value] })

         //Остается пользователя сохранить
         await user.save()

         //И вернуть ответ клиенту
         return res.json({ message: `Пользователь ${username} успешно зарегистрирован!` })

      } catch (e) {
         console.log(e);
         res.status(400).json({ message: "Registration error" })
      }
   }

   async getUser(req, res) {
      try {
         const users = await UserSchema.find()
         res.json({ users })
      } catch (e) {
         console.log(e);

      }
   }
}


export default new AuthController();