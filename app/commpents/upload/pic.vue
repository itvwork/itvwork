
<template>
<transition name="brand" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
    <section class="upload-wrap" v-if="show" ref="chnage" >
        <div class="upload-wrapin">
            <h2>
          <span :class="{active:status==1}" @click="status=1">上传图片</span>
          <span :class="{active:status==2}" @click="status=2">在线图片</span>
          <i class="icon-close" @click="show=false"></i>
        </h2>
            <div v-show="status==1" class="upload-tab" @dragover="allowDrop($event)" @drop="drap($event)">
              <img :src="img" width="100" height="100" />
                <i class="icon-pic"></i>
                <p>将图片拖拽到此处可以上传</p>
                <label><input type="file"  :multiple="multiple"  @change="tapUpload" />上传图片</label>
                <span>{{tips}}</span>
            </div>
            <div v-show="status==2" class="list-tab">
                <ul class="list-pic">
                    <li class="pic-item">
                        <label @click="stop" :class="{checked:radio==1||ischeckbox(1)}">

                          <div class="show-img">  <img src="/style/file/brand.png"></div>
                        <div class="pic-check ">
                          <i class="icon-check" :class="{active:radio==1||ischeckbox(1)}"></i>
                          <p>200*300</p>
                        </div>
                        <input v-if="num>1" type="checkbox" value="1" v-model="checkbox" />
                        <input v-if="num<=1" type="radio" name="pic" value="1" v-model="radio" />
                        </label>
                    </li>
                    <li class="pic-item">
                        <label @click="stop" :class="{checked:radio==2||ischeckbox(2)}">
                          <div class="show-img">  <img src="/style/file/brand.png"></div>
                        <div class="pic-check ">
                          <i class="icon-check" :class="{active:radio==2||ischeckbox(2)}"></i>
                          <p>200*300</p>
                        </div>
                        <input v-if="num>1" type="checkbox" value="2" v-model="checkbox"  />
                        <input v-if="num<=1" type="radio" name="pic" value="2" v-model="radio" />
                        </label>
                    </li>
                    <li class="pic-item">
                        <label @click="stop" :class="{checked:radio==2||ischeckbox(2)}"  >

                          <div class="show-img">  <img src="/style/file/brand.png"></div>
                        <div class="pic-check ">
                          <i class="icon-check" :class="{active:radio==3||ischeckbox(3)}"></i>
                          <p>200*300</p>
                        </div>
                        <input v-if="num>1" type="checkbox"  value="3" v-model="checkbox"  />
                        <input v-if="num<=1" type="radio" name="pic" value="3" v-model="radio" />
                        </label>
                    </li>
                </ul>
            </div>
        </div>
        <input type="hidden" ref="input"  :value="images"  />
    </section>
</transition>
</template>
<script>
export default {
    props: {
        num: {
            type: Number,
            default: 2
        },
        width: {
            type: Number,
            default: 1600
        },
        images:{
          type:String,
          default:''
        },
        multiple:{
          type:String,
          default:'false'
        }

    },
    computed: {

    },
    data() {
        return {
            show: false,
            status: 1,
            img:'',
            tips:'',
            radio:'',
            checkbox:[]
        }
    },
    created() {


    },
    methods: {
        allowDrop: function(event) {
            event.preventDefault();
        },
        async drap(event) {
            event.preventDefault();
            var self=this;
            var file = event.dataTransfer.files; //获取文件
            if(file.length>this.$props.num){
              this.tips="只能上传"+this.$props.num+'张图片';
              return false;
            }
            var img=await this.fun.base64(this.width,file);

            this.upload(img);

        },
        async upload(img){
            let len=img.length;
            let data=[];

            let token = await this.fun.getFileToken();

             for(let i = 0;i<len;i++){
                  let as=await this.fun.putData64(token.token,img[i].data);
                  data.push({_id:as.key,time:this.fun.time()});
                  console.log(as);
             }

            let dataToken=await this.fun.getDataToken();
                console.log(dataToken);

            let subdata={
               subdata:data,
               dataToken:dataToken
            };
            let content= await this.fun.getData('/pic/save/',subdata);
            if(content.code==0){
              this.updateValue(JSON.stringify(data));
              this.show=false;
            }else{
              alert(content.msg);
            }



        },

        async tapUpload(e){

          console.log(e.target.files[0]);

        },
        async getPic(){

        },
        updateValue: function(value) {
            this.$refs.input.images = value;
            this.$emit('input', value);
        },
        clear: function() {

            // this.$refs.input.value = "";
            // this.$emit('input', "")
        },
        ischeckbox(str){
            let len=this.checkbox.length;
            for(let i=0;i<len;i++){
              if (this.checkbox[i]==str) {
                return true;
              }
            }
              return false;
        },
        stop(e){
          if(this.num<=1){
            return false;
          }
          if(e.target.type=='checkbox'){
                return false;
          }

          let element=e.path;
          let isselect= false;
          for(let i in element){
              if(element[i].className=="checked"){
                isselect=true;
                break
              }
          }
          if(this.checkbox.length>=this.num){
                if(!isselect){
                  e.preventDefault();
                }
          }
        }
    }

};
</script>
