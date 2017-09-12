<template>
<section class="component-box">
    <div :id="id">

    </div>

</section>
</template>
</section>
<script>
import E from '../../editor/wangEditor.js';
export default {
    name: 'editor',
    props: {
        boxheight: {
            type: Number,
            default: 30
        },
        editorwidth: {
            type: String,
            default: '100%'
        },
        id: {
            type: String,
            default: 'e1'
        },
        content:{
          type:String,
          default:''
        },
        fun:{
          type:String,
          default:'fun'
        }
    },
    data(){
      return {
          editor:'',
            eh: this.$props.boxheight - 3.4 + 'rem'

      }
    },
    mounted() {
        var editor = new E('#' + this.$props.id);
        editor.create();
        editor.txt.html(this.editor);
        this.editor=editor;
        var self=this;
        $("#"+self.$props.id+' .btn-w-e').on('click',function(){
            console.log(self.$props.id);
        })

    },

    methods: {
        exec: function(name, value) {

            document.execCommand(name, false, value);

        },
        getContent:function(){

            return this.editor.txt.html();
        },
        openimg:function(){
          console.log('------');
        }
    }

}
</script>
