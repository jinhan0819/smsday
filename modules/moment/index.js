var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
moment.locale('ko');

/* 
    년 : years
    달 : months
    일 : days
    moment().add(number, String); 추가
    moment().subtract(number, String); 빼기
*/
module.exports = {
    date: function(){
        return moment();
    },
    // 오늘 일자
    getTodayFmtDate: function(){
        return moment().format('YYYY-MM-DD');
    },
    // 오늘 일시
    getTodayFmtDateTime: function(){
        return moment().format('YYYY-MM-DD HH:mm:ss');
    },
    // 내일 일자
    getTomorrowFmtDate: function(date){
        return moment(date).add(1,'days').format('YYYY-MM-DD');
    },
    // 내일 일시
    getTomorrowFmtDateTime: function(date){
        return moment(date).add(1,'days').format('YYYY-MM-DD HH:mm:ss');
    },
    // 어제 일자
    getYesterDayFmtDate: function(date){
        return moment(date).subtract(1,'days').format('YYYY-MM-DD');
    },
    // 어제 일시
    getYesterDayFmtDateTime: function(date){
        return moment(date).subtract(1,'days').format('YYYY-MM-DD HH:mm:ss');
    },
    // 한달 후 일자
    getAddMonthFmtDate: function(date){
        return moment(date).add(1,'months').format('YYYY-MM-DD');
    },
    // 한달 후 일시
    getAddMonthFmtDateTime: function(date){
        return moment(date).add(1,'months').format('YYYY-MM-DD HH:mm:ss');
    },
    // 한달 전 일자
    getSubMonthFmtDate: function(date){
        return moment(date).subtract(1,'months').format('YYYY-MM-DD');
    },
    // 한달 후 일시
    getSubMonthFmtDateTime: function(date){
        return moment(date).subtract(1,'months').format('YYYY-MM-DD HH:mm:ss');
    },
    // 날짜 포맷
    getFmtDateTime: function(date){
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    // 오늘 요일 구하기
    getDayOfTheWeek: function(){
        let day = moment().day();
        let value = '';
        switch (day) {
            case 0: value = '일요일'
            break;
            case 1: value = '월요일'
            break;
            case 2: value = '화요일'
            break;
            case 3: value = '수요일'
            break;
            case 4: value = '목요일'
            break;
            case 5: value = '금요일'
            break;
            case 6: value = '토요일'
            break;
        }
        return value;
    },
    // 입력 날짜 요일 구하기
    getInputDayOfTheWeek: function(date){
        let day = moment(date).day();
        let value = '';
        switch (day) {
            case 0: value = '일요일'
            break;
            case 1: value = '월요일'
            break;
            case 2: value = '화요일'
            break;
            case 3: value = '수요일'
            break;
            case 4: value = '목요일'
            break;
            case 5: value = '금요일'
            break;
            case 6: value = '토요일'
            break;
        }
        return value;
    },
    // 시간을 유닉스 값으로 표현
    getTimeUnix: function(){
        return moment().unix();
    },
    getKorTime: function(){
        return moment().format('LT');
    },
    getKorFullDate: function(){
        return moment().format('LLL');
    },
};