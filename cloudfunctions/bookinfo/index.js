const cloud = require('wx-server-sdk')
cloud.init({
  env: 'nju-douban-ni8r0',
  traceUser: true
})
var db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    return await db.collection('mybook').where({
      _openid: "oPhK65bGlyskyP1P1km3PSUkwm9l"
    })
      .update({
        data: {
          price: "100元"
        },
      })
  } catch (e) {
    console.error(e)
  }
}