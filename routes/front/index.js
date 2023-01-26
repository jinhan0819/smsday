let express = require('express');
let indexController = require('../../controllers/front/indexController');


module.exports = function () {

    let router = express.Router();

    router.get('/', indexController.main);
    router.get('/menual', indexController.menual);
    router.get('/pre', indexController.pre);
    router.post('/test', indexController.test);
    
    return router;

};


