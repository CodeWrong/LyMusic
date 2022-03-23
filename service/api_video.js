import lyRequest from './index'

export function getTopMv(offset,limit = 10){
    return lyRequest.get("/top/mv", {
        offset,
        limit
    })
}

/**
 * 请求MV的播放地址
 * @param {number} id MV对应的id
 */
export function getMVURL(id){
    return lyRequest.get("/mv/url",{
        id
    })
}

/**
 * 获取MV详情
 * @param {number} mvid 
 */
export function getMVDetail(mvid){
    return lyRequest.get("/mv/detail",{
        mvid
    })
}
/**
 * 
 * @param {number} id 
 */
export function getRelatedVedio(id){
    return lyRequest.get("/related/allvideo",{
        id
    })
}