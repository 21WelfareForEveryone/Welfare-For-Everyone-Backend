const Welfare = require('../models/welfare'); // 복지정보 모델

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

// 복지 정보 Delete Request 처리 
exports.deleteWelfare = (req, res, next) => {
    // 나중에 필요시 구현예정
}