// pages/search/search.js
const request=require("../../utils/requests");
var star = require("../../utils/star");
Page({
    data:{
        value: "",
        bookList: null,
        count: 0,
        totalRecord: 0, //图书总数
        historySearch: [],
        focus: true,
        loading: false,
        clearIconDisplay: "none",
    },

    changeValue:function(e){
        this.setData({value:e.detail.value});
        this.clearIconDisplayChange();
    },

    clearInput: function(e){
        this.focus();
        this.setData({
            value: "",
            clearIconDisplay: "none"
        })
    },
  
    focus: function(e){
      console.log(e);
      this.setData({
          focus: true
      })
  },
  
  deleteAllHistory: function(){
      var that = this;
      wx.showModal({
        title: "提示",
        content: "确认清空所有记录？",
        success(res){
            if(res.confirm){
                wx.removeStorage({
                  key: 'historySearch',
                  success(){
                    that.setData({
                        historySearch: []
                    })
                  }
                })
            }
            else if(res.cancel){
                console.log("用户点击取消")
            }
        }
      })
  },
  
  deleteOne: function(e){
      console.log(e);
      var that = this;
      wx.showModal({
          title: "提示",
          content: "确认清除该记录？",
          success(res){
              if(res.confirm){
                if(that.data.historySearch.length == 1){
                    that.setData({
                        historySearch: []
                    })
                }
                else{
                    let hs = that.data.historySearch;
                    hs.splice(e.currentTarget.dataset.index, 1);
                    that.setData({
                        historySearch: hs
                    })
                } 
                console.log(that.data.historySearch);
                that.saveSearchHistory();
              }
              else if(res.cancel){
                  console.log("用户点击取消")
              }
          }
        })
  },
  
  saveSearchHistory: function(){
      var hs = this.data.historySearch;
      var index = hs.indexOf(this.data.value);
      var val = this.data.value;
      if (index == -1 && val != ""){
          hs.reverse().push(this.data.value);
          hs.reverse();
      }
      else if(val != ""){
          hs.splice(index, 1);
          hs.reverse().push(val);
          hs.reverse();
      }
      this.setData({
          historySearch: hs
      })
      wx.setStorage({
        data: hs,
        key: 'historySearch',
      })
  },
  
      searchHandel:function(){
          var that=this;
          if(that.data.value.replace(/\s/g,"")){
              that.setData({
                  bookList: null,
                  focus: false,
                  loading: true
              })
              wx.showToast({
                  title: '加载中',
                  icon: 'loading',
                  duration: 10000
              })
              request.searchBook({q:that.data.value},function(res){
                  var types = res.data.books;
                  for (var i = 0; i < types.length; ++i) {
                      var book = types[i];
                      var rating = book.rating;
  
                      rating.block = star.get_star(rating.average);
                  }
                  res.data.books = types;
                  console.log(res.data.books);
                  that.setData({
                      loading: false
                  })
                  if(res.data.count==0){return;}
                  that.setData({bookList:res.data.books,count:that.data.count+res.data.count});
                  wx.hideToast();
                  console.log(res.data);
              })
          }
          else
          {
              wx.showToast({
                  title: '请输入书名',
                  icon:"loading"
              })
          }
      },
  
      searchByName: function(e){
          console.log(e);
          this.setData({
              value: e.currentTarget.dataset.name,
              clearIconDisplay: "block"
          })
          this.toSearch();
      },
      
      toSearch:function(){
          var that=this;
          this.setData({
              start: 0
          });
          that.searchHandel();
          that.saveSearchHistory();
      },
  
      lower: function(e) {
          console.log("已到低部");
          var that=this;
          wx.showToast({
              title: '加载中',
              icon: 'loading',
              duration: 10000
          })
          var sobj=that.data.bookTag ?{tag:that.data.bookTag,start:that.data.count}:{q:that.data.value,start:that.data.count};
          request.searchBook(sobj,function(res){
              var types = res.data.books;
              for (var i = 0; i < types.length; ++i) {
                  var book = types[i];
                  var rating = book.rating;
  
                  rating.block = star.get_star(rating.average);
              }
              res.data.books = types;
              console.log(res.data.books);
  
              if(res.data.count==0){return;}
              that.setData({bookList:that.data.bookList.concat(res.data.books),count:that.data.count+res.data.count});
              wx.hideToast();
          })
      },

      clearIconDisplayChange: function(){
          var res = this.data.value == ""? "none": "block";
          this.setData({
              clearIconDisplay: res
          })
      },


    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
      var that = this;
      wx.getStorage({
          key: 'historySearch',
          success(res){
              that.setData({
                  historySearch: res.data
              })
          }
      })    
    },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})