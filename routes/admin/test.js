let express = require('express');
let testController = require('../../controllers/admin/testController');


module.exports = function () {

    let router = express.Router();

    router.get('/1', testController.test1);
    router.get('/2', testController.test2);
    router.get('/3', testController.test3);
    router.get('/4', testController.test4);
    router.get('/5', testController.test5);
    router.get('/6', testController.test6);
    router.get('/7', testController.test7);
    router.get('/8', testController.test8);
    router.get('/9', testController.test9);
    router.get('/10', testController.test10);
    router.get('/11', testController.test11);
    router.get('/12', testController.test12);

    return router;

};


