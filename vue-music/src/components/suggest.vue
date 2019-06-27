<template>
  <v-scroll ref="suggest" class="suggest" :data="result" :pullup="pullup" :beforeScroll="beforeScroll" 
  @scrollToEnd="searchMore" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i class="icon">&#xe641;</i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p> 
        </div>
      </li>
      <!-- <loading v-show="hasMore" class="loading-wraper"></loading> -->
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <span>抱歉，暂无搜索结果</span>
    </div>

  </v-scroll>
</template>

<script>
const limit = 20  //控制请求回来的数据有多少条
import api from '@/api/index'
import scroll from '@/components/scroll'
export default {
  name:'suggest',
  props:{  //从父组件得到的数据
    query:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      page:1,
      pullup:true,
      beforeScroll:true,
      hasMore:true,
      result:[]
    }
  },
  methods: {
    getDisplayName(item){
      return `${item.name}-${item.artists[0]&&item.artists[0].name}`
    },
    refresh(){
      this.$refs.suggest.refresh() //better-scroll自带方法
    },
    fentchResult(page){
      const params = {
        limit,
        offset:page-1,  //这两个是网易云的接口
        keywords:this.query
      }
      api.MusicSearch(params).then(res=>{
        if(res.code === 200){ 
          // console.log(res) 打印出数据
          // 把数据渲染到页面上
          // this.result.push(res.result.songs)
          // 数组的合并  把res.result.songs 加到this.result数组里
          this.result = [...this.result,...res.result.songs] //为了下拉加载更多的时候请求数据的时候可以再次发起请求，并且保证前面的数据还在
          this._checkMore(res.result)
        }
      })
    },
    selectItem(item){
      this.$emit('select',item)
    },
    _checkMore(data){
      if(data.songs.length<12 || (this.page -1)*limit >= data.songCount){
        this.hasMore = false
      }
    },
    searchMore(page){
      if(!this.hasMore){
        return
      }
      this.page++
     
      this.fentchResult(this.page)
    },
    listScroll(){
      this.$emit('listScroll')
    },
    search(){
      this.page=1
      this.hasMore=true
      this.$refs.suggest.scrollTo(0,0)
      this.result=[]
      this.fentchResult(this.page)
    }
  },
  watch: {
    query(newQuery){
      if(!newQuery){
        return
      }
      this.search(newQuery)
    }
  },
  components:{
    'v-scroll':scroll
  }
}
</script>

<style scoped lang="stylus">
@import "../assets/css/function.styl"
.suggest 
  height 100%
  overflow hidden
  .suggest-list 
    padding 0 px2rem(60px)
    .suggest-item 
      display flex
      align-items center
      line-height px2rem(80px)
    .icon 
      flex 0 0 px2rem(60px)
      width px2rem(60px)
      font-size 14px
      color hsla(0,0%,100%,.3)
    .name 
      flex 1
      font-size 14px
      color hsla(0,0%,100%,.3)
      overflow hidden
      .text 
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
    .loading-wraper 
      height px2rem(80px)
  .no-result-wrapper 
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
    span 
      font-size 14px
      color hsla(0,0%,100%,.3)
</style>

