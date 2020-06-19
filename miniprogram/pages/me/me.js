// pages/about/about.js
const db = wx.cloud.database({});//首先获得数据库实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    db.collection('mybook').get({
      success: res =>{
        console.log(res.data[0]);
        this.setData({
          booklist: res.data
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