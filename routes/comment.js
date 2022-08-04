const express = require('express');

const { Op } = require("sequelize"); //Op객체
const { comment } = require("../models/index");
const jwt = require("jsonwebtoken") 

//모델이름 대문자로
const router = express.Router()

// 6. 댓글 목록 조회 /comment
//     - 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
//     - 작성 날짜 기준으로 내림차순 정렬하기
//      GET: comment, date, nickname
router.get('/comment/:post_id', async(req, res,next)=>{ //댓글 목록 조회
    try{
    
    const {post_id} = req.params
    
    const comments = await comment.findAll({
        where : {post_id:post_id},
        attributes : ['nickname', 'comment'],
        order: [['createdAt', 'DESC']]
    })
    
   
    
    
    // populate
    // User.findOne({ name: 'zero' }).populate('bestFriend').exec((err, data) => {
    // console.log(data);
    // });
    // Post.findOne({postid}).populate('comment')

    //미들웨어끼리 연결 가능

    //요소 안에 있는 고유한 아이디를 쓰는게 효과적임.
    

    res.json({success : true, comments:comments})
}
catch(err){
    next(err)
}

})//http에서는 하나의 요청만 보낼 수 있다. 1api 1 res
//

// 7. 댓글 작성 /comment
//     - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
//     - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
//      POST: comment, date, nickname
router.post('/comment/:post_id', async(req, res, next)=>{ //댓글 작성
    try{
    const token = req.cookies.token
       
    if(!token){
        res.status(401).send({
            errorMessage: "로그인이 필요한 기능입니다."
        })
        return
    }
    const {post_id} = req.params
    const{ content } = req.body;
    //댓글의 게시물의 아이디, 댓글의 내용, 닉네임, 작성 날짜

    if(!content){
        return res.status(400).json({success : false, message : "댓글 내용을 입력해주세요"})

    }
    const nickname = jwt.verify(token,"gwon_secret").userId//
    await comment.create({
        post_id : post_id,
         comment : content,
         nickname: nickname})
    res.json({success : true, message : "댓글 작성 완료!"})
    }
    catch(err){
        next(err)
    }

})
// 8. 댓글 수정 /comment
//     - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
//     - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
//      PUT: comment
router.put('/comment/:comment_id', async(req, res)=>{ // 댓글 수정
    const {comment_id} = req.params
    const {content} = req.body;
    const token = req.cookies.token
    
    if(!token){
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능합니다."
        })
        return
    }
    const nickname = jwt.verify(token,"gwon_secret")
    
    const cur_comment = await comment.findAll({
         where : {nickname: nickname.userId}
    })
    
    if(!cur_comment.length  ){
        res.status(401).send({
            errorMessage : "권한이 없습니다."
            
        })
        return
    }
    
  //코맨트를 비워둔 채 수정을 하려하면 오류발생
    if(!content.length){
        return res.status(400).json({success : false, message : "댓글 내용을 입력해주세요"})
    }
    
    
    //코맨트 수정기능
    await comment.update({comment : content },{where:{ id : comment_id}})
    res.json({success : true, message : "댓글 수정 완료!"})

})

// 9. 댓글 삭제 /comment
//     - 원하는 댓글을 삭제하기
// DELETE: comment
router.delete('/comment/:comment_id', async(req, res)=>{ // 댓글 삭제
    const {id} = req.params;
    const token = req.cookies.token
    
    if(!token){
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능합니다."
        })
        return
    }
    const nickname = jwt.verify(token,"gwon_secret")
    
    const cur_comment = await comment.findAll({
         where : {nickname: nickname.userId}
    })
    console.log(cur_comment)
    if(!cur_comment.length  ){
        res.status(401).send({
            errorMessage : "권한이 없습니다."
            
        })
        return
    }

    await comment.destroy({
        where : {id : id}
    })
        
    res.json({success : true, message : "댓글 삭제 완료!"})
})
module.exports = router