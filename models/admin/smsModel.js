let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');

module.exports = {
    cateInsert: async function(data){
        let sql = 'SELECT * FROM TB_SMS_CATE ORDER BY index_no DESC LIMIT 1';
        let rslt = await db.queryTransaction(sql, []);

        if(rslt.result.length == 0){
            data.sc_catecode = '001';
        }else{
            let num = parseInt(rslt.result[0].sc_catecode) + 1;
            data.sc_catecode = String(num).padStart(3, '0');;
        }
        
        let sql_2 = 'INSERT INTO TB_SMS_CATE SET ?';
        let rslt_2 = await db.queryTransaction(sql_2, data);

        return rslt_2;
    },
}