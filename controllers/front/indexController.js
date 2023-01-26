let config = require('../../config');
let indexModel = require('../../models/front/indexModel');
let file = require('../../modules/file')

module.exports = {
    main: function (req, res, next) {
        res.render('main');
    },
    menual: function (req, res, next) {
        res.render('menual');
    },
    pre: function (req, res, next) {
        res.render('pre');
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
