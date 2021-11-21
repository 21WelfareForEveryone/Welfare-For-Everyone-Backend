const User_dibs = require('../models/dibs'); // 찜 모델 
const Welfare = require('../models/welfare'); // 복지정보 모델
const Welfare_category = require('../models/welfare_category');
let jwt = require("jsonwebtoken"); // 토큰 관리를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈

// 찜 Create Request 처리
exports.createDibs = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    let likedWelfareIds = [];
    likedWelfareIds.push(req.body.welfare_id);
    User_dibs.findAll({where: {user_id: user_info.user_id}, raw: true})
    .then(results => {
        results.forEach(element => {
            likedWelfareIds.push(element.welfare_id)
        });
    })

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


            let welfare_list = []
            Welfare.findAll({where: {welfare_id: welfare_ids}, raw: true})
            .then(result => {
                welfare_list = result;
                Welfare_category.findAll({where:{welfare_id:welfare_ids}, raw: true})
                .then(result=>{
                    result.forEach(element1 => {
                        welfare_list.forEach(element2 => {
                            if(element1.welfare_id == element2.welfare_id){
                                element2.category = element1.category_id
                            }
                            if(likedWelfareIds.includes(element2.welfare_id)){
                                element2.isLiked = true;
                            }
                            else {
                                element2.isLiked = false;
                            }
                        })
                    });
                })
                .then(()=>{
                    res.send(JSON.stringify({
                        "success" : true,
                        "statusCode": 200,
                        "recommend_welfare_list" :welfare_list,
                        "token" : req.body.token
                    }));
                })  
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

    let likedWelfareIds = [];
    User_dibs.findAll({where: {user_id: user_info.user_id}, raw: true})
    .then(results => {
        results.forEach(element => {
            likedWelfareIds.push(element.welfare_id)
        });
    })

    User_dibs.findAll({where: { user_id: user_info.user_id }, raw: true})
    .then(dibs_info=>{
        const welfare_ids = []
        dibs_info.forEach(element => {
            if(welfare_ids.indexOf(element.welfare_id) == -1){
                welfare_ids.push(element.welfare_id)
            }
        });

        let welfare_list = []
        Welfare.findAll({where: {welfare_id: welfare_ids}, raw: true})
        .then(result => {
            welfare_list = result;
            Welfare_category.findAll({where:{welfare_id:welfare_ids}, raw: true})
            .then(result=>{
                result.forEach(element1 => {
                    welfare_list.forEach(element2 => {
                        if(element1.welfare_id == element2.welfare_id){
                            element2.category = element1.category_id
                        }
                        if(likedWelfareIds.includes(element2.welfare_id)){
                            element2.isLiked = true;
                        }
                        else {
                            element2.isLiked = false;
                        }
                    })
                });
            })
            .then(()=>{
                res.send(JSON.stringify({
                    "success" : true,
                    "statusCode": 200,
                    "recommend_welfare_list" :welfare_list,
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

// 찜 데이터 삭제
exports.deleteDibs = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);
    let likedWelfareIds = [];
    // 토큰 값으로 해당 유저 검색
    User_dibs.destroy({
        where: { user_id: user_info.user_id, welfare_id: req.body.welfare_id },
        raw: true
    })
    .then(()=>{
        User_dibs.findAll({where: {user_id: user_info.user_id}, raw: true})
        .then(results => {
            results.forEach(element => {
                likedWelfareIds.push(element.welfare_id)
            });
        })
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

            let welfare_list = []
            Welfare.findAll({where: {welfare_id: welfare_ids}, raw: true})
            .then(result => {
                welfare_list = result;
                Welfare_category.findAll({where:{welfare_id:welfare_ids}, raw: true})
                .then(result=>{
                    result.forEach(element1 => {
                        welfare_list.forEach(element2 => {
                            if(element1.welfare_id == element2.welfare_id){
                                element2.category = element1.category_id
                            }
                            if(likedWelfareIds.includes(element2.welfare_id)){
                                element2.isLiked = true;
                            }
                            else {
                                element2.isLiked = false;
                            }
                        })
                    });
                })
                .then(()=>{
                    res.send(JSON.stringify({
                        "success" : true,
                        "statusCode": 200,
                        "recommend_welfare_list" :welfare_list,
                        "token" : req.body.token
                    }));
                })
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
