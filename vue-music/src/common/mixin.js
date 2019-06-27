import {mapGetters,mapMutations,mapActions} from 'vuex'

export const searchMixin = {
  data() {
    return {
      query:'',
      refreshDalay:120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query){
      // console.log(query)
      this.query = query.trim()
    }
  },
  blurInput(){
    // 要是$emit没传参，可以用更简单得方法来调用子组件的方法
    this.refs.searchBox.blur()
  },
  addQuery(query){
    this.refs.searchBox.setQuery(query)
  },
  saveSearch(song){
    console.log(song);
    this.selectPlaySong(song)
    this.saveSearchHistory(query)
  },
  
  ...mapActions([
    'saveSearchHistory',
    'selectPlaySong'
  ])
}