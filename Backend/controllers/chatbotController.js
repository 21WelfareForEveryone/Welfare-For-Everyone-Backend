const { response } = require('express');
let jwt = require("jsonwebtoken"); // 토큰 관리를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈 
var request = require('request'); // Request 생성을 위한 라이브러리 임포트
// const https = require('https')
const Welfare = require('../models/welfare'); // 복지정보 모델
const fetch = require('node-fetch');
const chatbotInfo = require("../config/chatbot.json");  

const serverURL = "http://172.30.1.57:3000"

/*
통신 url : /chatbot
통신 method : POST
Request 
    {
        "message" : "사용자의 메시지"
        "id" : "사용자 id"
    }

Response
    {
        "type" : "welfare or message",
        "message" : "label number",
        "welfare" : ["welfareid1","welfareid2","welfareid3"]    
    }
*/
exports.getResponse = (req, res, next) =>{
    /*
    FLOW
    1. kmg2933 서버에 REQUEST 요청
    2. RESPONSE에 따라 다르게 처리한다. 
        2-1. "type" : "welfare" 일 경우 -> Response로 복지 정보를 전달한다.
        2-2. "type" : "message"이고 message가 특정 label일 경우 -> kosbert_image 서버에 Request를 요청한다
            2-2-1. Response로 온 세개의 복지정보를 Response로 전달한다.
        2-3. "type" : "message" 일 경우 -> Response로 답변 정보를 전달한다.
    */

    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);
    user_message = req.body.chat_message;

    // send Request to kmg2933
    const options = {
        // uri: 'http://172.30.1.57:3000/chatbot',
        uri: 'http://34.64.176.63:3000/chatbot',
        method: 'POST',
        json: {
            "message" : user_message,
            "id" : user_info.user_id
        }
    };
    let kmgResponse = {};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            kmgResponse = body;

            // kmgResponse = 
            // {
            //     "message": "350",
            //     "type": "welfare",
            //     "welfare": undefined
            // }
            
            // case 1. "type" == "welfare"일 경우
            if (kmgResponse.type == 'welfare') {
                console.log('welfare!');
                const welfareIds = kmgResponse.welfare;
        
                Welfare.findAll({where: { welfare_id: welfareIds }, raw: true})
                .then(result=>{
        
                    res.send(JSON.stringify({
                        "success": true,
                        "statusCode" : 200,
                        "message_type": 1,
                        "message_content": null,
                        "welfare_info": result
                    }));
                })
                .catch(err => {
                    console.log(err);
                })
                
        
            }
            // other cases "type" == "message"일 경우
            else {
                if (kmgResponse.type == 'message' && kmgResponse.message == '360') {
                    console.log("Go to Kobert");
                    
                    // send Request to kobert
                    const optionsKobert = {
                        // uri: 'http://172.30.1.57:5000/sebert_title',
                        uri: 'http://34.64.176.63:5000/sebert_title',
                        method: 'POST',
                        json: {
                            "query" : user_message
                        }
                    };
                    let kobertResponse = {};
                    request(optionsKobert, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log(body);
                            kobertResponse = body;
                            const welfareIdsKobert = kobertResponse.recommend;
                            console.log(kobertResponse.recommend);
                
                            Welfare.findAll({where: { welfare_id: welfareIdsKobert }, raw: true})
                            .then(result=>{
                    
                                res.send(JSON.stringify({
                                    "success": true,
                                    "statusCode" : 200,
                                    "message_type": 1,
                                    "message_content": null,
                                    "welfare_info": result
                                }));
                            })
                            .catch(err => {
                                console.log(err);
                            })
                        }
                    });
                }
                else {
                    let message = "";
                    chatbotInfo.forEach(element => {
                        if (element.id == kmgResponse.message) {
                            console.log(element.message);
                            element.message = message
                        }
                    });
                    
                    console.log("message!");
                    res.send(JSON.stringify({
                        "success": true,
                        "statusCode" : 200,
                        "message_type": 0,
                        "message_content":  message,
                        "welfare_info": null
                    }));
                }
            }
        }
    });

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
