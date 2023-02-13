let config = require('../../config');
// let popupModel = require('../../models/admin/popupModel');
let file = require('../../modules/file')

module.exports = {
    partner_fee_popup: function (req, res, next) {
        res.render('popup/partner_fee_popup');
    },
};
