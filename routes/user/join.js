let express = require('express');
let joinController = require('../../controllers/user/joinController');


module.exports = function () {

    let router = express.Router();

    router.get('/join_selection', joinController.join);
    router.get('/join_agree', joinController.join_agree);
    router.get('/join_regist', joinController.join_regist);
    router.get('/join_ok', joinController.join_ok);

    router.post('/id_check', joinController.id_check);
    router.post('/signup', joinController.signup);

    return router;

};


