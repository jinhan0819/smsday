let express = require('express');
let popupController = require('../../controllers/admin/popupController');

module.exports = function () {

    let router = express.Router();

    /* 로고 관리 */
    router.get('/partner_fee_popup', popupController.partner_fee_popup);

    return router;

};


