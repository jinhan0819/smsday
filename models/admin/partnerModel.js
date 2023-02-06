let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');
const file = require('../../modules/file');

module.exports = {
    getPartnerCount: async function(data){
        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql += `WHERE pt_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql += `WHERE pt_owner LIKE '%${data.keyword}%'`;
        }

        
        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += 'AND';
            search_sql += ` DATE_FORMAT(create_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_PARTNER
            ${search_sql}
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getPartnerList: async function(data){
        let params = paging.pagingRange(data.paging);

        let search_sql = ``;
        if(typeof data.keycode !== 'undefined'){
            if(data.keycode == 'id') search_sql += `WHERE Z.pt_id LIKE '%${data.keyword}%'`;
            else if(data.keycode == 'name') search_sql += `WHERE Z.pt_owner LIKE '%${data.keyword}%'`;
        }

        
        if(typeof data.date !== 'undefined' && (data.date.start !== '' && data.date.end !== '')){
            if(search_sql === '') search_sql += 'WHERE'
            else search_sql += 'AND';
            search_sql += ` DATE_FORMAT(Z.create_datetime, '%Y-%m-%d') BETWEEN '${data.date.start}' AND '${data.date.end}'`;
        }

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.pt_id,
                Z.pt_company_name,
                Z.pt_saupja,
                Z.pt_tongsin,
                IFNULL(Z.pt_domain, '-') AS pt_domain,
                Z.pt_tel,
                Z.pt_fax,
                Z.pt_item,
                Z.pt_service,
                Z.pt_owner,
                Z.pt_zip,
                Z.pt_addr,
                Z.pt_addr_detail,
                Z.pt_manager_name,
                Z.pt_manager_hp,
                Z.pt_manager_email,
                DATE_FORMAT(Z.create_datetime, '%Y-%m-%d') AS create_date
            FROM (
                SELECT
                    index_no,
                    pt_id,
                    pt_company_name,
                    pt_saupja,
                    pt_tongsin,
                    pt_domain,
                    pt_tel,
                    pt_fax,
                    pt_item,
                    pt_service,
                    pt_owner,
                    pt_zip,
                    pt_addr,
                    pt_addr_detail,
                    pt_manager_name,
                    pt_manager_hp,
                    pt_manager_email,
                    create_datetime
                FROM TB_PARTNER
            ) Z, (SELECT @ROWNUM := 0) R
            ${search_sql}
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
                pt_domain,
                pt_tel,
                pt_fax,
                pt_item,
                pt_service,
                pt_owner,
                pt_zip,
                pt_addr,
                pt_addr_detail,
                pt_manager_name,
                pt_manager_hp,
                pt_manager_email
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

        if(typeof data.pt_company_file_id === 'undefined') data.pt_company_file_id = null;
        if(typeof data.pt_manager_file_id === 'undefined') data.pt_manager_file_id = null;

        let col_datas = [
            // VALUES
            data.index_no, data.pt_id, data.pt_company_name, data.pt_saupja, data.pt_tongsin, data.pt_tel, data.pt_domain,
            data.pt_fax, data.pt_item, data.pt_service, data.pt_owner, data.pt_zip, data.pt_addr, data.pt_addr_detail,
            data.pt_manager_name, data.pt_manager_email, data.pt_manager_hp, data.pt_company_file_id, data.pt_manager_file_id,
            // UPDATE
            data.pt_id, data.pt_company_name, data.pt_saupja, data.pt_tongsin, data.pt_tel, data.pt_domain,
            data.pt_fax, data.pt_item, data.pt_service, data.pt_owner, data.pt_zip, data.pt_addr, data.pt_addr_detail,
            data.pt_manager_name, data.pt_manager_email, data.pt_manager_hp,
        ]
        let sql = `
            INSERT INTO TB_PARTNER (
                index_no,
                pt_id,
                pt_company_name,
                pt_saupja,
                pt_tongsin,
                pt_tel,
                pt_domain,
                pt_fax,
                pt_item,
                pt_service,
                pt_owner,
                pt_zip,
                pt_addr,
                pt_addr_detail,
                pt_manager_name,
                pt_manager_email,
                pt_manager_hp,
                pt_company_file_id,
                pt_manager_file_id
            )
            VALUES(
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            ) 
            ON DUPLICATE KEY UPDATE
            pt_id = ?,
            pt_company_name = ?,
            pt_saupja = ?,
            pt_tongsin = ?,
            pt_tel = ?,
            pt_domain = ?,
            pt_fax = ?,
            pt_item = ?,
            pt_service = ?,
            pt_owner = ?,
            pt_zip = ?,
            pt_addr = ?,
            pt_addr_detail = ?,
            pt_manager_name = ?,
            pt_manager_email = ?,
            pt_manager_hp = ?
        `;
        let rslt = await db.queryTransaction(sql, col_datas);

        return rslt;
    },
    delPartner: async function(data){
        let result = {};
        try {
            await data.del_list.reduce(async (pre, item, index) => {
                return pre.then(async ()=> new Promise(async (resolve) => {
    
                    // 파일 여부 체크
                    let check_file_sql = 'SELECT pt_company_file_id, pt_manager_file_id FROM TB_PARTNER WHERE index_no = ?';
                    let check_rslt = await db.queryTransaction(check_file_sql, [item]);
    
                    // 사업자 등록 파일 삭제 및 DB 삭제
                    if(check_rslt.result[0].pt_company_file_id !== null){
                        let file_sql_1 = 'SELECT * FROM TB_ATCHM_FILE WHERE index_no = ?';
                        let file_rslt_1 = await db.queryTransaction(file_sql_1, [check_rslt.result[0].pt_company_file_id]);
                        try {
                            file.fileDelete(file_rslt_1.result[0].file_path);
                            let del_file_sql_1 = 'DELETE FROM TB_ATCHM_FILE WHERE index_no = ?'
                            await db.queryTransaction(del_file_sql_1, [check_rslt.result[0].pt_company_file_id]);
                        } catch (error) {
                            console.log('file delete error => ', error);
                        }
                    }
    
                    // 담당자 파일 삭제 및 DB 삭제
                    if(check_rslt.result[0].pt_manager_file_id !== null){
                        let file_sql_2 = 'SELECT * FROM TB_ATCHM_FILE WHERE index_no = ?';
                        let file_rslt_2 = await db.queryTransaction(file_sql_2, [check_rslt.result[0].pt_manager_file_id]);
                        try {
                            file.fileDelete(file_rslt_2.result[0].file_path);
                            let del_file_sql_2 = 'DELETE FROM TB_ATCHM_FILE WHERE index_no = ?'
                            await db.queryTransaction(del_file_sql_2, [check_rslt.result[0].pt_manager_file_id]);
                        } catch (error) {
                            console.log('file delete error => ', error);
                        }
                    }
    
                    let sql = `
                        DELETE FROM TB_PARTNER
                        WHERE index_no = ?
                    `;
                    await db.queryTransaction(sql, [item]);
                    result.code = 200;
                    result.message = 'file and data delete success';
                    resolve();
                }));
            }, Promise.resolve());
        } catch (error) {
            result.code = 500;
            result.message = 'file and data delete fail';
        }

        return result;
    },
}