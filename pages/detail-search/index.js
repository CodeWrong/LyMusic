// pages/detail-search/index.js
import {getSearchHot, getSearchSuggest} from "../../service/api_search";
import debounce from '../../utils/debounce';

const debounceGetSearchSuggest = debounce(getSearchSuggest,300);

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotKeyWords: [],
        suggestSongs: [],
        searchValue: ''
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
                this.setData({suggestSongs: res.result.allMatch})
            });
        }else{
            this.setData({suggestSongs: []})
        }
    },
    onUnload: function() {}
})