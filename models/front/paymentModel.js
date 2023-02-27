let db = require('../../modules/db');
let config = require('../../config');

module.exports = {
    /* 문자 단가 */
    chargeRequest: async function(data){
        // 가맹점별 수정 부분
        data.po_depositor = data.po_depositor;
        data.po_point = parseInt(data.po_point.replace(/,/g, ''));
        data.po_request_datetime = new Date();

        let sql = `INSERT INTO TB_POINT SET ?`;
        // 쿼리를 하나만 처리할 때 사용
        let rslt = await db.queryTransaction(sql, data);

        return rslt;
    },

    /* 충전 내역 */
    getChargeHistoryCount: async function(param){
        let searchSql = '';
        // if(typeof param.searchWord != 'undefined' && param.searchWord != ''){
        //     searchSql += `AND (pf_contents LIKE '%${param.searchWord}%')`;
        // }
        if(typeof param.startDate != 'undefined' && typeof param.endDate != 'undefined'){
            if(param.startDate != '' && param.endDate != ''){
                searchSql += `AND DATE_FORMAT(po_approval_datetime, '%Y-%m-%d') BETWEEN '${param.startDate}' AND '${param.endDate}'`
            }
        }

        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_POINT
            WHERE mb_id = ?
            AND po_approval_yn = 1
            AND po_point ${param.type === 'plus' ? '>' : '<'} 0
            ${searchSql}
        `

        let rslt = await db.queryTransaction(sql, [param.mb_id]);
        return rslt;
    },
    getChargeHistoryList: async function(param, page){
        let searchSql = '';
        // if(typeof param.searchWord != 'undefined' && param.searchWord != ''){
        //     searchSql += `AND (pf_contents LIKE '%${param.searchWord}%')`;
        // }
        if(typeof param.startDate != 'undefined' && typeof param.endDate != 'undefined'){
            if(param.startDate != '' && param.endDate != ''){
                searchSql += `AND DATE_FORMAT(po_approval_datetime, '%Y-%m-%d') BETWEEN '${param.startDate}' AND '${param.endDate}'`
            }
        }

        let sql = `
            SELECT
                DATE_FORMAT(po_approval_datetime, '%Y-%m-%d') AS po_approval_date,
                FORMAT(po_point , 0) AS po_point,
                IFNULL(po_contents, '-') AS po_contents
            FROM TB_POINT
            WHERE mb_id = ?
            AND po_approval_yn = 1
            AND po_point ${param.type === 'plus' ? '>' : '<'} 0
            ${searchSql}
            LIMIT ? OFFSET ?
        `
        let rslt = await db.queryTransaction(sql, [param.mb_id, page.pageCount, (page.curPage - 1) * page.pageCount]);
        return rslt;
    },
    
}
