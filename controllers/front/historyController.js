let config = require('../../config');
let historyModel = require('../../models/front/historyModel');

module.exports = {
    send_result: function (req, res, next) {
        res.render('history/send_result');
    },
    reservation: function (req, res, next) {
        res.render('history/reservation');
    },
    send_stats: function (req, res, next) {
        res.render('history/send_stats');
    },
};
