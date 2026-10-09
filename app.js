// Pas producten hier aan (n = naam, d = beschrijving, p = prijs). Voor een echte foto: zet bij een product img:"fotos/jas.jpg"
const products=[
 {n:"Linde jas",d:"Een warme jas met een rustige, rechte lijn. Gemakkelijk te combineren en gemaakt om meerdere winters mee te gaan.",p:189,c:"#F4CFD7",t:"#111"},
 {n:"Mira blouse",d:"Een lichte blouse met een soepele val. Draag hem open over een top of dichtgeknoopt met een broek.",p:79,c:"#FFFFFF",t:"#111",b:1},
 {n:"Aster broek",d:"Een hoog getailleerde broek met een rechte pijp. Zit comfortabel en blijft netjes in model.",p:99,c:"#111111",t:"#fff"},
 {n:"Noor jurk",d:"Een jurk met een zachte pasvorm die zowel overdag als in de avond past.",p:129,c:"#F9E3E8",t:"#111"},
 {n:"Fenn trui",d:"Een zachte trui met een ontspannen pasvorm. Fijn onder een jas en op zichzelf.",p:89,c:"#111111",t:"#fff"},
 {n:"Sage overhemd",d:"Een tijdloos overhemd met een nette kraag. Past bij alles in je kast.",p:85,c:"#F4CFD7",t:"#111"}
];
const eur=v=>"€"+v.toFixed(2).replace(".",",");
const $=id=>document.getElementById(id);

// Winkelwagen blijft bewaard tussen pagina's
let cart=[];
try{cart=JSON.parse(localStorage.getItem("elithe-cart")||"[]")}catch(e){}
const save=()=>{try{localStorage.setItem("elithe-cart",JSON.stringify(cart))}catch(e){}};

const pic=x=>x.img?`<img class="pic" src="${x.img}" alt="${x.n}" style="object-fit:cover;width:100%">`:`<div class="pic" style="background:${x.c};color:${x.t};${x.b?'border:1px solid var(--line)':''}">${x.n.split(" ")[0]}</div>`;
const card=(x,i)=>`<article class="item">
 <a href="product.html?id=${i}" aria-label="${x.n}">${pic(x)}</a>
 <h3><a href="product.html?id=${i}">${x.n}</a></h3><div class="row"><span>${eur(x.p)}</span><button onclick="add(${i})">In winkelwagen</button></div></article>`;

// Startpagina: de eerste 3 producten zijn "Trending"
if($("grid-trending")) $("grid-trending").innerHTML=products.slice(0,3).map((x,i)=>card(x,i)).join("");

