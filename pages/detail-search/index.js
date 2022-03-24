// pages/detail-search/index.js
import {getSearchHot, getSearchSuggest,getSearchResult} from "../../service/api_search";
import debounce from '../../utils/debounce';
import {stringToNodes} from '../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest,300);

Page({
    /**
     * 页面的初始数据
     */
    data: {
        hotKeyWords: [],
        suggestSongs: [],
        searchValue: '',
        nodes: [],
        resultSongs: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPageData();
    },

    getPageData: function(){
        getSearchHot().then(res => {
            this.setData({hotKeyWords: res.result.hots})
        })
    },

    handleSearchChange(event){
        const searchValue = event.detail;
        this.setData({searchValue: searchValue})
        if(searchValue){
            debounceGetSearchSuggest(searchValue).then(res => {
                const suggestSongs = res.result.allMatch
                this.setData({suggestSongs})

                // 转为nodes节点
                const suggestKeywords = suggestSongs.map(item => item.keyword);
                const suggestNodes = []
                for(const keyword of suggestKeywords){
                    const nodes = stringToNodes(keyword,searchValue)
                    suggestNodes.push(nodes)
                }
                this.setData({nodes: suggestNodes})
            });
        }else{
            this.setData({suggestSongs: []})
            this.setData({resultSongs: []})
        }
    },
    handleSearchAction(){
        const searchValue = this.data.searchValue;
        getSearchResult(searchValue).then(res => {
            this.setData({resultSongs: res.result.songs})
        })
    },
    handleKeywordItemClick(event){
        const keyword = event.currentTarget.dataset.keyword;
        this.setData({searchValue: keyword});
        this.handleSearchAction();
    },
    onUnload: function() {}
})