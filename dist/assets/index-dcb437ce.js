var b=Object.defineProperty;var S=(s,e,a)=>e in s?b(s,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[e]=a;var g=(s,e,a)=>(S(s,typeof e!="symbol"?e+"":e,a),a);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))c(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();class E{constructor(e){g(this,"container");g(this,"searchInput");g(this,"onSearch");g(this,"debounceTimer",null);this.onSearch=e,this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4",e.innerHTML=`
      <div class="space-y-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            type="text"
            id="search-input"
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Search gluten-free restaurants..."
          >
        </div>
      </div>
    `,this.searchInput=e.querySelector("#search-input"),this.setupEventListeners(),e}debounce(e,a){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(e,a)}setupEventListeners(){this.searchInput.addEventListener("input",e=>{const a=e.target;this.debounce(()=>{this.onSearch(a.value)},500)}),this.searchInput.addEventListener("keypress",e=>{e.key==="Enter"&&this.onSearch(this.searchInput.value)})}render(){return this.container}}class ${constructor(e){this.restaurant=e}createElement(){var r;const e=document.createElement("div");e.className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow";const a="★".repeat(Math.floor(this.restaurant.rating))+"☆".repeat(5-Math.floor(this.restaurant.rating)),c="$".repeat(this.restaurant.priceLevel);return e.innerHTML=`
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg text-gray-900">${this.restaurant.name}</h3>
        <span class="text-sm text-gray-500">${((r=this.restaurant.distance)==null?void 0:r.toFixed(1))||"—"} km</span>
      </div>
      
      <div class="flex items-center mb-2">
        <span class="text-yellow-400 mr-2">${a}</span>
        <span class="text-sm text-gray-600">${this.restaurant.rating}</span>
        <span class="mx-2 text-gray-400">•</span>
        <span class="text-sm text-gray-600">${c}</span>
        ${this.restaurant.openNow!==void 0?`
          <span class="mx-2 text-gray-400">•</span>
          <span class="text-sm ${this.restaurant.openNow?"text-green-600":"text-red-600"}">
            ${this.restaurant.openNow?"Open":"Closed"}
          </span>
        `:""}
      </div>
      
      <p class="text-sm text-gray-600 mb-3">${this.restaurant.address}</p>
      
      <div class="space-y-2">
        <p class="text-sm font-medium text-gray-900">Gluten-free options:</p>
        <div class="flex flex-wrap gap-1">
          ${this.restaurant.glutenFreeOptions.map(o=>`
            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              ${o}
            </span>
          `).join("")}
        </div>
      </div>
    `,e}}class P{constructor(){g(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex justify-center items-center py-12",e.innerHTML=`
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    `,e}render(){return this.container}show(){this.container.style.display="flex"}hide(){this.container.style.display="none"}}class _{constructor(){g(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex flex-col items-center justify-center py-12 text-center",e.innerHTML=`
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
      <p class="text-gray-500">Try adjusting your search or location</p>
    `,e}render(){return this.container}}async function O(){return new Promise(s=>{if(!navigator.geolocation){console.log("Geolocation not supported"),s(null);return}navigator.geolocation.getCurrentPosition(e=>{s({lat:e.coords.latitude,lng:e.coords.longitude})},e=>{console.error("Geolocation error:",e),s(null)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})})}const I="https://overpass-api.de/api/interpreter";function A(s,e,a,c){const o=(a-s)*Math.PI/180,i=(c-e)*Math.PI/180,t=Math.sin(o/2)*Math.sin(o/2)+Math.cos(s*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(i/2)*Math.sin(i/2);return 6371*(2*Math.atan2(Math.sqrt(t),Math.sqrt(1-t)))}async function R(s,e=5){const a=e*1e3,c=`
    [out:json][timeout:25];
    (
      // Restaurants with gluten-free tags
      node["amenity"~"restaurant|cafe|fast_food"]["diet:gluten_free"](around:${a},${s.lat},${s.lng});
      node["amenity"~"restaurant|cafe|fast_food"]["gluten_free"](around:${a},${s.lat},${s.lng});
      // All restaurants (we'll filter later)
      node["amenity"~"restaurant|cafe|fast_food"](around:${a},${s.lat},${s.lng});
    );
    out body;
  `;try{const r=await fetch(I,{method:"POST",body:`data=${encodeURIComponent(c)}`,headers:{"Content-Type":"application/x-www-form-urlencoded"}});if(!r.ok)throw new Error(`Overpass API error: ${r.status}`);return(await r.json()).elements.filter(t=>{var n;return(n=t.tags)==null?void 0:n.name}).map(t=>{var p,y,w,f;const n=t.tags||{},l=[];n["diet:gluten_free"]==="yes"&&l.push("Gluten-free options available"),n["diet:gluten_free"]==="only"&&l.push("Fully gluten-free restaurant"),n.gluten_free==="yes"&&l.push("Gluten-free menu available"),(p=n.cuisine)!=null&&p.includes("gluten_free")&&l.push("Gluten-free cuisine"),l.length===0&&(n["diet:vegan"]==="yes"||n["diet:vegetarian"]==="yes"?l.push("Vegan/Vegetarian - likely has GF options"):(y=n.cuisine)!=null&&y.includes("asian")||(w=n.cuisine)!=null&&w.includes("thai")||(f=n.cuisine)!=null&&f.includes("vietnamese")?l.push("Asian cuisine - often has rice-based GF options"):l.push("Call to confirm gluten-free options"));const u=A(s.lat,s.lng,t.lat,t.lon),d=n.opening_hours,v=void 0;return{id:t.id.toString(),name:n.name,address:[n["addr:street"],n["addr:housenumber"],n["addr:city"],n["addr:postcode"]].filter(Boolean).join(" ")||n.vicinity||"Address not available",rating:0,priceLevel:n.price_range?parseInt(n.price_range):0,openNow:v,distance:Math.round(u*10)/10,glutenFreeOptions:l,phone:n.phone||n["contact:phone"],website:n.website||n["contact:website"],photos:[]}}).sort((t,n)=>{const l=!t.glutenFreeOptions.some(d=>d.includes("Call to confirm")),u=!n.glutenFreeOptions.some(d=>d.includes("Call to confirm"));return l&&!u?-1:!l&&u?1:(t.distance||0)-(n.distance||0)}).slice(0,20)}catch(r){throw console.error("OpenStreetMap search error:",r),r}}const L={}.VITE_FOURSQUARE_API_KEY||"",G="https://api.foursquare.com/v3/places/search",k=["4bf58dd8d48988d1c5941735","4bf58dd8d48988d10c941735","4bf58dd8d48988d1d3941735"];function T(s,e,a,c){const o=(a-s)*Math.PI/180,i=(c-e)*Math.PI/180,t=Math.sin(o/2)*Math.sin(o/2)+Math.cos(s*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(i/2)*Math.sin(i/2);return 6371*(2*Math.atan2(Math.sqrt(t),Math.sqrt(1-t)))}async function j(s,e="gluten free",a=5e3){if(!L)return console.log("Foursquare API key not configured"),[];const c=new URLSearchParams({query:e,ll:`${s.lat},${s.lng}`,radius:a.toString(),categories:k.join(","),limit:"50",fields:"fsq_id,name,location,categories,rating,price,hours,website,tel,description,tips,photos"});try{const r=await fetch(`${G}?${c}`,{headers:{Accept:"application/json",Authorization:L}});if(!r.ok)throw new Error(`Foursquare API error: ${r.status}`);const o=await r.json();return(await Promise.all(o.results.map(async t=>{var v,p,y,w,f;const n=[];if(((v=t.categories)==null?void 0:v.some(h=>{var m;return((m=h.name)==null?void 0:m.toLowerCase().includes("gluten"))||h.id==="4bf58dd8d48988d1c5941735"}))&&n.push("Certified gluten-free restaurant"),((p=t.tips)==null?void 0:p.length)>0){const h=t.tips.filter(m=>{var M;return(M=m.text)==null?void 0:M.toLowerCase().includes("gluten")});h.length>0&&n.push(`${h.length} user tips mention gluten-free options`)}((y=t.categories)==null?void 0:y.some(h=>h.id==="4bf58dd8d48988d10c941735"))&&n.length===0&&n.push("Health food restaurant - likely has GF options"),n.length===0&&n.push("Check with restaurant for gluten-free options");const d=T(s.lat,s.lng,t.location.lat,t.location.lng);return{id:t.fsq_id,name:t.name,address:t.location.formatted_address||`${t.location.address||""} ${t.location.locality||""}`.trim(),rating:t.rating?t.rating/2:0,priceLevel:t.price||0,openNow:(w=t.hours)==null?void 0:w.open_now,distance:Math.round(d*10)/10,glutenFreeOptions:n,phone:t.tel,website:t.website,photos:((f=t.photos)==null?void 0:f.map(h=>`${h.prefix}300x300${h.suffix}`))||[]}}))).sort((t,n)=>{const l=t.glutenFreeOptions.some(d=>d.includes("Certified")),u=n.glutenFreeOptions.some(d=>d.includes("Certified"));return l&&!u?-1:!l&&u?1:(t.distance||0)-(n.distance||0)})}catch(r){return console.error("Foursquare search error:",r),[]}}const x={}.VITE_YELP_API_KEY||"",q="https://api.yelp.com/v3/businesses/search";function N(s,e,a,c){const o=(a-s)*Math.PI/180,i=(c-e)*Math.PI/180,t=Math.sin(o/2)*Math.sin(o/2)+Math.cos(s*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(i/2)*Math.sin(i/2);return 6371*(2*Math.atan2(Math.sqrt(t),Math.sqrt(1-t)))}async function H(s,e="gluten free",a=5e3){if(!x)return console.log("Yelp API key not configured"),[];const c=new URLSearchParams({term:`${e} restaurant`,latitude:s.lat.toString(),longitude:s.lng.toString(),radius:Math.min(a,4e4).toString(),categories:"restaurants,gluten_free",attributes:"gluten_free_friendly",limit:"50",sort_by:"distance"});try{const r=await fetch(`${q}?${c}`,{headers:{Authorization:`Bearer ${x}`,Accept:"application/json"}});if(!r.ok)throw new Error(`Yelp API error: ${r.status}`);const o=await r.json();return(await Promise.all(o.businesses.map(async t=>{var d,v;const n=[];(d=t.attributes)!=null&&d.gluten_free_friendly&&n.push("Yelp verified: Gluten-free friendly"),((v=t.categories)==null?void 0:v.some(p=>{var y;return p.alias==="gluten_free"||((y=p.title)==null?void 0:y.toLowerCase().includes("gluten"))}))&&n.push("Listed as gluten-free restaurant");try{const p=await fetch(`https://api.yelp.com/v3/businesses/${t.id}/reviews`,{headers:{Authorization:`Bearer ${x}`,Accept:"application/json"}});if(p.ok){const w=(await p.json()).reviews.filter(f=>f.text.toLowerCase().includes("gluten"));if(w.length>0){n.push(`${w.length} reviews mention gluten-free`);const f=new Set;w.forEach(h=>{const m=h.text.toLowerCase();(m.includes("dedicated gluten")||m.includes("separate fryer"))&&f.add("Dedicated GF preparation"),(m.includes("gf menu")||m.includes("gluten free menu"))&&f.add("GF menu available"),(m.includes("celiac safe")||m.includes("celiac friendly"))&&f.add("Celiac safe")}),f.forEach(h=>n.push(h))}}}catch(p){console.warn("Failed to fetch reviews:",p)}n.length===0&&n.push("Contact restaurant for gluten-free options");const u=N(s.lat,s.lng,t.coordinates.latitude,t.coordinates.longitude);return{id:t.id,name:t.name,address:t.location.display_address.join(", "),rating:t.rating,priceLevel:t.price?t.price.length:0,openNow:!t.is_closed,distance:Math.round(u*10)/10,glutenFreeOptions:n,phone:t.display_phone||t.phone,website:t.url,photos:t.photos||[]}}))).sort((t,n)=>{const l=t.glutenFreeOptions.some(d=>d.includes("verified")||d.includes("Celiac safe")),u=n.glutenFreeOptions.some(d=>d.includes("verified")||d.includes("Celiac safe"));return l&&!u?-1:!l&&u?1:(t.distance||0)-(n.distance||0)})}catch(r){return console.error("Yelp search error:",r),[]}}const C=[{id:"1",name:"Green Garden Café",address:"123 Main St, Downtown",rating:4.5,priceLevel:2,openNow:!0,distance:.5,glutenFreeOptions:["Gluten-free bread","GF pasta","GF desserts"]},{id:"2",name:"Healthy Bites",address:"456 Oak Ave, Midtown",rating:4.2,priceLevel:2,openNow:!0,distance:1.2,glutenFreeOptions:["GF pizza","GF sandwiches","GF salads"]},{id:"3",name:"Pure Kitchen",address:"789 Pine St, Uptown",rating:4.7,priceLevel:3,openNow:!1,distance:2.1,glutenFreeOptions:["Dedicated GF menu","GF bakery items"]}];async function D(s,e){const a=[],c=[];if(e){c.push(j(e,s||"gluten free",5e3).catch(i=>(console.warn("Foursquare search failed:",i),[]))),c.push(H(e,s||"gluten free",5e3).catch(i=>(console.warn("Yelp search failed:",i),[]))),c.push(R(e,5).catch(i=>(console.warn("OpenStreetMap search failed:",i),[])));const r=await Promise.all(c),o=new Map;for(const i of r)for(const t of i){const n=`${t.name.toLowerCase()}_${t.address.toLowerCase()}`,l=o.get(n);(!l||t.glutenFreeOptions.some(u=>u.includes("Certified")||u.includes("Dedicated"))&&!l.glutenFreeOptions.some(u=>u.includes("Certified")||u.includes("Dedicated")))&&o.set(n,t)}a.push(...o.values())}if(a.length===0){const r=C.filter(o=>!s||o.name.toLowerCase().includes(s.toLowerCase())||o.glutenFreeOptions.some(i=>i.toLowerCase().includes(s.toLowerCase())));return s?r:C}return a.sort((r,o)=>{const i=r.glutenFreeOptions.some(n=>n.includes("Certified"))?3:r.glutenFreeOptions.some(n=>n.includes("Dedicated"))?2:r.glutenFreeOptions.some(n=>n.includes("user tips"))?1:0,t=o.glutenFreeOptions.some(n=>n.includes("Certified"))?3:o.glutenFreeOptions.some(n=>n.includes("Dedicated"))?2:o.glutenFreeOptions.some(n=>n.includes("user tips"))?1:0;return i!==t?t-i:(r.distance||999)-(o.distance||999)})}class U{constructor(){g(this,"searchBar");g(this,"loadingSpinner");g(this,"emptyState");g(this,"restaurants",[]);g(this,"userLocation");this.searchBar=new E(this.handleSearch.bind(this)),this.loadingSpinner=new P,this.emptyState=new _,this.init()}async init(){console.log("App initializing..."),this.render(),await this.requestLocation(),this.handleSearch("")}render(){const e=document.querySelector("#app");if(!e){console.error("App element not found");return}e.innerHTML="",e.innerHTML=`
      <div class="min-h-screen bg-gray-50">
        <div class="max-w-md mx-auto bg-white min-h-screen">
          <!-- Header -->
          <div class="bg-green-500 text-white p-4">
            <h1 class="text-xl font-bold text-center">Gluten-Free Finder</h1>
            <p class="text-green-100 text-sm text-center mt-1">Find safe dining options near you</p>
          </div>
          
          <!-- Search Bar Container -->
          <div id="search-container"></div>
          
          <!-- Content Container -->
          <div id="content-container" class="p-4">
            <!-- Results will be rendered here -->
          </div>
        </div>
      </div>
    `;const a=document.querySelector("#search-container");a&&a.appendChild(this.searchBar.render())}async handleSearch(e){const a=document.querySelector("#content-container");if(a){a.innerHTML="",a.appendChild(this.loadingSpinner.render()),this.loadingSpinner.show();try{console.log("Searching for:",e),this.restaurants=await D(e,this.userLocation),this.loadingSpinner.hide(),this.renderResults()}catch(c){console.error("Search error:",c),this.loadingSpinner.hide(),this.renderError()}}}renderResults(){const e=document.querySelector("#content-container");if(!e)return;if(e.innerHTML="",this.restaurants.length===0){e.appendChild(this.emptyState.render());return}const a=document.createElement("div");a.className="space-y-4",this.restaurants.forEach(c=>{const r=new $(c);a.appendChild(r.createElement())}),e.appendChild(a)}renderError(){const e=document.querySelector("#content-container");e&&(e.innerHTML=`
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p class="text-gray-500">Please try again later</p>
      </div>
    `)}async requestLocation(){try{console.log("Requesting location...");const e=await O();e?(this.userLocation=e,console.log("Location obtained:",this.userLocation)):(this.userLocation=void 0,console.log("Location not available"))}catch(e){console.error("Location error:",e),this.userLocation=void 0}}}console.log("Main script loading...");function F(){console.log("Initializing app..."),new U}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",F):F();
