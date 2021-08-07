const User = require('../models/user');
let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");

exports.userLogin = (req, res, next) => {
    User.findByPk(req.body.user_id).then(user=>{
        if (req.body.user_id == user.user_id && req.body.user_password == user.user_password){
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 200,
                "token" : user.user_mToken
            }));
        }
        else{
            res.send(JSON.stringify({
                "success": false,
                "statusCode" : 400,
                "token" : "DENIED"
            }));
        }
    })
    .catch(err=>{
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 400,
            "token" : "DENIED"
        }));
    });
}

exports.userRegister = (req, res, next) => {
    let token = jwt.sign({
        user_id : req.body.user_id,
        user_password : req.body.user_password,
        user_name : req.body.user_name
    }
    , secretObj.secret
    , { expiresIn: '365d'});
    
    User.create({
        user_id: req.body.user_id,
        user_password: req.body.user_password,
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_age: req.body.user_age,
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_family: req.body.user_family,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_is_veterans: req.body.user_is_veterans,
        user_interest: req.body.user_interest,
        user_mToken: token
    })
    .then(result=>{
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200,
            "token" : token
        }));
    })
    .catch(err=>{
        console.log(err);
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 400,
            "token" : token
        }));
    });
}

exports.userRead = (req, res, next) => {


    
}

exports.userUpdate = (req, res, next) => {
    
    User.update({
        user_id:req.body.user_id,
        user_password:req.body.user_password,
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_age: req.body.user_age,
        user_address: req.body.user_address,
        user_life_cycle: req.body.user_life_cycle,
        user_family: req.body.user_family,
        user_income: req.body.user_income,
        user_is_disabled: req.body.user_is_disabled,
        user_is_veterans: req.body.user_is_veterans,
        user_interest: req.body.user_interest,
    }, { where: { user_mToken: req.body.token }})
    .then(result=>{
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200,
            "token" : req.body.token
        }));
    })
    .catch(err=>{
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 400,
            "token" : req.body.token
        }));
    }); 
}

exports.userDelete = (req, res, next) => {
    User.findOne({
        where: { user_mToken: req.body.token }
      })
      .then(user=>{
        user.destroy();
      })
      .then(result=>{
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200
        }));
      })
      .catch(err=>{
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 400
        }));
      });
}