<template>
  <div>
    <h1 class="logo">cnodejs Api Test</h1>
    <ul class="list">
      <li v-for="item in lists" v-text="item.title"></li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lists:[{
        id:1,
        title:"你是谁，我再测试一下"
      },{
        id:2,
        title:"del--------------"
      }]
    }
  }
}
</script>
