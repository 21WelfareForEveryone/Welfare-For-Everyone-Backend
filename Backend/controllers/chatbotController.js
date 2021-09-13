const { response } = require('express');
var request = require('request'); // Request 생성을 위한 라이브러리 임포트
// const https = require('https')
const Welfare = require('../models/welfare'); // 복지정보 모델
const fetch = require('node-fetch');



exports.getResponse = (req, res, next) =>{
    /*
    혜현님의 모델만 적용된 버전
    */
    reqList = {
        'query' : req.chat_message
    }

    fetch('http://172.30.1.57:3000/sebert', {
        method: 'POST',
        body: JSON.stringify(reqList),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
        console.log(res.body);
        // res.json()

    })
    // .then(json => {
    //     console.log(json)
    // })
 

    // const flaskServer1Url = "http://172.30.1.57:3000/sebert";
    // console.log('hello');
    // const options_server1 = {
    //     url : flaskServer1Url,
    //     method : 'POST',
    //     body : {
    //         "query" : req.chat_message
    //     },
    //     json : true
    // }

    // request.post(options_server1, (error, response, body) => {
    //     console.log(response.body);
    // });

    

    // const flaskServer1Url = "thisIsFlaskUrl1";
    // const flaskServer2Url = "thisIsFlaskUrl2";

    // const options_server1 = {
    //     url : flaskServer1Url,
    //     method : 'POST',
    //     body : {
            
    //     },
    //     json : true
    // }

    // const options_server2 = {
    //     url : flaskServer2Url,
    //     method : 'POST',
    //     body : {
            
    //     },
    //     json : true
    // }

    // // 1. Flask Server로 Request를 보낸다. & 2. Flask Server로부터 Response를 받는다.
    // request.post(options_server1, (error, response, body) =>{
    //     // 3. 받은 Response의 종류를 파악한다. 
        
    //     // 4-1. string 형태의 답변일 경우 App에게 보낸다.
    //     res.send(JSON.stringify({
    //         "success": true,
    //         "statusCode" : 201,
    //         "message_type" : 0,
    //         "message_content" : "message",
    //         "welfare_info" : []
    //     }));        

    //     // 4-2-1. 복지정보 추천이 필요할 경우 flask server2로 Request를 생성한다.
    //     request.post(options_server2, (error, response, body) => {
            
    //     })
    //     .then(result =>{
    //         // 4-2-2. 받은 복지정보 Response를 App에게 보낸다.  
    //         res.send(JSON.stringify({
    //             "success": true,
    //             "statusCode" : 201,
    //             "message_type" : 0,
    //             "message_content" : "0",
    //             "welfare_info" : []
    //         }));
    //     })

    // })
}