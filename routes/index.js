let express = require('express');
let indexController = require('../controllers/indexController');

module.exports = function () {

    let router = express.Router();

    router.get('/', indexController.index);
    router.post('/doLogin', indexController.doLogin);
    router.get('/doLogout', indexController.doLogout);
    
    return router;

};


