<template>
<indoor>
<navbox></navbox>
<search>
    <addbtn :btn="btn" ></addbtn>
    <!--<vue-select></vue-select>-->
</search>
    <ul class="ul-model">
        <li class="item-model" v-for="(item,index) in list">
            <div class="outer-model">
                <div class="imgs">
                    <img :src="item.share_image?Api.storeimg+item.share_image:'/style/file/car.jpg'" />
                </div>
                <div class="info-bar">
                    <h2>{{item.model_name}}</h2>
                    <h3>{{item.share_title}}</h3>
                    <p>{{item.share_des}}</p>
                </div>
                <div class="handle-bar">
                    <i class="icon-del" @click="del(item.id,index)"></i>
                    <a href="#" class="icon-view" title="查看"></a>
                    <router-link class="icon-edit" title="编辑" :to="{name:'modeledit',params:{id:item.id}}"></router-link>
                </div>
                <div class="clear"></div>
            </div>

        </li>

    </ul>
    <loading v-show="loading" :loading="loading"></loading>
    <vue-tips v-if="tips" :tips.sync="tips"></vue-tips>

    <page ref="page"  sub=12 v-if="rows>12"  :rows.sync="rows"  ></page>
</indoor>
</template>

<script>
import addbtn from '../../commpents/meun/addbtn';
import navbox from './nav';
export default {
    components: { addbtn,navbox },
    data() {
        return {
            btn: [{
                    type: 'link',
                    url: '/admin/model/add',
                    name: '添加模型',
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

        }
    },
    created() {
        let self=this;
        this.getdata();
        this.$root.uievent.$on('delmodel',async function () {
            self.loading="删除中";
            self.$store.commit('uiclose',{type:'confirm'});
            let data=await this.$ajax.post(self.Api.modeldel,{id:self.delid,token:self.$store.state.token});
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
                this.$refs.page.change({});
            }

            //   console.log(this.$route.query);
        }
    },
    methods: {
        async getdata(page){
            this.loading="加载中…";
            let data=await this.$ajax.post(this.Api.modellist,{page:this.$route.query.page?this.$route.query.page:1,pageNum:12,token:this.$store.state.token});
            this.loading=false;
            let list =data.data;
            this.list=list.data;
            this.rows=list.total;
            this.showpage=true;
//            this.$refs.page.change({row:this.rows});
        },
        async del(id,index){
            this.delid=id;
            this.delindex=index;
            this.$store.commit('uishow',{
                wrap:'warn',
                title:'警告',
                word:'是否删除该模型',
                type:'confirm',
                even:'delmodel',
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
