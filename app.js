const express =require("express")
const mongoose = require("mongoose")
const comment_db = require('./schemas/comment')
const post_db = require("./schemas/posts")
const connect = require("./schemas/index")

connect()

const commentRouter = require("./routes/comment")
const postRouter = require("./routes/posts")
const indexRouter = require("./routes/index")


const app = express()
const port = 8000

app.use(express.json()) // body로 전달받은 json 데이터를 사용할 수 있게 해줌.

app.use("/", indexRouter)
app.use("/api", [commentRouter, postRouter])

app.use((req, res, next) => {
    console.log('Request Url', req.originalUrl, ' - ', new Date())
    next()
})

app.get('/', (req, res) => {
    res.send('메인페이지')
})

app.listen(port, () => {
    console.log(port)
})