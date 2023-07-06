var prefix = "";
export function setLocal (name: string, value: any, time?: any) {
  if (time == -1) {
    localStorage.removeItem(prefix + name); //为负数则删除此
    return;
  }
  localStorage.setItem(prefix + name, value);
}

export function getLocal (name: String):any {
  return localStorage.getItem(prefix + name)
    ? localStorage.getItem(prefix + name)
    : false;
}

export function delLocal (c_name: String) {
  localStorage.removeItem(prefix + c_name);
}
export function delAllLocal () {
  localStorage.clear();
}

/** sessionStorage */
export const setSession = (key:string,val:string)=>{
  sessionStorage.setItem(key,val)
}
export const getSession = (key:string):any =>{
  return sessionStorage.getItem(key)
}
export const clearSession = ()=>{
  return sessionStorage.clear()
}