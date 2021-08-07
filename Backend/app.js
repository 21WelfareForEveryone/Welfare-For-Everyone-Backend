// 필요한 모듈 가져오기
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes); // user router 연결

app.listen(80);