module.exports = {
    index: function (req, res) { res.render('publ/index'); },
    list: function (req, res) { res.render('publ/list'); },
    form: function (req, res) { res.render('publ/form'); },
    odform: function (req, res) { res.render('publ/odform'); },
};
