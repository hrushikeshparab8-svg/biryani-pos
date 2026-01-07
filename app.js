let db;
let cart=[];
let orderType="Dine In";
let gstOn=false;

const openDB=()=>{
 let r=indexedDB.open("POS",1);
 r.onupgradeneeded=e=>{
  let d=e.target.result;
  d.createObjectStore("bills",{autoIncrement:true});
 };
 r.onsuccess=e=>db=e.target.result;
};
openDB();

function nav(p){
 document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"));
 document.getElementById(p).classList.remove("hidden");
}

function openSettings(){
 let p=prompt("Enter Settings Password");
 if(p===localStorage.pass) nav("settings");
 else alert("Wrong password");
}

if(!localStorage.pass) localStorage.pass="1234";

function setType(t){orderType=t;}

function getMenu(){
 return JSON.parse(localStorage.menu||"[]");
}

function renderMenu(){
 let m=getMenu();
 menu.innerHTML="";
 m.forEach(i=>{
  let b=document.createElement("button");
  b.textContent=`${i.name} ₹${i.price}`;
  b.onclick=()=>{cart.push(i);calcTotal();};
  menu.appendChild(b);
 });
}
renderMenu();

function calcTotal(){
 let t=cart.reduce((s,i)=>s+i.price,0);
 gstOn=document.getElementById("gstToggle")?.checked;
 if(gstOn) t+=t*(parseFloat(gstRate.value||0)/100);
 total.textContent=t.toFixed(2);
}

function saveBill(){
 let bill={
  cart,
  orderType,
  date:new Date(),
  total:total.textContent
 };
 let tx=db.transaction("bills","readwrite");
 tx.objectStore("bills").add(bill);
 cart=[];
 total.textContent=0;
 alert("Bill Saved");
}

function loadBills(){
 billList.innerHTML="";
 let tx=db.transaction("bills","readonly");
 tx.objectStore("bills").openCursor().onsuccess=e=>{
  let c=e.target.result;
  if(c){
   billList.innerHTML+=`
    <div class="billItem" onclick="viewBill(${c.key})">
     ${new Date(c.value.date).toLocaleString()} ₹${c.value.total}
    </div>`;
   c.continue();
  }
 };
}

function viewBill(id){
 let tx=db.transaction("bills","readonly");
 tx.objectStore("bills").get(id).onsuccess=e=>{
  let b=e.target.result;
  let h=`<h3>${localStorage.resName||""}</h3>${localStorage.resAddr||""}<hr>`;
  b.cart.forEach(i=>h+=`${i.name} ₹${i.price}<br>`);
  h+=`<hr>Total ₹${b.total}`;
  billContent.innerHTML=h;
  billView.classList.remove("hidden");
 };
}

function closeBill(){billView.classList.add("hidden");}

function loadSales(){
 let sales={};
 let tx=db.transaction("bills","readonly");
 tx.objectStore("bills").openCursor().onsuccess=e=>{
  let c=e.target.result;
  if(c){
   c.value.cart.forEach(i=>{
    sales[i.name]=(sales[i.name]||0)+1;
   });
   c.continue();
  }else{
   let h="";
   for(let k in sales) h+=`${k}: ${sales[k]} plates<br>`;
   salesData.innerHTML=h;
  }
 };
}

function addMenu(){
 let m=getMenu();
 m.push({name:itemName.value,price:parseFloat(itemPrice.value)});
 localStorage.menu=JSON.stringify(m);
 renderMenu();
}

function changePass(){
 localStorage.pass=newPass.value;
 alert("Password Changed");
}

function deleteAllBills(){
 if(confirm("Delete all bills?")){
  let tx=db.transaction("bills","readwrite");
  tx.objectStore("bills").clear();
 }
}

function loadLogo(e){
 let r=new FileReader();
 r.onload=()=>localStorage.logo=r.result;
 r.readAsDataURL(e.target.files[0]);
}
