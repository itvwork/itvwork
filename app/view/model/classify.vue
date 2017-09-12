<template>

    <indoor>
     <navbox></navbox>
        汽车分类
  <addbtn :btn="btn"></addbtn>
    </indoor>

</template>

<script>
import addbtn from '../../commpents/meun/addbtn';
import navbox from './nav';
export default {
  components: { addbtn,navbox },
    data() {
        return {
          btn: [{
                  type: 'link',
                  url: '/admin/model/add',
                  name: '添加模型',
                  class: 'btn-add-model'
              }
          ]



        }
    },
    created(){
      //console.log(this.$route.query);


    //   this.$on('page',function(msg){
    //      console.log(msg);
    //   })



    },
    watch: {
        // username: function(val, oldval) {
        //     console.log(this.login);
        // },
        // '$route':function(to,from){
        //     if(this.$route.query.page){
        //           this.$refs.page.change({});
        //     }
        //
        // //   console.log(this.$route.query);
        // }
    },
    methods: {


    },
    events: {

    }
};
</script>
