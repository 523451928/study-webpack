/* eslint-disable */
let Tips = {};
Tips.install = function (Vue, options) {
  let opt = {
    defaultType:'bottom',
    duration:'2500'
  };
  for(let property in options){
    opt[property] = options[property];
  }
  Vue.prototype.$toast = function(tips,type,duration,callback,themeObj){
    let curType = type ? type : opt.defaultType;
    let self = this
    if(document.querySelector('.lx-dialog')){
      // 如果dialog还在，则不再执行
      return;
    }
    let toastTpl = Vue.extend({
      template: `<div class="dia-mask"><div class="lx-dialog lx-dialog-${curType}">{{tips}}</div></div>`,
      data:function(){
        return{
          tips:tips
        }
      }
    });
    let tpl = new toastTpl().$mount().$el;
    let tep = document.createElement("div");
    tep.setAttribute("class","lx-dialog lx-dialog-"+curType);
    tep.innerText=tips;
    document.body.appendChild(tpl);
    if(themeObj!=undefined){
      for(let key in themeObj){
        document.querySelector(".lx-dialog").style[key]=themeObj[key];
      }
    }
    let timer=setTimeout(function () {
      document.body.removeChild(tpl);
      if(typeof callback=='function'){
        callback.call(self)
      }
    }, duration || opt.duration);

    return new Promise(function(resolve,reject){
      if(true){
        resolve({
          "status":"success"
        })
      }else{
        reject({
          "status":"error"
        })
      }
    })
  };
  ['bottom', 'center', 'top'].forEach(function(type) {
    Vue.prototype.$toast[type] = function(tips,duration,callback,themeObj) {
      return Vue.prototype.$toast(tips,type,duration,callback,themeObj);
    };
  });
  Vue.prototype.$notify = function(option) {
    let opt = {
      type: 'wa-warning',
      text: 'message',
      delay: 2500,
      isSingle: false
    }
    opt = Object.assign(opt, option)
    let notifyTpl = Vue.extend({
      template:`<div class="wa-notify" ref='wrapper'>
                  <div class="wa-notify-content">
                    <div>
                      <span :class='opt.type'></span>
                      {{opt.text}}
                    </div>
                  </div>
                </div>`,
      data() {
        return {
          opt
        }
      },
      methods: {
        close() {
          if (this.$refs.wrapper) {
            if (this.timer) {
              clearTimeOut(this.timer)
            }
            this.timer = setTimeout(() => {
              this.$refs.wrapper.style.opacity = 0
              this.$refs.wrapper.style.transform = 'translateY(-10px)'
              if (this.timertwo) {
                clearTimeOut(this.timertwo)
              }
              this.timertwo = setTimeout(() => {
                if (document.querySelector('.wa-notify')) {
                  document.body.removeChild(document.querySelector('.wa-notify'))
                }
              }, 500)
            }, this.opt.delay || 2500)
          }
        }
      },
      mounted() {
        if (this.opt.isSingle) {
          let nodelist = document.querySelectorAll('.wa-notify')
          for(let i = 0;i < nodelist.length; i++) {
            if (nodelist[i]) {
              document.body.removeChild(nodelist[i])
            }
          }
        }
        this.close()
      }
    })
    let tpl = new notifyTpl().$mount().$el
    document.body.appendChild(tpl)
  }
  Vue.prototype.$dialog = function(option) {
    let dialogTpl = Vue.extend({
      template:`<div class="wa-tips-mask" ref="wrapper">
                    <div class="tips-container">
                      <span class="tips-close-btn" @click="close">&times;</span>
                      <div class="tips-title">{{title}}</div>
                      <div class="tips-content" v-html="content"></div>
                      <div class="tips-btn-group">
                        <!--<span class="view-btn">点击查看</span>-->
                        <!--<span class="use-btn">立即使用</span>-->
                        <span v-for="(item,index) in btnArr" :class="item.className" @click="callback(item.callback)">{{item.text}}</span>
                      </div>
                    </div>
                  </div>`,
      data() {
        return {
          title: option.title,
          content: option.content,
          btnArr: option.btnArr
        }
      },
      methods: {
        close() {
          this.$refs.wrapper.style.opacity=0
          setTimeout(() => {
            document.body.removeChild(this.$refs.wrapper)
          }, 1000)
        },
        callback(fn) {
          fn.apply(this)
        }
      }
    })
    let tpl = new dialogTpl().$mount().$el
    document.body.appendChild(tpl)
  }
  Vue.prototype.$alert=function(type,title,btnText,callback){
    let self=this
    if(!btnText){
      btnText="确认"
    }
    let alertTpl=Vue.extend({
      template:`<div class="lx-confirm-wrapper" ref="wrapper">
                <div class="confirm-box">
                    <p>{{title}}</p>
                    <div class="btn-wrapper" @click="confirmFn">
                        <span class="alert-confirm" :class="{'success-confirm':type=='success','error-confirm':type=='error','warning-confirm':type=='warning'}">{{btnText}}</span>
                     </div>
                </div>
            </div>`,
      data(){
        return {
          type:type,
          title:title,
          btnText:btnText
        }
      },
      methods:{
        confirmFn(){
          if(typeof callback=="function"){
            callback.apply(self)
          }
          this.$refs.wrapper.style.opacity=0;
          setTimeout(()=>{
            document.body.removeChild(this.$refs.wrapper);
          },500)
        }
      }
    })
    let tpl = new alertTpl().$mount().$el;
    document.body.appendChild(tpl);
  };

  ['error', 'warning', 'success'].forEach(function(type) {
    Vue.prototype.$alert[type] = (title,btnText,callback) => {
      return Vue.prototype.$alert(type,title,btnText,callback);
    };
  });

  Vue.prototype.$prompt=function(title,cancelCallback){
    let self=this;
    if(!title){
      title="请确认"
    }
    let promptTpl=Vue.extend({
      template:`<div class="lx-confirm-wrapper lx-prompt-wrapper" ref="wrapper">
                <div class="confirm-box">
                    <div>
                        <p>{{title}}</p>
                        <input type="text" v-model="val">
                    </div>
                    <div class="btn-wrapper">
                        <span class="cancel" @click="cancelFn">取消</span>
                        <span class="confirm" @click="confirmFn">确认</span>
                     </div>
                </div>
            </div>`,
      data() {
        return{
          title:title,
          val:""
        }
      },
      methods:{
        cancelFn(){
          this.$refs.wrapper.style.opacity=0;
          setTimeout(()=>{
            document.body.removeChild(this.$refs.wrapper);
          },500)
        },
        confirmFn(){
          this.cancelFn();
          if(typeof cancelCallback=="function"){
            cancelCallback.call(self,this.val);
          }else{
            console.warn('参数错误')
          }
        }
      }
    })
    let tpl = new promptTpl().$mount().$el;
    document.body.appendChild(tpl);
  }

  Vue.prototype.$comfirm=function(title,confirmCallback){
    let self=this;
    if(!title){
      title="请确认"
    }
    let confirmTpl=Vue.extend({
      template:`<div class="lx-confirm-wrapper" ref="wrapper">
                <div class="confirm-box">
                    <p>{{title}}</p>
                    <div class="btn-wrapper">
                        <span class="cancel" @click="cancelFn">取消</span>
                        <span class="confirm" @click="confirmFn">确认</span>
                     </div>
                </div>
            </div>`,
      data() {
        return{
          title:title
        }
      },
      methods:{
        cancelFn(){
          this.$refs.wrapper.style.opacity=0;
          setTimeout(()=>{
            document.body.removeChild(this.$refs.wrapper);
          },500)
        },
        confirmFn(){
          this.cancelFn();
          if(typeof confirmCallback=="function"){
            confirmCallback.apply(self);
          }else{
            console.warn('参数错误')
          }
        }
      }
    })
    let tpl = new confirmTpl().$mount().$el;
    document.body.appendChild(tpl);
  };

  Vue.prototype.$loading = function(tips,type,themeObj) {
    let load = document.querySelector('.lx-load-mark');
    if(!tips){
      tips="加载中..."
    }
    if(type == 'close'){
      load && document.body.removeChild(load);
      return new Promise((resolve, reject) => {
        if(true){
          resolve('可以执行回调')
        }else{
          reject()
        }
      })
    }else{
      if(load){
        // 如果loading还在，则不再执行
        return;
      }
      let loadTpl = Vue.extend({
        template: '<div class="lx-load-mark"><div class="lx-load-box"><div class="lx-loading"><div class="loading_leaf loading_leaf_0"></div><div class="loading_leaf loading_leaf_1"></div><div class="loading_leaf loading_leaf_3"></div><div class="loading_leaf loading_leaf_4"></div><div class="loading_leaf loading_leaf_5"></div><div class="loading_leaf loading_leaf_6"></div><div class="loading_leaf loading_leaf_7"></div><div class="loading_leaf loading_leaf_8"></div><div class="loading_leaf loading_leaf_9"></div><div class="loading_leaf loading_leaf_10"></div><div class="loading_leaf loading_leaf_11"></div></div><div class="lx-load-content">'+tips+'</div></div></div>'
      });

      let tpl = new loadTpl().$mount().$el;
      document.body.appendChild(tpl);
      if(themeObj!="undefined"){
        for(let key in themeObj){
          document.querySelector(".lx-load-box").style[key]=themeObj[key];
        }
      }
    }
  };

  ['open', 'close'].forEach(function(type) {
    Vue.prototype.$loading[type] = function(tips,theme) {
      return Vue.prototype.$loading(tips,type,theme);
    };
  });

  Vue.directive('drag', {     //添加全局指令
    bind (el, binding, vnode, oldVnode) {
      let docWidth = document.body.clientWidth
      let docHeight = document.body.clientHeight
      let dragObj = {} ,elmWidth, elmHeight
      let top
      el.addEventListener('mousedown', startFn, false)
      el.addEventListener('mousemove', moveFn, false)
      document.body.addEventListener('mouseup', endFn, false)
      function startFn(e){
        if (!top) {
          top = el.offsetTop
          let node = el
          while (node.offsetParent!==null) {
            top += node.offsetParent.offsetTop
            node = node.offsetParent
          }
        }
        elmWidth = el.clientWidth
        elmHeight = el.clientHeight
        dragObj = {
          minLeft: -(docWidth - elmWidth) / 2,
          maxLeft: (docWidth - elmWidth) / 2,
          minTop: -top,
          maxTop: docHeight - elmHeight - top
        }
        dragObj.isMouseDown = true
        dragObj.startX = e.clientX
        dragObj.startY = e.clientY
        if (parseInt(el.style.left) ) {
          dragObj.startX = e.clientX - parseInt(el.style.left)
        } else {
          dragObj.startX = e.clientX
        }
        if (parseInt(el.style.top)) {
          dragObj.startY = e.clientY - parseInt(el.style.top)
        } else {
          dragObj.startY = e.clientY
        }
      }
      function moveFn(e){
        if (dragObj.isMouseDown && e.target.nodeName !== 'INPUT') {
          let moveX = e.clientX - dragObj.startX
          let moveY = e.clientY - dragObj.startY
          if (moveX > dragObj.minLeft && moveX < dragObj.maxLeft) {
            el.style.left = `${moveX}px`
          }
          if (moveY > dragObj.minTop && moveY < dragObj.maxTop) {
            el.style.top = `${moveY}px`
          }
        }
      }
      function endFn(){
        dragObj = {}
        dragObj.isMouseDown = false
      }
    }
  })
};
Vue.use(Tips)
