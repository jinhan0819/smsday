// 오늘 날짜 구하기
function getTodayDate(){
	let nowDate = new Date();
    let weekDate = nowDate.getTime();
    nowDate.setTime(weekDate);

    let weekYear = nowDate.getFullYear();
    let weekMonth = nowDate.getMonth() + 1;
    let weekDay = nowDate.getDate();

    if(weekMonth < 10) {weekMonth = "0" + weekMonth};
    if(weekDay < 10) {weekDay = "0" + weekDay};

    let resultDate = weekYear + "-" + weekMonth + "-" + weekDay;

    return resultDate;
}

// 지난 1주 구하기
function getBeforeDate(){
	let nowDate = new Date();
    let weekDate = nowDate.getTime() - (7*24*60*60*1000);
    nowDate.setTime(weekDate);

    let weekYear = nowDate.getFullYear();
    let weekMonth = nowDate.getMonth() + 1;
    let weekDay = nowDate.getDate();

    if(weekMonth < 10) {weekMonth = "0" + weekMonth};
    if(weekDay < 10) {weekDay = "0" + weekDay};

    let resultDate = weekYear + "-" + weekMonth + "-" + weekDay;

    return resultDate;
}

// 지난달 1일 구하기
function getBeforeMonthFirstDay(){

    var now = new Date();

    var startDt = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    let stYear = startDt.getFullYear();
    let stMonth = startDt.getMonth() + 1;
    let stDay = startDt.getDate();

    if(stMonth < 10) {stMonth = "0" + stMonth};
    if(stDay < 10) {stDay = "0" + stDay};

    let resultDate = stYear + "-" + stMonth + "-" + stDay;

    return resultDate;
}

// 지난달 말일 구하기
function getBeforeMonthEndDay(){

    var now = new Date();
	var endDt = new Date(now.getFullYear(), now.getMonth(), 0);
    let endYear = endDt.getFullYear();
    let endMonth = endDt.getMonth() + 1;
    let endDay = endDt.getDate();

    if(endMonth < 10) {endMonth = "0" + endMonth};
    if(endDay < 10) {endDay = "0" + endDay};

    let resultDate = endYear + "-" + endMonth + "-" + endDay;

    return resultDate;
}

// 이번달 1일 구하기
function getCurrentMonthFirstDay(){

    var now = new Date();

    var startDt = new Date(now.getFullYear(), now.getMonth(), 1);
    let stYear = startDt.getFullYear();
    let stMonth = startDt.getMonth() + 1;
    let stDay = startDt.getDate();

    if(stMonth < 10) {stMonth = "0" + stMonth};
    if(stDay < 10) {stDay = "0" + stDay};

    let resultDate = stYear + "-" + stMonth + "-" + stDay;

    return resultDate;
}

// 이번달 말일 구하기
function getCurrentMonthEndDay(){

    var now = new Date();

	var endDt = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    let endYear = endDt.getFullYear();
    let endMonth = endDt.getMonth() + 1;
    let endDay = endDt.getDate();

    if(endMonth < 10) {endMonth = "0" + endMonth};
    if(endDay < 10) {endDay = "0" + endDay};

    let resultDate = endYear + "-" + endMonth + "-" + endDay;
    
    return resultDate;
}

// dayjs

// 오늘
function getTodayDayJS(){
    let start_date = dayjs(new Date()).format('YYYY-MM-DD');
    let end_date = dayjs(new Date()).format('YYYY-MM-DD');
    return {start: start_date, end: end_date};
}

// 어제
function getYesterDayJS(){
    let start_date = dayjs(new Date()).subtract(1, "day").format('YYYY-MM-DD');
    let end_date = dayjs(new Date()).format('YYYY-MM-DD');
    return {start: start_date, end: end_date};
}

// 일주일
function getWeekDayJS(){
    let start_date = dayjs(new Date()).subtract(7, "day").format('YYYY-MM-DD');
    let end_date = dayjs(new Date()).format('YYYY-MM-DD');
    return {start: start_date, end: end_date};
}

// 지난달
function getBeforeMonthDayJS(){
    let before_month = dayjs(new Date()).subtract(1, "month");
    let start_date = before_month.format('YYYY-MM') + '-01';
    let end_date = before_month.format('YYYY-MM') + '-' +before_month.daysInMonth();
    return {start: start_date, end: end_date};
}

// n개월
function getMonthDayJS(m){
    let start_date = dayjs(new Date()).subtract(m, "month").format('YYYY-MM-DD');
    let end_date = dayjs(new Date()).format('YYYY-MM-DD');
    return {start: start_date, end: end_date};
}

// 이번 달의 1일과 현재
function getCurrentMonthDayJS(){
    let start_date = dayjs(new Date()).format('YYYY-MM') + '-01';
    let end_date = dayjs(new Date()).format('YYYY-MM-DD');
    return {start: start_date, end: end_date};
}