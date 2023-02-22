let express = require('express');
let popupController = require('../../controllers/admin/popupController');

module.exports = function () {

    let router = express.Router();

    /* 가맹점사용료 상세내역 팝업 */
    router.get('/partnerFeePopup', popupController.partnerFeePopup);

    return router;

};


