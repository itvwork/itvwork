<template>

    <div class="page" >
       <!--<span v-if="curPage==1" class="forbid">上一页</span>-->
         <router-link  v-if="curPage>1" :to="prev">上一页</router-link>
       <template v-for="(item,index) in page">
          <span v-if="item.page==curPage" class="active">{{item.page}}</span>
          <router-link  v-if="item.page!=curPage" :to="item.url">{{item.page}}</router-link>
       </template>
         <!--<span v-if="countPages==curPage" class="forbid">下一页</span>-->
         <router-link  v-if="curPage<countPages" :to="next">下一页</router-link>
    </div>
</template>

<script>
export default {
    name: 'page',
    props:{
      rows:{

        default:0
      },
    pages:{

      default:10
    },
    cur:{

      default:1
    },
    sub:{

      default:15
    }
    },
    data(){
      return {
        page:[],
         showPages:this.$props.pages,
         curPage:this.$props.cur,
         pageurl:'',
         countPages:0,
         prev:'',
         next:''
      }


    },
    watch: {
        '$props.rows':function(){
            this.change();
        },
        '$route': function(to, from) {
            if (this.$route.query.page) {
                this.change();
            }
        }
    },
    created(){

         this.curPage=this.$route.query.page?parseInt(this.$route.query.page):1;
         this.change();
//         this.pagehtml();
    },
    methods: {

      change:function(){
          this.curPage=this.$route.query.page?parseInt(this.$route.query.page):1;
          let route=this.$route;
          let page={};
          if(route.name){
              page['name']=route.name;
          }else{
              page['path']=route.path;
          }
          if(JSON.stringify(route.params) !== "{}"){
              page['params']= JSON.parse( JSON.stringify(route.params))
          }
          if(JSON.stringify(route.query) !== "{}"){
              page['query']= JSON.parse( JSON.stringify(route.query));
              page['query']['page']=1;
          }else{
              page['query']={page:1};
          }
          this.pageurl=page;
          this.pagehtml();

      },
      pagehtml:function(){

        var count = this.$props.rows; //总条数，
         if(count<=0){
             return false;
         }
        var showPages = this.showPages; //显示页数
        var curPage = this.curPage; //当前页
        var subPages = this.$props.sub; //每页显示条数
        var url = this.pageurl; //url
        var countPages = Math.ceil(count / subPages); //总页数
        this.countPages=countPages;

        var page_url = []; //生成的链接数组

        if (countPages <= 1) { //当只一页或小于一页时 还生成个屁分页，浪费
            return false;
        }

        if (curPage > countPages) { //当前大于总页数时
            curPage = countPages;
        }

        //根据当前页计算前后页数
        var leftPage_num = parseInt(showPages / 2);
        var rightPage_num = showPages - leftPage_num;
        //左边显示数为当前页减左边该显示的数 例如总显示7页 当前页是5  左边最小为5-3  右边为5+3
        var left = curPage - leftPage_num;

        left = Math.max(left, 1); //左边最小不能小于1
        var right = left + showPages - 1; //左边加显示页数减1就是右边显示数
        right = Math.min(right, countPages); //右边最大不能大于总页数
        left = Math.max(right - showPages + 1, 1); //确定右边再计算左边，必须二次计算
        for (let i = left; i <= right; i++) {

           let urllink= JSON.stringify(this.pageurl);
            urllink=JSON.parse(urllink);
              urllink.query.page=i;

            page_url.push({
                page: i,
                url:urllink
            });
        }

        this.prev=page_url[0]['url'];
        this.next=page_url[page_url.length-1]['url'];
        this.page=page_url;



      }

    }

}
</script>
