import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router';
import App from './app.vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import fun from './common/fun.js';
import Schema from './validator/index.js';
import http from './common/http';


//components
import form_edit from './commpents/form/form-edit.vue';
import text_edit from './commpents/input/text-edit.vue';
import editor from './commpents/editor/editor.vue';
import textarea_edit from './commpents/input/textarea-edit.vue';
import pic from './commpents/upload/pic.vue';
import top from './commpents/top/top.vue';
import back from './commpents/top/back.vue';
import alert from './commpents/ui/alert.vue';
import confirm from './commpents/ui/confirm.vue';
import indoor from './commpents/indoor/indoor.vue';
import page from './commpents/page/page.vue';
import VueEditor from './commpents/editor/vue-editor.vue';
import Cover from './commpents/input/cover.vue';
import crumbs from './commpents/meun/crumbs.vue';
import indexbox from './commpents/router/index-box'
import code_box from './commpents/input/code-box';
import input_text from './commpents/input/input-text';
import VueSelect from './commpents/input/vue-select';
import search from './commpents/meun/search';
import Tool from  './common/tool.js';
import api from './api';
import loading from './commpents/ui/loading.vue';
import vueTips from './commpents/ui/vue-tips.vue'



import stateManage from './modules/index';


export let Components = {
    VueSelect,
    form_edit,
    text_edit,
    editor,
    textarea_edit,
    pic,
    top,
    alert,
    confirm,
    indoor,
    page,
    back,
    VueEditor,
    Cover,
    crumbs,
    indexbox,
    code_box,
    input_text,
    search,
    loading,
    vueTips
};

for(let i in Components){
  let name = i.replace('_', '-');
  Vue.component(name,Components[i]);

};

Vue.use(VueRouter);

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(http,{url:'http://192.168.26.86/3dplay/public/'});

window.Vue = Vue || {};
window.Vuex=Vuex || {};
window.Schema=Schema||{};
window.Api=api;
window.Tool= new Tool(Vue);

Vue.config.devtools = true;
Vue.prototype.fun=fun;
Vue.prototype.Api=api;

const router = new VueRouter({
    // mode: 'history',

    routes
})

var store = new Vuex.Store(stateManage);
router.beforeEach((to,from,next)=>{

    if(to.fullPath.indexOf('admin')>=1){

        if (sessionStorage.getItem("wgctokens")) {
            next();
        }else{

           setTimeout(function(){
               next({ path: '/login' });
           },1);

        }
    }
    next();


});





new Vue({
    el: '#app',
    store,
    router: router,
    render: h => h(App),
    data:{
        uievent:new Vue()
    }
})
