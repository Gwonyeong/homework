const express =require("express")
const cookieParser = require("cookie-parser")

const commentRouter = require("./routes/comment")
const postRouter = require("./routes/posts")
const indexRouter = require("./routes/index")
const signRouter = require("./routes/sign")




const app = express()
const port = 8001

app.use(cookieParser())
app.use(express.json()) // body로 전달받은 json 데이터를 사용할 수 있게 해줌.
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter)
app.use("/api", [commentRouter, postRouter])
app.use("/sign" , signRouter)


app.get('/', (req, res) => {
    res.send('메인페이지')
})

app.listen(port, () => {
    console.log(port)
})