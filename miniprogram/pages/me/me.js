const app = getApp()
const db = wx.cloud.database()
const db_book = db.collection('mybooks')
let skip = 0,
  limit = 10
Page({
  data: {
    bookList: [],
    showMore: true
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
  gotoDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../bookdetail/bookdetail',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', item)
      }
    })
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
      if (e.detail.x < -30) {
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
    const index = e.currentTarget.dataset.index
    console.log(id, index)
    this.data.bookList.splice(index, 1)
    this.setData({
      bookList: this.data.bookList
    })
    const bookInfo = await db_book.doc(id).get()
    console.log(bookInfo.data)
    let openids = bookInfo.data.openids
    openids.splice(openids.findIndex(item => item === app.globalData.openid), 1)
    db_book.doc(id).update({
      data: {
        openids
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