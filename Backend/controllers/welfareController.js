const Welfare = require('../models/welfare'); // 복지정보 모델
const Welfare_category = require('../models/welfare_category'); // 복지정보-카테고리 모델
const User_recommended = require('../models/user_recommended'); // 추천복지 정보 모델
const User = require('../models/user'); // User 모델 

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
            if(welfare_num < 10){
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

// 추천 복지 정보 GET Request (디버깅 필요)
exports.recommendedWelfare = (req, res, next) => {
    // 토큰 복호화 
    const user_info = jwt.verify(req.body.token, secretObj.secret);

    // 토큰으로 온 user_id에 대한 추천 복지 id를 추출한다.
    User_recommended.findAll({where: {user_id: user_info.user_id}, raw: true})
    .then(user_id => {
        const welfare_ids = [];

        user_id.forEach(element=>{
            welfare_ids.push(element.welfare_id);
        })
        
        // 추출된 복지 id에 대한 복지정보를 Response로 보낸다. 
        Welfare.findAll({where: { welfare_id: welfare_ids }, raw: true})
        .then(result=>{
            // 성공시 성공 json 보내기
            res.send(JSON.stringify({
                "success": true,
                "statusCode" : 201,
                "recommend_welfare_list": result,
                "token" : req.body.token
            }));
        })
    })
}

// 복지 정보 Delete Request 처리 
exports.deleteWelfare = (req, res, next) => {
    // 나중에 필요시 구현예정
}