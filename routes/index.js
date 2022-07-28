const router = require("express").Router()
const index = require('../schemas/index.js')
const postDB = require("../schemas/posts.js")

// 1. 전체 게시글 목록 조회 API '/'
// - 제목, 작성자명, 작성 날짜를 조회하기
// - 작성 날짜 기준으로 내림차순 정렬하기
// GET: title, nickname, date
// 

//메인페이지
router.get('/', async(req, res) => { //전체 게시글 목록 조회
    const content = await postDB.find();
    
    res.json({success: true, content : content.map(p => ({
        _id : p._id,
        title : p.title,
        nickname: p.nickname,
        desc : p.desc,
        date : p.date

    }
    ))
})
})
module.exports = router