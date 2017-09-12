<template>


      <div class="page-btn">
       <template v-for="(item,index) in btn">
             <router-link :class="item.class"  v-if="item.type=='link'" :to="item.url">{{item.name}}</router-link>
             <button  v-if="item.type=='btn'" >{{item.name}}</button>

       </template>
      </div>


</template>
</section>
<script>
export default {
    name: 'addbtn',
    props:{
    btn:{

      default:''
    },

    },
    data(){
      return {

      }

    },
    created(){


    },
    methods: {

    }

}
</script>
