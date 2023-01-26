let config = require('../../config');
let mypageModel = require('../../models/front/mypageModel');

module.exports = {
    member_modify: function (req, res, next) {
        res.render('mypage/member_modify');
    },
    setting: function (req, res, next) {
        res.render('mypage/setting');
    },
    pwd_change: function (req, res, next) {
        res.render('mypage/pwd_change');
    },
    tel_modify: function (req, res, next) {
        res.render('mypage/tel_modify');
    },
    member_delete: function (req, res, next) {
        res.render('mypage/member_delete');
    },
};
