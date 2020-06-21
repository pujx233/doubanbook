// pages/detail/detail.js
const request=require("../../utils/requests");
var star = require("../../utils/star");
const app = getApp()
const db = wx.cloud.database()
const db_book = db.collection('mybooks')
global.regeneratorRuntime = require('../../lib/regenerator/runtime-module')
const { regeneratorRuntime } = global
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify'

Page({
  data:{
      id:"",
      isbn:"",
      buttonClicked: false
  },
  onLoad:function(options){
      // 页面初始化 options为页面跳转所带来的参数
      var that=this;
      that.setData({ id:options.id});
      wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 3000
      })
      request.getBookById(that.data.id,function(res){
          
          var types =res.data;
          var rating = types.rating;
          rating.block = star.get_star(rating.average);

          res.data = types;
          console.log(res.data);
          that.setData({
            bookInfo:res.data,
            isbn:types.isbn13
          });
      });
  },
  
  onReady:function(){
    // 页面渲染完成
   wx.hideToast();
  },
  onShow:function(){
    // 页面显示
    console.log("显示");
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  async collect(e) {
    
    console.log(e.currentTarget.dataset.id)
    const isbn = e.currentTarget.dataset.id
    console.log('isbn', isbn)
    const isExist = await this.checkBook(isbn)
    
    if (isExist) {
      wx.showLoading({
        title: '已收藏',
        mask:true,
        });
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
        
      Notify({
        text: '图书已存在',
        duration: 10000,
        selector: '#custom-selector',
        backgroundColor: 'red',
        context:this
      })
      console.log("存在")
     
      return
    }
    if (isExist==false) {
      Notify({
        text: '添加成功',
        duration: 10000,
        selector: '#custom-selector',
        backgroundColor: 'green',
        context:this
      })
      
      
    } // 已更新
    
    wx.showLoading({
      title: '收藏中', 
      mask:true,   
      });
      setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    console.log("添加中",isbn),
    wx.cloud.callFunction({
      
      name: 'bookinfo',
      data: { isbn },
      // data: { isbn: '9787101003048'},
      success: res => {
        console.log('res', res.result)
        db_book.add({
          data: Object.assign(res.result, {openids: [app.globalData.openid]})
        }).then(res => {
          console.log("添加成功",res)
          wx.hideLoading();
        }).catch(err => {
          console.log(err)
        })
      },
      fail: err => {
        Notify({
          text: '图书获取超时或不存在',
          duration: 10000,
          selector: '#custom-selector',
          backgroundColor: 'red'
        })
      }
    })
  },

  //扫码部分----------------------------------------end



  // 根据isbn查询
  async checkBook(isbn13) {
    const bookResult = await db.collection('mybooks').where({isbn13}).get()
    console.log('book', bookResult)
    if (bookResult.data.length==0) {
     
      return false
    }else{
      return true
    }
  },
})