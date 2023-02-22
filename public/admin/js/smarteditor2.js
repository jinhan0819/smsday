function editor_html(id, content) {
    editor_url = '/admin/lib/smarteditor2';

    let html = "";

    html += "<span class='sound_only'>웹에디터 시작</span>\n";
    html += "<script src='"+editor_url+"/js/HuskyEZCreator.js'></script>\n";
    html += "<script>let tw_editor_url = '"+editor_url+"', oEditors = [];</script>\n";
    html += "<script src='"+editor_url+"/config.js'></script>\n";
    html += "<textarea id='"+id+"' name='"+id+"' class='smarteditor2' maxlength='65536' style='width:100%'>'"+content+"'</textarea>\n";
    html += "<span class='sound_only'>웹 에디터 끝</span>\n";

    return html;
}

// textarea 로 값을 넘긴다. javascript 반드시 필요
function get_editor_js(id) {

    let script = "";

    script += "let "+id+"_editor_data = oEditors.getById['"+id+"'].getIR();\n";
    script += "oEditors.getById['"+id+"'].exec('UPDATE_CONTENTS_FIELD', []);\n";
    script += "if(jQuery.inArray(document.getElementById('"+id+"').value.toLowerCase().replace(/^\s*|\s*$/g, ''), ['&nbsp;','<p>&nbsp;</p>','<p><br></p>','<div><br></div>','<p></p>','<br>','']) != -1){document.getElementById('"+id+"').value='';}\n";

    return script;
}

//  textarea 의 값이 비어 있는지 검사
function chk_editor_js(id) {

    let script = "if(!"+id+"_editor_data || jQuery.inArray("+id+"_editor_data.toLowerCase(), ['&nbsp;','<p>&nbsp;</p>','<p><br></p>','<p></p>','<br>']) != -1) { alert(\"내용을 입력해 주십시오.\"); oEditors.getById['"+id+"'].exec('FOCUS'); return false; }\n";

    return script;
}