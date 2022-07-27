const mongoose = require('mongoose')

// DB : title, nickname, pw, desc, date

// 2. 게시글 작성 API '/create_post'
// - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
//  POST: title, nickname, pw, desc

// 3. 게시글 조회 API '/detail/:index'
// - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기 
// (검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
// GET: title, nickname, date, desc

// 4. 게시글 수정 API '/update_post'
// - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
// PUT: pw

// 5. 게시글 삭제 API '/delet_post'
// - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
// DELETE: pw

const schema = new mongoose.Schema({
    title: { type : String, required : true, },

    nickname: { type : String, required : true, },

    desc : { type: String, require : true},

    date : { type : Date, default : Date.now},

    pw : { type: String, required : true },
        
        //모델명
        //1대 다관계 :
        //게시물의 언더바 아이디를 넣어줘야함.
        //
})
module.exports = mongoose.model('Post', schema)