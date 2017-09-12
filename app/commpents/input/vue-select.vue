<template>
<div class="vue-select-outer">
          <select class="vue-select">
            <option value ="volvo">Volvo</option>
            <option value ="saab">Saab</option>
            <option value="opel">Opel</option>
            <option value="audi">Audi</option>
          </select>
</div>


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
