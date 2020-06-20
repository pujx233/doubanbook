const rp = require('request-promise')

exports.main = async (event, context) => {
  const isbn = event.isbn
  const result = await rp(`https://douban-api.now.sh/v2/book/isbn/${isbn}`)
  .then(res => {
    return JSON.parse(res)
  }).catch(err => console.log(err))
  return result
}