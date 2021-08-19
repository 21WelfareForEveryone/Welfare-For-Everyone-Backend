const User_dibs = require('../models/dibs'); // 찜 모델 
let jwt = require("jsonwebtoken"); // 토큰 관리를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈

// 찜 데이터 생성
exports.createDib = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);
    console.log(User_dibs.user_id);
    // 데이터 생성    
    User_dibs.create({
        id: 0,
        user_id: user_info.user_id,
        welfare_id: req.body.welfare_id
    })
    .then(result=>{
        // 성공시 성공 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 201,
            "token" : req.body.token
        }));
    })
    .catch(err=>{
        console.log(err);
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406,
            "token" : "DENIED"
        }));
    });
}

// 찜 데이터 삭제
exports.deleteDib = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 토큰 값으로 해당 유저 검색
    User_dibs.findAll({
        where: { user_id: user_info.user_id }
      })
      .then(dib=>{
        // 성공시 삭제
        dib.destroy();
      })
      .then(result=>{
        // 삭제후 성공 json 보내기 
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200,
            "token": req.body.token
        }));
      })
      .catch(err=>{
        // 오류시 실패 json 보내기 
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406,
            "token": req.body.token
        }));
      });
}
