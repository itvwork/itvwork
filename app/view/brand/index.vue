<template>
<transition name="brand" enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
    <indoor>
        <top add='/admin/brand/add'></top>
        <div class="list-brand">
            <ul class="list-ul-brand">
              <li class="item-brand">
                <div class="brand-indoor">
                    <h2>

                      <label class="brand-label"> <input type="checkbox"  /><i class="icon-brand-checkbox"></i><span>01</span> </label>
                      标题
                    </h2>
                    <div class="brand-cover">
                        <img src="/style/file/brand.png" />
                    </div>
                    <div class="item-group-brand">
                        <span class="view-num"><i class="icon-view"></i>200</span>
                        <i class="icon-del"></i>
                        <a class="icon-edit"></a>
                    </div>
                </div>
              </li>
              <li class="item-brand">
                <div class="brand-indoor">
                    <h2>
                      <label class="active"> <input type="checkbox"  /><i class="icon-brand-checkbox"></i><span>01</span> </label>
                      标题
                    </h2>
                    <div class="brand-cover">
                        <img src="/style/file/brand.png" />
                    </div>
                    <div class="item-group-brand">
                        <span class="view-num"><i class="icon-view"></i>200</span>
                        <i class="icon-del"></i>
                        <a class="icon-edit"></a>
                    </div>
                </div>
              </li>
              <li class="item-brand">
                <div class="brand-indoor">
                    <h2>

                      <label class="brand-label"> <input type="checkbox"  /><i class="icon-brand-checkbox"></i><span>01</span> </label>
                      标题
                    </h2>
                    <div class="brand-cover">
                        <img src="/style/file/brand.png" />
                    </div>
                    <div class="item-group-brand">
                        <span class="view-num"><i class="icon-view"></i>200</span>
                        <i class="icon-del"></i>
                        <a class="icon-edit"></a>
                    </div>
                </div>
              </li>
              <li class="item-brand">
                <div class="brand-indoor">
                    <h2>
                      <label class="active"> <input type="checkbox"  /><i class="icon-brand-checkbox"></i><span>01</span> </label>
                      标题
                    </h2>
                    <div class="brand-cover">
                        <img src="/style/file/brand.png" />
                    </div>
                    <div class="item-group-brand">
                        <span class="view-num"><i class="icon-view"></i>200</span>
                        <i class="icon-del"></i>
                        <a class="icon-edit"></a>
                    </div>
                </div>
              </li>
              <li class="item-brand">
                <div class="brand-indoor">
                    <h2>

                      <label class="brand-label"> <input type="checkbox"  /><i class="icon-brand-checkbox"></i><span>01</span> </label>
                      标题
                    </h2>
                    <div class="brand-cover">
                        <img src="/style/file/brand.png" />
                    </div>
                    <div class="item-group-brand">
                        <span class="view-num"><i class="icon-view"></i>200</span>
                        <i class="icon-del"></i>
                        <a class="icon-edit"></a>
                    </div>
                </div>
              </li>
              <li class="item-brand">
                <div class="brand-indoor">
                    <h2>
                      <label class="active"> <input type="checkbox"  /><i class="icon-brand-checkbox"></i><span>01</span> </label>
                      标题
                    </h2>
                    <div class="brand-cover">
                        <img src="/style/file/brand.png" />
                    </div>
                    <div class="item-group-brand">
                        <span class="view-num"><i class="icon-view"></i>200</span>
                        <i class="icon-del"></i>
                        <a class="icon-edit"></a>
                    </div>
                </div>
              </li>
              <li class="item-brand">
                <div class="brand-indoor">
                    <h2>

                      <label class="brand-label"> <input type="checkbox"  /><i class="icon-brand-checkbox"></i><span>01</span> </label>
                      标题
                    </h2>
                    <div class="brand-cover">
                        <img src="/style/file/brand.png" />
                    </div>
                    <div class="item-group-brand">
                        <span class="view-num"><i class="icon-view"></i>200</span>
                        <i class="icon-del"></i>
                        <a class="icon-edit"></a>
                    </div>
                </div>
              </li>
              <li class="item-brand">
                <div class="brand-indoor">
                    <h2>
                      <label class="active"> <input type="checkbox"  /><i class="icon-brand-checkbox"></i><span>01</span> </label>
                      标题
                    </h2>
                    <div class="brand-cover">
                        <img src="/style/file/brand.png" />
                    </div>
                    <div class="item-group-brand">
                        <span class="view-num"><i class="icon-view"></i>200</span>
                        <i class="icon-del"></i>
                        <a class="icon-edit"></a>
                    </div>
                </div>
              </li>
              <li class="item-brand">
                <div class="brand-indoor">
                    <h2>

                      <label class="brand-label"> <input type="checkbox"  /><i class="icon-brand-checkbox"></i><span>01</span> </label>
                      标题
                    </h2>
                    <div class="brand-cover">
                        <img src="/style/file/brand.png" />
                    </div>
                    <div class="item-group-brand">
                        <span class="view-num"><i class="icon-view"></i>200</span>
                        <i class="icon-del"></i>
                        <a class="icon-edit"></a>
                    </div>
                </div>
              </li>
              <li class="item-brand">
                <div class="brand-indoor">
                    <h2>
                      <label class="active"> <input type="checkbox"  /><i class="icon-brand-checkbox"></i><span>01</span> </label>
                      标题
                    </h2>
                    <div class="brand-cover">
                        <img src="/style/file/brand.png" />
                    </div>
                    <div class="item-group-brand">
                        <span class="view-num"><i class="icon-view"></i>200</span>
                        <i class="icon-del"></i>
                        <a class="icon-edit"></a>
                    </div>
                </div>
              </li>
            </ul>
        </div>

        
        <page ref="page"></page>
    </indoor>
</transition>
</template>

<script>
export default {
    data() {
        return {
            login: {
                username: 'admmin',
                pwd: '123'
            },
            username: 'adminstreis'
        }
    },
    created(){
      //console.log(this.$route.query);
      this.$on('page',function(msg){
         console.log(msg);
      })
    },
    watch: {
        username: function(val, oldval) {
            console.log(this.login);
        },
        '$route':function(to,from){
          console.log(to+','+from)
          this.$refs.page.change({});
          console.log(this.$route.query);
        }
    },
    methods: {

        sub() {
            console.log(this.$data);
        }
    },
    events: {

    }
};
</script>
