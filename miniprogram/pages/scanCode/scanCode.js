//index.js
//获取应用实例
var app = getApp()
Page({
  data: {},
  //事件处理函数
  bindViewTap: function() {
    var that = this
    wx.scanCode({
      success: (res) => {
        wx.showLoading({});
        wx.request({
          url: 'https://api.jisuapi.com/isbn/query?appkey=44898c9b893f35ce&isbn=',
          data: {
            barcode: res.result
          },
          success: function(res) {
            wx.hideLoading()
            console.log(res.data)
            that.setData({
              barcodeData:res.data.data
            });
          }
        })
      }
    })
  },

  bindViewInput: function (res) {
    var that = this
    this.setData({
      inputTxt: ''
    }),
      wx.request({
        url: 'https://api.jisuapi.com/isbn/query?appkey=44898c9b893f35ce&isbn=',
        data: {
          barcode: res.detail.value
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res.data)
          that.setData({
            barcodeData: res.data.data
          });
        }
      })
  },
  
  onLoad: function () {
    console.log('onLoad')    
  }
})
