// 추천 복지 모델 생성 
const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User_recommended = sequelize.define('user_recommended', {
    user_recommended_id : {
        primaryKey : true,
        autoIncrement: true,
        allowNull : false,
        type : Sequelize.INTEGER,
    }, 
    user_id : {
        allowNull : false,
        type : Sequelize.STRING,
    }, 
    welfare_id : {
        allowNull : false,
        type : Sequelize.INTEGER
    }
}, {
    charset: "utf8", // char format 설정
    collate: "utf8_general_ci", // 한국어 설정 
    timestamps: false, // filestamps 비활성화
    tableName: "user_recommended" // 연결할 table 이름 설정 
});
module.exports = User_recommended;
