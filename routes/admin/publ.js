let express = require('express');
let publController = require('../../controllers/admin/publController');


module.exports = function () {

    let router = express.Router();

    router.get('/index', publController.index);
    router.get('/list', publController.list);
    router.get('/form', publController.form);
    router.get('/odform', publController.odform);

    return router;

};


