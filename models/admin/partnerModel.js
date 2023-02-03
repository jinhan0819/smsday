let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');

module.exports = {
    getPartnerCount: async function(data){
        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_PARTNER
            WHERE (pt_id LIKE '%${data.keyword}%' OR pt_company_name LIKE '%${data.keyword}%' OR pt_owner LIKE '%${data.keyword}%')
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getPartnerList: async function(data){
        let params = paging.pagingRange(data.paging);

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.pt_id,
                Z.pt_company_name,
                Z.pt_saupja,
                Z.pt_tongsin,
                Z.pt_tel,
                Z.pt_fax,
                Z.pt_item,
                Z.pt_service,
                Z.pt_owner,
                Z.pt_zip,
                Z.pt_addr,
                Z.pt_addr_detail
            FROM (
                SELECT
                    index_no,
                    pt_id,
                    pt_company_name,
                    pt_saupja,
                    pt_tongsin,
                    pt_tel,
                    pt_fax,
                    pt_item,
                    pt_service,
                    pt_owner,
                    pt_zip,
                    pt_addr,
                    pt_addr_detail
                FROM TB_PARTNER
            ) Z, (SELECT @ROWNUM := 0) R
            WHERE (Z.pt_id LIKE '%${data.keyword}%' OR Z.pt_company_name LIKE '%${data.keyword}%' OR Z.pt_owner LIKE '%${data.keyword}%')
            ORDER BY rownum DESC 
            LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },
    getPartnerDetail: async function(data){
        let sql = `
            SELECT
                index_no,
                pt_id,
                pt_company_name,
                pt_saupja,
                pt_tongsin,
                pt_tel,
                pt_fax,
                pt_item,
                pt_service,
                pt_owner,
                pt_zip,
                pt_addr,
                pt_addr_detail
            FROM TB_PARTNER
            WHERE index_no = ?
        `;
        let rslt = await db.queryTransaction(sql, [data.index_no]);

        return rslt;
    },
    partnerModify: async function(data) {

        if(typeof data.index_no === 'undefined'){
            data.index_no = null;
        }
        let col_datas = [
            // VALUES
            data.index_no, data.pt_id, data.pt_company_name, data.pt_saupja, data.pt_tongsin, data.pt_tel, 
            data.pt_fax, data.pt_item, data.pt_service, data.pt_owner, data.pt_zip, data.pt_addr, data.pt_addr_detail,
            // UPDATE
            data.pt_id, data.pt_company_name, data.pt_saupja, data.pt_tongsin, data.pt_tel,
            data.pt_fax, data.pt_item, data.pt_service, data.pt_owner, data.pt_zip, data.pt_addr, data.pt_addr_detail
        ]
        let sql = `
            INSERT INTO TB_PARTNER (
                index_no,
                pt_id,
                pt_company_name,
                pt_saupja,
                pt_tongsin,
                pt_tel,
                pt_fax,
                pt_item,
                pt_service,
                pt_owner,
                pt_zip,
                pt_addr,
                pt_addr_detail
            )
            VALUES(
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            ) 
            ON DUPLICATE KEY UPDATE
            pt_id = ?,
            pt_company_name = ?,
            pt_saupja = ?,
            pt_tongsin = ?,
            pt_tel = ?,
            pt_fax = ?,
            pt_item = ?,
            pt_service = ?,
            pt_owner = ?,
            pt_zip = ?,
            pt_addr = ?,
            pt_addr_detail = ?
        `;
        let rslt = await db.queryTransaction(sql, col_datas);

        return rslt;
    }
}