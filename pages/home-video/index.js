// pages/home-video/index.js

import {getTopMv} from '../../service/api_video'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        topMVs: [],
        hasMore: true
    },

    /**
     * 生命周期函数--监听页面加载(created)
     */
    onLoad: async function (options) {
        this.getTopMVData(0);
    },

    async getTopMVData(offset){
        if(!this.data.hasMore)return;

        if(offset === 0){
            wx.showNavigationBarLoading()
        }
        const res = await getTopMv(offset);
        let newData = this.data.topMVs;
        if(offset === 0){
            newData = res.data;
        }else{
            newData = newData.concat(res.data);
        }
        this.setData({topMVs: newData});
        this.setData({hasMore: res.hasMore});
        wx.hideNavigationBarLoading({})
    },

    // 封装事件处理的函数
    handleItemClick: function(event){
        const id = event.currentTarget.dataset.item.id;
        wx.navigateTo({
          url: '/pages/detail-video/index?id=' + id,
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getTopMVData(0)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: async function () {
        this.getTopMVData(this.data.topMVs.length);
    },
})