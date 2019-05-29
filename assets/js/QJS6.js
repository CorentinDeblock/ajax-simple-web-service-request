let QJS6Tools = {
    AjaxQueryBase: class{
        constructor(url,async){
            this.url = url;
            this.async = async;
            this.ajax = new XMLHttpRequest();
            this.response = "";
    
            this.onload =  () => {
                if(this.ajax.status == 200){
                    let response = this.convert(this.ajax.responseText);
                    this.success(response);
                }else{
                    this.failed();
                }
            }
    
            this.ajax.onload = this.onload;
    
            this.convert = (obj) => {
                return obj;
            }
            this.oncall = () =>{
                
            }
            this.success = () => {
    
            }
            this.failed = () => {
    
            }
            this.beforeCall = () => {
    
            }
            this.call = () =>{
                this.beforeCall();
                this.ajax.send();
                this.oncall();
            }
        }
    },
    AnimationBase: class{
        constructor(classCss) {
            this.element = document.querySelectorAll(classCss);

            this.callback = (event) =>{
                
            }

            this.removeAnimation = new Map();
            this.bufferAnim = new Map();
            let parent =  this;
            this.element.forEach((object) => {
                object.addEventListener("animationend",function(event) {
                    parent.checkApplyAfter(this);
                })
            })
        }
        checkApplyAfter(element) {
            this.bufferAnim.forEach((animName,call) => {
                if(animName == event.animationName){
                    call(element);
                }
            })
        }
        addAnimation(animationName){
            this.element.forEach((object) => {
                if(object.style.display != "none"){
                    object.classList.add(animationName);
                }
            })
        }
        applyAfter(animationName,call){
            this.bufferAnim.set(call,animationName);
        }
    }
}

let QJS6 = {
    Animation: {
        Fader: class extends QJS6Tools.AnimationBase{
            constructor() {
                super(".fade")
                this.applyAfter("fadeIn",(element) => {
                    element.classList.remove("fadeIn");
                    if(element.classList.contains("fade")){
                        element.classList.remove("fade");
                    }
                })
                this.applyAfter("fadeOut",(element) => {
                    element.classList.remove("fadeOut");
                    element.classList.add("fadeIn");
                })
            }
            fadeElmeent(option) {
                if(option == "in"){
                    this.addAnimation("fadeIn");
                }else if(option == "out"){
                    this.addAnimation("fadeOut");
                }
            }
        }
    },
    Ajax: {
        Vanilla: class extends QJS6Tools.AjaxQueryBase{
            constructor(type,url,async){
                if(type == "post"){
                    this.method = new this.Post(url,async);
                }else if(type == "get"){
                    this.method = new this.Get(url,async);
                }
            }
            call(){
                if(this.method != undefined){
                    this.method.call();
                }else{
                    console.log("Undefined method");
                }
            }
        },
        Post: class extends QJS6Tools.AjaxQueryBase {
            constructor(url,async){
                super(url,async);
                this.beforeCall = () => {
                    this.ajax.open("post",this.url,this.async);
                }
            }
        },
        Get: class extends QJS6Tools.AjaxQueryBase {
            constructor(url,async){
                super(url,async);
                this.beforeCall = () => {
                    this.ajax.open("get",this.url,this.async);
                }
            }
        },
        Buffers: class {
            constructor(){
                this.buffer = new Map();
                let parent = this;
                this.called = 0;
                this.success = (obj) => {
                    parent.buffer.forEach((key,value) => {
                        value.function(obj[key],value.target);
                    })
                    parent.onSuccess();
                    parent.called++;
                }
                this.onSuccess = () => {

                }
            }
            add(key,value,multiple,func){
                let tar = (multiple ? document.querySelectorAll(value) : document.querySelector(value));
                this.buffer.set({
                    target:tar,
                    function:func
                },key);
            }
            getElement(key){
                if(this.buffer.has(key)){
                    return this.buffer.get(key).value;
                }
                return undefined;
            }
        } 
    }
}