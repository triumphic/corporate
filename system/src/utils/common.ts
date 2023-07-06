export function getDay (day:any, haveHours:any) {
  //day为0表示今天的日期   -1为昨天   haveHours存在表示要时分秒 haveHours:true,false
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  var hours = today.getHours();
  var minutes = today.getMinutes(); //分
  var seconds = today.getSeconds(); //秒
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  if (haveHours) {
    if (day == 0) {
      return {
        'now': tYear + "-" + tMonth + "-" + tDate + ' ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds),
        'zero': tYear + "-" + tMonth + "-" + tDate + ' ' + '00:00:00'
      }
    } else {
      return tYear + "-" + tMonth + "-" + tDate + ' ' + hours + ':' + minutes + ':' + seconds
    }
  } else {
    return tYear + "-" + tMonth + "-" + tDate
  }
  function doHandleMonth (month:any) {
    var m = month;
    if (month.toString().length == 1) {
      m = "0" + month;
    }
    return m;
  }

}

export function NumberHandle (value:any, numberDigit?:any) {//数值小数点处理 ①5997；②8.1w；③2489kw；④4.2亿  且保留一位小数
  if (typeof parseFloat(value) === 'number' && !isNaN(value)) {
    //判断是否是数值类型
    if ((value >= 10000 && value < 100000000) || (value <= -10000 && value > -100000000)) {
      if (hasDot(value / 10000000, numberDigit) == 10) {
        return '1亿'
      } else {
        return hasDot(value / 10000, numberDigit) + 'w'
      }
    } else if (value >= 100000000 || value <= -100000000) {
      return hasDot(value / 100000000, numberDigit) + '亿'
    } else {
      if (value == undefined) {
        return '-'
      } else {
        return hasDot(value, numberDigit)
      }
    }
  } else {
    if (value == undefined) {
      return '-'
    } else {
      return value
    }
  }
}
function hasDot (num:any, numberDigit:any) {
  //有小数点就保留一个小数，没有就直接返回 ,默认保留1位小数
  var digit = 1;
  if (numberDigit) {
    digit = numberDigit
  }
  return formatNum((num + '').indexOf('.') != -1 ? parseFloat(Number(num).toFixed(digit)) : num);
}

// 检测是否全是中文
export function isChn (str:any) {
  var reg = /^[\u4E00-\u9FA5]+$/;
  if (!reg.test(str)) {
    // alert("不是中文");
    return false;
  }
  //alert("中文");
  return true;
}


export function formatNum (str:any) {
  if (typeof parseFloat(str) === 'number' && !isNaN(str) && str != null) {
    //判断是否是数值类型
    var newStr = "";
    var count = 0;
    str = Number(str).toFixed(2)
    str = parseFloat(str)
    str = str.toString();
    if (str.indexOf(".") == -1) {
      for (var i = str.length - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0 && str.charAt(i) != '-') {
          newStr = str.charAt(i) + "," + newStr;
        } else {
          newStr = str.charAt(i) + newStr;
        }
        count++;
      }
      str = newStr; //自动补小数点后两位
    } else {
      for (var i = str.indexOf(".") - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0 && str.charAt(i) != '-') {
          newStr = str.charAt(i) + "," + newStr;
        } else {
          newStr = str.charAt(i) + newStr; //逐个字符相接起来
        }
        count++;
      }
      str = newStr + str.substring(str.indexOf("."), str.length);
    }
  }
  return str
}

//秒转化为时
export function formateHours (endTime:any) {
  if (endTime) {
    let secondTime = parseInt(endTime)//将传入的秒的值转化为Number
    let h = 0// 初始化小时
    let result = ''
    h = parseFloat((secondTime / 3600).toFixed(1))
    result = h + "h"
    return result
  } else {
    return "0h"
  }
}
//秒转化为分
export function formateMinute (endTime:any) {
  if (endTime) {
    let secondTime = parseInt(endTime)//将传入的秒的值转化为Number
    if (secondTime > 60) {
      let m = parseFloat((secondTime / 60).toFixed(1)) // 初始化小时
      return m + "min"
    } else {
      return secondTime + 's'
    }
  } else {
    return "0"
  }
}

export function date_compatible (date:any) {
  //new Date() 2021-09-08 20:02:00 改为 2021/09/08 20:02:00 safari ios不支持前者 返回后者
  if (date && date != '' && date != ' ') {
    return (new Date(date.replace(/-/g, "/")))
  } else {
    return new Date(date)
  }
}

export function day_format (date:any, flag:Boolean) {//返回 类似 2016-01-02 格式的字符串
  if (flag) {
    return date.getFullYear() + '-'
      + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-'
      + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + ' '
      + (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':'
      + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes())
  } else {
    return date.getFullYear() + '-'
      + ((date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-'
      + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()) + ' '
      + (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ':'
      + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ':'
      + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds())
  }

}


export function timeStamp_to_date (getUnixtimestamp:any, hourFlag:any, sFlag:Boolean) {//时间戳转日期 unixtimestamp时间戳 hourFlag是否要时间 sFlag是否要秒 返回日期格式
  var unixtimestamp:any = new Date(getUnixtimestamp);
  var year = 1900 + unixtimestamp.getYear();
  var month = "0" + (unixtimestamp.getMonth() + 1);
  var date = "0" + unixtimestamp.getDate();
  var hour = "0" + unixtimestamp.getHours();
  var minute = "0" + unixtimestamp.getMinutes();
  var second = "0" + unixtimestamp.getSeconds();
  if (hourFlag) {
    return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date.length) +
      " " + hour.substring(hour.length - 2, hour.length) + ":" +
      minute.substring(minute.length - 2, minute.length) +
      (!sFlag ? (":" + second.substring(second.length - 2, second.length)) : '');
  } else {
    return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date.length)
  }

}

export function getStrBytes (string:any) {//获取对应的字节数
  if (string) {
    var blob = new Blob([string]);
    let size = blob && blob.size;
    let n = string.match(/\n/g, "");//一个\n加一个字节
    size += n ? n.length : 0;
    return size
  } else {
    return 0
  }
}

export function judgePhone (num:string) {//判断手机号是否合格，1合格，0不合格
  if (!num || num == '' || (num && num != '' && !(/^1[3456789]\d{9}$/.test(num)))) {
    return 0
  } else {
    return 1
  }

  // if(num){
  //   var isNumber = /^[0-9]*$/
  //   var reg = new RegExp(isNumber)
  //   if(!reg.test(num)){
  //     return 0
  //   }
  //   if(num.length != 11){
  //     return 0
  //   }
  //   if(num.charAt(0) != 1){
  //     return 0
  //   }
  //   return 1
  // }else{
  //   return 0
  // }
}
