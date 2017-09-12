
<template>
<section class="ui" v-if="ui.show">
<div class="ui-wrap" :class="ui.wrap" draggable="true">
    <div class="ui-outdoor">
        <em class="ui-icon ui-icon-close" @click="closebox()"></em>
        <div class="ui-top">
            <p class="ui-icon ui-icon-title"></p>
            <h2>{{ui.title}}</h2>
            <p class="ui-words">{{ui.word}}</p>
        </div>
        <div class="ui-btn-group">
            <button class="btn-alert" @click="sure()">确定</button>
        </div>
    </div>
  </div>
  <div class="bg" v-if="ui.bg" @click="closebox()"></div>
  </section>
</template>
<script>
    import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            ui: state=> state.ui.alert
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
            this.ui.show=false;
        },
        sure: function() {
            this.$root.uievent.$emit(this.ui.even);

        },
    }
};
</script>
