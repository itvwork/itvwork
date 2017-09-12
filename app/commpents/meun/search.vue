<template>
  <div class="top-bar-module">


     <slot></slot>
    <div class="serach-outer">
      <i class="icon-search"></i>
      <input type="text" placeholder="请输入搜索的关健字"  />
    </div>
  </div>
</template>
</section>
<script>
export default {
    name: 'search',
    data(){
      return {
        isShow:true,
        crumb:[],
        now:''
      }
    },
    created(){


    },
    methods: {

    },
    watch: {


    }

}
</script>