// Reviews op de startpagina
// LET OP: dit zijn VOORBEELDEN. Vervang ze door echte reviews van klanten voordat de site live gaat
// (nep-reviews tonen is in Nederland/EU niet toegestaan). Haal daarna ook de regel "Voorbeeldreviews" in index.html weg.
// s = sterren (1 t/m 5), q = tekst, n = naam, p = product
const reviews=[
 {s:5,q:"De jas zit precies zoals ik hoopte: warm, maar niet zwaar. Ik draag hem bijna elke dag.",n:"Voorbeeld A.",p:"Linde jas"},
 {s:5,q:"Mooie stof en een fijne val. Valt goed op maat, ik heb mijn normale maat genomen.",n:"Voorbeeld B.",p:"Mira blouse"},
 {s:4,q:"Zit heel comfortabel en blijft netjes. De pijpen waren voor mij iets lang.",n:"Voorbeeld C.",p:"Aster broek"},
 {s:5,q:"Snel in huis en heel netjes verpakt. De jurk is nog mooier dan op de foto.",n:"Voorbeeld D.",p:"Noor jurk"},
 {s:5,q:"Zachte trui die na het wassen gewoon in model blijft. Ik wil hem in nog een kleur.",n:"Voorbeeld E.",p:"Fenn trui"}
];
if($("rv-track")){
 const stars=s=>"★★★★★".slice(0,s)+"☆☆☆☆☆".slice(0,5-s);
 $("rv-track").innerHTML=reviews.map(r=>`<figure class="rv-card">
  <div class="rv-stars" aria-label="${r.s} van 5 sterren">${stars(r.s)}</div>
  <blockquote>${r.q}</blockquote>
  <figcaption><strong>${r.n}</strong><span>${r.p}</span></figcaption></figure>`).join("");
 const avg=reviews.reduce((t,r)=>t+r.s,0)/reviews.length;
 $("rv-score").innerHTML=`<span class="rv-big">${avg.toFixed(1).replace(".",",")}</span><span>van 5 · ${reviews.length} reviews</span>`;
 const step=d=>{const t=$("rv-track"),c=t.querySelector(".rv-card");t.scrollBy({left:d*(c?c.offsetWidth+24:300),behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"})};
 $("rv-prev").onclick=()=>step(-1);
 $("rv-next").onclick=()=>step(1);
}

// Collectiepagina: alle producten met sorteren
if($("grid-collection")){
 const sorts={
  aanbevolen:(a,b)=>a.i-b.i,
  laag:(a,b)=>a.x.p-b.x.p,
  hoog:(a,b)=>b.x.p-a.x.p,
  az:(a,b)=>a.x.n.localeCompare(b.x.n),
  za:(a,b)=>b.x.n.localeCompare(a.x.n)
 };
 const show=()=>{
  const list=products.map((x,i)=>({x,i})).sort(sorts[$("sort").value]);
  $("grid-collection").innerHTML=list.map(o=>card(o.x,o.i)).join("");
  $("total-items").textContent=products.length+" producten";
 };
 $("sort").onchange=show;
 show();
}

// Productpagina: product.html?id=0
if($("product")){
 const id=Number(new URLSearchParams(location.search).get("id"));
 const x=products[id];
 if(!x){
  $("product").innerHTML='<p>Dit product bestaat niet. <a href="collectie.html" style="text-decoration:underline">Terug naar de collectie</a></p>';
 }else{
  document.title=x.n+" | ELITHÉ";
  let size="";
  $("product").innerHTML=`<div class="big">${pic(x)}</div>
  <div class="info">
   <p class="crumbs"><a href="index.html">Home</a> / <a href="collectie.html">Collection</a> / ${x.n}</p>
   <h1 class="h2">${x.n}</h1>
   <p class="price">${eur(x.p)}</p>
   <p class="desc">${x.d||""}</p>
   <p class="label">Maat</p>
   <div class="sizes" role="group" aria-label="Kies een maat">${["XS","S","M","L","XL"].map(s=>`<button type="button" data-s="${s}">${s}</button>`).join("")}</div>
   <p class="warn" id="warn" role="alert"></p>
   <button class="btn" id="buy">In winkelwagen</button>
  </div>`;
  document.querySelectorAll(".sizes button").forEach(b=>b.onclick=()=>{
   size=b.dataset.s;$("warn").textContent="";
   document.querySelectorAll(".sizes button").forEach(o=>o.classList.toggle("on",o===b));
  });
  $("buy").onclick=()=>{
   if(!size){$("warn").textContent="Kies eerst een maat.";return}
   add(id,size);
  };
 }
}

function add(i,size){cart.push(size?{...products[i],size}:products[i]);save();draw();$("cart").classList.add("open")}
function del(i){cart.splice(i,1);save();draw()}
function draw(){
 $("count").textContent=cart.length;
 $("badge").textContent=cart.length||"";
 $("lines").innerHTML=cart.length?cart.map((x,i)=>`<li><span>${x.n}${x.size?" ("+x.size+")":""}</span><span>${eur(x.p)}<button onclick="del(${i})" aria-label="Verwijder ${x.n}">✕</button></span></li>`).join(""):"<li>Je winkelwagen is leeg. Kies een product uit de collectie.</li>";
 $("sum").textContent=eur(cart.reduce((t,x)=>t+x.p,0));
}
// Startpagina: banner vult het beginscherm, met evenveel wit boven en onder
const setTop=()=>document.documentElement.style.setProperty("--top",(document.querySelector(".bar").offsetHeight+document.querySelector("body > header").offsetHeight)+"px");
if(document.querySelector(".stage")){setTop();addEventListener("resize",setTop)}

// Mobiel menu
const hd=document.querySelector("body > header");
$("menu").onclick=()=>{const o=hd.classList.toggle("open");$("menu").setAttribute("aria-expanded",o)};
document.querySelectorAll("#nav a").forEach(l=>l.addEventListener("click",()=>{hd.classList.remove("open")}));
$("open").onclick=()=>$("cart").classList.add("open");
$("close").onclick=()=>$("cart").classList.remove("open");

// Alleen op de startpagina: klik op het logo zet de banner precies in het midden
const banner=document.querySelector(".banner");
if(banner) document.querySelector(".logo").addEventListener("click",e=>{
 e.preventDefault();
 const b=banner.getBoundingClientRect();
 const h=document.querySelector("body > header").offsetHeight;
 const y=window.scrollY+b.top+b.height/2-(h+window.innerHeight)/2;
 const calm=matchMedia("(prefers-reduced-motion:reduce)").matches;
 window.scrollTo({top:Math.max(0,y),behavior:calm?"auto":"smooth"});
});
draw();
