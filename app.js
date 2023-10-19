import express from "express";
import mongoose from "mongoose";
import router from "./router.js";

const app = express()
const PORT = 5000
app.use(express.json())
app.use('/auth', router)


const start = async () => {
   try {
      await mongoose.connect('mongodb+srv://infinitycorpkz:qCEDYsXCQS5DSXNm@users-db.nrtiroh.mongodb.net/')
      app.listen(PORT, () => console.log(`TryAuth2 has been launched on ${PORT} port....`))
   } catch (e) {

   }

}
start()


