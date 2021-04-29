// 时间tab
export function timeTab () {
    var data = [
        {
            text: '今日',
            val: 1
        },
        {
            text: '昨日',
            val: 2
        },
        {
            text: '本月',
            val: 3
        },
        {
            text: '上月',
            val: 4
        },
    ];
    return data
}

// 选择时间
export function selectTime(val) {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth();

    var date = [];
    if(val == 1){
        date = [getDate(myDate.getTime()), getDate(myDate.getTime())]
    }else if(val == 2){
        var yesterday = myDate.getTime() - 24*60*60*1000;
        date = [getDate(yesterday), getDate(yesterday)]
    }else if(val == 3){
        date = [year + "-" + ((month + 1) < 10 ? "0" + (month + 1) : month + 1) + "-" + "01", getDate(myDate.getTime())]
    }else{
        if(month==0){
            month = 12;
            year = year-1;

        }
        if(month<10){
            month = '0'+month;
        }
        var nowdays = new Date(year,month,0);
        var endDate = year + '-' + month + '-' + nowdays.getDate();  
        date = [year + "-" + month + "-" + "01", endDate]
    }
    return date
}

// 时间戳转yy-mm-dd格式
export function getDate(time) {
    var myDate = new Date(time);
    var year = myDate.getFullYear();
    var month = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1);
    var day = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
    return year + "-" + month + "-" + day;
}