// pages/rank/rank.js
// 获取全局应用程序实例对象
const app = getApp()
var jsonData =  require('../../data/top250.js');
const request=require("../../utils/requests");


// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(){
    
    this.setData({
      //jsonData.dataList获取json.js里定义的json数据，并赋值给dataList
      dataList: jsonData.dataList
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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
