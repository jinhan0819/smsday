let excel = require("exceljs");
let iconvLite = require('iconv-lite');

/* 
    사용법
    let columns = [
        { header: "헤더_명_1", key: "key_name_1", width: 25 },
        { header: "헤더_명_2", key: "key_name_2", width: 25 },
        ...
        { header: "헤더_명_5", key: "key_name_5", width: 25 },
    ];

    let rows = [];
    [리스트].forEach(item => {
        let data = {};
        data.key_name_1 = item.[데이터];
        data.key_name_2 = item.[데이터];
        ...
        data.key_name_5 = item.[데이터];
        rows.push(data);
    });

    res : response
    excel.excelDownload(res, columns, rows, [시트_명], [파일_명])
*/

module.exports = {
    excelDownload: async function(res, columns, rows, sheet, fileName) {

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet(sheet);
        worksheet.columns = columns;

        // Add Array Rows
        worksheet.addRows(rows);
        // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + iconvLite.decode(iconvLite.encode(fileName, "UTF-8"), 'ISO-8859-1') +".xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    }
}