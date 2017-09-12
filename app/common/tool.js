export default function Tool(Vue) {
    this.Vue;


}

Tool.prototype = {
    constructor: Tool,
    init: function(valname, val) {

    },
    post:function(url,data){
      let Vue=this.Vue;
      return new Promise(function(resolve, reject) {
          Vue.$http.post(url,data).then(response => {

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
      });
    }



};
