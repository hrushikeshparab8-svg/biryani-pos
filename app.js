let cart=[], orderType="Dine In";
let gstOn=true, gstRate=5;

function toggleMenu(){
 sidebar.style.left = sidebar.style.left=="0px"?"-260px":"0px";
}

function nav(p){
 document.querySelectorAll('.page').forEach(s=>s.classList.add('hidden'));
 document.getElementById(p).classList.remove('hidden');
 title.innerText=p.toUpperCase();
 toggleMenu();
}

function setType(t){ orderType=t; }

function addItem(name,price){
 let q=prompt("Quantity?");
 if(!q) return;
 cart.push({name,price,qty:q});
 renderTotal();
}

function renderMenu(){
 menuList.innerHTML="";
 getMenu().forEach(i=>{
  menuList.innerHTML+=`<div onclick="addItem('${i.name}',${i.price})">
    <h4>${i.name}</h4>
    ₹${i.price}
  </div>`;
 });
}

function renderTotal(){
 let t=cart.reduce((s,i)=>s+i.price*i.qty,0);
 if(gstOn) t+=t*gstRate/100;
 total.innerText=t.toFixed(2);
}

renderMenu();
