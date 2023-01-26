let config = require('../../config');
let paymentModel = require('../../models/front/paymentModel');

module.exports = {
    sms_price: function(req, res){
        res.render('payment/sms_price');
    },
    charge_history: function(req, res){
        res.render('payment/charge_history');
    },
    send_history: function(req, res){
        res.render('payment/send_history');
    },
};
