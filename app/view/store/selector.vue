<template>
  <transition name="brand" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
<section class="pop-select-wrap">

    <h1>

            请选择要增加的车型
            <i class="icon-close" @click="close()"></i>

        </h1>

    <ul class="select-list">

        <li class="item" v-for="(item,index) in model">

            <label>


                    <img :src="item.img" />

                    <h3>{{item.name}}</h3>

                    <input type="checkbox" v-model="select" :value="index" />

                    <i class="icon-select " :class="{'icon-selected':contains(select,index),active:contains(select,index)}" ></i>

                </label>

        </li>



    </ul>

    <div class="group-bar">

        <button class="btn-sure" :class="{forbid:select.length<=0}" @click="sub()">确定</button>

    </div>



</section>
</transition>
</template>

<script>


export default {

    name: 'selector',
    props: {
        value:{
          default:''
        },
        show:{
          default:false
        },
    },
    data() {

        return {

            btn: [{

                type: 'link',

                url: '/admin/shop/add',

                name: '添加店铺',

                class: 'btn-add-model'

            }],

            model:[],
            select: [],
            selected:[],

        }

    },

    created() {
      this.getdata();

    },

    watch: {


    },

    methods: {
        async getdata(){
          let store_id=this.$route.params.id;
          let data=await this.$ajax.post(this.Api.storemodelNone,{storeId:store_id,pageNum:12,page:1,token:this.$store.state.token});
          let list=data.data.data;
          if(data.state==1){
             for(let i =0, len=list.length;i<len;i++){
               this.model.push(list[i]);
             }

          };



          console.log(data);
        },


        sub() {

            if(this.select.length<=0){
              return false;
            }
            for(let i=0;i<this.select.length;i++){
                  this.selected.push(this.model[this.select[i]]);
            }
            this.$emit('update:value', this.selected);
            let arr =[];
            for(let i =0;i< this.model.length;i++){
                  if(!this.contains(this.select,i)){
                        arr.push(this.model[i]);
                  }

            }

            this.model=arr;
            this.select=[];
            this.selected=[];
            this.close();



        },
        close:function(){
            this.$emit('update:show', false);

        },

        contains: function(arr, obj) {

            var i = arr.length;

            while (i--) {

                if (arr[i] == obj) {

                    return true;

                }

            }

            return false;

        }

    },

    events: {



    }

};
</script>
