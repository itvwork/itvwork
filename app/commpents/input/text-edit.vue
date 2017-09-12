<template>
<label class="row-label">
  <span class="row-title" v-if="toggleTitle==1" :style="{width:tw}">{{title}}</span>
  <span class="text-outdoor">
      <input :type="inputType"  class="input-text" :placeholder="tips" ref="input"  :value="value"  @input="updateValue($event.target.value)"  />
      <i class="clear-word"  @click="clear()" v-if="value&&(type!='password')"></i>
      <i :class="{'icon-view-pwd':(inputType=='password'),'icon-hide-pwd':(inputType!='password')}"  v-if="value&&(type=='password')"   @click="inputType!='password'?inputType='password':inputType='text' "></i>
      <em class="err-msg">帐号错误</em>
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
    name: {
      type: String,
      default: 'username'
    },
    type: {
      type: String,
      default: 'text'
    },
    toggleTitle: {
      type: String,
      default: '0'
    }
  },
  computed: {

  },
  data() {
    return {
      inputType: this.$props.type
    }
  },

  methods: {
    updateValue: function(value) {
      this.$refs.input.value = value;
      this.$emit('input', value)
    },
    clear: function() {
      this.$refs.input.value = "";
      this.$emit('input', "")
    }
  }
};
</script>
