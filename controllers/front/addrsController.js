let config = require('../../config');
let addrsModel = require('../../models/front/addrsModel');

module.exports = {
    address_book: function (req, res, next) {
        res.render('addrs/address_book');
    },
    address_reject: function (req, res, next) {
        res.render('addrs/address_reject');
    },
    address_reject_list: function (req, res, next) {
        res.render('addrs/address_reject_list');
    },
};
