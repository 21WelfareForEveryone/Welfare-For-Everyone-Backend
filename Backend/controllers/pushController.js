const Welfare = require('../models/welfare'); // 복지정보 모델
const { Op } = require("sequelize");
const PushAlarm = require('../models/push_alarm');
let jwt = require("jsonwebtoken"); // 토큰 관리를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈 
const schedule = require('node-schedule');

// 날짜가 되면 실행된다. 
const date2execute = {
    
}

// In-App 푸시알림 창에 표시할 정보 전송 API 
exports.getInfo = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 현재 날짜
    const curDate = new Date();

    // welfare_id 배열에 들어있는 복지 정보를 Response로 반환
    // PushAlarm.findAll({where: {user_id:user_info.user_id}, raw: true})
    // .then(result)
    Welfare.findAll({where: {end_date : { [Op.gte] : curDate}}, order: [['like_count', 'DESC']], raw: true})
    .then(result=>{
        let welfare_list = [];
        let count = 5;
        result.forEach(element => {
            if(count > 0){
                // console.log(element);
                welfare_list.push(element)                
            }
            count -= 1;
        });
        // 성공시 성공 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 201,
            "welfare_list": welfare_list,
            "token" : req.body.token
        }));
    })
}

// 복지정보를 토글했을 경우의 API
exports.pushToggle = (req, res, next) => {
    // 토큰 복호화 
    const command = req.body.command;
    const user_info = jwt.verify(req.body.token, secretObj.secret);
    const id2toggle = req.body.welfare_id

    if (command == 'On') {
        // 데이터 생성    
        PushAlarm.create({
            user_id:user_info.user_id,
            welfare_id:id2toggle
        })
        .then(result => {
            // 성공시 성공 json 보내기
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 200,
                "token" : req.body.token
            }));
        }).catch(err => { console.log(err);})        
    } else {
        PushAlarm.destroy({where: { welfare_id: id2toggle }})
        .then(result => {
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 200,
                "token" : req.body.token
            }));
        })
        .catch(err=>{console.log(err);})
    }
}
