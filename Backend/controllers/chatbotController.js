const { response } = require('express');
var request = require('request'); // Request 생성을 위한 라이브러리 임포트
// const https = require('https')
const Welfare = require('../models/welfare'); // 복지정보 모델
const fetch = require('node-fetch');



exports.getResponse = (req, res, next) =>{
    /*
    
    */
}

exports.getResponseDummy0 = (req, res, next) =>{
    /*
    if message_type == 0일때 (string 형식의 답변만 있을경우)
    */
    res.send(JSON.stringify({
        "success": true,
        "statusCode" : 201,
        "message_type": 0,
        "message_content": "답변 예시입니다.",
        "welfare_info": null
    }));
}

exports.getResponseDummy1 = (req, res, next) =>{
    /*
    if message_type == 1일때 (복지정보를 추천할 경우)
    */

    dummyIds = [0,1,2];
    Welfare.findAll({where: { welfare_id: dummyIds }, raw: true})
    .then(result=>{
        // 성공시 성공 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 201,
            "message_type": 0,
            "message_content": null,
            "welfare_info": result
        }));
    })
    .catch(err => {
        console.log(err);
    })
}
