// pages/home-music/index.js
import {rankingStore, rankingMap,playerStore} from '../../store/index'

import {getBanner, getSongMenu} from '../../service/api_music';
import querySelector from '../../utils/query-rect';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      banners: [],
      swiperHeight: 100,
      recommendSongs: [],
      hotSongMenu: [],
      recommendSongMenu: [],
      rankings: {0: {}, 2: {}, 3: {}},
      currentSong: {}
    },

    // 事件处理
    handleClick(){
        wx.navigateTo({
          url: '/pages/detail-search/index',
        })
    },

    handleImageLoaded(){
      // 获取组件的高度
      querySelector(".swiper-image").then(res => {
        this.setData({swiperHeight: res[0].height})
      })
    },
    handleSongItemClick(event){
      const index = event.currentTarget.dataset.index;
      playerStore.setState("currentPlayIndex",index);
      playerStore.setState("currentPlayList", this.data.recommendSongs);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getPageData()
    },

    getPageData(){
      getBanner().then(res => {
        this.setData({banners: res.banners})
      })

      getSongMenu().then(res => {
        this.setData({hotSongMenu: res.playlists})
      })

      getSongMenu("华语").then(res => {
        this.setData({recommendSongMenu: res.playlists})
      })

      playerStore.dispatch("playMusicWithSongIdAction",{id: 1901371647})

      this.setupPlayerStoreListener();

      rankingStore.dispatch('getRankingDataAction')

      rankingStore.onState('hotRanking', (res) => {
        if(res.tracks){
          const recommendSongs = res.tracks.slice(0,6);
          this.setData({recommendSongs})
        }
      })

      rankingStore.onState("newRanking",this.getRankingHandler(0))
      rankingStore.onState("originRanking",this.getRankingHandler(2))
      rankingStore.onState("upRanking",this.getRankingHandler(3))
    },
    setupPlayerStoreListener(){
        playerStore.onState("currentSong",(currentSong) => {
          this.setData({currentSong})
        })
    },

    getRankingHandler(idx){
      return (res) => {
        if(Object.keys(res).length !== 0){
          const name = res.name;
          const coverImgUrl = res.coverImgUrl;
          const songList = res.tracks.slice(0,3);
          const playCount = res.playCount;
          const rankingObj = {name,coverImgUrl,songList,playCount};
          const newRankings = {...this.data.rankings, [idx]: rankingObj};
          this.setData({
            rankings: newRankings
          })
        }
      }
    },

    // getNewRankingHandler: function(res){
    //   if(Object.keys(res).length !== 0){
    //     const name = res.name;
    //     const coverImgUrl = res.coverImgUrl;
    //     const songList = res.tracks.slice(0,3);
    //     let rankingObj = {name,coverImgUrl,songList};
    //     const originRankings = [...this.data.rankings];
    //     originRankings.push(rankingObj);
    //     this.setData({
    //       rankings: originRankings
    //     })
    //   }
    // },



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

    handleMoreClick: function() {
      this.navigateToDetailSongPage("hotRanking");
    },

    handleRankingItemClick: function(event) {
      const idx = event.currentTarget.dataset.idx;
      const rankingName = rankingMap[idx]
      this.navigateToDetailSongPage(rankingName);
    },

    navigateToDetailSongPage: function (rankingName) {
      wx.navigateTo({
        url: `/pages/detail-songs/index?ranking=${rankingName}&type=ranking`,
      })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})