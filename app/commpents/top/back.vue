
<template>
<div class="top-back">
      <button class="btn-back" @click="$router.go(-1)"><i class="icon-back"></i>返回</button>
      <span>{{title}}</span>
</div>
</template>
<script>
export default {
     props: {
       title:{
         type:String,
         default:'标题'
       }
    },

};



</script>
