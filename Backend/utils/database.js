const Sequelize = require('sequelize');

const sequelize = new Sequelize("welfare-for-everyone", 'root', '1357', {
  dialect: 'mysql',
  host: '34.64.116.88'
});

module.exports = sequelize;
