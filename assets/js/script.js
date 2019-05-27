let btn = document.querySelector("#quotation #reloader")

let fade = new QJS6.Animation.Fader();
let ajax = new QJS6.Ajax.Get("https://thatsthespir.it/api",true);
let buffer = new QJS6.Ajax.Buffers();
function applyHTML(element,content){
    element.innerHTML = content;
}
function apllySrc(img,content){
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
buffer.onSuccess = () => {
    if(buffer.called == 0){
        fade.fadeElmeent("in");
    }
}
buffer.add("photo","#quotation img",false,(key,value) => {
    if(buffer.called == 0){
        apllySrc(value,key);
    }else{
        fade.applyAfter("fadeOut",() => {
            apllySrc(value,key);
        })
    }
})
buffer.add("quote","#quotation blockquote",false,(key,value) => {
    if(buffer.called == 0){
        applyHTML(value,key);
    }else{
        fade.applyAfter("fadeOut",() =>{
            applyHTML(value,key);
        })
    }
})
buffer.add("author","#quotation #author",false,(key,value) => {
    if(buffer.called == 0){
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

ajax.success = buffer.success;

ajax.failed = () => {
    console.log('request failed');
}
ajax.oncall = () => {
    if(buffer.called > 0){
        fade.fadeElmeent("out");
    }
}

ajax.call();

btn.addEventListener("click",ajax.call);