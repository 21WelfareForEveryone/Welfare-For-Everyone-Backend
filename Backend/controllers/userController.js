/*
todolist
- pw 암호화 코드 추가 
- jwt 토큰 out of date 코드 추가 
- 중복 코드 함수로 빼기 
*/

const User = require('../models/user'); // User 모델 
let jwt = require("jsonwebtoken"); // 토큰 관리를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈
// const bcrypt = require('bcrypt') // 비밀번호 암호화를 위한 bcrypt 모듈 -> crypto로 대체 
const crypto = require('crypto');

// 로그인 Request 처리
exports.userLogin = (req, res, next) => {
    // const hashed_pw = crypto.createHash('sha256').update(req.body.user_password).digest('base64');

    // id로 해당 아이디를 가진 데이터를 db에서 찾기
    User.findByPk(req.body.user_id).then(user=>{
        // 있다면 jwt token 생성 뒤 성공 json 보내기
        if (req.body.user_id == user.user_id && req.body.user_password == user.user_password){
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
    // const hashed_pw = crypto.createHash('sha256').update(req.body.user_password).digest('base64');
    // console.log(hashed_pw);

    // 데이터 생성    
    User.create({
        user_id: req.body.user_id,
        user_password: req.body.user_password,
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_age: req.body.user_age,
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_family: req.body.user_family,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_is_veterans: req.body.user_is_veterans,
        user_interest: req.body.user_interest,
        user_mToken: req.body.token_firebase
    })
    .then(result=>{
        // 토큰 생성 
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
            "user_password": user.user_password,
            "user_name": user.user_name,
            "user_gender": user.user_gender,
            "user_age": user.user_age,
            "user_address": user.user_address,
            "user_life_cycle": user.user_life_cycle,
            "user_family": user.user_family,
            "user_income": user.user_income,
            "user_is_disabled": user.user_is_disabled,
            "user_is_veterans": user.user_is_veterans,
            "user_interest": user.user_interest
        }));  
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

// 유저 정보 갱신 Request 처리
exports.userUpdate = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 유저 정보 업데이트 
    User.update({
        // user_id:req.body.user_id, // pk인 id는 업데이트하지 않는다.
        user_password:req.body.user_password,
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_age: req.body.user_age,
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_family: req.body.user_family,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_is_veterans: req.body.user_is_veterans,
        user_interest: req.body.user_interest,
    }, { where: { user_id: user_info.user_id }})
    .then(result=>{
        // 성공시 성공 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 201,
            "token" : req.body.token
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
    User.findOne({
        where: { user_id: user_info.user_id }
      })
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



// 암호화 프로세스 
/*

const User = require('../models/user'); // User 모델 
let jwt = require("jsonwebtoken"); // 토큰 발행을 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈
const bcrypt = require('bcrypt') // 비밀번호 암호화를 위한 bcrypt 모듈 -> 

// 로그인 Request 처리
exports.userLogin = (req, res, next) => {
    // id로 해당 아이디를 가진 데이터를 db에서 찾기
    User.findByPk(req.body.user_id).then(user=>{
        // if (req.body.user_id == user.user_id && bcrypt.compareSync(req.body.user_password, user.user_password)){ // -> 복호화 프로세스
        if (req.body.user_id == user.user_id && req.body.user_password==user.user_password){
            // 있다면 성공 json 보내기
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 200,
                "token" : user.user_mToken
            }));
        }
        else{
            // console.log(user);
            // 없다면 실패 json 보내기
            res.send(JSON.stringify({
                "success": false,
                "statusCode" : 202,
                "token" : "DENIED"
            }));
        }
    })
    .catch(err=>{
        // console.log(err);
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
    // 토큰 생성 
    let token = jwt.sign({
        user_id : req.body.user_id,
        user_password : req.body.user_password,
        user_name : req.body.user_name
    }
    , secretObj.secret
    , { expiresIn: '365d'});

    // 암호화 없는 버전
    User.create({
        user_id: req.body.user_id,
        user_password: encryptedPassowrd,
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_age: req.body.user_age,
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_family: req.body.user_family,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_is_veterans: req.body.user_is_veterans,
        user_interest: req.body.user_interest,
        user_mToken: token
    }).then(result=>{
        // 성공시 성공 json 보내기
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
    
    // 입력받은 비밀번호로 해시값 생성 후 User 객체 생성
    // bcrypt.hash(req.body.user_password, 10, (err, encryptedPassowrd) => {
    //     User.create({
    //         user_id: req.body.user_id,
    //         user_password: encryptedPassowrd,
    //         user_name: req.body.user_name,
    //         user_gender: req.body.user_gender,
    //         user_age: req.body.user_age,
    //         user_address: req.body.user_address,
    //         user_life_cycle: req.body.user_life_cycle,
    //         user_family: req.body.user_family,
    //         user_income: req.body.user_income,
    //         user_is_disabled: req.body.user_is_disabled,
    //         user_is_veterans: req.body.user_is_veterans,
    //         user_interest: req.body.user_interest,
    //         user_mToken: token
    //     }).then(result=>{
    //         // 성공시 성공 json 보내기
    //         res.send(JSON.stringify({
    //             "success": true,
    //             "statusCode" : 201,
    //             "token" : token
    //         }));
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //         // 오류시 실패 json 보내기
    //         res.send(JSON.stringify({
    //             "success": false,
    //             "statusCode" : 406,
    //             "token" : "DENIED"
    //         }));
    //     });
    // })
    
}

// 유저의 정보를 가져다주는 함수
exports.userRead = (req, res, next) => {
    // 토큰 값으로 해당 유저 검색
    User.findOne({
        where: { user_mToken: req.body.token }
      })
      .then(user=>{
        // 성공시 유저 정보 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200,
            "token" : req.body.token,
            "user_id": user.user_id,
            "user_password": user.user_password,
            "user_name": user.user_name,
            "user_gender": user.user_gender,
            "user_age": user.user_age,
            "user_address": user.user_address,
            "user_life_cycle": user.user_life_cycle,
            "user_family": user.user_family,
            "user_income": user.user_income,
            "user_is_disabled": user.user_is_disabled,
            "user_is_veterans": user.user_is_veterans,
            "user_interest": user.user_interest
        }));  
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

// 유저 정보 갱신 Request 처리
exports.userUpdate = (req, res, next) => {
    // 유저 정보 업데이트 
    User.update({
        user_id:req.body.user_id,
        user_password:req.body.user_password,
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_age: req.body.user_age,
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_family: req.body.user_family,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_is_veterans: req.body.user_is_veterans,
        user_interest: req.body.user_interest,
    }, { where: { user_mToken: req.body.token }})
    .then(result=>{
        // 성공시 성공 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 201,
            "token" : req.body.token
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
    // 토큰 값으로 해당 유저 검색
    User.findOne({
        where: { user_mToken: req.body.token }
      })
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


*/