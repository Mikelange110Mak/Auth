import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../config.js"


//Функция которая будет принимать в себя роли которые разрешены для доступа к роуту
const checkRole = (acceptedRoles) => {
   return function (req, res, next) {
      if (req.method === "OPTIONS") next()

      try {
         //Нужен сам токен, а не весь его конфиг
         const token = req.headers.authorization.split(' ')[1]
         if (!token) return res.status(403).json({ message: "Пользователь не авторизован" })

         //Вытаскиваю роли из токена
         const { roles } = jwt.verify(token, SECRET_KEY)

         //Ползунок false который будет меняться
         let hasRole = false

         //Пробегаю по массиву ролей
         roles.forEach(role => {
            //Если есть роль которая в аргументе функции (acceptedRoles) ползунок hasRole = true
            if (acceptedRoles.includes(role)) hasRole = true
         });

         if (!hasRole) return res.status(403).json({ message: `Доступ только для ${acceptedRoles}` })

         next()

      } catch (e) {
         console.log(e);
         res.status(403).json({ message: "Пользователь не авторизован" })
      }
   }
}

export default checkRole