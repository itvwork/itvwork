<template>
<section>
    <top></top>
    <span>bc-content</span>
    <alert ref="alert" @alert="change"></alert>
    <confirm close=null content="你确定要删除该条数据？"></confirm>
    <button  @click="open()">打开</button>
</section>
</template>

<script>
export default {
    data() {
        return {
            login: {
                username: 'admmin',
                pwd: '123'
            },
            username: 'adminstreis'
        }
    },
    created() {

    },
    watch: {
        username: function(val, oldval) {
            console.log(this.login);
        }
    },
    methods: {
        open: function() {
            this.$refs.alert.open(1);
        },
        sub:function() {
            console.log(this.$data);
        },
        change:function(value){
          console.log(value+'-----------');

        }

    }

};
</script>
