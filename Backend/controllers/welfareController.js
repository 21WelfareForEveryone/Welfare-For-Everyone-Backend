const Welfare = require('../models/welfare'); // 복지정보 모델
const Welfare_category = require('../models/welfare_category'); // 복지정보-카테고리 모델
const User_recommended = require('../models/user_recommended'); // 추천복지 정보 모델
const User = require('../models/user'); // User 모델 
const request = require('request');

// 복지 정보 Create Request 처리 
exports.createWelfare = (req, res, next) => {
    Welfare.create({
        welfare_id: req.body.welfare_id,
        title: req.body.title,
        summary: req.body.summary,
        who: req.body.who,
        criteria: req.body.criteria,
        what: req.body.what,
        how: req.body.how,
        calls: req.body.calls,
        sites: req.body.sites,
        like_count: 0
    })
    .then(result=>{
        // 성공 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 201,
            "welfare_id" : req.body.welfare_id
        }));
    })
    .catch(err=>{
        console.log(err);
        // 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 202,
            "welfare_id" : "DENIED"
        }));
    })
}

// 복지 정보 Read Request 처리 
exports.readWelfare = (req, res, next) => {
    Welfare.findByPk(req.body.welfare_id)
    .then(welfare=>{
        // 성공시 복지 정보 json 보내기
        res.send(JSON.stringify({
            "success": true,
            "statusCode" : 200,
            "welfare_id" : req.body.welfare_id,
            "title" : welfare.title,
            "summary": welfare.summary,
            "who" : welfare.who,
            "criteria": welfare.criteria,
            "what" : welfare.what,
            "how": welfare.how,
            "calls" : welfare.calls,
            "sites": welfare.sites,
            "category" : welfare.category,
            "like_count": welfare.like_count        
        })); 
    })
    .catch(err=>{
        console.log(err);
        // 오류시 실패 json 보내기
        res.send(JSON.stringify({
            "success": false,
            "statusCode" : 406,
            "welfare_id" : req.body.welfare_id
        }));
    })
}

// 복지 정보 Search Request
exports.searchWelfare = (req, res, next) => {
    // Request로부터 Category 번호 받기
    const category = req.body.welfare_category;
    let welfare_num = 0;
    
    // 해당 Category 번호에 해당하는 복지의 welfare_id 배열로 추출 
    Welfare_category.findAll({where: {category_id: category}, raw: true})
    .then(welfare_info => {
        // console.log(welfare_info);
        let welfare_ids = [];
        welfare_info.forEach(element=>{
            if(welfare_num < 30){
                welfare_ids.push(element.welfare_id);
                console.log(element.welfare_id);
            }
            welfare_num += 1;
        })
        console.log(welfare_ids);
        
        // welfare_id 배열에 들어있는 복지 정보를 Response로 반환
        Welfare.findAll({where: { welfare_id: welfare_ids }, raw: true})
        .then(result=>{
            // 성공시 성공 json 보내기
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 201,
                "welfare_list": result,
                "token" : req.body.token
            }));
        })
    })
    .catch(err=>{
        console.log(err);
    })
}

// 추천 복지 정보 GET Request
/*
    // AI 서버 API //

    통신 url : /main
    통신 method : POST   
    
    Request 
    {
        "id" : "사용자 id"
    }

    Response
    {
        "welfare" : ["welfareid1","welfareid2","welfareid3","welfareid4","welfareid5","welfareid6"]    
    }
*/
exports.recommendedWelfare = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 민규 서버로 Request 보내기 
    // Response로 도착한 추천복지 6개의 id의 전체 정보를 서버로부터 받아서 res로 전달

    // option parameter 지정    
    const options = {
        uri: 'http://172.30.1.57:3000/main',
        method: 'POST',
        json: {
            "id" : user_info.user_id
        }
    };
    // Request 전송
    let recommendedInfo = {};
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            recommendedInfo = body;
        }
    });


    // 복지 정보 가져오는 과정 필요!

    // res로 전달
    // res.send(JSON.stringify({
    //     "success": true,
    //     "statusCode" : 200,
    //     "recommend_welfare_list": recommendedInfo,
    //     "token" : req.body.token
    // }));

 
    /*
    Front-end 작업을 위한 Dummy Data Res Codes
    */
    // dummyIds = [0,1,2,3,4];
    // Welfare.findAll({where: { welfare_id: dummyIds }, raw: true})
    // .then(result=>{
    //     // 성공시 성공 json 보내기
    //     res.send(JSON.stringify({
    //         "success": true,
    //         "statusCode" : 201,
    //         "recommend_welfare_list": result,
    //         "token" : req.body.token
    //     }));
    // })
    // .catch(err => {
    //     console.log(err);
    // })
    
}

// 복지 정보 Delete Request 처리 
exports.deleteWelfare = (req, res, next) => {
    // 나중에 필요시 구현예정
}