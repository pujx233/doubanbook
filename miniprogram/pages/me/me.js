const app = getApp()
const db = wx.cloud.database()
const db_book = db.collection('mybooks')
var star = require("../../utils/star");
global.regeneratorRuntime = require('../../lib/regenerator/runtime-module')
const { regeneratorRuntime } = global
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify'

let skip = 0,
  limit = 10
Page({
  data: {
    bookList: [],
    showMore: true
  },
  onLaunch: function(){
    
  },
  //扫码部分-------------------------------begin
  onLoad: function() {
    
    if (!wx.cloud) {
      console.log('未开启云开发')
      return
    }
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        app.globalData.openid = res.result.openid
        console.log('云函数获取到的openid: ', res.result.openid)
      }
    })
  },
  // 扫码
  async scan() {
    const isbn = await new Promise(function(resolve, reject) {
      wx.scanCode({
        scanType: ['barCode'],
        success: function (res) {
          resolve(res.result)
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
    console.log('扫码结果', isbn)
    const isExist = await this.checkBook(isbn)
    
    if (isExist) {
      Notify({
        text: '图书已存在',
        duration: 10000,
        selector: '#custom-selector',
        backgroundColor: 'red',
        context:this
      })
      console.log("存在")
      wx.showLoading({
        title: '已收藏',
        mask:true,
        });
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
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
      console.log("可添加")
    wx.showLoading({
      title: '已收藏',
      mask:true,
      });
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)  
    } // 已更新
    console.log("添加中")
    wx.cloud.callFunction({
      name: 'bookinfo',
      data: { isbn },
      // data: { isbn: '9787101003048'},
      success: res => {
        console.log('res', res.result)
        db_book.add({
          data: Object.assign(res.result, {openids: [app.globalData.openid]})
        }).then(res => {
          Notify({
            text: '添加成功',
            duration: 10000,
            selector: '#custom-selector',
            backgroundColor: 'green'
          })
          console.log(res)
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

  async onLoad() {
    if (!app.globalData.openid) {
      wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          app.globalData.openid = res.result.openid
          console.log('云函数获取到的openid: ', res.result.openid)
        }
      })
    }
    skip = 0
    await this.loadData()
  },
  onShow() {
  
  },
  // 显示删除按钮
  showDeleteButton(e) {
    const index = e.currentTarget.dataset.index
    this.setXmove(index, -100)
  },
  // 隐藏删除按钮
  hideDeleteButton(e) {
    const index = e.currentTarget.dataset.index
    this.setXmove(index, 0)
  },
  // 设置movable-view位移
  setXmove(index, xmove) {
    const bookList = this.data.bookList
    bookList[index].xmove = xmove
    this.setData({
      bookList: bookList
    })
  },
  // 处理movable-view移动事件
  handleMovableChange(e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -60) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },
  // 处理touchstart事件
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
  },
  // 处理touchend事件
  handleTouchEnd(e) {
    if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -30) {
      this.showDeleteButton(e)
    } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
      this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
  },
  
  // 左滑删除
  async delete(e) {
    const id = e.currentTarget.dataset.id
    console.log(id)
    const index = e.currentTarget.dataset.index
    console.log(id, index)
    this.data.bookList.splice(index, 1)
    this.setData({
      bookList: this.data.bookList
    })
    const bookInfo = await db_book.doc(id).get()
    console.log(bookInfo.data)
    db.collection('mybooks').doc(id).remove({
      success: function(res) {
        console.log(res.data)
      }
    })
    
  },

  async onPullDownRefresh() {
    console.log('下拉刷新')
    this.setData({
      showMore: true
    })
    await this.onLoad()
    wx.stopPullDownRefresh() // 处理真机不回弹
  },
  async loadData() {
    
    const res = await db.collection('mybooks').skip(skip).limit(limit).where({
      openids: db.command.eq(app.globalData.openid)
    }).get()
    console.log('data', res.data)
    if (res.data.length > 0) {
      this.setData({
        // 第一次加载或下拉刷新 bookList=res.data
        bookList: skip === 0 ? res.data : this.data.bookList.concat(res.data)
      })
      skip += limit
      console.log('skip', skip)
    } else {
      this.setData({
        showMore: false
      })
      console.log('无数据了')
    }

  },
  async onReachBottom() {
    if (!this.data.showMore) return
    await this.loadData()
  },
  onShareAppMessage: function() {

  }
})