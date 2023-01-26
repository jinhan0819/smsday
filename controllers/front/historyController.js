let config = require('../../config');
let historyModel = require('../../models/front/historyModel');

module.exports = {
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
