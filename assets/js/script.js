let bq = document.querySelector("#quotation blockquote");
let img = document.querySelector("#quotation img");
let p = document.querySelector("#quotation #author")
let btn = document.querySelector("#quotation #reloader")
let ajax = new XMLHttpRequest();
img.style.display = "none";
bq.style.display = "none";
function onLoad(){
    if(ajax.status >= 200 && ajax.status < 300 ){
        bq.style.display = "block";
        let query = JSON.parse(ajax.responseText);
        if(query.photo != ""){
            img.src = query.photo;
            img.style.display = "block";
        }else{
            img.style.display = "none";
        }
        bq.innerText = query.quote;
        p.innerText = query.author;
    }else{
        console.log("Request failed");
    }
}

ajax.onload = onLoad;

function sendRequest(){
    ajax.open("GET","https://thatsthespir.it/api");
    ajax.send();
}

sendRequest();

btn.addEventListener("click",sendRequest);