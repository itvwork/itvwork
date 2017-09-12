<template>
<indoor>
    <form-edit>
      <input-text toggleTitle=1 title="模型名称：" isDisabled=true  :value.sync="shop.name" tw="1rem"></input-text>
      <input-text toggleTitle=1 title="店铺名称："  :value.sync="shop.name" tw="1rem"></input-text>
      <input-text toggleTitle=1 title="电话号码：" :value.sync="shop.tel"   tw="1rem"></input-text>
      <input-text toggleTitle=1 title="店铺地址：" :value.sync="shop.addr"   tw="1rem"></input-text>
      <code-box  :value.sync="shop.code"   toggleTitle=1  tw="1rem" title="上传二维码"  ></code-box>
    </form-edit>


    <addbtn :btn="btn"></addbtn>
    <page ref="page" url="/admin/model/index"  page=20></page>


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
                    url: '/admin/shop/add',
                    name: '添加店铺',
                    class: 'btn-add-model'
                }
            ],
            shop:{
              name:"",
              tel:'',
              code:'',
              addr:''
            }

        }
    },
    created() {
        //console.log(this.$route.query);


        //   this.$on('page',function(msg){
        //      console.log(msg);
        //   })


        console.log(this.$route);
    },
    watch: {
        username: function(val, oldval) {
            console.log(this.login);
        },
        '$route': function(to, from) {
            if (this.$route.query.page) {
                this.$refs.page.change({});
            }

            //   console.log(this.$route.query);
        }
    },
    methods: {

        sub() {
            console.log(this.$data);
        }
    },
    events: {

    }
};
</script>
