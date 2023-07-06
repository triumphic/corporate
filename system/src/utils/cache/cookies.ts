export function setCookie(name: string, value: string|Boolean, time?: string|number) {
  var name = name;
  var exp = new Date();
  if (time == -1) {
    exp.setTime(exp.getTime() - 1); //为负数则删除此cookie
  } else {
    exp.setTime(exp.getTime() + 3 * 30 * 24 * 60 * 60 * 1000);
  }
  document.cookie =
    name + "=" + JSON.stringify(value) + ";expires=" + exp.toString() + ";path=/;";
}

export function getCookie(name: string): any {
  var name = name;
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) {
    return JSON.parse(arr[2]);
  } else {
    return false;
  }
}

export function delCookie(c_name: string) {
  setCookie(c_name, "", -1);
}
export function delAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?==)/g);
  if (keys) {
    for (var i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
    }
  }
}
