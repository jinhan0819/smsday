// Ajax
function jcall(method, url, params, callback) {
    $.ajax({
        cache: false,
        url: url,
        dataType: 'json',
        type: method,
        data: params,
        success: function success(data) {
            callback(null, data);
        },
        error: function error(xhr, status, _error2) {
            callback(_error2);
        }
    });
}

// localStorage 아이템 추가
// 모든 key와 value는 항상 string으로 저장됩니다. (주의하세요, object와 integer 들은 string으로 자동 변환됩니다.)
function setLocalStorage(key, value) {
	localStorage.setItem(key, value);
}

// localStorage 아이템 읽기
// return값은 항상 string입니다.
function getLocalStorage(key) {
	return localStorage.getItem(key);
}

// localStorage 아이템 삭제
function removeLocalStorage(key) {
	localStorage.removeItem(key);
}

// localStorage 아이템 전체 삭제
function clearLocalStorage() {
	localStorage.clear();
}

// URL Parameter 만들기 
// async function makeParamsUrl(data){
//     let url_params = '';
//     await Object.keys(data).reduce(async (pre, key, index) => {
//         return pre.then(async ()=> new Promise(async (resolve) => {
//             url_params += (index === 0 ? "?" : "&") + key + "=" + String(data[key]);
//             resolve();
//         }));
//     }, Promise.resolve());
//     return url_params;
// }
async function makeParamsUrl(data){
    let url_params = '';
    await Object.keys(data).reduce(async (pre, key, index) => {
        return pre.then(async ()=> new Promise(async (resolve) => {
            url_params += (index === 0 ? "?" : "&") + key + "=" + String(Base64.encode(data[key]));
            resolve();
        }));
    }, Promise.resolve());
    return url_params;
}

// 모바일 체크 여부
function isMobile() { 
    var user = navigator.userAgent; 
    var is_mobile = false; 
    if( user.indexOf("iPhone") > -1 || user.indexOf("Android") > -1 ) { 
        is_mobile = true; 
    } 
    return is_mobile; 
}

// 쿠키 관련
/* 
    name : 쿠키 키 값
    value : 값
    exp : 시간
*/
function setCookie(name, value, exp) {
    var date = new Date();
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};
function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
};
function deleteCookie(name) {    
    document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
};
// 쿠키 관련

// 콤마
function setComma(n){
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
    n += '';                          // 숫자를 문자열로 변환         
    while (reg.test(n)) {
        n = n.replace(reg, '$1' + ',' + '$2');
    }         
    return n;
};

// 퍼블리싱 common
window.addEventListener('load', function() {
    var allElements = document.getElementsByTagName('*');
    Array.prototype.forEach.call(allElements, function(el) {
        var includePath = el.dataset.includePath;
        if (includePath) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    el.outerHTML = this.responseText;
                }
            };
            xhttp.open('GET', includePath, true);
            xhttp.send();
        }
    });
});

$(function(){
    var $firstmenu = $('.center_nav > ul > li.dep1'), $header = $('.subdeps01');

    $firstmenu.mouseenter(function(){
        $header.stop().animate({height:'80px'},200);
    })
    .mouseleave(function(){
        $header.stop().animate({height:'0px'},200);
    })
});

$(function(){
    var $firstmenu = $('.center_nav > ul > li.dep2'), $header = $('.subdeps02');

    $firstmenu.mouseenter(function(){
        $header.stop().animate({height:'80px'},200);
    })
    .mouseleave(function(){
        $header.stop().animate({height:'0px'},200);
    })
});

$(function(){
    var $firstmenu = $('.center_nav > ul > li.dep3'), $header = $('.subdeps03');

    $firstmenu.mouseenter(function(){
        $header.stop().animate({height:'80px'},200);
    })
    .mouseleave(function(){
        $header.stop().animate({height:'0px'},200);
    })
});

$(function(){
    var $firstmenu = $('.center_nav > ul > li.dep4'), $header = $('.subdeps04');

    $firstmenu.mouseenter(function(){
        $header.stop().animate({height:'80px'},200);
    })
    .mouseleave(function(){
        $header.stop().animate({height:'0px'},200);
    })
});

$(function(){
    var $firstmenu = $('.center_nav > ul > li.dep5'), $header = $('.subdeps05');

    $firstmenu.mouseenter(function(){
        $header.stop().animate({height:'80px'},200);
    })
    .mouseleave(function(){
        $header.stop().animate({height:'0px'},200);
    })
});

$(function(){
    var $firstmenu = $('.center_nav > ul > li.dep6'), $header = $('.subdeps06');

    $firstmenu.mouseenter(function(){
        $header.stop().animate({height:'80px'},200);
    })
    .mouseleave(function(){
        $header.stop().animate({height:'0px'},200);
    })
});

$(function() {
    $(".login_btn").click(function () {
    	if($('.login_box').hasClass('atv')) {
                $('.login_box').removeClass('atv');
          } else {
                $('.login_box').addClass('atv');
          }
    });
});





