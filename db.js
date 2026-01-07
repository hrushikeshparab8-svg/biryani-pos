let db;
let req=indexedDB.open("POS",1);
req.onupgradeneeded=e=>{
 db=e.target.result;
 db.createObjectStore("bills",{autoIncrement:true});
 db.createObjectStore("menu",{keyPath:"name"});
};
req.onsuccess=e=>db=e.target.result;

function saveBill(){
 let tx=db.transaction("bills","readwrite");
 tx.objectStore("bills").add({
  date:new Date(),
  orderType,
  cart
 });
 alert("Bill Saved");
 cart=[]; renderTotal();
}

function getMenu(){
 return JSON.parse(localStorage.menu||'[{"name":"Chicken Biryani","price":180}]');
}
