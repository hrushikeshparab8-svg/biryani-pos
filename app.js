let db = indexedDB.open("posDB",1);
let order=[], mode="Table 1";

if(!localStorage.pass) localStorage.pass="1234";
if(!localStorage.shop) localStorage.shop="The House of Biryani’s";
if(!localStorage.gstOn) localStorage.gstOn="0";
if(!localStorage.gstRate) localStorage.gstRate="5";
if(!localStorage.gstNo) localStorage.gstNo="";

db.onupgradeneeded=e=>{
 let d=e.target.result;
 d.createObjectStore("bills",{autoIncrement:true});
};

function login(){
 if(password.value===localStorage.pass){
   loginDiv(true);
 } else alert("Wrong password");
}
function loginDiv(ok){
 login.hidden=ok;
 app.hidden=!ok;
 shopName.innerText=localStorage.shop;
 headerName.innerText=localStorage.shop+" POS";
}

function setMode(m){mode=m;}

function addItem(){
 let p=price.value*qty.value;
 order.push({n:item.value,q:qty.value,p});
 render();
}

function render(){
 let s=0;
 items.innerHTML="";
 order.forEach(o=>{
   s+=o.p;
   items.innerHTML+=`<li>${o.n} x${o.q} ₹${o.p}</li>`;
 });
 sub.innerText=s.toFixed(2);
 let g=localStorage.gstOn=="1"?s*localStorage.gstRate/100:0;
 gst.innerText=g.toFixed(2);
 total.innerText=(s+g).toFixed(2);
}

function saveBill(){
 let tx=db.result.transaction("bills","readwrite");
 tx.objectStore("bills").add({
   date:new Date(),
   mode,order,total:total.innerText
 });
 alert("Saved");
 order=[];
 render();
}

function printBill(){window.print();}

function openSettings(){
 let p=prompt("Enter password");
 if(p!==localStorage.pass) return;
 let n=prompt("Restaurant name",localStorage.shop);
 if(n) localStorage.shop=n;
 let g=confirm("Enable GST?");
 localStorage.gstOn=g?"1":"0";
 let r=prompt("GST %",localStorage.gstRate);
 if(r) localStorage.gstRate=r;
 let gn=prompt("GST Number",localStorage.gstNo);
 if(gn) localStorage.gstNo=gn;
 let np=prompt("Change password?");
 if(np) localStorage.pass=np;
 location.reload();
}
