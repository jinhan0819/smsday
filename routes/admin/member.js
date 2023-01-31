let express = require('express');
let memberController = require('../../controllers/admin/memberController');


module.exports = function () {

    let router = express.Router();

    router.get('/memberList', memberController.memberList);
    
    return router;

};


