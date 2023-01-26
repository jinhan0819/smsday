let express = require('express');
let indexController = require('../../controllers/front/indexController');


module.exports = function () {

    let router = express.Router();

    router.get('/', indexController.main);
    router.post('/test', indexController.test);
    
    return router;

};


