import {HYEventStore} from "hy-event-store";
import {
    getSongDetail,
    getSongLyric
} from '../service/api_player';
import {
    parseLyric
} from '../utils/parse-lyric';

const audioContext = wx.createInnerAudioContext();


const playerStore = new HYEventStore({
    state: {
        id:'',
        currentSong: {},
        durationTime: 0,
        lyricInfos: [],

        currentLyricText: '',
        currentLyricIndex: 0,
        currentTime: 0,

        playModeIndex: 0, // 0: 顺序 , 1: 单曲 , 2: 随机
        isPlaying: false,
        currentPlayList: [],
        currentPlayIndex: 0
    },
    actions: {
        playMusicWithSongIdAction(ctx,{id}){
            if(ctx.id === id) {
                this.dispatch("changeIsPlaying",true);
                return;
            }
            ctx.id = id;

            ctx.isPlaying = true;
            ctx.currentSong = {};
            ctx.durationTime = 0;
            ctx.lyricInfos = [];
            ctx.currentLyricText = '';
            ctx.currentLyricIndex = 0;
            ctx.currentTime = 0;
            ctx.playModeIndex = 0;


            getSongDetail(id).then(res => {
                ctx.currentSong = res.songs[0];
                ctx.durationTime = res.songs[0].dt;
            })
    
            getSongLyric(id).then(res => {
                const lyricString = res.lrc.lyric;
                const lyrics = parseLyric(lyricString);
                ctx.lyricInfos = lyrics;
            })

            audioContext.stop();
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
            // audioContext.autoplay = true;
            this.dispatch("setupAudioContextListenerAction")
        },

        setupAudioContextListenerAction: function(ctx){
            audioContext.onCanplay(() => {
                audioContext.play();
            })
    
            audioContext.onTimeUpdate(() => {
                const currentTime = audioContext.currentTime * 1000;
                
                ctx.currentTime = currentTime
                
                if(!ctx.lyricInfos) return
                let i = 0
                for (; i < ctx.lyricInfos.length; i++) {
                    const lyricInfo = ctx.lyricInfos[i];
                    if (currentTime < lyricInfo.time) {
                        break;
                    }
                }
                const currentIndex = i - 1;
                if (ctx.currentLyricIndex !== currentIndex) {
                    const currentLyricInfo = ctx.lyricInfos[currentIndex];
                    ctx.currentLyricText = currentLyricInfo.lyricText;
                    ctx.currentLyricIndex = currentIndex
                }
            })
        },

        changeIsPlaying(ctx, isPlaying=true){
            ctx.isPlaying = isPlaying;
            if(ctx.isPlaying){
                audioContext.play();
            }else{
                audioContext.pause()
            }
        },

        changeNewMusicAction(ctx, isNext = true){
            let index = ctx.currentPlayIndex;
            switch(ctx.playModeIndex){
                case 0:
                    index = isNext ? index +=1 : index -=1;
                    if(index === ctx.currentPlayList.length) {index = 0;}
                    if(index == -1) {index = ctx.currentPlayList.length - 1;}
                    break;
                case 1:
                    break;
                case 2:
                    index = Math.floor(Math.random() * ctx.currentPlayList.length);
                    break;
            }
            let currentSong = ctx.currentPlayList[index];
            if(!currentSong){
                currentSong = ctx.currentSong;
            }else{
                ctx.currentPlayIndex = index;
            }

            this.dispatch("playMusicWithSongIdAction",{id: currentSong.id})
        }
    }
})



export{
    audioContext,
    playerStore
}
