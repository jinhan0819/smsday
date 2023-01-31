let express = require('express');
let memberController = require('../../controllers/admin/memberController');


module.exports = function () {

    let router = express.Router();

    router.get('/memberList', memberController.memberList);
    router.post('/getMemberList', memberController.getMemberList);
    router.post('/getMemberDetail', memberController.getMemberDetail);
    router.post('/memberModify', memberController.memberModify);
    
    return router;

};


