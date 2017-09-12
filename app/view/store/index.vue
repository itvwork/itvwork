<template>
<indoor>
    <addbtn :btn="btn"></addbtn>
  <ul class="ul-model">

      <li class="item-model" v-for="(item,index) in list">
          <div class="outer-model">
              <div class="imgs">
                  <img :src="Api.storeimg + item.store_ewm"/>
              </div>
              <div class="info-bar">
                  <h2>{{item.store_name}}</h2>
                  <h3>{{item.store_phone}}</h3>
                  <p>{{item.store_address}}</p>

              </div>
              <div class="handle-bar">
                  <i class="icon-del" @click="del(item.id,index)"></i>
                  <router-link class="icon-add" title="添加车型" :to="{name:'storemodel',params:{id:item.id}}"></router-link>
                  <router-link class="icon-view" title="预览" :to="{name:'storeedit',params:{id:item.id}}"></router-link>
                  <router-link class="icon-edit" title="编辑" :to="{name:'storeedit',params:{id:item.id}}"></router-link>
              </div>
              <div class="clear"></div>
          </div>
      </li>
  </ul>

    <page ref="page"  sub=12 v-if="rows>12"  :rows.sync="rows"  ></page>
    <loading v-show="loading" :loading="loading"></loading>
    <vue-tips v-if="tips" :tips.sync="tips"></vue-tips>

</indoor>
</template>

<script>
import addbtn from '../../commpents/meun/addbtn';
export default {
    components: { addbtn },
    data() {
        return {
            btn: [{
                    type: 'link',
                    url: {name:'storeadd'},
                    name: '添加店铺',
                    class: 'btn-add-model'
                }
            ],
            list:[],
            rows:0,
            imgurl:'',
            loading:'',
            showpage:false,
            delid:'',
            delindex:'',
            tips:'',
        };
    },
    created() {
        let self=this;
       this.getdata();
       this.$root.uievent.$on('delstore',async function () {
           self.loading="删除中";
           self.$store.commit('uiclose',{type:'confirm'});
           let data=await this.$ajax.post(self.Api.storedel,{id:self.delid,token:self.$store.state.token});
           if(data.state==1){
               self.loading="";
               self.tips="删除成功";

               self.getdata();
           }else{
               self.loading="";
               self.tips="删除失败，已经删除，或不存在";
           }

       })
    },
    watch: {

        '$route': function(to, from) {
            if (this.$route.query.page) {

                this.getdata(this.$route.query.page);

            }else{
                this.getdata(1);
            }

            //   console.log(this.$route.query);
        }
    },
    methods: {
        async getdata(page){
            this.loading=true;
            let data=await this.$ajax.post(this.Api.storelist,{page:this.$route.query.page?this.$route.query.page:1,pageNum:12,token:this.$store.state.token});
            this.loading=false;
            let list =data.data;
            this.list=list.data;
            this.rows=list.total;
            this.showpage=true;


        },
        async del(id,index){
            this.delid=id;
            this.delindex=index;
            this.$store.commit('uishow',{
                 wrap:'warn',
                 title:'警告',
                 word:'是否删除该店铺',
                 type:'confirm',
                 even:'delstore',
                 isclose:true
            });
//            let data=await this.$ajax.post(this.Api.storelist,{id:id,token:this.$store.state.token});
//            console.log(data);
        }
    },
    events: {

    }
};
</script>
