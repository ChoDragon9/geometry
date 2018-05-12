((w) => {
  w.each = iter => (list) => {
    for (let i = 0, len = list.length; i < len; i++) {
      iter(list[i], i, list, len)
    }
    return list
  }
  w.loop = iter => len => {
    for (let i = 0; i < len; i++) {
      iter(i, len)
    }
    return len
  }
  w.map = iter => list => {
    const newList = []
    w.each(item => {
      newList.push(iter(item))
    })(list)
    return newList
  }
  w.filter = iter => list => {
    const newList = []
    w.each(item => {
      if (iter(item)) {
        newList.push(item)
      }
    })(list)
    return newList
  }
  w.find = iter => list => {
    for (let i = 0, len = list.length; i < len; i++) {
      if (iter(list[i], i, list)) return list[i]
    }
    return null
  }
  w.findIndex = iter => list => {
    for (let i = 0, len = list.length; i < len; i++) {
      if (iter(list[i], i, list)) return i
    }
    return -1
  }
  w.reduce = (init, iter) => list => {
    w.each((item) => {
      init = iter(init, item)
    })(list)
    return init
  }
  w.pipe = (...fns) => res => {
    return w.reduce(res, (res, fn) => fn(res))(fns)
  }
  w.divEq = (...fns) => val => { //Divided Equal
    w.each((fn) => fn(val))(fns)
    return val
  }
  w.isUndefined = (obj) => () => {
    return typeof obj === 'undefined'
  }
  w.negate = v => !v
})(typeof global === 'object' ? global : window)