let db = require('../../modules/db');
let cipher = require('../../modules/cipher');
let config = require('../../config');
let paging = require('../../modules/pagination');
const file = require('../../modules/file');

module.exports = {
    bannerSave: async function(data) {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try{
            // 내용
            if(typeof data.index_no === 'undefined') {
                data.index_no = null;

                if(typeof data.bn_file_id === 'undefined') data.bn_file_id = null;

            } else {
                /* 
                    1. 기존 파일 삭제
                    2. 기존 file table row 삭제 (새로 등록되었기 때문에)
                */
                if((typeof data['bn_file_id'] !== 'undefined' || data['bn_file_id']) && data.index_no != null) {
                    let file_sql = `
                        SELECT
                            index_no,
                            file_path
                        FROM TB_ATCHM_FILE
                        WHERE index_no = (
                                            SELECT
                                                bn_file_id
                                            FROM TB_BANNER
                                            WHERE index_no = ?
                                        )
                    `;
                    let result = await connection.query(file_sql, data.index_no);
                    if(result[0].length > 0) {
                        try {
                            file.fileDelete(result[0][0].file_path);
                        } catch (error) {
                            console.log('file delete error ==> ', error);
                        }

                        let file_del_sql = `DELETE FROM TB_ATCHM_FILE WHERE index_no = ?`;
                        await connection.query(file_del_sql, result[0][0].index_no);
                    }
                /* 
                    파일을 변경하지 않을 시
                    1. 기존 파일 아이디 조회 후 파라미터에 값을 준다.
                */
                } else {
                    if(data.index_no !== null){
                        let file_sel_sql = `
                            SELECT bn_file_id FROM TB_BANNER WHERE index_no = ?
                        `;
                        let result = await connection.query(file_sel_sql, data.index_no);
                        data['bn_file_id'] = result[0][0]['bn_file_id'];
                    }
                }
            }
    
            let col_datas = [
                // VALUES
                data.index_no, data.pt_id, data.bn_code, data.bn_file_id, data.bn_link, data.bn_target,
                data.bn_width, data.bn_height, data.bn_bg, data.bn_text, data.bn_use, data.bn_order,
                // UPDATE
                data.index_no, data.pt_id, data.bn_code, data.bn_file_id, data.bn_link, data.bn_target,
                data.bn_width, data.bn_height, data.bn_bg, data.bn_text, data.bn_use, data.bn_order,
            ]
            let sql = `
                INSERT INTO TB_BANNER (
                    index_no,
                    pt_id,
                    bn_code,
                    bn_file_id,
                    bn_link,
                    bn_target,
                    bn_width,
                    bn_height,
                    bn_bg,
                    bn_text,
                    bn_use,
                    bn_order
                )
                VALUES(
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                ) 
                ON DUPLICATE KEY UPDATE
                pt_id       = ?,
                bn_code     = ?,
                bn_file_id  = ?,
                bn_link     = ?,
                bn_target   = ?,
                bn_width    = ?,
                bn_height   = ?,
                bn_bg       = ?,
                bn_text     = ?,
                bn_use      = ?,
                bn_order    = ?
            `;
            await connection.query(sql, col_datas)

            await connection.commit();
                    
            let rslt = JSON.parse(JSON.stringify(config.suc_result));

            return rslt;
        } catch(e) {
            await connection.rollback();
            console.error('Transaction rollbacked ======>',e);
            let rslt = JSON.parse(JSON.stringify(config.err_result));
            rslt.message = e;
            return rslt;
        } finally {
            connection.release();
        }

        
    },
    getPartnerDetail: async function(data){
        let sql = `
            SELECT
                A.*
                B.original_file_nm AS bn_file_nm,
            FROM TB_BANNER A
            LEFT OUTER JOIN TB_ATCHM_FILE B ON (A.bn_file_id = B.index_no)  
            WHERE A.index_no = ?
        `;
        let rslt = await db.queryTransaction(sql, [data.index_no]);

        return rslt;
    },
    getBannerCount: async function(data){
        let search_sql = ``;
        if(typeof data.bncode !== 'undefined'){
            search_sql += ` WHERE bn_code = '${data.bncode}' `;
        }

        let sql = `
            SELECT
                COUNT(index_no) AS total_count
            FROM TB_BANNER
            ${search_sql}
        `;
        let rslt = await db.queryTransaction(sql, []);

        return rslt;
    },
    getBannerList: async function(data){
        let params = paging.pagingRange(data.paging);

        let search_sql = ``;
        if(typeof data.bncode !== 'undefined'){
            search_sql += ` WHERE bn_code = '${data.bncode}' `;
        }

        let sql = `
            SELECT
                @ROWNUM := @ROWNUM + 1 AS rownum,
                Z.index_no,
                Z.bn_code,
                Z.bn_file_id,
                Z.bn_link,
                Z.bn_target,
                Z.bn_width,
                Z.bn_height,
                Z.bn_use,
                Z.bn_order,
                DATE_FORMAT(Z.create_datetime, '%Y-%m-%d') AS create_date
            FROM (
                SELECT
                    index_no,
                    bn_code,
                    bn_file_id,
                    bn_link,
                    bn_target,
                    bn_width,
                    bn_height,
                    bn_use,
                    bn_order,
                    create_datetime
                FROM TB_BANNER
            ) Z, (SELECT @ROWNUM := 0) R
            ${search_sql}
            ORDER BY rownum DESC 
            LIMIT ?, ? 
        `;
        let rslt = await db.queryTransaction(sql, params);

        return rslt;
    },

}