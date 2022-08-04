const router = require("express").Router()

const { Post , Favorite } = require("../models")


// 1. 전체 게시글 목록 조회 API '/'
// - 제목, 작성자명, 작성 날짜를 조회하기
// - 작성 날짜 기준으로 내림차순 정렬하기
// GET: title, nickname, date
// 

//메인페이지
router.get('/', async(req, res, next) => { //전체 게시글 목록 조회
    const content = await Post.findAll({
        order: [['createdAt', 'DESC']]
});
    
    const arr = content.map(p => ({
        id : p.id
    }
    ))
    
    let favorite_num = []
    for(let i =0; i < arr.length; i++){
        let favor =  await Favorite.findAll({
            where : {Post_id:arr[i].id}
        })
        favor = favor.length
        favorite_num.push(favor)

    }
    

    res.json({success: true, content : content.map((p, idx) => ({
        
        title : p.title,
        like : favorite_num[idx],
        nickname: p.nickname,
        desc : p.desc,
        

    }
    ))
    
})
})
module.exports = router