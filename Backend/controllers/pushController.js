const Welfare = require('../models/welfare'); // 복지정보 모델
const { Op } = require("sequelize");
const PushAlarm = require('../models/push_alarm');
let jwt = require("jsonwebtoken"); // 토큰 관리를 위한 jwt 모듈
let secretObj = require("../config/jwt"); // jwt key 모듈 


// In-App 푸시알림 창에 표시할 정보 전송 API 
exports.getInfo = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 현재 날짜
    const curDate = new Date();

    const welfare_list_on = []
    // welfare_id 배열에 들어있는 복지 정보를 Response로 반환
    PushAlarm.findAll({where: {user_id:user_info.user_id}, raw: true})
    .then(results => {
        results.forEach(element => {
            Welfare.findByPk(element.welfare_id)
            .then(welfareInfo=>{
                welfare_list_on.push(welfareInfo);
            })
        });
    })
    .then(()=>{
        Welfare.findAll({where: {start_date : { [Op.gte] : curDate}}, order: [['like_count', 'DESC']], raw: true})
	.then(result=>{
            let welfare_list = [];
            let count = 5-welfare_list_on.length;
            // console.log(welfare_list_on);
            result.forEach(element => {
                let flag = false
                if(count > 0){
                    if(welfare_list_on != undefined)
                        welfare_list_on.forEach(element2 => {
                            if (element.welfare_id == element2.welfare_id) {
                                flag = true
                            }
                        });
                    if(!flag)
                        welfare_list.push(element);                
                        count -= 1;
                }
            });
            // 성공시 성공 json 보내기
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 201,
                "welfare_list": welfare_list,
                "welfare_list_on":welfare_list_on,
                "token" : req.body.token
            }));
        })
    })

}

// 복지정보를 토글했을 경우의 API
exports.pushToggle = (req, res, next) => {
    // 토큰 복호화 
    const command = req.body.toggle_command;
    const user_info = jwt.verify(req.body.token, secretObj.secret);
    const id2toggle = req.body.welfare_id

    Welfare.findByPk(id2toggle).then(welfare => {
        if (command === 'On') {
            // 데이터 생성    
            PushAlarm.create({
                user_id:user_info.user_id,
                welfare_id:id2toggle,
                d_day: welfare.start_date
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
    })

}
