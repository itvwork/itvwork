<template>
<section class="login-bg">
    <div class="login-box">
        <h2 class="login-logo">微改车
        </h2>
        <ul class="ul-login">
            <li class="item-login"><input v-model="sub.admin_name"  class="input-login" type="text" placeholder="请输入登录帐号" />

            </li>
            <li class="item-login"><input v-model="sub.admin_password"  class="input-login" type="password" placeholder="请输入登录密码" /></li>

              <p class="err-msg">{{err_msg}}</p>
        </ul>
        <div class="btn-box">
            <button class="btn btn-login" @click="submit()">{{stateWord}}</button>
        </div>
    </div>
</section>
</template>
<script>
let schema =new Schema({
   admin_name:{
     tirm:false,
     rule:['require'],
     msg:['用户名不能为空']
  },
  admin_password:{
    rule:['require'],
    msg:['用户密码不能为空']
  }
})

export default {
    data() {
        return {
            sub:{
              admin_name: 'admin',
              admin_password: 'admin'
            },
            stateWord:'登录',
            err_msg:'登录失败',
            state:0

        }
    },
    ready() {

    },
    components: {

    },
    watch: {



    },
    methods: {
        async submit() {
            sessionStorage.setItem("wgctokens", 'admin');
            sessionStorage.setItem("wgc_admin_username",'admin');
            this.$router.push({name:'/admin'});
            return false;


            let username=schema.single("admin_name", this.sub.admin_name);
            let pwd=schema.single("admin_password", this.sub.admin_password);
            if(username!==true){
                this.err_msg=username;
                return false;
            }
            if(pwd!==true){
                this.err_msg=pwd;
                return false;
            }
            if(this.state==1){
              return false;
            }
            this.state=0;


            let ret=await this.$ajax.post(Api.login,this.sub);
            if(ret.state==1){
              sessionStorage.setItem("wgctokens", ret.data.api_token);
              sessionStorage.setItem("wgc_admin_username",ret.data.admin_name);
              this.$store.state.token=ret.data.api_token;
              this.$store.state.admin=ret.data.admin_name
              this.$router.push({name:'/admin'});
            }else{

            }


        }

    },
    events: {

    }
};
</script>
