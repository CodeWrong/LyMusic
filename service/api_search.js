
import lyRequest from './index'

export function getSearchHot(){
    return lyRequest.get("/search/hot")    
}

export function getSearchSuggest(keywords){
    return lyRequest.get("/search/suggest",{
        keywords,
        type: "mobile"
    })
}

export function getSearchResult(keywords) {
    return lyRequest.get("/search",{
        keywords
    })
}