import LYRequest from "./index";

export function getBanner(){
    return LYRequest.get('/banner', {
        type: 2
    })
}

export function getRankings(idx){
    return LYRequest.get("/top/list", {
        idx
    })
}

export function getSongMenu(cat="全部", limit=6, offset=0){
    return LYRequest.get("/top/playlist",{
        cat,
        limit,
        offset
    })
}

export function getSongDetail(id){
    return LYRequest.get("/playlist/detail/dyamic", {
        id
    })
}