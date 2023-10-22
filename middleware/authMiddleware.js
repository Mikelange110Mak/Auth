import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../config.js"


const checkAuthorization = (req, res, next) => {
   if (req.method === "OPTIONS") next()

   try {
      //Нужен сам токен, а не весь его конфиг
      const token = req.headers.authorization.split(' ')[1]

      //Если его нет, шлем пользователя
      if (!token) return res.status(403).json({ message: "Пользователь не авторизован" })

      //Если есть, декодируем его данные (пригодяться хуль)
      const decodedData = jwt.verify(token, SECRET_KEY)
      req.user = decodedData

      //Пропускаю дальше по роуту
      next()

   } catch (e) {
      console.log(e);
      res.status(403).json({ message: "Пользователь не авторизован" })
   }

}

export default checkAuthorization;