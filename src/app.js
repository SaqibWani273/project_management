import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
import hCRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import errorHandler from "./utils/handlers.js";
const app = express()




//configs using express middlewares
app.use(express.json({ limit: '32kb' }))
app.use(express.urlencoded({ extended: true, limit: '32kb' }))
app.use(express.static('public'))
app.use(cookieParser())
// Adds headers: Access-Control-Allow-Origin: *
let corsOptions = {
  origin: process.env.CORSORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],

}
app.use(cors(corsOptions))
app.use("/api/v1/healthcheck", hCRouter)
app.use("/api/v1/auth", authRouter)

// Last middleware
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send(`Hello,  & Welcome to the world`)
})
app.get('/coronavirus', (req, res) => {
  res.send(`Coronavirus | Covid19 is back`)
})

export default app