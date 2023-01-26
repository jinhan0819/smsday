let express = require('express');
let historyController = require('../../controllers/front/historyController');

module.exports = function () {

    let router = express.Router();

    router.get('/send_result', historyController.send_result);
    router.get('/reservation', historyController.reservation);
    router.get('/send_stats', historyController.send_stats);

    return router;

};


