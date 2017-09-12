<template>

    <div class="crumbs" v-if="isShow">
    <template v-for="(item,index) in crumb">
           <router-link :to="{path:item.path}" >{{item.title}}</router-link>
    </template>
    <span>{{now}}</span>

    </div>
</template>
</section>
<script>
export default {
    name: 'crumbs',

    data(){
      return {
        isShow:true,
        crumb:[],
        now:''
      }

    },
    created(){

       if(this.$route.name=="home" ){
              this.isShow=false;
       }
       this.getpath();

    },
    methods: {
      getpath:function(){
        this.crumb=[];
        this.now=this.$route.meta.title;

         let urllist=this.$route.matched;
         let len=urllist.length;

         if(len>1){
             for(let i =0;i<len-1;i++){
               if(urllist[i]['meta']['title']!=this.now){
                 this.crumb.push({
                     path:urllist[i]['path'],
                     title:urllist[i]['meta']['title']
                 })
               }

             }

         }




      }
    },
    watch: {

        '$route':function(to,from){


          if(to.name=="home" ){
               this.isShow=false;
          }else{
               this.isShow=true;
                this.getpath();
          }


        },


    }

}
</script>
