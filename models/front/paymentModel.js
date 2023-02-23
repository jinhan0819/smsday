let db = require('../../modules/db');
let config = require('../../config');

module.exports = {
    /* 문자 단가 */
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

    /* 충전 내역 */
    getChargeHistoryCount: async function(param){
        let searchSql = '';
        if(typeof param.searchWord != 'undefined' && param.searchWord != ''){
            searchSql += `AND (pf_contents LIKE '%${param.searchWord}%')`;
        }
        if(typeof param.startDate != 'undefined' && typeof param.endDate != 'undefined'){
            if(param.startDate != '' && param.endDate != ''){
                searchSql += `AND DATE_FORMAT(pf_approval_datetime, '%Y-%m-%d') BETWEEN '${param.startDate}' AND '${param.endDate}'`
            }
        }

        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_PARTNER_FEE
            WHERE pt_id = ?
            AND pf_approval_yn = 1
            ${searchSql}
        `

        let rslt = await db.queryTransaction(sql, [param.pt_id]);
        return rslt;
    },
    getChargeHistoryList: async function(param, page){
        let searchSql = '';
        if(typeof param.searchWord != 'undefined' && param.searchWord != ''){
            searchSql += `AND (pf_contents LIKE '%${param.searchWord}%')`;
        }
        if(typeof param.startDate != 'undefined' && typeof param.endDate != 'undefined'){
            if(param.startDate != '' && param.endDate != ''){
                searchSql += `AND DATE_FORMAT(pf_approval_datetime, '%Y-%m-%d') BETWEEN '${param.startDate}' AND '${param.endDate}'`
            }
        }

        let sql = `
            SELECT
                DATE_FORMAT(pf_approval_datetime, '%Y-%m-%d') AS pf_approval_date,
                FORMAT(pf_fee , 0) AS pf_fee,
                pf_contents
            FROM TB_PARTNER_FEE
            WHERE pt_id = ?
            AND pf_approval_yn = 1
            ${searchSql}
            LIMIT ? OFFSET ?
        `
        let rslt = await db.queryTransaction(sql, [param.pt_id, page.pageCount, (page.curPage - 1) * page.pageCount]);
        return rslt;
    },
    
}
