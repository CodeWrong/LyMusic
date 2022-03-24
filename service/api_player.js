import lyRequest from './index';

export function getSongDetail(ids){
    return lyRequest.get("/song/detail",{
        ids
    })
}