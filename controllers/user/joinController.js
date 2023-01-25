let config = require('../../config');
let joinModel = require('../../models/user/joinModel');

module.exports = {
    join: function(req, res){
        res.render('join/join_selection');
    },
    join_agree: function(req, res){
        res.render('join/join_agree');
    },
    join_regist: function(req, res){
        res.render('join/join_regist');
    },
    join_ok: function(req, res){
        res.render('join/join_ok');
    },
    id_check: async function(req, res){
        let data = req.body;
        let rslt = await joinModel.id_check(data);
        res.send(rslt);
    },
    signup: async function(req, res){
        let data = req.body;
        let rslt = await joinModel.signup(data);
        res.send(rslt);
    },
};
