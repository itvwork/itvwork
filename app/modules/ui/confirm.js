const state={
    word:"",
    show:false,
    title:"",
    wrap:'warn',
    bg:false,
    even:'sure',
    btnsure:'确定',
    btnclose:'关闭',
    evenclose:'close',
    isclose:true
}

const mutations ={
    uishow(state,val){
        if (val.type !== "confirm") return false;
        state.word=val.word?val.word:'';
        state.title=val.title?val.title:""
        state.bg=val.bg==false?false:true;
        state.show=true;
        state.even=val.even?val.even:'sure';
        state.btnsure=val.btnsure?val.btnsure:'确定';
        state.btnclose=val.btnclose?val.btnclose:'关闭';
        state.evenclose=val.btnclosee?val.evenclose:'close';
        state.wrap=val.wrap?val.wrap:'close';
        state.isclose=val.isclose?val.isclose:false;

    },
    uiclose(state,val){
        if (val.type !== 'confirm') return false;
        state.show=false;
        state.bg=false;
    }
}

export default {
    state,
    mutations
}