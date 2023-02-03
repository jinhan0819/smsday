let express = require('express');
let memberController = require('../../controllers/admin/memberController');


module.exports = function () {

    let router = express.Router();

    router.get('/memberList', memberController.memberList);
    router.get('/memberForm', memberController.memberForm);
    router.post('/getMemberCount', memberController.getMemberCount);
    router.post('/getMemberList', memberController.getMemberList);
    router.post('/getMemberDetail', memberController.getMemberDetail);
    router.post('/memberModify', memberController.memberModify);

    router.post('/getNotPartnerMemberCount', memberController.getNotPartnerMemberCount);
    router.post('/getNotPartnerMemberList', memberController.getNotPartnerMemberList);
    
    return router;

};


