
<template >
    <transition name="tips" enter-active-class="animated bounceIn" leave-active-class="animated  bounceOut">
        <div v-if="tips" :id="id" class="vue-tips" :style="{'margin-left':left}">
            {{tips}}
        </div>
    </transition>
</template>
<script>
    export default {
        props: {
            tips:{
                default:'成功'
            }
        },
        data(){
            return {
                id:'tips',
                left:'-10px'
            }
        },
        watch: {
            id: function(val, oldval) {
                let self=this;
                let tips=document.getElementById(self.id);
                let bwidth=document.body.clientWidth;
                if(bwidth>780){
                    self.left=-tips.clientWidth/2-20+120+'px';
                }else{
                    self.left=-tips.clientWidth/2-20+'px';
                }

            },
            '$route': function(to, from) {
                if (this.$route.query.page) {
                    this.getdata(this.$route.query.page);
                }else{
                    this.getdata(1);
                }

            }
        },
        methods: {
            close(){
                this.$emit('update:tips', '');
            }
        },
        created(){
            this.id='tips-'+parseInt(Math.random()*1000);
            let self=this;
            setTimeout(function(){
                self.close();
            },2000);

        }

    };
</script>
