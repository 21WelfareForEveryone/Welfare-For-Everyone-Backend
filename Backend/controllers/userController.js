const User = require('../models/user'); // User 모델 
const User_interest = require('../models/user_interest'); // User_interest 모델
const User_dibs = require('../models/dibs'); // 찜 모델 
let jwt = require("jsonwebtoken"); // 토큰 관리를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈 
const crypto = require('crypto'); // 비밀번호 해시화 모듈

const { Op } = require("sequelize");

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
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_is_multicultural: req.body.user_is_multicultural,
        user_is_one_parent: req.body.user_is_one_parent,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_mToken: req.body.token_firebase
    })
    .then(result =>{
        // 관심 카테고리 테이블 생성 
        // 영유아~노년에 대한 관심 카테고리 생성 
        User_interest.create({
            user_id : req.body.user_id,
            category_id : req.body.user_life_cycle
        })
        // 장애인일 경우 
        if(req.body.user_is_disabled == 1){
            User_interest.create({
                user_id : req.body.user_id,
                category_id : 5
            })
        }
        // 한부모일 경우
        if(req.body.user_is_one_parent == 1){
            User_interest.create({
                user_id : req.body.user_id,
                category_id : 6
            })
        }
        // 다문화일 경우
        if(req.body.user_is_multicultural == 1){
            User_interest.create({
                user_id : req.body.user_id,
                category_id : 7
            })
        }
        // 저소득층일 경우
        if(req.body.user_income == 1){
            User_interest.create({
                user_id : req.body.user_id,
                category_id : 8
            })
        }
        // 나머지 관심 카테고리 추가
        User_interest.create({
            user_id : req.body.user_id,
            category_id : (req.body.user_interest + 9)
        })    
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
        User_interest.findAll( {
            where: { user_id: user_info.user_id },
            raw: true
        })
        .then(result => {
            // Response로 보낼 user interest 찾기 
            interest = -1
            result.forEach(element => {
            if(element.category_id >= 9){
                interest = element.category_id
            }
            });

            // 성공시 유저 정보 json 보내기
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 200,
                "token" : req.body.token,
                "user_id": user.user_id,
                "user_password": user_info.user_password,
                "user_name": user.user_name,
                "user_gender": user.user_gender,
                "user_address": user.user_address,
                "user_life_cycle": user.user_life_cycle,
                "user_is_multicultural": user.user_is_multicultural,
                "user_is_one_parent": user.user_is_one_parent,
                "user_income": user.user_income,
                "user_is_disabled": user.user_is_disabled,
                "user_interest" : interest
            }));  
        })
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
        user_is_disabled: req.body.user_is_disabled
    }, { where: { user_id: user_info.user_id }})
    .then(()=>{
        // 관심 카테고리 테이블 수정 
        /*
        영유아 : 0
        아동·청소년 : 1
        청년 : 2
        중장년 : 3
        노년 : 4
        장애인 : 5
        한부모 : 6
        다문화(새터민) : 7
        저소득층 : 8
        교육 : 9
        고용 : 10
        주거 : 11
        건강 : 12
        서민금융 : 13
        문화 : 14
        임신·출산 : 15
        */

        // 1. Life cycle 수정
        User_interest.destroy({where: {user_id : user_info.user_id, category_id : { [Op.between] : [0, 4]}}})
        .then(()=>{
            User_interest.create({
                user_id : user_info.user_id,
                category_id : req.body.user_life_cycle
            })
        })

        // 2. 장애인일 경우
        User_interest.destroy({where: {user_id : user_info.user_id, category_id : 5}})
        .then(()=>{
            if(req.body.user_is_disabled == 1){
                User_interest.create({
                    user_id : user_info.user_id,
                    category_id : 5
                })
            }
        })

        // 3. 한부모일 경우
        User_interest.destroy({where: {user_id : user_info.user_id, category_id : 6}})
        .then(()=>{
            if(req.body.user_is_one_parent == 1){
                User_interest.create({
                    user_id : user_info.user_id,
                    category_id : 6
                })
            }
        })

        // 4. 다문화일 경우
        User_interest.destroy({where: {user_id : user_info.user_id, category_id : 7}})
        .then(()=>{
            if(req.body.user_is_multicultural == 1){
                User_interest.create({
                    user_id : user_info.user_id,
                    category_id : 7
                })
            }
        })

        // 5. 저소득층일 경우
        User_interest.destroy({where: {user_id : user_info.user_id, category_id : 8}})
        .then(()=>{
            if(req.body.user_income == 1){
                User_interest.create({
                    user_id : user_info.user_id,
                    category_id : 8
                })
            }
        })

        // 6. 나머지 경우
        User_interest.destroy({where: {user_id : user_info.user_id, category_id : { [Op.between] : [9, 15]}}})
        .then(()=>{
            User_interest.create({
                user_id : user_info.user_id,
                category_id : (req.body.user_interest + 9)
            })
        })
    })
    .then(()=>{
        // 성공시 토큰 생성 
        // let token = jwt.sign({
        //     user_id : user_info.user_id,
        //     user_password : user_info.user_password
        // }, secretObj.secret, { expiresIn: '365d'});

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
            "token" : req.body.token
        }));
    }); 
}

// 유저 삭제 Request 처리
exports.userDelete = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 토큰 값으로 해당 유저 검색
    User.destroy({where: { user_id: user_info.user_id }})
      .then(()=>{
        // user_interest 테이블에서도 삭제
        User_interest.destroy({
            where: {
             user_id: user_info.user_id
           }
        })
      })
      .then(()=>{
        // user_like 테이블에서도 삭제
        User_dibs.destroy({
            where: {
             user_id: user_info.user_id
           }
        })
      })
      .then(result=>{
        // 삭제후 성공 json 보내기 
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200
        }));
      })
      .catch(err=>{
        console.log(err);
        // 오류시 실패 json 보내기 
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406
        }));
      });
}
