const mongoose = require("mongoose");

// 6. 댓글 목록 조회 /comment
//     - 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
//     - 작성 날짜 기준으로 내림차순 정렬하기
//      GET: comment, date, nickname

// 7. 댓글 작성 /comment
//     - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
//     - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
//      POST: comment, date, nickname

// 8. 댓글 수정 /comment
//     - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
//     - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
//      PUT: comment

// 9. 댓글 삭제 /comment
//     - 원하는 댓글을 삭제하기
// DELETE: comment

//virtual 몽구스에서 제공: _id를 원하는 이름으로 가져오게 해줌.
//스키마.virtual
// virtual
// mongoose
// Schema.virtual('id').get(function(){
// return this._id.toHexString();
// });

const schema = new mongoose.Schema({
    post_id: {
        type : Number,
        required : true,
        
    },

    comment: {
        type : String, 
        required : true,
    },
    nickname: {
        type: String,
        required : true,
    },
    date : {
        type : Date,
        required : true,
        
        default : Date.now,
    },
    
    //댓글 내용과 포스트 내용을 분리 시켜서 
    //코맨트에서 포스트를 가져올 수 있게 1:다 관계이니까
    //
    
})
// schema.virtual~~~~ _id값을 가져올 수 있다.
// 
module.exports = mongoose.model('comment', schema)