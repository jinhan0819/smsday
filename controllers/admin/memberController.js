let config = require('../../config');
let indexModel = require('../../models/admin/memberModel');
let file = require('../../modules/file')

module.exports = {
    memberList: function (req, res, next) {
        res.render('member/member_list');
    },
};
