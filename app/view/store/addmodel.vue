<template>
<indoor>
    <div class="shop-mess-top">
        <div class="left">
            <img src="/style/file/code.png" />
        </div>
        <div class="right">
            <h2>东风本田某店</h2>
            <p>地址地址地址地址地址地址地址地址</p>
        </div>
    </div>
    <h1 class="model-title-has">已经添加的车型</h1>
    <ul class="ul-model">
        <li class="item-model" v-for="(item,index) in hasModel">
            <div class="outer-model">
                <i class="icon-close"></i>
                <div class="imgs">
                    <img src="/style/file/car.jpg" />
                </div>
                <div class="info-bar">
                    <h2>{{item.name}}</h2>
                    <h3>{{item.share_title}}</h3>
                    <p>{{item.info}}</p>
                </div>
                <div class="handle-bar">
                    <a href="#" class="icon-view" title="查看"></a>
                    <a href="#" class="icon-code" title="生成二维码"></a>
                </div>
                <div class="clear"></div>
            </div>
        </li>
    </ul>
    <div class="page-btn"><button class="btn-add-model" @click="open()">添加车型</button>
        <!---->
    </div>
    <selector :value.sync="model" :show.sync="show_select" v-if="show_select"></selector>
      <confirm v-if="confirm" :show.sync="confirm" ></confirm>
</indoor>
</template>

<script>
import selector from './selector';

let schema = new Schema({
    shop_name: {
        tirm: false,
        rule: ['require', ['between', 10, 15]],
        msg: ['店名是必须', '店名必须在10-15个字符']
    },
    tel: {
        rule: ['require', 'phone'],
        msg: ['电话是必填的', '电话号码不正确']
    },
    addr: {
        rule: ['require'],
        msg: ['地址不能为空']
    }
})





export default {
    components: {
        selector
    },
    data() {
        return {
            btn: [{
                type: 'link',
                url: '/admin/shop/add',
                name: '添加店铺',
                class: 'btn-add-model'
            }],
            confirm:false,
            show_select: false,
            model: [],
            hasModel: []

        }
    },
    created() {
        this.schema = schema;

        //
        // console.log(this.$route);
    },
    watch: {

        '$route': function(to, from) {
            if (this.$route.query.page) {
                this.$refs.page.change({});
            }

            //   console.log(this.$route.query);
        },
        'model': function() {

            if (this.model.length <= 0) {
                return false;
            }
            for (let i = 0; i < this.model.length; i++) {
                this.hasModel.push(this.model[i]);
            }
            this.model = [];
        }

    },
    methods: {
        send: function() {
            let child = this.$refs.form.$children;
            for (let i = 0; i < child.length; i++) {
                if (child[i].rule) {
                    child[i].valtVal();
                }
            }

        },
        sub() {
            //console.log(this.$data);
        },
        open() {
            this.show_select=!this.show_select;


        }
    },
    events: {

    }
};
</script>
