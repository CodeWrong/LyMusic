// pages/music-player/index.js
import {getSongDetail} from '../../service/api_player';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        currentSong: {},

        currentPage: 0,
        contentHeight: 0,

        // 是否显示歌词
        isMusicLyric: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取传入的id
        const id = options.id;
        this.setData({id})
        // 根据id获取歌曲信息
        this.getPageData(id)

        // 动态计算内容高度
        const globalData = getApp().globalData;
        
        const screenHeight = globalData.screenHeight;
        const statusBarHeight = globalData.statusBarHeight;
        const navBarHeight = globalData.navBarHeight;
        const deviceRadio = globalData.deviceRadio;
        const contentHeight = screenHeight - statusBarHeight - navBarHeight;
        this.setData({contentHeight});
        this.setData({isMusicLyric: deviceRadio >= 2});


        // 创建音乐播放器
        const audioContext = wx.createInnerAudioContext();
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`

        // 第一种调用方法
        // audioContext.play();

        // 第二种调用方式
        // audioContext.autoplay = true;
    },

    getPageData: function(id) {
        getSongDetail(id).then(res => {
            this.setData({currentSong: res.songs[0]})
        })
    },

    // 事件处理
    handleSwiperChange: function(event){
        const current = event.detail.current;
        this.setData({currentPage: current})
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
})