<template>
<div class="row-label">

  <span class="row-title" v-if="toggleTitle==1" :style="{width:tw}">{{title}}</span>
    <div class="cover-right">
        <div class="code-box" >
            <img  :src="value" v-show="value" />
            <i class="icon-plus" v-if="!value"></i>
            <input type="file" @change="upload" />
        </div>

        <em class="err-msg" v-if="err!==true">{{err}}</em>
    </div>




</div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '上传封面'
    },
    info: {
      type: String,
      default: '尺寸限580X340PX , 大小限100K以内'
    },
    value:{

      default:''
    },
    toggleTitle:{

      default:0
    },
    tw: {
      type: String,
      default: '.8rem'
    },
      schema:{
          default:false
      },
      rule:{
          default:false
      },
  },
  computed: {

  },
  data() {
    return {
      images:'',
      cover:'',
      showurl:this.$props.value,
        err:''
    }
  },
  watch:{
    images:function (val, oldVal) {
       let url=JSON.parse(val)[0]['_id'];
       this.cover='http://orvg4jqcj.bkt.clouddn.com/'+url;
       this.updateValue(url);
   },

 },
    created(){
        if(this.showurl){
            if(this.showurl.length<100){

                this.showurl=Api.storeimg+this.showurl;
            }
        }
    },
  methods: {
    async upload(e){

        let img =await this.fun.base64(200,e.target.files,1);
        this.showurl=img[0]['url'];
        this.cover=img[0]['url'];
        e.target.value="";
        this.$emit('update:value', this.cover);
        if(this.schema){
            this.err=this.schema.single(this.rule,this.cover);
        }


    },
      valtVal:function(){
          this.err=this.schema.single(this.rule,this.value);
      },
      showErr:function(err){
          this.err=err;
      }

  }


};
</script>
