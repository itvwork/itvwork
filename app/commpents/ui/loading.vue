
<template>
    <div class="vue-loading">
            <div class="loading-img">
            </div>
            <p>{{loading}}</p>
    </div>
</template>
<script>
    export default {
        props: {
            loading:{

                default:'加载中…'
            }
        }

    };
</script>
