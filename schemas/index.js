const mongoose = require('mongoose')

// 1. 전체 게시글 목록 조회 API '/'
// - 제목, 작성자명, 작성 날짜를 조회하기
// - 작성 날짜 기준으로 내림차순 정렬하기
// GET: title, nickname, date
// 

const connect = () =>{
    mongoose.connect('mongodb://localhost:27017/node_homework1', {ignoreUndefined : true}).catch((err) =>
    console.error(err))
}

module.exports = connect