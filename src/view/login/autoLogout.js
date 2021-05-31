import {Msg} from "../../tools/message";
// import {Auth} from "../../store/modules/auth";
import {store} from '../../store'
import router from '../../router'
// import SockJS from "sockjs-client"


var lastTime = new Date().getTime();
var currentTime = new Date().getTime();
var timeOut = 50 * 60 * 1000; //设置超时时间： 50分

window.onload = function () {
  window.document.onmousedown = function () {
    localStorage.setItem("lastTime", new Date().getTime());
  }
};

function checkTimeout() {
  currentTime = new Date().getTime(); //更新当前时间
  lastTime = localStorage.getItem("lastTime");
  // console.log(currentTime - lastTime);
  // console.log(timeOut);
  if (currentTime - lastTime > timeOut) { //判断是否超时
    Msg.warn("检测到50分钟内无操作，系统已经自动注销");
    store.dispatch('accountLogoutSubmit').then((res) => {
      router.push({path: '/login'})
    });
    router.push({path: '/login'});
  }
}

/* 定时器 间隔1分钟检测是否长时间未操作页面 */
var x = window.setInterval(checkTimeout, 60 * 1000);

export default {
  // data () {
  //   return {
  //     path:"http://localhost:9090/sock-js?user="+Auth.getUserInfo().account,
  //     socket:""
  //   }
  // },
  // mounted () {
  //   // 初始化
  //   this.init()
  // },
  // methods: {
  //   init: function () {
  //       // 实例化socket
  //       this.socket = new SockJS(this.path);
  //       // 监听socket连接
  //       this.socket.onopen = this.open;
  //       // 监听socket错误信息
  //       this.socket.onerror = this.error;
  //       // 监听socket消息
  //       this.socket.onmessage = this.getMessage
  //   },
  //   open: function () {
  //     console.log("socket连接成功")
  //   },
  //   error: function () {
  //     console.log("连接错误")
  //   },
  //   getMessage: function (msg) {
  //     console.log(msg.data)
  //   },
  //   send: function () {
  //     this.socket.send(params)
  //   },
  //   close: function () {
  //     console.log("socket已经关闭")
  //   }
  // },
  // destroyed () {
  //   // 销毁监听
  //   this.socket.onclose = this.close
  // }
}
