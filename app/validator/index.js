export default function Validator(data,opt,ref) {
    this.data = data;
    this.result = Object.assign({}, data);
    this.self=opt;
    this.ref=ref;
    for (let i in this.result) {
        this.result[i] = true;
    }

}
Validator.prototype = {
    constructor: Validator,
    single: function(valname, val) {

        let str = true;
        if (this.data[valname]['tirm']) {
            val = this.trim(val);
        }

        for (let i = 0; i < this.data[valname]['rule'].length; i++) {
            let msg = this.data[valname]['msg'][i];
            let rule = this.data[valname]['rule'][i];
            if (typeof rule == 'string') {
                if (this[rule](val)) {
                    str = true;
                } else {
                    str = msg;
                    break;
                }
            } else {
                if (this[rule[0]](rule, val)) {
                    str = true;
                } else {
                    str = msg;
                    break;
                }
            }
        }
        str === true ? this.result[valname] = true : this.result[valname] = false;
        return str;

    },
    all: function(data) {
        return this.data[valname];
    },
    require: function(str) { //必须字段
        if (str) {
            return true;
        } else {
            return false;
        }
    },
    tel: function(str) { //国内固话验证
        var result = str.match(/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/);
        if (result == null) return false;
        return true;
    },
    tel400: function(str) {
        if (str.match(/^400\-[\d|\-]{7}[\d]{1}$/)) { //第一次匹配 400-（七个数字和-）（数字结尾）
            if (str.match(/[\-]/g) == "-,-") { //第二次匹配两个 -
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    trim: function(str) { //去除前后空格
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    between: function(arr, val) { //区间大小
        if (val.length >= arr[1] && val.length <= arr[2]) {
            return true;
        } else {
            return false;
        }

    },
    max:function(arr,val){
      if (val.length > arr[1]) {
          return false;
      } else {
          return true;
      }

    },
    max:function(arr,val){
      if (val.length <arr[1]) {
          return false;
      } else {
          return true;
      }

    },
    phone: function(str) {
      var result = str.match(/^1[34578]\d{9}$/);
      if (result == null) return false;
      return true;
    },
    email: function(str) { //email
        var result = str.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
        if (result == null) return false;
        return true;
    },
    getResult: function() {
        return this.result;
    },
    strlen: function(str) { //
        return str.replace(/[^\x00-\xff]/g, "**").length;
    },
    alltel:function (str) {
        return this.tel(str)||this.tel400(str)||this.phone(str);
    },
    getdata:function () {
        return this.self.shop
    },
    allvalt:function(){
        let child = this.self.$refs[this.ref?this.ref:'form'].$children;
        let oneerr=true;//获取第一个错误的组件 然后获取焦点
        for(let i =0 ; i<child.length;i++){
            if(child[i].rule){
                if(child[i].valtVal()!==true&&oneerr===true){
                    child[i].focus();
                    oneerr=false;
                }

            }
        }
        if(oneerr===true){
            return true;
        }else{
            return false;
        }


    }


};
