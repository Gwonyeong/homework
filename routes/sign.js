const express = require("express")
const { Op } = require("sequelize")
const { User } = require("../models")
const jwt = require("jsonwebtoken")

const router = express.Router()

router.post("/up", async (req, res, next) => { //회원가입
    try{
        
        const { nickname, pw, confirmPw} = req.body
        let idReg = /^[a-zA-Z0-9]{3,}$/;
        if(!idReg.test(nickname)){
            res.status(400).send({
                errorMessage : "닉네임은 영어 소문자, 대문자, 숫자만 사용 가능하며 3자 이상이여야 합니다."
            })
            return
        }
        if(pw.length <4){
            res.status(400).send({
                errorMessage : "비밀번호는 4자 이상이여야 합니다!"
            })
            return
        }
        
        if(pw !== confirmPw || nickname.includes(pw)){ //비밀번호와 비번 확인이 다름 
            res.status(400).send({
                errorMessage : "비밀번호는 닉네임에 포함되지 않아야 하고 비밀번호 확인란과 같아야합니다."
            })
            return
        }
        const existUser = await User.findAll({
            where : { //해당 닉네임이 있는지 확인
                 nickname,
            },
        });

        if(existUser.length){
            res.status(400).send({
                errorMessage : "중복된 닉네임 입니다."
            })
            return
        }
        const secret = "gwon_secret"
        user_pw = jwt.sign({pw}, secret)
        
        await User.create({ nickname, password:user_pw} );
        return res.status(201).send({message : "회원가입 성공!"})
    }//try
    catch(err){
    next(err)
    }
})

router.post("/in", async (req, res, next) => { //로그인 시도
    try{
        const { nickname, password } = req.body;
        const DBnickname = await User.findOne({
            where : {nickname}
        })
        
        
        if(!DBnickname ){ //닉네임이 틀린 경우(해당 닉네임에 대응되는 비밀번호가 없음.)
            
            res.status(400).send({message:"로그인에 실패했습니다."})
            return
        }
        const DBpassword = DBnickname.password
        
        const pw = jwt.verify(DBpassword, "gwon_secret") //비밀번호
        
        
        
        if(password !== pw.pw){ // 비밀번호가 틀린 경우
            console.log("pw")
            res.status(400).send({message:"로그인에 실패했습니다."})
            return
        }
        const nick =DBnickname.nickname // 닉네임
        
        res.cookie(
            "token" , jwt.sign({userId : nick}, "gwon_secret")
            
        )
        res.status(200).send({message :"로그인 성공!"})
        

    }
    catch(err){
    next(err)
    }
})

router.delete("/:user_id", async ( req, res, next) => {
    const {user_id} = req.params;
    
    await User.destroy({
        where: {userId: Number(user_id)}
    })
    res.status(200).send("삭제 성공!")
})
module.exports = router;