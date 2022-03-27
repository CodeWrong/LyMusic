// pages/music-player/index.js
import {
    audioContext,
    playerStore
} from '../../store/index'

const playModeNames = ["order","repeat","random"]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        currentSong: {},
        currentPage: 0,
        contentHeight: 0,
        lyricInfos: [],
        currentLyricText: '',
        currentLyricIndex: 0,
        currentTime: 0,

        // 是否显示歌词
        isMusicLyric: true,
        
        durationTime: 0,
        sliderValue: 0,
        isSliderChanging: false,
        lyricScrollTop: 0,

        playModeIndex: 0,
        playModeName: 'order',

        isPlaying: false,
        playingName: 'pause'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取传入的id
        const id = options.id;
        this.setData({
            id
        })
        
        this.setupPlayerStoreListener()

        // 动态计算内容高度
        const globalData = getApp().globalData;

        const screenHeight = globalData.screenHeight;
        const statusBarHeight = globalData.statusBarHeight;
        const navBarHeight = globalData.navBarHeight;
        const deviceRadio = globalData.deviceRadio;
        const contentHeight = screenHeight - statusBarHeight - navBarHeight;
        this.setData({
            contentHeight
        });
        this.setData({
            isMusicLyric: deviceRadio >= 2
        });



        // this.setupAudioContextListener();
    },
    handleBackClick(){
        wx.navigateBack()
    },
    handleModeClick(){
        let playModeIndex = this.data.playModeIndex + 1;
        if(playModeIndex === 3){playModeIndex = 0};
        playerStore.setState("playModeIndex",playModeIndex)
    },
    handlePlayingClick(){
        playerStore.dispatch("changeIsPlaying")
    },
    setupPlayerStoreListener(){
        playerStore.onStates(["currentSong","durationTime","lyricInfos"], ({
            currentSong,
            durationTime,
            lyricInfos
        }) => {
            if(lyricInfos){
                this.setData({lyricInfos})
            }
            if(currentSong){
                this.setData({currentSong})
            }
            if(durationTime){
                this.setData({durationTime})
            }
        })

        playerStore.onStates(["currentTime","currentLyricText","currentLyricIndex"],({
            currentTime,
            currentLyricIndex,
            currentLyricText
        }) => {
            if(currentTime && !this.data.isSliderChanging){
                const value = currentTime / this.data.durationTime * 100
                this.setData({
                    currentTime,
                    sliderValue: value
                })
            }
            if(currentLyricText){
                this.setData({currentLyricText})
            }
            if(currentLyricIndex){
                this.setData({
                    currentLyricIndex,
                    lyricScrollTop: currentLyricIndex * 35
                })
            }
        })

        playerStore.onState("playModeIndex",(playModeIndex) => {
            this.setData({playModeIndex,playModeName: playModeNames[playModeIndex]})
        })

        playerStore.onState("isPlaying",(isPlaying) => {
            this.setData({isPlaying,playingName: isPlaying ? 'pause' : 'resume'})
        })
    },
    // setupAudioContextListener() {
    //     audioContext.onCanplay(() => {
    //         // audioContext.play();
    //     })

    //     audioContext.onTimeUpdate(() => {
    //         const currentTime = audioContext.currentTime * 1000;
    //         if (!this.data.isSliderChanging) {
    //             const value = currentTime / this.data.durationTime * 100
    //             this.setData({
    //                 currentTime,
    //                 sliderValue: value
    //             })
    //         }
    //         if(!this.data.lyricInfos) return
    //         let i = 0
    //         for (; i < this.data.lyricInfos.length; i++) {
    //             const lyricInfo = this.data.lyricInfos[i];
    //             if (currentTime < lyricInfo.time) {
    //                 break;
    //             }
    //         }
    //         const currentIndex = i - 1;
    //         if (this.data.currentLyricIndex !== currentIndex) {
    //             const currentLyricInfo = this.data.lyricInfos[currentIndex];
    //             this.setData({
    //                 currentLyricText: currentLyricInfo.lyricText,
    //                 currentLyricIndex: currentIndex,
    //                 lyricScrollTop: currentIndex * 35
    //             })
    //         }
    //     })
    // },

    // 事件处理
    handleSwiperChange: function (event) {
        const current = event.detail.current;
        this.setData({
            currentPage: current
        })
    },

    handleSliderChange: function (event) {
        // 获取slider变化的值
        const value = event.detail.value;

        const currentTime = this.data.durationTime * value / 100;

        audioContext.pause();
        playerStore.setState("isPlaying",true)
        audioContext.seek(currentTime / 1000);

        this.setData({
            sliderValue: value,
            isSliderChanging: false
        })
    },

    handleSliderChanging(event) {
        const value = event.detail.value;
        const currentTime = this.data.durationTime * value / 100;
        this.setData({
            isSliderChanging: true,
            currentTime,
            sliderValue: value
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
})