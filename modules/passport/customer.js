let db = require('../db');

module.exports =  {

    getUserAndPath: async function(data){
        let sql = 'SELECT * FROM customer WHERE id = ?';
        let rslt = await db.queryTransaction(sql, data.id);

        let returnObj = {};
        if(rslt.data.length > 0){
            returnObj.path = '/';
            returnObj.userInfo = rslt.data[0];
        }else{
            returnObj.path = '/sign/sns_signup';
            returnObj.userInfo = {};
        }
        return returnObj;
    },
};