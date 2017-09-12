<template>
<section  @resize="size($event)" class="wrap-box" @dragleave="dragleave($event)" @drop="drop($event)" @dragenter="dragenter($event)" @dragover="dragover($event)">
    <div class="left-box-meun" v-show="navshow">
        <div class="logo-admin" >
            微改车
        </div>
        <menu>
            <div class="item-menu">
                <router-link to="/admin/index"><i class="icon-home"></i>首页</router-link>
            </div>
            <div class="item-menu">
                <router-link to="/admin/model" ><i class="icon-brand"></i>汽车模型</router-link>
                <div class="meun-sub">
                    <router-link to="/admin/model/index">模型列表</router-link>
                    <router-link to="/admin/model/brand">汽车品牌</router-link>
                    <router-link to="/admin/model/classify">汽车分类</router-link>

                </div>
            </div>
            <div class="item-menu">
                <router-link :to="{name:'store'}"> <i class="icon-brand"></i>店铺管理</router-link>
            </div>
        </menu>
    </div>
    <div class="message-bar">
          <div class="user-bar">
            <i class="user-header"  @click="userMess=!userMess" ><img src="/style/file/header.jpg" /></i>
            <span class="user-word">欢迎：admin </span>
            <div class="message-user-box" v-show="userMess">
              <div class="message-user-indoor">
                <i class="triangle"></i>
                <span>修改密码</span>
                <span>设置信息</span>
                <span>退出</span>
              </div>
            </div>
          </div>
          <i class="icon-nav" @click="navshow=!navshow"></i>
    </div>

    <section class="right-box">
         <crumbs></crumbs>
         <router-view></router-view>
    </section>
    <!-- <div class="loading" v-if="$store.state.loading">
        <div class="bg-loading" v-if="$store.bg"></div>
        <span>loading</span>
    </div> -->

    <alert></alert>
    <confirm></confirm>

</section>
<!-- <form-edit>
    <text-edit type="text" v-model="username"></text-edit>
    <textarea v-model="login.pwd"></textarea>
    <editor ref="editors"></editor>
    <editor id="e4" ref="editor"></editor>
    <button @click='sub()'>提交</button>
    <ul>
      <li>{{username}}</li>
    </ul>
    <input type="text" v-model="username" />
  </form-edit> -->
</template>

<script>
export default {
    data() {
        return {
            login: {
                username: 'admmin',
                pwd: '123'
            },
            username: 'adminstreis',
            navshow:true,
            userMess:false,
            bg:false
        }
    },
    created(){

      var width=document.body.offsetWidth
      if(width<=780){
          this.navshow=false;
      }

      document.addEventListener('click',function(e){

      },false)

    },
    mounted(){
      let self=this;
      window.onresize = function temp() {
        var width=document.body.offsetWidth
        if(width<=780){
            self.navshow=false;
        }else{
            self.navshow=true;
        }
        };



    },

    watch: {
        username: function(val, oldval) {
            console.log(this.login);
        },
        '$route': function(to, from) {
          var width=document.body.offsetWidth
          if(width<=780){
              this.navshow=false;
          }

        },
        '$store.state.bg':function(){
          console.log('store----------');
        }
    },
    methods: {
        sub() {
            console.log(this.$data);
        },
        dragleave:function(e){    //拖离
            e.preventDefault();
        },
        drop:function(e){  //拖后放
            e.preventDefault();
        },
        dragenter:function(e){    //拖进
            e.preventDefault();
        },
        dragover:function(e){    //拖来拖去
            e.preventDefault();
        },
        tiggle:function(e){
            e.preventDefault();
        },
        size(e){
          console.log('navs');
        }

    },
    events: {

    }
};
</script>
