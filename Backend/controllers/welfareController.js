const Welfare = require('../models/welfare'); // 복지정보 모델
const User_dibs = require('../models/dibs'); // 찜 모델 
let jwt = require("jsonwebtoken"); // 토큰 관리를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈

// 복지 정보 Request 처리 
exports.readWelfare = (req, res, next) => {
    Welfare.findByPk(req.body.welfare_id)
    .then(welfare=>{
        // 성공시 복지 정보 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200,
            "welfare_id" : req.body.welfare_id,
            "title" : welfare.title,
            "summary": welfare.summary,
            "who" : welfare.who,
            "criteria": welfare.criteria,
            "what" : welfare.what,
            "how": welfare.how,
            "calls" : welfare.calls,
            "sites": welfare.sites,
            "category" : welfare.category        
        })); 
    })
    .catch(err=>{
        console.log(err);
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406,
            "welfare_id" : req.body.welfare_id
        }));
    })
}

// 관심 복지 정보 Request 처리 
exports.readDibsWelfare = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    User_dibs.findAll({
        where: { user_id: user_info.user_id }
    })
    .then(userDibs =>{
        Welfare.findAll({where: {welfare_id: userDibs.welfare_id}})
        .then(result =>{
            console.log(result);
        })
    })
}