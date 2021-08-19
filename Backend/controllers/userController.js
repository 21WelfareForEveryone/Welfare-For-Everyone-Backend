const User = require('../models/user'); // User 모델 
let jwt = require("jsonwebtoken"); // 토큰 관리를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈 
const crypto = require('crypto'); // 비밀번호 해시화 모듈

// 로그인 Request 처리
exports.userLogin = (req, res, next) => {
    // request로 받은 비밀번호 해시화 
    const hashed_pw = crypto.createHash('sha256').update(req.body.user_password).digest('base64');

    // id로 해당 아이디를 가진 데이터를 db에서 찾기
    User.findByPk(req.body.user_id).then(user=>{
        // id, pw 일차하는 유저가 있다면 jwt token 생성 뒤 성공 json 보내기
        if (req.body.user_id == user.user_id && hashed_pw == user.user_password){
            // 토큰 생성 
            let token = jwt.sign({
                user_id : req.body.user_id,
                user_password : req.body.user_password
            }
            , secretObj.secret
            , { expiresIn: '365d'});

            // 성공 json 보내기
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 200,
                "token" : token
            }));
        }
        else{
            // 없다면 실패 json 보내기
            res.send(JSON.stringify({
                "success": false,
                "statusCode" : 202,
                "token" : "DENIED"
            }));
        }
    })
    .catch(err=>{
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406,
            "token" : "DENIED"
        }));
    });
}

// 회원가입 Request 처리
exports.userRegister = (req, res, next) => {
    // 비밀번호 해시화 
    const hashed_pw = crypto.createHash('sha256').update(req.body.user_password).digest('base64');

    // 데이터 생성    
    User.create({
        user_id: req.body.user_id,
        user_password: hashed_pw,
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_age: req.body.user_age,
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_is_multicultural: req.body.user_is_multicultural,
        user_family_state: req.body.user_family_state,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_is_veterans: req.body.user_is_veterans,
        user_mToken: req.body.token_firebase
    })
    .then(result=>{
        // 성공시 토큰 생성 
        let token = jwt.sign({
            user_id : req.body.user_id,
            user_password : req.body.user_password
        }, secretObj.secret, { expiresIn: '365d'});

        // 성공 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 201,
            "token" : token
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

// 유저의 정보를 가져다주는 함수
exports.userRead = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 토큰 값으로 해당 유저 검색
    User.findByPk(user_info.user_id)
      .then(user=>{
        // 성공시 유저 정보 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200,
            "token" : req.body.token,
            "user_id": user.user_id,
            "user_password": user_info.user_password,
            "user_name": user.user_name,
            "user_gender": user.user_gender,
            "user_age": user.user_age,
            "user_address": user.user_address,
            "user_life_cycle": user.user_life_cycle,
            "user_is_multicultural": user.user_is_multicultural,
            "user_family_state": user.user_family_state,
            "user_income": user.user_income,
            "user_is_disabled": user.user_is_disabled,
            "user_is_veterans": user.user_is_veterans
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

// 유저 정보 갱신 Request 처리
exports.userUpdate = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // request로 받은 비밀번호 해시화 
    const hashed_pw = crypto.createHash('sha256').update(req.body.user_password).digest('base64');

    // 유저 정보 업데이트 
    User.update({
        // user_id:req.body.user_id, // pk인 id는 업데이트하지 않는다.
        user_password:hashed_pw,
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_age: req.body.user_age,
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_is_multicultural: req.body.user_is_multicultural,
        user_family_state: req.body.user_family_state,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_is_veterans: req.body.user_is_veterans
    }, { where: { user_id: user_info.user_id }})
    .then(result=>{
        // 성공시 토큰 생성 
        let token = jwt.sign({
            user_id : req.body.user_id,
            user_password : req.body.user_password
        }, secretObj.secret, { expiresIn: '365d'});

        // 성공시 성공 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 201,
            "token" : token
        }));
    })
    .catch(err=>{
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406,
            "token" : req.body.token
        }));
    }); 
}

// 유저 삭제 Request 처리
exports.userDelete = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 토큰 값으로 해당 유저 검색
    User.findOne({where: { user_id: user_info.user_id }})
      .then(user=>{
        // 성공시 삭제
        user.destroy();
      })
      .then(result=>{
        // 삭제후 성공 json 보내기 
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200
        }));
      })
      .catch(err=>{
        // 오류시 실패 json 보내기 
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406
        }));
      });
}