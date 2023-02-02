let express = require('express');
let partnerController = require('../../controllers/admin/partnerController');


module.exports = function () {

    let router = express.Router();

    router.get('/partnerList', partnerController.partnerList);
    // router.post('/getMemberCount', memberController.getMemberCount);
    // router.post('/getMemberList', memberController.getMemberList);
    // router.post('/getMemberDetail', memberController.getMemberDetail);
    // router.post('/memberModify', memberController.memberModify);
    
    return router;

};


