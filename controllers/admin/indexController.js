let config = require('../../config');
let indexModel = require('../../models/admin/indexModel');
let file = require('../../modules/file')
let passport = require('../../modules/passport')();

module.exports = {
    main: function (req, res, next) {
        res.render('main');
    },
    itemlist: function (req, res, next) {
        res.render('imsi/itemlist');
    },
    test: function (req, res, next) {
        let data = req.body.data;
        file.fileUpload(req, (result) => {
            console.log('111 : ', result);

        });
        res.send('ok');
        // indexModel.testDB(data, (result) => {
        //     console.log('222 : ', result)
        //     res.send(result);
        // })
    },

};
