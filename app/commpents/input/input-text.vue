<template>
<label class="row-label">
  <span class="row-title" v-if="toggleTitle==1" :style="{width:tw}">{{title}}</span>
  <span class="text-outdoor">
      <input :type="inputType" :id="id"  :value="value"   :disabled='isDisabled' class="input-text" :placeholder="tips"   ref="input"   @input="updateValue($event.target.value)"  />
      <i class="clear-word"  @click="clear()" v-if="value&&(type!='password')&&(!isDisabled)" ></i>
      <i :class="{'icon-view-pwd':(inputType=='password'),'icon-hide-pwd':(inputType!='password')}"  v-if="value&&(type=='password')&&(!isDisabled)"   @click="inputType!='password'?inputType='password':inputType='text' "></i>
      <em class="err-msg" v-if="err!==true">{{err}}</em>
  </span>
</label>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '标题'
    },
    tips: {
      type: String,
      default: '请输入内容'
    },
    type: {
      type: String,
      default: 'text'
    },
    tw: {
      type: String,
      default: '.1rem'
    },
    toggleTitle: {
      type: String,
      default: '0'
    },
    isDisabled:{

      default:false
    },
    schema:{
      default:false
    },
    rule:{
      default:false
    },
    valtEvent:{

    }
  },
  computed: {

  },
  data() {
    return {
      inputType: this.$props.type,
      newvalue:this.$props.value,
      err:'',
      id:'input-'+parseInt(Math.random()*1000)+'-'+parseInt(Math.random()*1000)
    }
  },
  watch: {

  },
  methods: {
    updateValue: function(value) {
       if(this.schema){
          this.err=this.schema.single(this.rule,value);
        }
       this.$emit('update:value', value);
    },
    valtVal:function(){
        this.err=this.schema.single(this.rule,this.value);
        return this.err;
    },
    showErr:function(err){
        this.err=err;
    },
    focus:function(){
            document.getElementById(this.id).focus();
    },
    clear: function() {
      this.$refs.input.value = "";
      this.$emit('update:value', "");
    }
  }
};
</script>
