export default {
    getFileToken: function() {
        return new Promise(function(resolve, reject) {
            $.post('http://localhost:2000/filetoken', {}, function(ret) {
                resolve(ret);
            })
        })
    },
    getDataToken: function() {
        return new Promise(function(resolve, reject) {
            $.post('http://localhost:2000/datatoken', {}, function(data) {
                resolve(data);
            })
        })
    },
    getData: function(url, data) {
        return new Promise(function(resolve, reject) {

            $.ajax({
                type: 'post',
                url: 'http://localhost:3000/api' + url,
                data: {
                    data: data
                },
                success: function(ret) {
                    resolve(ret)
                },
                error: function(ret) {
                    reject(ret)
                },
                dataType: 'json',
                timeout: '5000'
            });
        })

    },
    putData64: function(token, pic, ishow) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'post',
                url: 'http://upload-z2.qiniu.com/putb64/-1',
                data: pic,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.setRequestHeader("Authorization", "UpToken " + token);
                },
                success: function(ret) {

                    resolve(ret);

                },
                error: function(ret) {

                    reject(ret)
                },
                dataType: 'json',
                timeout: '100000'
            });
        });
    },
    base64: function(width, file, isshow) {
        var i = 0;
        var len = file.length;
        var arr = [];
        return new Promise(function(resolve, reject) {
            for (var a = 0; a < len; a++) {
                let imgname = file[a].name;
                let index1 = imgname.lastIndexOf(".");
                let index2 = imgname.length;
                imgname = imgname.substring(index1 + 1, index2); //后缀名
                let type = "";
                if (imgname == "jpg" || imgname == "jpeg" || imgname == "bmp") {
                    type = 'image/jpeg';
                } else if (imgname = 'gif') {
                    type = 'image/gif';
                } else {
                    type = 'image/png';
                }

                lrz(file[a], {
                    width: width,
                    quality: 0.8,
                    type: type
                }).then(function(rst) {
                    i++;
                    let base64Data = rst.base64.replace(/^data:image\/\w+;base64,/, "");
                    if (isshow) {
                        arr.push({
                            type: imgname,
                            data: base64Data,
                            url: rst.base64
                        })

                    } else {
                        arr.push({
                            type: imgname,
                            data: base64Data
                        })
                    }

                    if (i >= len) {
                        resolve(arr);
                    } else {
                        reject(error);
                    }
                });
            }
        })
    },
    time: function() {
        return parseInt(new Date().getTime() / 1000);
    },
    formatDateTime: function(inputTime) {
        var date = new Date(inputTime * 1000);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },
    trim: function(str) { //去掉所有空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    lrtrim: function(str) { //删除左右两端的空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    rtrim: function(str) { //删除右边的空格
        return str.replace(/(\s*$)/g, "");
    },
    exit: function(arr, str) {
        let ist = false;
        for (let i = 0; arr.length; i++) {
            if (arr[i] == str) {
                ist = true;
                break;
            }
        }
        return ist;

    },
    post: function(url,data) {
      let Vue=this.Vue;
        return new Promise(function(resolve, reject) {
          Vue.post(url,data).then(response => {

                // get status
                response.status;

                // get status text
                response.statusText;

                // get 'Expires' header
                response.headers.get('Expires');

                // get body data
                resolve(response.body);
                //this.someData = response.body;

            }, response => {
              reject(response);
                // error callback
            });
        })
    },
    postJson: function(url,data) {
        return new Promise(function(resolve, reject) {
            $.post('http://192.168.26.86/3dplay/public/admin/'+url, data, function(ret) {
                resolve(ret);
            })
        })
    },

};
