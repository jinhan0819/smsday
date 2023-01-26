let express = require('express');
let addrsController = require('../../controllers/front/addrsController');


module.exports = function () {

    let router = express.Router();

    router.get('/address_book', addrsController.address_book);
    router.get('/address_reject', addrsController.address_reject);
    router.get('/address_reject_list', addrsController.address_reject_list);

    return router;

};


