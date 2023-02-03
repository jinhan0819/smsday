let express = require('express');
let partnerController = require('../../controllers/admin/partnerController');


module.exports = function () {

    let router = express.Router();

    router.get('/partnerList', partnerController.partnerList);
    router.post('/getPartnerCount', partnerController.getPartnerCount);
    router.post('/getPartnerList', partnerController.getPartnerList);
    router.post('/getPartnerDetail', partnerController.getPartnerDetail);
    router.post('/partnerModify', partnerController.partnerModify);
    
    return router;

};


