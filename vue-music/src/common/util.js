// 防抖函数
export function debounce(func,delay) {
  let timer
  return function(...args){
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(()=>{
      func.apply(this,args)
    },delay)
  }
}

export function findIndex(list,song){
  return list.findIndex((item)=>{
    return item.id === song.id  //查找数组下标
  })
}