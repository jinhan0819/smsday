let pagination = {
    perPage: 30, // 페이지 갯수
    page: 1 // 현재 페이지
}

let funcName = '';
// 페이징 [전체갯수,  데이터(파라미터), 현재 페이지, 페이지 갯수, 페이징 갯수, 실행시킬 함수명]
async function Pagination(url, params, currentPage, perPage, pagingCount, func) {
    funcName = func;

    let getCount =  await axios.post(url, params);
    let totalCount = getCount.data.result[0].total_count;
    let totalPage   = Math.ceil(totalCount / perPage); // 전체 페이지 계산

    // 페이지가 없으면 첫 페이지 (1 페이지)
    if(currentPage == "") { 
        currentPage = 1; 
    }

    if(totalPage < 2) return '';

    let html = '';
    let atv  = '';

    html += '<a href="javascript:void(0);" class="start" data-num="1"><img src="/front/images/pagenation/ll.png"></a>';

    let startPage = ((parseInt((currentPage - 1 ) / pagingCount)) * pagingCount) + 1;
    let endPage  = startPage + pagingCount - 1;

    if(endPage >= totalPage) {
        endPage = totalPage;
    }

    html += '<a href="javascript:void(0);" class="pre" data-num="'+(parseInt(currentPage) > 1 ? currentPage-1 : 1)+'"><img src="/front/images/pagenation/l.png"></a>';

    if(totalPage > 1) {
        for(let k = startPage; k <= endPage; k++) {
            if(currentPage != k) {
                atv  = '';
            } else {
                atv  = 'atv';
            }
            html += '<a href="javascript:void(0);" name="page_num" class="'+atv+'" data-num="'+k+'">'+k+'</a>';
        }
    }

    html += '<a href="javascript:void(0);" class="next" data-num="'+(parseInt(currentPage) < totalPage ? currentPage+1 : totalPage)+'"><img src="/front/images/pagenation/r.png"></a>';

    html += '<a href="javascript:void(0);" class="end" data-num="'+totalPage+'"><img src="/front/images/pagenation/rr.png"></a>';

    return html;

}

$(document).unbind().on('click', '.pagenation a', function(){
    pagination.page = $(this).data('num');
    console.log(pagination.page)

    if(typeof(window[funcName]) == "function"){
        var execFunc = (new Function("return " + funcName))();
        execFunc();
    }else{
        // ... //해당 문자열 함수가 없을 경우 동작 구현
        alert('함수가 존재하지 않습니다.');
    }
});