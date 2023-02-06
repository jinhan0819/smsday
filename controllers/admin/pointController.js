let config = require('../../config');
let pointModel = require('../../models/admin/pointModel');
let file = require('../../modules/file')

module.exports = {
    pointList: function (req, res, next) {
        res.render('point/point_list');
    },
    pointChargeList: async function (req, res, next) {
        res.render('point/point_charge_list');
    },
    // getMemberList: async function (req, res, next) {
    //     let data = req.body;
    //     let rslt = await memberModel.getMemberList(data);
    //     res.send(rslt);
    // },
    // getMemberDetail: async function (req, res, next) {
    //     let data = req.body;
    //     let rslt = await memberModel.getMemberDetail(data);
    //     res.send(rslt);
    // },
    // memberModify: async function (req, res, next) {
    //     let data = req.body;
    //     let rslt = await memberModel.memberModify(data);
    //     res.send(rslt);
    // },
};
