const state={
    word:"非法操作",
    show:false,
    title:"警告",
    wrap:'warn',
    bg:false,
    even:'sure'
}

const mutations ={
     uishow(state,val) {
         if (val.type !== 'alert') return false;
         state.word=val.word?val.word:'非法操作';
         state.title=val.title?val.title:"警告"
         state.bg=val.bg==false?false:true;
         state.show=true;
         state.even=val.even?val.even:'sure';
     }

}

export default {
    state,
    mutations
}