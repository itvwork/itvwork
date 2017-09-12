<template>
<div class="row-label">
  <!-- <span class="row-title" v-if="toggleTitle==1" :style="{width:tw}">{{title}}</span>
  <span class="text-outdoor">
      <input :type="inputType"  class="input-text" :placeholder="tips" ref="input"  :value="value"  @input="updateValue($event.target.value)"  />
      <i class="clear-word"  @click="clear()" v-if="value&&(type!='password')"></i>
      <i :class="{'icon-view-pwd':(inputType=='password'),'icon-hide-pwd':(inputType!='password')}"  v-if="value&&(type=='password')"   @click="inputType!='password'?inputType='password':inputType='text' "></i>
      <em class="err-msg">帐号错误</em>
  </span> -->
  <pic ref="covers"  v-model="images" ></pic>
  <div class="cover-box" @click="$refs.covers.show=true">
        <img src="images" :src="cover" />
        <i class="icon-cover" v-if="!cover"></i>
        <p class="title" v-if="!cover">{{title}}</p>
        <p class="cover-info" v-if="!cover">{{info}}</p>
  </div>
  <input type="hidden" ref="input" :value="value" />

</div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '上传封面'
    },
    info: {
      type: String,
      default: '尺寸限580X340PX , 大小限100K以内'
    },
    value:{
      type:String,
      default:''
    }
  },
  computed: {

  },
  data() {
    return {
      images:'',
      cover:''
    }
  },
  watch:{
    images:function (val, oldVal) {
       let url=JSON.parse(val)[0]['_id'];
       this.cover='http://orvg4jqcj.bkt.clouddn.com/'+url;
       this.updateValue(url);
   }
 },
  methods: {
    get:function(){

    },
    updateValue: function(value) {
      this.$refs.input.value = value;
      this.$emit('input', value);
    },
    clear: function() {
      // this.$refs.input.value = "";
      // this.$emit('input', "")
    }
  }
};
</script>
