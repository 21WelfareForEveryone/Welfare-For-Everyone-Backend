const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Push_alarm = sequelize.define('push_alarm', {
    alarm_id : {
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
    },
    d_day : {
        allowNull : false,
        type : Sequelize.DATE
    }
}, {
    charset: "utf8", // char format 설정
    collate: "utf8_general_ci", // 한국어 설정 
    timestamps: false, // filestamps 비활성화
    tableName: "push_alarm" // 연결할 table 이름 설정 
});
module.exports = Push_alarm;
