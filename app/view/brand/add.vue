<template>
<transition name="brand" enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
  <indoor v-model="brand">
    <back title="添加品牌案例"></back>
    <form-edit>
      <text-edit toggleTitle='false' title="标题"  v-model="brand.username"></text-edit>

      <!-- <text-edit toggleTitle='false'  v-model="brand.pwd" type="password"></text-edit> -->
      <cover v-model="brand.cover" ref="cover"></cover>
    </form-edit>
    <!-- <button @click="$refs.upload.show=true" >上传图片</button>
    <button @click="getsend()">async</button> -->
    <VueEditor :detail="brand.content" ref='detail'></VueEditor>
    <button @click="getAll()">sub</button>
  </indoor>
</transition>
</template>

<script>
  var schema=new Schema({
    username:{
      require:true,
      maxlength:30
    },
    pwd:{
      require:true,
      maxlength:10
    }
  })

export default {
  data() {
    return {
    //  brand:schema.getModel()
    brand:{
      username:'admin',
      pwd:"sdfaf",
      cover:'',
      content:'1215145214',
    }
    }
  },
  created() {
    //console.log(this.$route.query);


  },
  watch: {

  },
  methods: {
      async getsend(){
        let as=await this.fun.getData('http://localhost:2000/filetoken',{});
        console.log(as);
      },
      getAll(){
        console.log(this.$refs.detail.getContent());
        this.brand.content=this.$refs.detail.getContent();
        console.log(this.brand);
      }
  },
  events: {

  }
};
</script>
