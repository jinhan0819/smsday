let express = require('express');
let pointController = require('../../controllers/admin/pointController');


module.exports = function () {

    let router = express.Router();

    router.get('/pointList', pointController.pointList);
    
    return router;

};


