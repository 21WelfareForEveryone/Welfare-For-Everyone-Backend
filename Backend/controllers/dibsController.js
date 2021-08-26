const User_dibs = require('../models/dibs'); // 찜 모델 
const Welfare = require('../models/welfare'); // 복지정보 모델
let jwt = require("jsonwebtoken"); // 토큰 관리를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈

// 찜 Create Request 처리
exports.createDibs = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 데이터 생성    
    User_dibs.create({
        user_id: user_info.user_id,
        welfare_id: req.body.welfare_id
    })
    .then(()=>{
        Welfare.findOne({ where: { welfare_id: req.body.welfare_id } })
        .then(welfare=>{
            Welfare.update({
                like_count: welfare.like_count + 1
            }, { where: { welfare_id: req.body.welfare_id } })
        })
    })
    .then(()=>{
        User_dibs.findAll({where: { user_id: user_info.user_id }, raw: true})
        .then(dibs_info=>{
            const welfare_ids = []
            dibs_info.forEach(element => {
                if(welfare_ids.indexOf(element.welfare_id) == -1){
                    welfare_ids.push(element.welfare_id)
                }
            });

            Welfare.findAll({where: { welfare_id: welfare_ids }, raw: true})
            .then(result=>{
                // 성공시 성공 json 보내기
                res.send(JSON.stringify({
                    "success": true,
                    "statusCode" : 201,
                    "dibs_welfare_list": result,
                    "token" : req.body.token
                }));
            })
        })
    })
    .catch(err=>{
        console.log(err);
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406,
            "dibs_welfare_list": "DENIED",
            "token" : "DENIED"
        }));
    });
}

// 찜 Read Request 처리
exports.readDibs = (req, res, next) =>  {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    User_dibs.findAll({where: { user_id: user_info.user_id }, raw: true})
    .then(dibs_info=>{
        const welfare_ids = []
        dibs_info.forEach(element => {
            if(welfare_ids.indexOf(element.welfare_id) == -1){
                welfare_ids.push(element.welfare_id)
            }
        });

        Welfare.findAll({where: { welfare_id: welfare_ids }, raw: true})
        .then(result=>{
            // 성공시 성공 json 보내기
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 201,
                "dibs_welfare_list": result,
                "token" : req.body.token
            }));
        })
    })
    .catch(err=>{
        console.log(err);
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406,
            "dibs_welfare_list": "DENIED",
            "token" : "DENIED"
        }));
    });
}

// 찜 데이터 삭제
exports.deleteDibs = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 토큰 값으로 해당 유저 검색
    User_dibs.destroy({
        where: { user_id: user_info.user_id, welfare_id: req.body.welfare_id },
        raw: true
    })
    .then(()=>{
        Welfare.findOne({ where: { welfare_id: req.body.welfare_id } })
        .then(welfare=>{
            Welfare.update({
                like_count: welfare.like_count - 1
            }, { where: { welfare_id: req.body.welfare_id } })
        })
    })
    .then(()=>{
        User_dibs.findAll({where: { user_id: user_info.user_id }, raw: true})
        .then(dibs_info=>{
            const welfare_ids = []
            dibs_info.forEach(element => {
                if(welfare_ids.indexOf(element.welfare_id) == -1){
                    welfare_ids.push(element.welfare_id)
                }
            });

            Welfare.findAll({where: { welfare_id: welfare_ids }, raw: true})
            .then(result=>{
                // 성공시 성공 json 보내기
                res.send(JSON.stringify({
                    "success": true,
                    "statusCode" : 201,
                    "dibs_welfare_list": result,
                    "token" : req.body.token
                }));
            })
        })
    })
    .catch(err=>{
        console.log(err);
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406,
            "dibs_welfare_list": "DENIED",
            "token" : "DENIED"
        }));
    });
}
