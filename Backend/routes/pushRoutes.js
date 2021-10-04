const express = require('express');
const router = express.Router();
const admin = require('firebase-admin')
const pushController = require('../controllers/pushController');

router.post('/push/getinfo', pushController.getInfo);
router.post('/push/toggle', pushController.pushToggle);

// router.get('/push_send', async function(req, res){
//   let deviceToken = ``;

//   let message = {
//       notification : {
//           title: 'PushAlarms Test',
//           body:'Check your CoupangEats',
//       },
//       token:deviceToken,
//   }

//   admin
//       .messaging()
//       .send(message)
//       .then(function(response){
//           console.log('Successfully sent message:', response)
//           return res.status(200).json({success: true})
//       })
//       .catch(function(err) {
//           console.log('Error Sending message!!! : ', err)
//           return res.status(400).json({success: false})
//       });
// })

// // push PAGE
// router.get('/push_send', function (req, res, next) {
//   //target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다
//   // let target_token = 'chBEIbJqQ8CoPQQwWJ7dRj:APA91bGs2VEtGMIztQoAZA_hl0W5M1lldPlZD5mcMraBl9xjYg0K1B5dFDXg65_qZ6n8L8K2MuBBtjl7sNAZQobM4VvEDQH2mQ7_gSi8NnmWFM8fSMMFakS5yqYtcy4TTRTBg6dkbMeM'

//   // This registration token comes from the client FCM SDKs.
//   const registrationToken = 'chBEIbJqQ8CoPQQwWJ7dRj:APA91bGs2VEtGMIztQoAZA_hl0W5M1lldPlZD5mcMraBl9xjYg0K1B5dFDXg65_qZ6n8L8K2MuBBtjl7sNAZQobM4VvEDQH2mQ7_gSi8NnmWFM8fSMMFakS5yqYtcy4TTRTBg6dkbMeM';

//   const message = {
//     data: {
//       score: '850',
//       time: '2:45'
//     },
//     token: registrationToken
//   };

//   // Send a message to the device corresponding to the provided
//   // registration token.
//   admin.messaging().send(message)
//     .then((response) => {
//       // Response is a message ID string.
//       console.log('Successfully sent message:', response);
//     })
//     .catch((error) => {
//       console.log('Error sending message:', error);
//     });

//   // let message = {
//   //   data: {
//   //     title: '테스트 데이터 발송',
//   //     body: '데이터가 잘 가나요?',
//   //     style: '굳굳',
//   //   },
//   //   token: target_token,
//   // }

//   // admin
//   //   .messaging()
//   //   .send(message)
//   //   .then(function (response) {
//   //     console.log('Successfully sent message: : ', response)
//   //   })
//   //   .catch(function (err) {
//   //     console.log('Error Sending message!!! : ', err)
//   //   })
  
//   res.send("Sent!");
// })

module.exports = router;