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
const limit = 20
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
          console.log(res)
        }
      })
    },
    searchMore(){},
    listScroll(){},
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

<style>

</style>
