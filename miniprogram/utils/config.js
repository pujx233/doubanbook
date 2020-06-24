/**api链接 */
const apiUrl = "https://api.douban.com/v2/book/";
//
module.exports = { 
    getBookById: apiUrl+"/:id"+"?apikey=0df993c66c0c636e29ecbb5344252a4a",
    searchBook: apiUrl + "search?apikey=0df993c66c0c636e29ecbb5344252a4a",
    getBookList: apiUrl + "series/:id/books?apikey=0df993c66c0c636e29ecbb5344252a4a" }