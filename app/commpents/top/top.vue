
<template>
<div class="top">
  <router-link :to="add"  class="add-link"><i class="icon-add"></i></router-link>
  <span :style='{display:hideinput}' class="search-outdoor"><input type="text" :placeholder="tips" class="input-search" /><i class="icon-search"></i></span>
  <div class="oper-right" :style='{display:hideoper}'>
    <label :class="{active:checked}">
      <i class="icon-checkbox"></i>
      <input type="checkbox" v-model="checked"   >
      全选
    </label>
      <button class="btn-del">删除</button>
  </div>
</div>
</template>
<script>
export default {
     props: {
       add:{
         type:String,
         default:'/admin'
       },
       tips:{
         type:String,
         default:'请输入搜索关键字'
       },
       hideinput:{
          type:String,
          default:''
       },
       hideoper:{
         type:String,
         default:''
       }

    },
    data(){
      return{
        checked:false
      }
    },
    computed: {

    },

    methods: {
      updateValue: function (value) {
          this.$refs.input.value = value;
          this.$emit('input', value)
      },
      clear:function(){
          this.$refs.input.value = "";
          this.$emit('input', "")
      }
    }
};



</script>
