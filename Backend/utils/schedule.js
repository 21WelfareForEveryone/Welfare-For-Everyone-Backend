const PushAlarm = require('../models/push_alarm');
const Welfare = require('../models/welfare'); // 복지정보 모델
const User = require('../models/user'); // User 모델 
const schedule = require('node-schedule');
const admin = require('firebase-admin');
const { Op } = require("sequelize");

// let serviceAccount = require('./config/hazel-cedar-312311-firebase-adminsdk-75xw8-efe9c58e9f.json')
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

module.exports = {
  check: () => {
    schedule.scheduleJob('0 0 8 * * *', async()=>{
    // schedule.scheduleJob('5 * * * * *', async()=>{
        
        // 현재 시간
        const curr = new Date();
        const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const kr_curr = new Date(utc + (KR_TIME_DIFF));

        console.log(kr_curr);
        
        PushAlarm.findAll({where: {d_day : { [Op.lte] : kr_curr}}, raw: true})
        .then(alarms => {
            console.log(alarms);
            alarms.forEach(pushinfo => {
                // 1. 파이어베이스 토큰값을 가져온다. 
                User.findByPk(pushinfo.user_id)
                .then(userinfo => {
                    // 2. Welfare 정보를 가져온다.
                    Welfare.findByPk(pushinfo.welfare_id)
                    .then(welfareinfo => {
                        firebaseToken = userinfo.user_mToken;
                        title = welfareinfo.title;

                        console.log(firebaseToken, title);
                        // 3. 푸시알림을 보낸다.
                        let message = 
                        {
                            notification : {
                                title: '모두를 위한 복지 알림입니다.',
                                body: title,
                            },
                            token:firebaseToken
                        }

                        admin
                        .messaging()
                        .send(message)
                        .then(function(response){
                            console.log('Successfully sent message:', response)
                            // return res.status(200).json({success: true})
                        })
                        .catch(function(err) {
                            console.log('Error Sending message!!! : ', err)
                            // return res.status(400).json({success: false})
                        });
                    })
                })

            });
        })

    })

    }
}
