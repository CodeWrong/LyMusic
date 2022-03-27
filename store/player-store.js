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
        currentSong: {},
        durationTime: 0,
        lyricInfos: [],

        currentLyricText: '',
        currentLyricIndex: 0,
        currentTime: 0,

        playModeIndex: 0, // 0: 顺序 , 1: 单曲 , 2: 随机
        isPlaying: false
    },
    actions: {
        playMusicWithSongIdAction(ctx,{id}){
            ctx.isPlaying = true;
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

        changeIsPlaying(ctx){
            ctx.isPlaying = !ctx.isPlaying;
            if(ctx.isPlaying){
                audioContext.play();
            }else{
                audioContext.pause()
            }
        }
    }
})



export{
    audioContext,
    playerStore
}
