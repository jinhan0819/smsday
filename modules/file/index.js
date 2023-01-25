let formidable = require('formidable');
let fsExtra = require('fs-extra');
let fs = require('fs');
let path = require('path');
let mime = require('mime');
let iconvLite = require('iconv-lite');

let config = require('../../config');

/* 
    [client]
    - form : enctype="multipart/form-data"
    - 파라미터 : let formData = new FormData(form[0]);

*/
function fileUpload(req, callback){

    // 헤더를 만들어 주는 역할(중첩시 에러)
    let form = new formidable.IncomingForm(); 
    let returnField = {};
    let returnFile = {};

    form.encoding = 'utf-8';
    // 파일 저장할 경로
    form.uploadDir = config.uploadDir;
    form.multiples = true;
    form.keepExtensions = true; // 확장자 표시
    form.maxFileSize = 1024 * 1024 * 1024;

    !fs.existsSync(form.uploadDir) && fs.mkdirSync(form.uploadDir, { recursive: true });

    form.parse(req, function(err, field, files){
        // end 이벤트까지 전송되고 최종적으로 호출되는 부분
        // console.log('[parse()] error ' + err + ', field : ' + field + ', file : ' + file);
        console.log('upload success...');
        returnField = JSON.parse(JSON.stringify(field));
        returnFile = JSON.parse(JSON.stringify(files.file));
    });

    form.on('fileBegin', (filename, file) => {
        let data = { name: 'fileBegin', filename, value: file };
        console.log('fileBegin : ', data);
    });

    form.on('field', function(field, value){
        console.log('filed :', field, value);
    });

    form.on('file', async function(field, file){
        // 업로드 할때 파일명 정의
        // Formidable은 파일 전송 시 일단 임시 경로에 파일을 저장한다.
        // 그리고 parse 메소드에서 fs.rename(), fs.renameSync() 등을 통해서 원하는 위치로 이동시키면 된다.
        // console.log(file.path, file.name)
        // fsExtra.rename(file.path, form.uploadDir+'/'+Date.now()+ '_'+file.name); // v1 버전
        // fsExtra.rename(file.filepath, form.uploadDir+'/'+Date.now()+ '_'+file.newFilename); // v2 버전
    });

    form.on('progress', function(bytesReceived, bytesExpected) { 
        var percent_complete = (bytesReceived * 100) / bytesExpected;
        console.log(percent_complete.toFixed(2), "% uploaded...");  
    });

    form.on('end', function() { 
        
        let trans_obj = {
            'field' : returnField,
            'file' : returnFile
        }
        
        callback(trans_obj);
        
    });

    form.on('error', function(err) { 
        console.log("=========== error ============"); 
        console.error(err); 
    });
}

/* 
    예시)
    let file_info = {};
    file_info.file_name = '/upload_1664b1fb74ddea4d2e089e31475ba2cc.zip'
    file_info.original_file_name = '게시판_샘플.zip'
    file.fileDownload(res, file_info)
*/
function fileDownload(res, file_info){
    let upload_folder = config.uploadDir;
    let file = upload_folder + file_info.file_name; // ex) /upload/files/sample.txt
    
    try {
        if (fs.existsSync(file)) { // 파일이 존재하는지 체크
            let filename = path.basename(file); // 파일 경로에서 파일명(확장자포함)만 추출
            let mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴
            // let mimetype = 'application/x-zip-compressed';
        
            res.setHeader('Content-disposition', 'attachment; filename=' 
                            + iconvLite.decode(iconvLite.encode(file_info.original_file_name, "UTF-8"), 'ISO-8859-1')); // 다운받아질 파일명 설정
            res.setHeader('Content-type', mimetype); // 파일 형식 지정
        
            let filestream = fs.createReadStream(file);
        filestream.pipe(res);
        } else {
            res.send('해당 파일이 없습니다.');  
            return;
        }
    } catch (e) { // 에러 발생시
        console.log(e);
        res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
        return;
    }
}

// 파일 삭제
function fileDelete(file_path){
    return fs.unlinkSync(file_path)
}

function rmDirFile(file_path){
    fs.rmdirSync(file_path, { recursive: true });
    setTimeout(() => {
        fs.rmdirSync(file_path);
    }, 1000);
}

module.exports = {
    fileUpload: fileUpload,
    fileDownload: fileDownload,
    fileDelete: fileDelete,
    rmDirFile: rmDirFile
}