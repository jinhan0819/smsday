
/* 
    page = pagination([현재_페이지], [전체_페이지_수]);
*/
module.exports = {
    // pagination: function(curPage, totalRowCount) {

    //     // 페이지당 게시물 수 
    //     let page_size = 10; 
        
    //     // let page_list_size = 5; 
    //     let page_count = 5; // 보여지는 페이지의 갯수 : 1 ~ 5 페이지 
    //     let page_list_size = Math.ceil(curPage / page_count); 
    //     // limit 변수 (DB에서 가져올 게시물 수 no~ 
    //     let no = 0; 
    //     // 인자로 받은 현재 페이지 번호 
    //     curPage = Number(curPage);

    //     if (curPage <= 0) { 
    //         no = 0; 
    //         curPage = 1; 
    //     } else no = (curPage - 1) * page_size; 
        
    //     // 전체 페이지 갯수 
    //     if (totalRowCount < 0) totalRowCount = 0; 
    //     let totalPage = Math.ceil(totalRowCount / page_size); // 전체 페이지 수 
    //     if (totalPage < curPage) { 
    //         no = 0; 
    //         curPage = 1 // totalPage 보다 더 큰 curPage가 호출되면 에러 발생시키기 
    //     } 

    //     let endPage = parseInt(page_list_size * page_count); // 마지막 페이지 계산 
    //     let startPage = endPage - (page_count - 1); // 시작 페이지 계산 

    //     if(endPage > totalPage || endPage == 0 || endPage < 0){
    //         endPage = totalPage;
    //     }

    //     if(startPage < 0){
    //         startPage = 1;
    //     }
        
    //     if(totalPage < 1){
    //         startPage = endPage;
    //     }

    //     let result = { 
    //         "curPage": curPage, 
    //         "pageSize": page_count, 
    //         "pageCount": page_size, 
    //         "totalPage": totalPage, 
    //         "startPage": startPage, 
    //         "endPage": endPage, 
    //         // "no": no 
    //     } 
    //     return result;
    // },
    pagingRange: function(data){
        return [parseInt(data.perPage) * (parseInt(data.page) - 1), parseInt(data.perPage)]
    }
}