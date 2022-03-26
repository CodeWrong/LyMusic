// pages/music-player/index.js
import {getSongDetail} from '../../service/api_player';
import {audioContext} from '../../store/index'


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
        isMusicLyric: true,

        currentTime:0,
        durationTime: 0,
        sliderValue: 0,
        isSliderChanging: false
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


        // 使用音乐播放器
        audioContext.stop();
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
        // audioContext.autoplay = true;

        audioContext.onCanplay(() => {
            // audioContext.play();
        })

        audioContext.onTimeUpdate(() => {
            if(!this.data.isSliderChanging){
                const currentTime = audioContext.currentTime * 1000;
                const value = currentTime / this.data.durationTime * 100
                this.setData({currentTime,sliderValue: value})
            }
        })
    },

    getPageData: function(id) {
        getSongDetail(id).then(res => {
            this.setData({currentSong: res.songs[0], durationTime: res.songs[0].dt})
        })
    },

    // 事件处理
    handleSwiperChange: function(event){
        const current = event.detail.current;
        this.setData({currentPage: current})
    },

    handleSliderChange: function(event){
        // 获取slider变化的值
        const value = event.detail.value;

        const currentTime = this.data.durationTime * value / 100;

        audioContext.pause();
        audioContext.seek(currentTime / 1000);

        this.setData({sliderValue: value,isSliderChanging: false})
    },

    handleSliderChanging(event){
        const value = event.detail.value;
        const currentTime = this.data.durationTime * value / 100;
        this.setData({isSliderChanging: true, currentTime})
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
})