let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');

module.exports = {
    getPtSmsChargeCount: async function(data){
        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_PARTNER_FEE
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getPtSmsChargeList: async function(data){
        let params = paging.pagingRange(data.paging);

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.pt_id,
                Z.pf_fee,
                Z.pf_depositor,
                Z.pf_contents,
                Z.pf_approval_yn,
                DATE_FORMAT(Z.pf_request_datetime, '%Y-%m-%d %H:%i:%s') AS pf_request_datetime,
                IFNULL(DATE_FORMAT(Z.pf_approval_datetime, '%Y-%m-%d %H:%i:%s'), '-') AS pf_approval_datetime
            FROM (
                SELECT
                    index_no,
                    pt_id,
                    pf_fee,
                    pf_depositor,
                    pf_contents,
                    pf_request_datetime,
                    pf_approval_yn,
                    pf_approval_datetime
                FROM TB_PARTNER_FEE
                ORDER BY create_datetime
            ) Z, (SELECT @ROWNUM := 0) R
            ORDER BY rownum DESC 
            LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },
    ptSmsInsert: async function(data){
        data.pf_fee = parseInt(data.pf_fee.replace(/,/g, ''));
        data.pf_request_datetime = new Date();
        let sql = 'INSERT INTO TB_PARTNER_FEE SET ?'
        let rslt = await db.queryTransaction(sql, data);
        return rslt;
    },
    ptSmsDelete: async function(data){
        let sql = 'DELETE FROM TB_PARTNER_FEE WHERE index_no IN (?)'
        let rslt = await db.queryTransaction(sql, [data.del_list]);
        return rslt;
    },
}