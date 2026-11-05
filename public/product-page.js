const money=n=>"৳"+Number(n||0).toLocaleString("en-BD");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let allProducts=[],currentProduct=null,selectedImage=0,selectedColor="",selectedSize="";
async function initProductPage(){
 const id=Number(location.pathname.split("/").filter(Boolean).pop());
 const res=await fetch("/api/products");allProducts=await res.json();
 currentProduct=allProducts.find(p=>Number(p.id)===id);
 const root=document.getElementById("productDetailRoot");
 if(!currentProduct){root.innerHTML="<h2>পণ্যটি পাওয়া যায়নি</h2><a href='/'>দোকানে ফিরে যান</a>";return;}
 const p=currentProduct,images=(Array.isArray(p.images)&&p.images.length?p.images:[p.image]).filter(Boolean);
 selectedColor=(p.colors||[])[0]||"";selectedSize=(p.sizes||[])[0]||"";
 root.innerHTML=`<div class="product-detail-grid">
 <div class="detail-gallery"><div class="detail-main-image"><img id="detailMainImage" src="${esc(images[0]||"")}" alt="${esc(p.name)}"></div><div class="detail-thumbnails">${images.map((src,i)=>`<button class="detail-thumb ${i===0?"active":""}" onclick="selectProductImage(${i})"><img src="${esc(src)}" alt="Product image ${i+1}"></button>`).join("")}</div></div>
 <section class="detail-product-info"><small class="detail-category">${esc(p.category||"Fashion")}</small><h1>${esc(p.name)}</h1><div class="detail-page-price">${money(p.price)}</div><p class="detail-page-description">${esc(p.description||"এই পণ্য সম্পর্কে বিস্তারিত তথ্য শীঘ্রই যুক্ত করা হবে।")}</p><p class="detail-page-stock">${Number(p.stock)>0?`স্টকে আছে · ${p.stock} টি`:"এই পণ্যটি বর্তমানে স্টকে নেই"}</p>
 ${p.colors?.length?`<div class="variant-block"><b>রং নির্বাচন করুন</b><div class="variant-options" id="colorOptions">${p.colors.map((c,i)=>`<button class="variant-option ${i===0?"selected":""}" onclick="chooseVariant('color','${esc(c)}',this)">${esc(c)}</button>`).join("")}</div></div>`:""}
 ${p.sizes?.length?`<div class="variant-block"><b>সাইজ নির্বাচন করুন</b><div class="variant-options" id="sizeOptions">${p.sizes.map((v,i)=>`<button class="variant-option ${i===0?"selected":""}" onclick="chooseVariant('size','${esc(v)}',this)">${esc(v)}</button>`).join("")}</div></div>`:""}
 <div class="detail-page-actions"><button class="primary-btn" ${Number(p.stock)<1?"disabled":""} onclick="addProductToCart()">কার্টে যোগ করুন</button><a class="outline-btn" href="/">আরও কেনাকাটা করুন</a></div><p id="cartFeedback" class="cart-feedback"></p></section></div>
 <section class="related-products"><div class="related-heading"><div><small>YOU MAY ALSO LIKE</small><h2>আরও সম্পর্কিত পণ্য</h2></div><div class="related-arrows"><button onclick="scrollRelated(-1)">‹</button><button onclick="scrollRelated(1)">›</button></div></div><div class="related-track" id="relatedTrack"></div></section>`;
 renderRelated();
 window.productGallery=images;
}
function selectProductImage(i){selectedImage=i;document.getElementById("detailMainImage").src=window.productGallery[i];document.querySelectorAll(".detail-thumb").forEach((b,n)=>b.classList.toggle("active",n===i))}
function chooseVariant(type,value,button){if(type==="color")selectedColor=value;else selectedSize=value;button.parentElement.querySelectorAll("button").forEach(b=>b.classList.remove("selected"));button.classList.add("selected")}
function addProductToCart(){const p=currentProduct;if(!p||p.stock<1)return;const cart=JSON.parse(localStorage.getItem("sf_cart")||"[]");const line=cart.find(x=>Number(x.id)===Number(p.id)&&x.color===selectedColor&&x.size===selectedSize);if(line){if(line.qty>=p.stock){document.getElementById("cartFeedback").textContent="স্টকে পর্যাপ্ত পণ্য নেই।";return}line.qty++}else cart.push({id:Number(p.id),qty:1,color:selectedColor,size:selectedSize});localStorage.setItem("sf_cart",JSON.stringify(cart));document.getElementById("cartFeedback").textContent="কার্টে যোগ হয়েছে!"; }
function renderRelated(){const p=currentProduct;let related=allProducts.filter(x=>x.id!==p.id&&x.active!==false&&(x.category===p.category||!p.category)).slice(0,12);if(related.length<4)related=related.concat(allProducts.filter(x=>x.id!==p.id&&!related.some(r=>r.id===x.id))).slice(0,8);document.getElementById("relatedTrack").innerHTML=related.map(x=>`<a class="related-card" href="/product/${x.id}"><img src="${esc((x.images?.[0]||x.image)||"")}" alt="${esc(x.name)}"><b>${esc(x.name)}</b><span>${money(x.price)}</span></a>`).join("")||"<p>এখনো সম্পর্কিত পণ্য নেই।</p>"}
function scrollRelated(dir){document.getElementById("relatedTrack").scrollBy({left:dir*280,behavior:"smooth"})}
initProductPage().catch(()=>document.getElementById("productDetailRoot").textContent="পণ্যের তথ্য লোড করা যায়নি।");
