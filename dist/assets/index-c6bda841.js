var O=Object.defineProperty;var $=(n,e,s)=>e in n?O(n,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):n[e]=s;var h=(n,e,s)=>($(n,typeof e!="symbol"?e+"":e,s),s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))l(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function s(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(r){if(r.ep)return;r.ep=!0;const i=s(r);fetch(r.href,i)}})();class P{constructor(e){h(this,"container");h(this,"searchInput");h(this,"onSearch");h(this,"debounceTimer",null);this.onSearch=e,this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4",e.innerHTML=`
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
    `,this.searchInput=e.querySelector("#search-input"),this.setupEventListeners(),e}debounce(e,s){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(e,s)}setupEventListeners(){this.searchInput.addEventListener("input",e=>{const s=e.target;this.debounce(()=>{this.onSearch(s.value)},500)}),this.searchInput.addEventListener("keypress",e=>{e.key==="Enter"&&this.onSearch(this.searchInput.value)})}render(){return this.container}}class I{constructor(e){this.restaurant=e}createElement(){var r;const e=document.createElement("div");e.className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow";const s="★".repeat(Math.floor(this.restaurant.rating))+"☆".repeat(5-Math.floor(this.restaurant.rating)),l="$".repeat(this.restaurant.priceLevel);return e.innerHTML=`
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg text-gray-900">${this.restaurant.name}</h3>
        <span class="text-sm text-gray-500">${((r=this.restaurant.distance)==null?void 0:r.toFixed(1))||"—"} km</span>
      </div>
      
      <div class="flex items-center mb-2">
        <span class="text-yellow-400 mr-2">${s}</span>
        <span class="text-sm text-gray-600">${this.restaurant.rating}</span>
        <span class="mx-2 text-gray-400">•</span>
        <span class="text-sm text-gray-600">${l}</span>
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
    `,e}}class R{constructor(){h(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex justify-center items-center py-12",e.innerHTML=`
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    `,e}render(){return this.container}show(){this.container.style.display="flex"}hide(){this.container.style.display="none"}}class _{constructor(){h(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex flex-col items-center justify-center py-12 text-center",e.innerHTML=`
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
      <p class="text-gray-500">Try adjusting your search or location</p>
    `,e}render(){return this.container}}async function k(){return new Promise(n=>{if(!navigator.geolocation){console.log("Geolocation not supported"),n(null);return}navigator.geolocation.getCurrentPosition(e=>{n({lat:e.coords.latitude,lng:e.coords.longitude})},e=>{console.error("Geolocation error:",e),n(null)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})})}const A="https://overpass-api.de/api/interpreter";function G(n,e,s,l){const i=(s-n)*Math.PI/180,a=(l-e)*Math.PI/180,c=Math.sin(i/2)*Math.sin(i/2)+Math.cos(n*Math.PI/180)*Math.cos(s*Math.PI/180)*Math.sin(a/2)*Math.sin(a/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}async function T(n,e=5){const s=e*1e3,l=`
    [out:json][timeout:25];
    (
      // Restaurants with gluten-free tags
      node["amenity"~"restaurant|cafe|fast_food"]["diet:gluten_free"](around:${s},${n.lat},${n.lng});
      node["amenity"~"restaurant|cafe|fast_food"]["gluten_free"](around:${s},${n.lat},${n.lng});
      // All restaurants (we'll filter later)
      node["amenity"~"restaurant|cafe|fast_food"](around:${s},${n.lat},${n.lng});
    );
    out body;
  `;try{const r=await fetch(A,{method:"POST",body:`data=${encodeURIComponent(l)}`,headers:{"Content-Type":"application/x-www-form-urlencoded"}});if(!r.ok)throw new Error(`Overpass API error: ${r.status}`);return(await r.json()).elements.filter(c=>{var t;return(t=c.tags)==null?void 0:t.name}).map(c=>{var u,m,y,w;const t=c.tags||{},o=[];t["diet:gluten_free"]==="yes"&&o.push("Gluten-free options available"),t["diet:gluten_free"]==="only"&&o.push("Fully gluten-free restaurant"),t.gluten_free==="yes"&&o.push("Gluten-free menu available"),(u=t.cuisine)!=null&&u.includes("gluten_free")&&o.push("Gluten-free cuisine"),o.length===0&&(t["diet:vegan"]==="yes"||t["diet:vegetarian"]==="yes"?o.push("Vegan/Vegetarian - likely has GF options"):(m=t.cuisine)!=null&&m.includes("asian")||(y=t.cuisine)!=null&&y.includes("thai")||(w=t.cuisine)!=null&&w.includes("vietnamese")?o.push("Asian cuisine - often has rice-based GF options"):o.push("Call to confirm gluten-free options"));const d=G(n.lat,n.lng,c.lat,c.lon),g=t.opening_hours,f=void 0;return{id:c.id.toString(),name:t.name,address:[t["addr:street"],t["addr:housenumber"],t["addr:city"],t["addr:postcode"]].filter(Boolean).join(" ")||t.vicinity||"Address not available",rating:0,priceLevel:t.price_range?parseInt(t.price_range):0,openNow:f,distance:Math.round(d*10)/10,glutenFreeOptions:o,phone:t.phone||t["contact:phone"],website:t.website||t["contact:website"],photos:[]}}).sort((c,t)=>{const o=!c.glutenFreeOptions.some(g=>g.includes("Call to confirm")),d=!t.glutenFreeOptions.some(g=>g.includes("Call to confirm"));return o&&!d?-1:!o&&d?1:(c.distance||0)-(t.distance||0)}).slice(0,20)}catch(r){throw console.error("OpenStreetMap search error:",r),r}}const S={}.VITE_FOURSQUARE_API_KEY||"",q="https://api.foursquare.com/v3/places/search",N=["4bf58dd8d48988d1c5941735","4bf58dd8d48988d10c941735","4bf58dd8d48988d1d3941735"];function j(n,e,s,l){const i=(s-n)*Math.PI/180,a=(l-e)*Math.PI/180,c=Math.sin(i/2)*Math.sin(i/2)+Math.cos(n*Math.PI/180)*Math.cos(s*Math.PI/180)*Math.sin(a/2)*Math.sin(a/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}async function H(n,e="gluten free",s=5e3){if(!S)return console.log("Foursquare API key not configured"),[];const l=new URLSearchParams({query:e,ll:`${n.lat},${n.lng}`,radius:s.toString(),categories:N.join(","),limit:"50",fields:"fsq_id,name,location,categories,rating,price,hours,website,tel,description,tips,photos"}),r=new AbortController,i=setTimeout(()=>r.abort(),1e4);try{const a=await fetch(`${q}?${l}`,{headers:{Accept:"application/json",Authorization:S},signal:r.signal});if(clearTimeout(i),!a.ok)throw new Error(`Foursquare API error: ${a.status}`);const c=await a.json();return(await Promise.all(c.results.map(async o=>{var y,w,x,b,L,M;const d=[];if(((y=o.categories)==null?void 0:y.some(p=>{var v;return((v=p.name)==null?void 0:v.toLowerCase().includes("gluten"))||p.id==="4bf58dd8d48988d1c5941735"}))&&d.push("Certified gluten-free restaurant"),((w=o.tips)==null?void 0:w.length)>0){const p=o.tips.filter(v=>{var F;return(F=v.text)==null?void 0:F.toLowerCase().includes("gluten")});p.length>0&&d.push(`${p.length} user tips mention gluten-free options`)}((x=o.categories)==null?void 0:x.some(p=>p.id==="4bf58dd8d48988d10c941735"))&&d.length===0&&d.push("Health food restaurant - likely has GF options"),d.length===0&&d.push("Check with restaurant for gluten-free options");const u=((b=o.geocodes)==null?void 0:b.main)||o.location,m=u!=null&&u.latitude&&(u!=null&&u.longitude)?j(n.lat,n.lng,u.latitude,u.longitude):o.distance?o.distance/1e3:void 0;return{id:o.fsq_id,name:o.name,address:o.location.formatted_address||`${o.location.address||""} ${o.location.locality||""}`.trim(),rating:o.rating?o.rating/2:0,priceLevel:o.price||0,openNow:(L=o.hours)==null?void 0:L.open_now,distance:m?Math.round(m*10)/10:void 0,glutenFreeOptions:d,phone:o.tel,website:o.website,photos:((M=o.photos)==null?void 0:M.map(p=>`${p.prefix}300x300${p.suffix}`))||[]}}))).sort((o,d)=>{const g=o.glutenFreeOptions.some(u=>u.includes("Certified")),f=d.glutenFreeOptions.some(u=>u.includes("Certified"));return g&&!f?-1:!g&&f?1:(o.distance||0)-(d.distance||0)})}catch(a){return console.error("Foursquare search error:",a),[]}}const C=[{id:"1",name:"Green Garden Café",address:"123 Main St, Downtown",rating:4.5,priceLevel:2,openNow:!0,distance:.5,glutenFreeOptions:["Gluten-free bread","GF pasta","GF desserts"]},{id:"2",name:"Healthy Bites",address:"456 Oak Ave, Midtown",rating:4.2,priceLevel:2,openNow:!0,distance:1.2,glutenFreeOptions:["GF pizza","GF sandwiches","GF salads"]},{id:"3",name:"Pure Kitchen",address:"789 Pine St, Uptown",rating:4.7,priceLevel:3,openNow:!1,distance:2.1,glutenFreeOptions:["Dedicated GF menu","GF bakery items"]}];async function U(n,e){const s=[],l=[];if(e){l.push(H(e,n||"gluten free",5e3).catch(a=>(console.warn("Foursquare search failed:",a),[]))),l.push(T(e,5).catch(a=>(console.warn("OpenStreetMap search failed:",a),[])));const r=await Promise.all(l),i=new Map;for(const a of r)for(const c of a){const t=`${c.name.toLowerCase()}_${c.address.toLowerCase()}`,o=i.get(t);(!o||c.glutenFreeOptions.some(d=>d.includes("Certified")||d.includes("Dedicated"))&&!o.glutenFreeOptions.some(d=>d.includes("Certified")||d.includes("Dedicated")))&&i.set(t,c)}s.push(...i.values())}if(s.length===0){const r=C.filter(i=>!n||i.name.toLowerCase().includes(n.toLowerCase())||i.glutenFreeOptions.some(a=>a.toLowerCase().includes(n.toLowerCase())));return n?r:C}return s.sort((r,i)=>{const a=r.glutenFreeOptions.some(t=>t.includes("Certified"))?3:r.glutenFreeOptions.some(t=>t.includes("Dedicated"))?2:r.glutenFreeOptions.some(t=>t.includes("user tips"))?1:0,c=i.glutenFreeOptions.some(t=>t.includes("Certified"))?3:i.glutenFreeOptions.some(t=>t.includes("Dedicated"))?2:i.glutenFreeOptions.some(t=>t.includes("user tips"))?1:0;return a!==c?c-a:(r.distance||999)-(i.distance||999)})}class z{constructor(){h(this,"searchBar");h(this,"loadingSpinner");h(this,"emptyState");h(this,"restaurants",[]);h(this,"userLocation");this.searchBar=new P(this.handleSearch.bind(this)),this.loadingSpinner=new R,this.emptyState=new _,this.init()}async init(){console.log("App initializing..."),this.render(),await this.requestLocation(),this.handleSearch("")}render(){const e=document.querySelector("#app");if(!e){console.error("App element not found");return}e.innerHTML="",e.innerHTML=`
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
    `;const s=document.querySelector("#search-container");s&&s.appendChild(this.searchBar.render())}async handleSearch(e){const s=document.querySelector("#content-container");if(s){s.innerHTML="",s.appendChild(this.loadingSpinner.render()),this.loadingSpinner.show();try{console.log("Searching for:",e),this.restaurants=await U(e,this.userLocation),this.loadingSpinner.hide(),this.renderResults()}catch(l){console.error("Search error:",l),this.loadingSpinner.hide(),this.renderError()}}}renderResults(){const e=document.querySelector("#content-container");if(!e)return;if(e.innerHTML="",this.restaurants.length===0){e.appendChild(this.emptyState.render());return}const s=document.createElement("div");s.className="space-y-4",this.restaurants.forEach(l=>{const r=new I(l);s.appendChild(r.createElement())}),e.appendChild(s)}renderError(){const e=document.querySelector("#content-container");e&&(e.innerHTML=`
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p class="text-gray-500">Please try again later</p>
      </div>
    `)}async requestLocation(){try{console.log("Requesting location...");const e=await k();e?(this.userLocation=e,console.log("Location obtained:",this.userLocation)):(this.userLocation=void 0,console.log("Location not available"))}catch(e){console.error("Location error:",e),this.userLocation=void 0}}}console.log("Main script loading...");function E(){console.log("Initializing app..."),new z}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E):E();
