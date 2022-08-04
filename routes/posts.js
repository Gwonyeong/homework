const express = require("express")
const { Post } = require("../models")
const {Favorite} = require("../models")
const { Op } = require("sequelize"); //Op객체
const jwt = require("jsonwebtoken");


const router = express.Router()



// 3. 게시글 조회 API '/post/:index'
// - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기 
// (검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
// GET: title, nickname, date, desc

router.get('/post/:id', async(req, res, next) => {//게시글 조회 
    try{const {id} =req.params;
    const article = await Post.findAll({
        where : {id},
        attribute : ['title','nickname','desc']
    });
    
    
    const favorite_num = await Favorite.findAll({
        where : {Post_id:id}
    })
    console.log(favorite_num.length)
    
    if(!article.length){//포스트가 없는 경우
        return res.status(400).json({success : false, errorMessage : "없는 게시물 입니다."})
    }
    res.json({success: true, Post : article.map(p => ({
        title : p.title,
        like:favorite_num.length,
        nickname: p.nickname,
        createdAt : p.createdAt,
        desc : p.desc
    }
    ))}
    )
}
    catch(err){
        //err콘솔로 확인
        //
        next(err) //app.js
    }

})


// 2. 게시글 작성 API '/post'
// - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
//  POST: title, nickname, pw, desc

router.post('/post', async(req, res) => {//게시글 작성
   
    const token = req.cookies.token
    console.log(token)
    if(!token){
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능합니다."
        })
        return
    }
    const {title, pw, desc} = req.body;// title, nickname, pw, desc
    let nickname = jwt.verify(token,"gwon_secret")
    const name = nickname.userId
    console.log(name)    
    await Post.create(
        { title,nickname:name, pw, desc});
    res.json({success : true});
    
})

// 4. 게시글 수정 API '/post'
// - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
// PUT: pw
router.put('/post/:id', async(req, res)=>{//게시글 수정
    const {id} = req.params;
    const {desc , pw} = req.body
    
    const token = req.cookies.token
    
    if(!token){
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능합니다."
        })
        return
    }
    const post = await Post.findAll({_id :id})//게시물의 아이디로 게시물 찾기
    console.log(desc, pw)
    if(!desc.length){
        return res.status(400).json({ success: false, errorMessage: "없는 게시물입니다."})
    }
    if(pw !== post[0]["pw"]){
        return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀렸습니다."})

    }
    await Post.update({
        desc : desc
    },  {
        where : {id : id}
    });
    res.json({success: true, message: "게시물 변경 성공!"})
})

// 5. 게시글 삭제 API '/post'
// - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
// DELETE: pw
router.delete('/post/:id', async(req, res)=> {//게시글 삭제
    const {id} = req.params;
    const token = req.cookies.token
     

    if(!token){
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능합니다."
        })
        return
    }

    
       
    await Post.destroy({
        where : {id: Number(id)}
    })
    res.json({success: true, message: "게시물 삭제 성공!"})
})

// 8. 내 블로그 글에 좋아요 기능 달기
//     - 로그인 토큰을 전달했을 때에만 좋아요 할 수 있게 하기
//     - 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 좋아요 취소 할 수 있게 하기
//     - 게시글 목록 조회시 글의 좋아요 갯수도 같이 표출하기

router.get("/favorite/:post_id", async(req, res) => {
try{    const {post_id} = req.params
    const token = req.cookies.token
     
    if(!token){
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능합니다."
        })
        return
    }
    const nickname = jwt.verify(token,"gwon_secret").userId
    
    const post_nickname = await Favorite.findOne({
         where : {nickname, post_id }
    }) // 이미 좋아요 기능을 누른 상태
    console.log(post_nickname)
    if(post_nickname !== null){
        await Favorite.destroy({
            where : {nickname, post_id }//그렇다면 좋아요를 삭제
        
        })
        return res.status(200).send({message: `${post_id}번글 좋아요 삭제!`})
    }else{ //좋아요를 누르지 않은 상태라면 테이블에 닉네임, 포스트 아이디 추가
        await Favorite.create({
            nickname, Post_id : post_id
        })
    }  
    
    res.status(200).send({message:`${post_id} 번글 좋아요!`})}
    catch(err){
        next(err)
    }



}) 


// 9. 좋아요 게시글 조회 API
//     - 로그인 토큰을 전달했을 때에만 좋아요 게시글 조회할 수 있게 하기
//     - 로그인 토큰에 해당하는 사용자가 좋아요 한 글에 한해서, 조회할 수 있게 하기
//     - 제일 좋아요가 많은 게시글을 맨 위에 정렬하기

router.get("/favorite", async (req,res,next) =>{ //코드가 더러움
    const token = req.cookies.token
     
    if(!token){
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능합니다."
        })
        return
    }
    const nickname = jwt.verify(token,"gwon_secret").userId

    const content = await Favorite.findAll({
        where : {nickname}
    })
    
    let arr =content.map((p) => (
       p.Post_id
        
    ))
    
    const post = await Post.findAll({
        where : {id : arr}, //배열을 넣어줘도 되는구나 
        
    })
    let favorite_num = []
    
    for(let i =0; i < arr.length; i++){
        let favor =  await Favorite.findAll({
            where : {Post_id:arr[i]}
        })
        favor = favor.length
        favorite_num.push(favor)

    }
    
    const p = post.map((p, idx) => ({
        title : p.title,
        like:favorite_num[idx],
        nickname: p.nickname,
        createdAt : p.createdAt,
        desc : p.desc
    }))
    p.sort((a,b) => {
        
        if(Number(a.like) < Number(b.like)) {
            return 1
        }
    })
    res.json({message:"success" , Post: p})




})

module.exports = router