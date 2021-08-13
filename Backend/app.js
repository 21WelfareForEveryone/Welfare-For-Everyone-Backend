// 필요한 모듈 가져오기
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const userRoutes = require('./routes/userRoutes');
const dibsRoutes = require('./routes/dibsRoutes');
const welfareRoutes = require('./routes/welfareRoutes');

// FCM 푸시알림 테스트 코드입니다.
const admin = require('firebase-admin')
let serviceAccount = require('./config/hazel-cedar-312311-firebase-adminsdk-75xw8-63ca59049b.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes); // user router 연결
app.use(dibsRoutes); // 찜 router 연결
app.use(welfareRoutes); // 복지정보 router 연결

app.listen(80);