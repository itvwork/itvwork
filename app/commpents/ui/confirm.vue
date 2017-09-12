
<template>
<section class="ui" v-if="ui.show">
<div class="ui-wrap" :class="ui.wrap"  draggable="true">
    <div class="ui-outdoor">
        <em class="ui-icon ui-icon-close" @click="close()"></em>
        <div class="ui-top">
            <p class="ui-icon ui-icon-title"></p>
            <h2 v-if="ui.title">{{ui.title}}</h2>
            <p class="ui-words" >{{ui.word}}</p>
        </div>
        <div class="ui-btn-group">
            <button class="btn-sure" @click="sure()">{{ui.btnsure}}</button>
            <button class="btn-cancel" @click="closebox()">{{ui.btnclose}}</button>
        </div>
    </div>
  </div>
  <div class="bg" v-show="ui.bg"@click="close()"></div>
  </section>
</template>
<script>
    import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState({
            ui: state=> state.ui.confirm
        })
    },
    data() {

        return {
            

        }
    },
    created() {

    },
    methods: {
        closebox: function() {

              if(this.ui.isclose){
                  this.ui.show=false;
                  this.ui.bg=false;
              }
            this.$root.uievent.$emit(this.ui.evenclose,1);
        },
        close:function(){
          this.ui.show=false;
          this.ui.bg=false;
        },
        sure: function() {
              this.$root.uievent.$emit(this.ui.even,1);
        }

    }
};
</script>
