var C=Object.defineProperty;var E=(s,e,o)=>e in s?C(s,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[e]=o;var h=(s,e,o)=>(E(s,typeof e!="symbol"?e+"":e,o),o);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))c(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&c(a)}).observe(document,{childList:!0,subtree:!0});function o(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function c(r){if(r.ep)return;r.ep=!0;const i=o(r);fetch(r.href,i)}})();class O{constructor(e){h(this,"container");h(this,"searchInput");h(this,"onSearch");h(this,"debounceTimer",null);this.onSearch=e,this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4",e.innerHTML=`
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
    `,this.searchInput=e.querySelector("#search-input"),this.setupEventListeners(),e}debounce(e,o){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(e,o)}setupEventListeners(){this.searchInput.addEventListener("input",e=>{const o=e.target;this.debounce(()=>{this.onSearch(o.value)},500)}),this.searchInput.addEventListener("keypress",e=>{e.key==="Enter"&&this.onSearch(this.searchInput.value)})}render(){return this.container}}class ${constructor(e){this.restaurant=e}createElement(){var r;const e=document.createElement("div");e.className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow";const o="★".repeat(Math.floor(this.restaurant.rating))+"☆".repeat(5-Math.floor(this.restaurant.rating)),c="$".repeat(this.restaurant.priceLevel);return e.innerHTML=`
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg text-gray-900">${this.restaurant.name}</h3>
        <span class="text-sm text-gray-500">${((r=this.restaurant.distance)==null?void 0:r.toFixed(1))||"—"} km</span>
      </div>
      
      <div class="flex items-center mb-2">
        <span class="text-yellow-400 mr-2">${o}</span>
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
          ${this.restaurant.glutenFreeOptions.map(i=>`
            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              ${i}
            </span>
          `).join("")}
        </div>
      </div>
    `,e}}class P{constructor(){h(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex justify-center items-center py-12",e.innerHTML=`
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    `,e}render(){return this.container}show(){this.container.style.display="flex"}hide(){this.container.style.display="none"}}class R{constructor(){h(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex flex-col items-center justify-center py-12 text-center",e.innerHTML=`
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
      <p class="text-gray-500">Try adjusting your search or location</p>
    `,e}render(){return this.container}}async function _(){return new Promise(s=>{if(!navigator.geolocation){console.log("Geolocation not supported"),s(null);return}navigator.geolocation.getCurrentPosition(e=>{s({lat:e.coords.latitude,lng:e.coords.longitude})},e=>{console.error("Geolocation error:",e),s(null)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})})}const k="https://overpass-api.de/api/interpreter";function I(s,e,o,c){const i=(o-s)*Math.PI/180,a=(c-e)*Math.PI/180,n=Math.sin(i/2)*Math.sin(i/2)+Math.cos(s*Math.PI/180)*Math.cos(o*Math.PI/180)*Math.sin(a/2)*Math.sin(a/2);return 6371*(2*Math.atan2(Math.sqrt(n),Math.sqrt(1-n)))}async function A(s,e=5){const o=e*1e3,c=`
    [out:json][timeout:25];
    (
      // Restaurants with gluten-free tags
      node["amenity"~"restaurant|cafe|fast_food"]["diet:gluten_free"](around:${o},${s.lat},${s.lng});
      node["amenity"~"restaurant|cafe|fast_food"]["gluten_free"](around:${o},${s.lat},${s.lng});
      // All restaurants (we'll filter later)
      node["amenity"~"restaurant|cafe|fast_food"](around:${o},${s.lat},${s.lng});
    );
    out body;
  `;try{const r=await fetch(k,{method:"POST",body:`data=${encodeURIComponent(c)}`,headers:{"Content-Type":"application/x-www-form-urlencoded"}});if(!r.ok)throw new Error(`Overpass API error: ${r.status}`);return(await r.json()).elements.filter(n=>{var t;return(t=n.tags)==null?void 0:t.name}).map(n=>{var f,g,m,y;const t=n.tags||{},d=[];t["diet:gluten_free"]==="yes"&&d.push("Gluten-free options available"),t["diet:gluten_free"]==="only"&&d.push("Fully gluten-free restaurant"),t.gluten_free==="yes"&&d.push("Gluten-free menu available"),(f=t.cuisine)!=null&&f.includes("gluten_free")&&d.push("Gluten-free cuisine"),d.length===0&&(t["diet:vegan"]==="yes"||t["diet:vegetarian"]==="yes"?d.push("Vegan/Vegetarian - likely has GF options"):(g=t.cuisine)!=null&&g.includes("asian")||(m=t.cuisine)!=null&&m.includes("thai")||(y=t.cuisine)!=null&&y.includes("vietnamese")?d.push("Asian cuisine - often has rice-based GF options"):d.push("Call to confirm gluten-free options"));const u=I(s.lat,s.lng,n.lat,n.lon),l=t.opening_hours,w=void 0;return{id:n.id.toString(),name:t.name,address:[t["addr:street"],t["addr:housenumber"],t["addr:city"],t["addr:postcode"]].filter(Boolean).join(" ")||t.vicinity||"Address not available",rating:0,priceLevel:t.price_range?parseInt(t.price_range):0,openNow:w,distance:Math.round(u*10)/10,glutenFreeOptions:d,phone:t.phone||t["contact:phone"],website:t.website||t["contact:website"],photos:[]}}).sort((n,t)=>{const d=!n.glutenFreeOptions.some(l=>l.includes("Call to confirm")),u=!t.glutenFreeOptions.some(l=>l.includes("Call to confirm"));return d&&!u?-1:!d&&u?1:(n.distance||0)-(t.distance||0)}).slice(0,20)}catch(r){throw console.error("OpenStreetMap search error:",r),r}}const M={}.VITE_FOURSQUARE_API_KEY||"",G="https://api.foursquare.com/v3/places/search",T=["4bf58dd8d48988d1c5941735","4bf58dd8d48988d10c941735","4bf58dd8d48988d1d3941735"];function q(s,e,o,c){const i=(o-s)*Math.PI/180,a=(c-e)*Math.PI/180,n=Math.sin(i/2)*Math.sin(i/2)+Math.cos(s*Math.PI/180)*Math.cos(o*Math.PI/180)*Math.sin(a/2)*Math.sin(a/2);return 6371*(2*Math.atan2(Math.sqrt(n),Math.sqrt(1-n)))}async function N(s,e="gluten free",o=5e3){if(!M)return console.log("Foursquare API key not configured"),[];const c=new URLSearchParams({query:e,ll:`${s.lat},${s.lng}`,radius:o.toString(),categories:T.join(","),limit:"50",fields:"fsq_id,name,location,categories,rating,price,hours,website,tel,description,tips,photos"});try{const r=await fetch(`${G}?${c}`,{headers:{Accept:"application/json",Authorization:M}});if(!r.ok)throw new Error(`Foursquare API error: ${r.status}`);const i=await r.json();return(await Promise.all(i.results.map(async n=>{var f,g,m,y,x,b;const t=[];if(((f=n.categories)==null?void 0:f.some(p=>{var v;return((v=p.name)==null?void 0:v.toLowerCase().includes("gluten"))||p.id==="4bf58dd8d48988d1c5941735"}))&&t.push("Certified gluten-free restaurant"),((g=n.tips)==null?void 0:g.length)>0){const p=n.tips.filter(v=>{var L;return(L=v.text)==null?void 0:L.toLowerCase().includes("gluten")});p.length>0&&t.push(`${p.length} user tips mention gluten-free options`)}((m=n.categories)==null?void 0:m.some(p=>p.id==="4bf58dd8d48988d10c941735"))&&t.length===0&&t.push("Health food restaurant - likely has GF options"),t.length===0&&t.push("Check with restaurant for gluten-free options");const l=((y=n.geocodes)==null?void 0:y.main)||n.location,w=l!=null&&l.latitude&&(l!=null&&l.longitude)?q(s.lat,s.lng,l.latitude,l.longitude):n.distance?n.distance/1e3:void 0;return{id:n.fsq_id,name:n.name,address:n.location.formatted_address||`${n.location.address||""} ${n.location.locality||""}`.trim(),rating:n.rating?n.rating/2:0,priceLevel:n.price||0,openNow:(x=n.hours)==null?void 0:x.open_now,distance:w?Math.round(w*10)/10:void 0,glutenFreeOptions:t,phone:n.tel,website:n.website,photos:((b=n.photos)==null?void 0:b.map(p=>`${p.prefix}300x300${p.suffix}`))||[]}}))).sort((n,t)=>{const d=n.glutenFreeOptions.some(l=>l.includes("Certified")),u=t.glutenFreeOptions.some(l=>l.includes("Certified"));return d&&!u?-1:!d&&u?1:(n.distance||0)-(t.distance||0)})}catch(r){return console.error("Foursquare search error:",r),[]}}const F=[{id:"1",name:"Green Garden Café",address:"123 Main St, Downtown",rating:4.5,priceLevel:2,openNow:!0,distance:.5,glutenFreeOptions:["Gluten-free bread","GF pasta","GF desserts"]},{id:"2",name:"Healthy Bites",address:"456 Oak Ave, Midtown",rating:4.2,priceLevel:2,openNow:!0,distance:1.2,glutenFreeOptions:["GF pizza","GF sandwiches","GF salads"]},{id:"3",name:"Pure Kitchen",address:"789 Pine St, Uptown",rating:4.7,priceLevel:3,openNow:!1,distance:2.1,glutenFreeOptions:["Dedicated GF menu","GF bakery items"]}];async function j(s,e){const o=[],c=[];if(e){c.push(N(e,s||"gluten free",5e3).catch(a=>(console.warn("Foursquare search failed:",a),[]))),c.push(A(e,5).catch(a=>(console.warn("OpenStreetMap search failed:",a),[])));const r=await Promise.all(c),i=new Map;for(const a of r)for(const n of a){const t=`${n.name.toLowerCase()}_${n.address.toLowerCase()}`,d=i.get(t);(!d||n.glutenFreeOptions.some(u=>u.includes("Certified")||u.includes("Dedicated"))&&!d.glutenFreeOptions.some(u=>u.includes("Certified")||u.includes("Dedicated")))&&i.set(t,n)}o.push(...i.values())}if(o.length===0){const r=F.filter(i=>!s||i.name.toLowerCase().includes(s.toLowerCase())||i.glutenFreeOptions.some(a=>a.toLowerCase().includes(s.toLowerCase())));return s?r:F}return o.sort((r,i)=>{const a=r.glutenFreeOptions.some(t=>t.includes("Certified"))?3:r.glutenFreeOptions.some(t=>t.includes("Dedicated"))?2:r.glutenFreeOptions.some(t=>t.includes("user tips"))?1:0,n=i.glutenFreeOptions.some(t=>t.includes("Certified"))?3:i.glutenFreeOptions.some(t=>t.includes("Dedicated"))?2:i.glutenFreeOptions.some(t=>t.includes("user tips"))?1:0;return a!==n?n-a:(r.distance||999)-(i.distance||999)})}class H{constructor(){h(this,"searchBar");h(this,"loadingSpinner");h(this,"emptyState");h(this,"restaurants",[]);h(this,"userLocation");this.searchBar=new O(this.handleSearch.bind(this)),this.loadingSpinner=new P,this.emptyState=new R,this.init()}async init(){console.log("App initializing..."),this.render(),await this.requestLocation(),this.handleSearch("")}render(){const e=document.querySelector("#app");if(!e){console.error("App element not found");return}e.innerHTML="",e.innerHTML=`
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
    `;const o=document.querySelector("#search-container");o&&o.appendChild(this.searchBar.render())}async handleSearch(e){const o=document.querySelector("#content-container");if(o){o.innerHTML="",o.appendChild(this.loadingSpinner.render()),this.loadingSpinner.show();try{console.log("Searching for:",e),this.restaurants=await j(e,this.userLocation),this.loadingSpinner.hide(),this.renderResults()}catch(c){console.error("Search error:",c),this.loadingSpinner.hide(),this.renderError()}}}renderResults(){const e=document.querySelector("#content-container");if(!e)return;if(e.innerHTML="",this.restaurants.length===0){e.appendChild(this.emptyState.render());return}const o=document.createElement("div");o.className="space-y-4",this.restaurants.forEach(c=>{const r=new $(c);o.appendChild(r.createElement())}),e.appendChild(o)}renderError(){const e=document.querySelector("#content-container");e&&(e.innerHTML=`
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p class="text-gray-500">Please try again later</p>
      </div>
    `)}async requestLocation(){try{console.log("Requesting location...");const e=await _();e?(this.userLocation=e,console.log("Location obtained:",this.userLocation)):(this.userLocation=void 0,console.log("Location not available"))}catch(e){console.error("Location error:",e),this.userLocation=void 0}}}console.log("Main script loading...");function S(){console.log("Initializing app..."),new H}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",S):S();
