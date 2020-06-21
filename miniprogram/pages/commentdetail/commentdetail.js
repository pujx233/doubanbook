const db = wx.cloud.database({});
const comment = db.collection('comment')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    wx.showLoading({
      title: '加载中',
    })
    console.log(options);
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        id: options.id
      }
    }).then(res => {
      console.log("testid",res);
      this.setData({
        detail: res.result
      });
      wx.hideLoading();
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
    });

    db.collection('comment').where({
      id: options.id
    }).get().then(res=>{
      console.log(res);
      this.setData({
        dataList: res.data
      });
    })
    .catch(err=>{
      console.log(err);
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
})