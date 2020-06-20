// 云函数入口文件
import { init } from 'wx-server-sdk'

init()
import rp from 'request-promise'
// 云函数入口函数
export async function main(event, context) {
  var res = rp(`https://douban-api.now.sh/v2/book/isbn/` + event.isbn).then(html => {
    return html;
  }).catch(err => {
    console.log(err)
  })
  return res
}