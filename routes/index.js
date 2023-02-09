let express = require('express');
let indexController = require('../controllers/indexController');

module.exports = function () {

    let router = express.Router();

    router.get('/', indexController.index);
    router.post('/doLogin', indexController.doLogin);
    router.get('/doLogout', indexController.doLogout);
    router.post('/getMemberInfo', indexController.getMemberInfo);
    router.post('/fileUpload', indexController.fileUpload);
    router.get('/fileDownload', indexController.fileDownload);
    
    return router;

};


