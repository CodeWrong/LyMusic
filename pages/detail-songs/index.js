// pages/detail-songs/index.js
import {rankingStore, playerStore} from "../../store/index";
import {getSongDetail} from "../../service/api_music"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        rankingName: "",
        songInfo: {},
        type: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const type = options.type;
        this.setData({type: type});
        if(type==="menu"){
            const id = options.id;
            getSongDetail(id).then(res => {
                this.setData({songInfo: res.playlist})
            })
        }else if(type ==="ranking"){
            const ranking = options.ranking;
            this.setData({rankingName: ranking});
            rankingStore.onState(ranking,this.handleRankingData)
        }
        
    },

    handleRankingData(res){
        this.setData({songInfo: res});
    },
    handleSongItemClick(event){
        const index = event.currentTarget.dataset.index;
        playerStore.setState("currentPlayIndex",index);
        playerStore.setState("currentPlayList",this.data.songInfo.tracks);
    },

   onUnload: function(){
       if(this.data.rankingName){
        rankingStore.offState(this.data.rankingName,this.handleRankingData)
       }
   }
})