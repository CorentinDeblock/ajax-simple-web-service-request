let QJS6Tools = {
    applyBuffer: (parent,buffer) =>{
        if(buffer != undefined){
            parent.success = buffer.success;
            console.log("buffer called");
        }
    },
    Language: class {
        static traduce(event,variable,variableName) {
            if(this.enable){
                for(let i = 0; i < this.traductor.length;i++){
                    let index = this.traductor[i]
                    if(index.type == event && index.language == this.Speak && index.call(variable)){
                        console.error(index.content(variableName));
                    }
                }
            }
        }
        static addLanguage(event,type,condition,str) {
            this.traductor.push({
                type:event,
                call: condition,
                language: type,
                content:str
            })
        }
    },
    AjaxQueryBase: class{
        constructor(url,async){
            this.url = url;
            this.async = async;
            this.called = 0;
            this.ajax = new XMLHttpRequest();
            this.response = "";
            this.isSuccess = false;
            this.onSuccess = () => {

            }

            this.onload =  () => {
                if(this.ajax.status == 200){
                    let response = this.convert(this.ajax.responseText);
                    this.success(response);
                    this.onSuccess();
                    this.isSuccess = true;
                }else{
                    this.failed();
                }
                this.called++;
            }
            
            this.ajax.onload = this.onload;
    
            this.convert = (obj) => {
                return obj;
            }
            this.onCall = () =>{
                
            }
            this.success = (response) => {
    
            }
            this.failed = () => {
    
            }
            this.beforeCall = () => {
    
            }
            this.call = () =>{
                this.isSuccess = false;
                this.beforeCall();
                this.ajax.send();
                this.onCall();
            }
        }
    },
    AnimationBase: class{
        constructor(classCss) {
            this.element = document.querySelectorAll(classCss);

            this.callback = (event) =>{
                
            }

            this.add = (element) => {
                if(!element.classList.contains("fade")){
                    element.classList.add("fade");
                }
            }
            this.remove = (element) => {
                if(element.classList.contains("fade")){
                    element.classList.remove("fade");
                }
            }
            this.bufferAnim = new Map();
            let parent =  this;
            this.element.forEach((object) => {
                object.addEventListener("animationend",function(event) {
                    parent.checkApplyAfter(this);
                })
            })
            this
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
QJS6Tools.Language.enable = false;
QJS6Tools.Language.traductor = [];
QJS6Tools.Language.Speak = "fr";

QJS6Tools.Language.addLanguage("undefined","fr",(value) => { return value == undefined;},(value) => {
    return `La variable ${value} n'est pas définie (undefined)`
})

QJS6Tools.Language.addLanguage("request","fr",(value) => { return value != "post" && value != "get";},(value) => {
    return `La variable ${value} n'est pas de requête post ou get`
})

QJS6Tools.Language.addLanguage("undefined","en",(value) => { return value == undefined;},(value) => {
    return `The variable ${value} is undefined`
})
QJS6Tools.Language.addLanguage("request","en",(value) => { return value != "post" && value != "get";},(value) => {
    return `The variable ${value} is not of request post or get type`
})

let QJS6 = {
    Animation: {
        Fader: class extends QJS6Tools.AnimationBase{
            constructor() {
                super(".fade")
                this.callbackOut = () => {

                }
                this.callbackIn = () => {

                }

                this.applyAfter("fadeIn",(element) => {
                    element.classList.remove("fadeIn");
                    this.remove(element);
                    this.callbackIn();
                })
                this.applyAfter("fadeOut",(element) => {
                    element.classList.remove("fadeOut");
                    this.add(element);
                    this.callbackOut();
                })
            }
            fadeElement(option) {
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
            constructor(type,url,async,buffer){
                super(url,async);
                QJS6Tools.applyBuffer(this,buffer);
                this.beforeCall = () => {
                    this.ajax.open(type,this.url,this.async);
                }
                QJS6Tools.Language.traduce("request",type,"Type");
            }
            call(){
                if(this.method != undefined){
                    this.method.call();
                }
            }
        },
        Post: class extends QJS6Tools.AjaxQueryBase {
            constructor(url,async,buffer){
                super(url,async);
                QJS6Tools.applyBuffer(this,buffer);
                this.beforeCall = () => {
                    this.ajax.open("post",this.url,this.async);
                }
            }
        },
        Get: class extends QJS6Tools.AjaxQueryBase {
            constructor(url,async,buffer){
                super(url,async);
                QJS6Tools.applyBuffer(this,buffer);
                this.beforeCall = () => {
                    this.ajax.open("get",this.url,this.async);
                }
            }
        },
        Buffers: class {
            constructor(){
                this.buffer = new Map();
                this.success = (obj) => {
                    this.buffer.forEach((key,value) => {
                        value.function(obj[key],value.target);
                    })
                    this.onSuccess();
                }
                this.onSuccess = () => {

                }
                this.onDone = () => {

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
QJS6.waitForData = (ajax,func,timer) => {
    let wait = setInterval(() =>{
        if(ajax.isSuccess){
            func();
            clearInterval(wait);
        }
        console.log("In interval");
    },(timer != undefined ? timer : 250))
}