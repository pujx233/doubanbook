/**api链接 */
const apiUrl = "https://douban-api.now.sh/v2/book/";
//
module.exports = { 
    getBookById: apiUrl,
    searchBook: apiUrl + "search",
    getBookList: apiUrl + "series/:id/books" }