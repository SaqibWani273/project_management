import express from 'express'
const app = express()
let myuserName= process.env.USERNAME
app.get('/', (req, res) => {
  res.send(`Hello, ${myuserName} & Welcome to the world`)
})
app.get('/coronavirus', (req, res) => {
  res.send(`Coronavirus | Covid19 is back`)
})

export default app