<template>
    <indoor>
        <form-edit ref='form'>
            <input-text toggleTitle=1 title="店铺名称："  tips="请输入店铺名称"  :value.sync="shop.store_name"  :schema="schema" rule="store_name"  tw="1rem"></input-text>
            <input-text toggleTitle=1 title="联系人(可不填)："  tips="请输入联系人姓名"  :value.sync="shop.store_contact" tw="1rem"></input-text>
            <input-text toggleTitle=1 title="电话号码："  tips="请输入联系电话"  :value.sync="shop.store_phone" :schema="schema" rule="store_phone" tw="1rem"></input-text>
            <input-text toggleTitle=1 title="店面地址：" ref='addr'  tips="请输入地址至少要到区"  :value.sync="shop.store_address" :schema="schema" rule="store_address"  tw="1rem"></input-text>
            <code-box  v-if="shop.store_ewm" :value.sync="shop.store_ewm"   toggleTitle=1  tw="1rem" title="上传二维码"   ></code-box>

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
        store_name:{
            tirm:false,
            rule:['require',['between',3,20]],
            msg:['店名是必须','店名必须在10-15个字符']
        },
        store_phone:{
            rule:['require','alltel'],
            msg:['电话是必填的',"请输入正确的电话号码，固话，手机，400电话"]
        },
        store_address:{
            rule:['require'],
            msg:['地址不能为空']
        }
    };

    let geocoder, map, marker = null;
    geocoder = new qq.maps.Geocoder();

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
                    store_name:"",
                    store_phone:'',
                    store_ewm:'',
                    store_contact:'',
                    store_address:'',
                    latlng:'',
                    id:''

                },
                original:{

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
        beforeCreted(){

        },
        created() {
            this.getData();

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
            async send(){
                let self=this;
               if(JSON.stringify(this.shop)==JSON.stringify(this.original)){
                    this.tips="数据没有更改，不能提交";
                   return false;
               }

                if(!this.schema.allvalt()){
                    return false;
                }

                if(!await this.codeAddress(this.shop.store_address)){
                    this.$refs.addr.showErr('你填写的地址错误，不能在地图上找到');
                    return false;
                }

                let data =await this.$ajax.post(Api.storeUpdata,{data:this.shop,token:this.$store.state.token});
                if(data.state==1){
                    this.tips="修改成功，3秒后自动返回列表";
                    setTimeout(function () {
                        self.$router.push({name:'modelList'});
                    },3000)

                }else{
                    this.tips="修改失败，"+data.msg;
                }

            },
            async getData(){
                let id=this.$route.params.id;
                let data= await this.$ajax.post(this.Api.storeDetail,{data:{id:id},token:this.$store.state.token});
                if(data.state==1){
                        this.shop=data.data;
                        this.shop.store_ewm=this.Api.storeimg+data.data.store_ewm;
                        this.shop.id=id;
                        this.original=JSON.parse(JSON.stringify(this.shop));
                }

            },
            sub() {

            },
            codeAddress(address) {
                let self=this;
                return new  Promise(function(resolve,reject){
                    geocoder.getLocation(address);
                    //设置服务请求成功的回调函数
                    geocoder.setComplete(function (result) {
                        self.shop.latlng=result.detail.location.lat + ',' + result.detail.location.lng;
                        return resolve(true);
                    });
                    geocoder.setError(function (result) {
                        self.shop.latlng="";
                        reject(false);

                    });
                })
            }
        },
        events: {

        }
    };
</script>
