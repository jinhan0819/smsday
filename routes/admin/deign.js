let express = require('express');
let deignController = require('../../controllers/admin/deignController');

module.exports = function () {

    let router = express.Router();

    /* 로고 관리 */
    router.get('/logoForm', deignController.logoForm);

    /* 배너 관리 */
    router.get('/bannerList', deignController.bannerList);

    /* 배너 관리 */
    router.get('/popupList', deignController.popupList);

    return router;

};


