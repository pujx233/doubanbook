// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

var rp = require('request-promise')

// 云函数入口函数
exports.main = async (event, context) => {
  var res = rp('https://api.douban.com/v2/book/isbn/' + event.isbn)
  console.log(res)
  .then(html => {
    return eval('(' + html + ')');
  }).catch(err => {
    console.log(err)
  })

  return res;
}
