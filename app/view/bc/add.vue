<template>

  <span>  add-bc-content</span>


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
  watch: {
    username: function(val, oldval) {
      console.log(this.login);
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
