import bcrypt from 'bcrypt';
import {
    uuid
} from '../utils/uuid';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        // UUID to hide the id from the outside
        uuid : {
            allowNull : false,
            unique : true,
            type : 'BINARY(16)',
            defaultValue : () => Buffer(uuid(), 'hex'),
            get : function() {
                return Buffer.from(this.getDataValue('uuid')).toString('hex')
            }
        },
        user_id : {
            allowNull : false,
            unique : true,
            type : 'NVARCHAR(20)',
            primaryKey : true,
        }, 
        user_password : {
            allowNull : false,
            type : 'NVARCHAR(12)'
        },
        user_name : {
            allowNull : false,
            type : 'NVARCHAR(45)'
        },
        user_gender : {
            // tinyint(4) => boolean으로 해석
            allowNull : true,
            type : DataTypes.BOOLEAN
        },
        user_age : {
            allowNull : true,
            unique : false,
            type : DataTypes.INTEGER(11).UNSIGNED
        },
        user_address : {
            allowNull : true,
            unique : false,
            type : 'NVARCHAR(100)'
        },
        user_life_cycle : {
            allowNull : true,
            unique : false,
            type : DataTypes.INTEGER(11).UNSIGNED
        },
        user_family : {
            allowNull : true,
            unique : false,
            type : DataTypes.INTEGER(11).UNSIGNED
        },
        user_income : {
            allowNull : true,
            unique : false,
            type : DataTypes.INTEGER(11).UNSIGNED
        },
        user_is_disabled : {
            allowNull : true,
            unique : false,
            type : DataTypes.BOOLEAN
        },
        user_is_veterans : {
            allowNull : true,
            unique : false,
            type : DataTypes.BOOLEAN
        },
        user_interest : {
            allowNull : true,
            unique : false,
            type : DataTypes.INTEGER(11).UNSIGNED
        },
        last_update : {
            allowNull : true,
            unique : false,
            type : DataTypes.DATE
        },
        user_mToken : {
            allowNull : true,
            unique : false,
            type : DataTypes.TEXT
        },
        usercol : {
            allowNull : true,
            unique : false,
            type : 'NVARCHAR(45)'
        }
    })
}
