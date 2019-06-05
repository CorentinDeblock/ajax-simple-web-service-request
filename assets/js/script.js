let btn = document.querySelector("#quotation #reloader");

let fade = new QJS6.Animation.Fader();
let buffer = new QJS6.Ajax.Buffers();
let ajax = new QJS6.Ajax.Get("https://thatsthespir.it/api",true,buffer);

function applyHTML(element,content){
    element.innerHTML = content;
}
function applySrc(img,content){
    if(content != ""){
        img.style.display = "block";
        img.src = content;
    }else{
        img.style.display = "none";
    }
}

function applyText(element,content){
    element.innerText = content;
}

buffer.add("photo","#quotation img",false,(key,value) => {
    if(ajax.called == 0){
        applySrc(value,key);
    }else{
        fade.applyAfter("fadeOut",() => {
            applySrc(value,key);
        })
    }
})
buffer.add("quote","#quotation blockquote",false,(key,value) => {
    if(ajax.called == 0){
        applyHTML(value,key);
    }else{
        fade.applyAfter("fadeOut",() =>{
            applyHTML(value,key);
        })
    }
})
buffer.add("author","#quotation #author",false,(key,value) => {
    if(ajax.called == 0){
        applyText(value,key);
    }else{
        fade.applyAfter("fadeOut",() => {
            applyText(value,key);
        })
    }
})

ajax.convert = (obj) => {
    return JSON.parse(obj);
}

fade.callbackOut = () => {
    if(ajax.isSuccess){
        fade.fadeElement("in");
    }else{
        QJS6.waitForData(ajax,() => {
            fade.fadeElement("in");
        })
    }
}

ajax.failed = () => {
    console.log('request failed');
}
ajax.onSuccess = () => {
    if(ajax.called == 0){
        fade.fadeElement("in");
    }
}
ajax.onCall = () => {
    if(ajax.called > 0){
        fade.fadeElement("out");
    }
}


ajax.call();

btn.addEventListener("click",() => {
    if(ajax.isSuccess){
        ajax.call();
    }
});