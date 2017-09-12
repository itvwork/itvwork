<template>
<indoor>
    <form-edit ref='form'>
      <input-text toggleTitle=1 title="模型名称："  tips="请输入模型名称"  :value.sync="data.model_name"  :schema="schema" rule="model_name"  tw="1rem"></input-text>
        <input-text toggleTitle=1 title="模型路径："  tips="请入模型路径"  :value.sync="data.url" :schema="schema" rule="url" tw="1rem"></input-text>
        <input-text toggleTitle=1 title="分享题标："  tips="请输入分享标题"  :value.sync="data.share_title"  :schema="schema" rule="share_title" tw="1rem"></input-text>
        <textarea-edit toggleTitle=1 title="分享简介："  tips="请输入分简介"  :value.sync="data.share_des" :schema="schema" rule="share_des" tw="1rem"></textarea-edit>
          <code-box  :value.sync="data.share_image"   toggleTitle=1  tw="1rem" title="分享图片" :schema="schema" rule="share_image"    ></code-box>
        <div class="sub-bar" style="padding-left: 1.3rem">
            <button  class="btns btn-sub" @click="send()">{{subword}}</button>
        </div>
    </form-edit>
    <vue-tips :tips.sync="tips" v-if="tips"></vue-tips>
</indoor>
</template>
<script>
import addbtn from '../../commpents/meun/addbtn';

let schema ={
   model_name:{
     tirm:false,
     rule:['require',],
     msg:['模型的图片是必须的']
  },
  url:{
    rule:['require'],
    msg:['模型的路径是必须的']
  },
  share_title:{
    rule:['require'],
    msg:['分享标题不能为空']
  },
    share_des:{
        rule:['require'],
        msg:['分享简介不能为空']
    },
    share_image:{
        rule:['require'],
        msg:['分享图片不能为空']
    }
};


export default {
    components: { addbtn },
    data() {
        return {

            data:{
                model_name:"",
                share_title:'',
                share_des:'',
                share_image:'',
                url:''
            },

            model:[],
            map:{
                geocoder:'', map:'', marker:''
            },
            forbid:true,
            subword:"提交",
            schema:new Schema(schema,this),
            tips:''
        }
    },
    created() {
        let self=this;
        this.$root.uievent.$on('addmodel',function () {
            self.$store.commit('uiclose',{type:'confirm'});
            self.$router.push({
                name:'modeladd'
            })
        });
        this.$root.uievent.$on('close',function () {
            self.$store.commit('uiclose',{type:'confirm'});
            self.data={
                model_name:"",
                share_title:'',
                share_des:'',
                share_image:'',
                url:''
            };
            self.subword='提交'

        });

    },
    watch: {

        '$route': function(to, from) {
            if (this.$route.query.page) {
                this.$refs.page.change({});
            }

        }

    },
    methods: {
      async send(){
          if(this.subword=="数据提交中…"){
              return false;
          }


          if(!this.schema.allvalt()){
                return false;
        }


        this.subword="数据提交中…"
         let data =await this.$ajax.post(this.Api.modeladd,{data:this.data,token:this.$store.state.token});
          if(data.state==1){
              this.$store.commit('uishow',{
                  wrap:'success',
                  title:'添加成功,返回列表,或继续添加',
                  btnsure:'返回列表',
                  btnclose:'继续添加',
                  type:'confirm',
                  even:'addmodel'
              });
          }else{
              this.tips=data.msg;
          }



      }

    },
    events: {

    }
};
</script>
