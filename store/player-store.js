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
        lyricInfos: []
    },
    actions: {
        playMusicWithSongIdAction(ctx,{id}){
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
        }
    }
})



export{
    audioContext,
    playerStore
}
