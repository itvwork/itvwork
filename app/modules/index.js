import ui from './ui/index'
export default {
    state:{
        count: 0,
        meun:0,
        bg:false,
        loading:0,
        token:sessionStorage.getItem("wgctokens"),
        admin:sessionStorage.getItem("wgc_admin_username"),
    },
    modules: {
        ui
    },
}
