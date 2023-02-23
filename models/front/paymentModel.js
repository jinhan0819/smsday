let db = require('../../modules/db');
let config = require('../../config');

module.exports = {
    chargeRequest: async function(data){
        // 가맹점별 수정 부분
        data.pt_id = 'admin'
        data.pf_contents = '충전 요청';
        data.pf_request_datetime = new Date();
        data.pf_fee = parseInt(data.pf_fee.replace(/,/g, ''));

        let sql = `INSERT INTO TB_PARTNER_FEE SET ?`;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, data);

        return rslt;
    },
    
}
