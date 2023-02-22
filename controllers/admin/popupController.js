let config = require('../../config');
// let popupModel = require('../../models/admin/popupModel');
let file = require('../../modules/file')

module.exports = {
    partnerFeePopup: function (req, res, next) {
        res.render('partner_fee_popup');
    },
};
