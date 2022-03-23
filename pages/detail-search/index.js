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
        searchValue: '',
        nodes: []
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
                    const nodes = [];
                    if(keyword.toUpperCase().startsWith(searchValue.toUpperCase())){
                        const key1 = keyword.slice(0, searchValue.length);
                        const node1 = {
                            name: 'span',
                            attrs: {
                                style: "color: #26ce8a"
                            },
                            children: [
                                {
                                    type: "text",
                                    text: key1
                                }
                            ]
                        };
                        nodes.push(node1);
                        const key2 = keyword.slice(searchValue.length);
                        const node2 = {
                            name: 'span',
                            attrs: {
                                style: "color: black"
                            },
                            children: [
                                {
                                    type: "text",
                                    text: key2
                                }
                            ]
                        };
                        nodes.push(node2);
                    }else{
                        const node1 = {
                            name: 'span',
                            attrs: {
                                style: "color: #000"
                            },
                            children: [
                                {
                                    type: "text",
                                    text: keyword
                                }
                            ]
                        };
                        nodes.push(node1);
                    }
                    suggestNodes.push(nodes)
                }
                this.setData({nodes: suggestNodes})
            });
        }else{
            this.setData({suggestSongs: []})
        }
    },
    onUnload: function() {}
})