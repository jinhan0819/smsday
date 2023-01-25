let config = require('../../config');
let indexModel = require('../../models/user/indexModel');
let file = require('../../modules/file')

module.exports = {
    main: function (req, res, next) {
        res.render('main');
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
