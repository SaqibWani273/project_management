import dotenv from "dotenv";
import app from "./app.js"
import connectDB from "./db/index.js";
dotenv.config({
  path: "./.env",
});
let port = process.env.PORT || 3000;



connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}).catch(err => {
  console.log("In index.js", err)
  process.exit(1)
})
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`)
// })

