let url='http://192.168.26.86/3dplay/public/'
export default {
     login:url+'admin/login',//登录 admin_name admin_password
     store:url+'store/list', //店铺列表 pageNum:1 page:1
     storeimg:url+'images/',
     addStore:url+'store/add',
     storeDetail:url+'store/detail',
     storeUpdata:url+'store/update',
     storelist:url+'store/list',
     storedel:url+'store/delete',
     storeaddmodel:url+'storemodel/add',
     sotreselectmodel:url+'storemodel/list',
     storemodelNone:url+'storemodel/modelOffLineList',
     modeladd:url+'model/add',
     modellist:url+'model/list',
     modeldetail:url+'model/detail',
     modeledit:url+'model/update',
     modeldel:url+'model/delete',

}
