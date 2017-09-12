<template>
  <section class="home-page">
      <h2 class="page-title">数据统计</h2>
     <ul class="ul-stat">
        <li>
            <h3>商家数</h3>   
            <p>1,201,254</p> 
            <span>2017年</span>
        </li>
        <li>
           <h3> 模型数 </h3>

             <p>1,201,254</p>  
              <span>2017年</span>
        </li>
        <li>
          <h3>访问量</h3>
         <p>1,201,254</p>  
           <span>2017年</span>
        </li>
     </ul>
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
    created(){

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
