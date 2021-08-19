const express = require('express');
const router = express.Router();
const admin = require('firebase-admin')

// push PAGE
router.get('/push_send', function (req, res, next) {
  //target_token은 푸시 메시지를 받을 디바이스의 토큰값입니다
  let target_token = 'dGe5vXV0TraIxvfiSJoosg:APA91bE8eFnQDGKHAuuXFawBQRryYJWeThdFJS6Q1Y54JOpX3w529nc6lN_RwJaqtr68zEg7kg6Iv6U8x5h0nyaHIOMn3YSHFi7-tOlt9nDfYLT7dFXnsTh72Apv_s0YU5o2cquerQEb'
  
  let message = {
    data: {
      title: '테스트 데이터 발송',
      body: '데이터가 잘 가나요?',
      style: '굳굳',
    },
    token: target_token,
  }

  admin
    .messaging()
    .send(message)
    .then(function (response) {
      console.log('Successfully sent message: : ', response)
    })
    .catch(function (err) {
      console.log('Error Sending message!!! : ', err)
    })
  })

module.exports = router;