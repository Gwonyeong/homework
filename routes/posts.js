const express = require("express")
const Post = require("../schemas/posts")


const router = express.Router()

// 3. 게시글 조회 API '/post/:index'
// - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기 
// (검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
// GET: title, nickname, date, desc

router.get('/post/:id', async(req, res, next) => {//게시글 조회 
    try{const {id} =req.params;
    const post = await Post.find({_id:id});
    

    
    if(!post.length){//포스트가 없는 경우
        return res.status(400).json({success : false, errorMessage : "없는 게시물 입니다."})
    }
    res.json({success: true, post : post.map(p => ({
        title : p.title,
        nickname: p.nickname,
        desc : p.desc,
        date : p.date

    }
    ))
}
    );
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
   
    const {title,nickname, pw, desc} = req.body;// title, nickname, pw, desc
    const dup_nickname = await Post.find({ nickname }); //닉네임과 글 제목이 같으면 중복

    for(let i =0; i < dup_nickname.length; i++){
        if(title === dup_nickname[i]["title"]){
            return res.status(400).json({ success : false, errorMessage: '같은 제목의 글이 있습니다.'})

        }
    }
    await Post.create({ title,nickname, pw, desc});
    res.json({success : true});
    
})

// 4. 게시글 수정 API '/post'
// - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
// PUT: pw
router.put('/post/:id', async(req, res)=>{//게시글 수정
    const {id} = req.params;
    const content = req.body["content"]
    const pw = req.body["password"]
    const post = await Post.find({_id :id})//게시물의 아이디로 게시물 찾기
    console.log(content, pw)
    if(!content.length){
        return res.status(400).json({ success: false, errorMessage: "없는 게시물입니다."})
    }
    if(pw !== post[0]["pw"]){
        return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀렸습니다."})

    }
    await Post.updateOne({_id: id}, {$set: {desc : content}})
    res.json({success: true, message: "게시물 변경 성공!"})
   

})

// 5. 게시글 삭제 API '/post'
// - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
// DELETE: pw
router.delete('/post/:id', async(req, res)=> {//게시글 삭제
    const {id} = req.params;
   
       
    await Post.deleteOne({_id: id})
    res.json({success: true, message: "게시물 삭제 성공!"})
})

module.exports = router