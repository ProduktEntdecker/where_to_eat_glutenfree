var M=Object.defineProperty;var S=(t,e,n)=>e in t?M(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var u=(t,e,n)=>(S(t,typeof e!="symbol"?e+"":e,n),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();class L{constructor(e){u(this,"container");u(this,"searchInput");u(this,"onSearch");u(this,"debounceTimer",null);this.onSearch=e,this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4",e.innerHTML=`
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
    `,this.searchInput=e.querySelector("#search-input"),this.setupEventListeners(),e}debounce(e,n){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(e,n)}setupEventListeners(){this.searchInput.addEventListener("input",e=>{const n=e.target;this.debounce(()=>{this.onSearch(n.value)},500)}),this.searchInput.addEventListener("keypress",e=>{e.key==="Enter"&&this.onSearch(this.searchInput.value)})}render(){return this.container}}class C{constructor(e){this.restaurant=e}createElement(){var r;const e=document.createElement("div");e.className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow";const n="★".repeat(Math.floor(this.restaurant.rating))+"☆".repeat(5-Math.floor(this.restaurant.rating)),a="$".repeat(this.restaurant.priceLevel);return e.innerHTML=`
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg text-gray-900">${this.restaurant.name}</h3>
        <span class="text-sm text-gray-500">${((r=this.restaurant.distance)==null?void 0:r.toFixed(1))||"—"} km</span>
      </div>
      
      <div class="flex items-center mb-2">
        <span class="text-yellow-400 mr-2">${n}</span>
        <span class="text-sm text-gray-600">${this.restaurant.rating}</span>
        <span class="mx-2 text-gray-400">•</span>
        <span class="text-sm text-gray-600">${a}</span>
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
    `,e}}class E{constructor(){u(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex justify-center items-center py-12",e.innerHTML=`
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    `,e}render(){return this.container}show(){this.container.style.display="flex"}hide(){this.container.style.display="none"}}class O{constructor(){u(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex flex-col items-center justify-center py-12 text-center",e.innerHTML=`
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
      <p class="text-gray-500">Try adjusting your search or location</p>
    `,e}render(){return this.container}}async function P(){return new Promise(t=>{if(!navigator.geolocation){console.log("Geolocation not supported"),t(null);return}navigator.geolocation.getCurrentPosition(e=>{t({lat:e.coords.latitude,lng:e.coords.longitude})},e=>{console.error("Geolocation error:",e),t(null)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})})}const G="https://overpass-api.de/api/interpreter";function _(t,e,n,a){const o=(n-t)*Math.PI/180,d=(a-e)*Math.PI/180,i=Math.sin(o/2)*Math.sin(o/2)+Math.cos(t*Math.PI/180)*Math.cos(n*Math.PI/180)*Math.sin(d/2)*Math.sin(d/2);return 6371*(2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i)))}async function F(t,e=5){const n=e*1e3,a=`
    [out:json][timeout:25];
    (
      // Restaurants with gluten-free tags
      node["amenity"~"restaurant|cafe|fast_food"]["diet:gluten_free"](around:${n},${t.lat},${t.lng});
      node["amenity"~"restaurant|cafe|fast_food"]["gluten_free"](around:${n},${t.lat},${t.lng});
      // All restaurants (we'll filter later)
      node["amenity"~"restaurant|cafe|fast_food"](around:${n},${t.lat},${t.lng});
    );
    out body;
  `;try{const r=await fetch(G,{method:"POST",body:`data=${encodeURIComponent(a)}`,headers:{"Content-Type":"application/x-www-form-urlencoded"}});if(!r.ok)throw new Error(`Overpass API error: ${r.status}`);return(await r.json()).elements.filter(i=>{var s;return(s=i.tags)==null?void 0:s.name}).map(i=>{var p,g,m,f;const s=i.tags||{},l=[];s["diet:gluten_free"]==="yes"&&l.push("Gluten-free options available"),s["diet:gluten_free"]==="only"&&l.push("Fully gluten-free restaurant"),s.gluten_free==="yes"&&l.push("Gluten-free menu available"),(p=s.cuisine)!=null&&p.includes("gluten_free")&&l.push("Gluten-free cuisine"),l.length===0&&(s["diet:vegan"]==="yes"||s["diet:vegetarian"]==="yes"?l.push("Vegan/Vegetarian - likely has GF options"):(g=s.cuisine)!=null&&g.includes("asian")||(m=s.cuisine)!=null&&m.includes("thai")||(f=s.cuisine)!=null&&f.includes("vietnamese")?l.push("Asian cuisine - often has rice-based GF options"):l.push("Call to confirm gluten-free options"));const h=_(t.lat,t.lng,i.lat,i.lon),c=s.opening_hours,y=void 0;return{id:i.id.toString(),name:s.name,address:[s["addr:street"],s["addr:housenumber"],s["addr:city"],s["addr:postcode"]].filter(Boolean).join(" ")||s.vicinity||"Address not available",rating:0,priceLevel:s.price_range?parseInt(s.price_range):0,openNow:y,distance:Math.round(h*10)/10,glutenFreeOptions:l,phone:s.phone||s["contact:phone"],website:s.website||s["contact:website"],photos:[]}}).sort((i,s)=>{const l=!i.glutenFreeOptions.some(c=>c.includes("Call to confirm")),h=!s.glutenFreeOptions.some(c=>c.includes("Call to confirm"));return l&&!h?-1:!l&&h?1:(i.distance||0)-(s.distance||0)}).slice(0,20)}catch(r){throw console.error("OpenStreetMap search error:",r),r}}const w=[{id:"1",name:"Green Garden Café",address:"123 Main St, Downtown",rating:4.5,priceLevel:2,openNow:!0,distance:.5,glutenFreeOptions:["Gluten-free bread","GF pasta","GF desserts"]},{id:"2",name:"Healthy Bites",address:"456 Oak Ave, Midtown",rating:4.2,priceLevel:2,openNow:!0,distance:1.2,glutenFreeOptions:["GF pizza","GF sandwiches","GF salads"]},{id:"3",name:"Pure Kitchen",address:"789 Pine St, Uptown",rating:4.7,priceLevel:3,openNow:!1,distance:2.1,glutenFreeOptions:["Dedicated GF menu","GF bakery items"]}],I={}.VITE_GOOGLE_PLACES_API_KEY,k={}.VITE_SEARCH_RADIUS||5e3;function $(t,e,n,a){const o=(n-t)*Math.PI/180,d=(a-e)*Math.PI/180,i=Math.sin(o/2)*Math.sin(o/2)+Math.cos(t*Math.PI/180)*Math.cos(n*Math.PI/180)*Math.sin(d/2)*Math.sin(d/2);return 6371*(2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i)))}async function A(t,e=""){var a,r;if(!((r=(a=window.google)==null?void 0:a.maps)!=null&&r.places))return console.warn("Google Maps not loaded, using mock data"),w;const n=window.google.maps;return new Promise(o=>{const d=new n.places.PlacesService(document.createElement("div")),i={location:new n.LatLng(t.lat,t.lng),radius:k,type:"restaurant",keyword:e?`${e} gluten free`:"gluten free"};d.nearbySearch(i,(s,l)=>{if(l===n.places.PlacesServiceStatus.OK&&s){const h=s.map(c=>{var y,p,g,m,f,v;return{id:c.place_id||"",name:c.name||"",address:c.vicinity||"",rating:c.rating||0,priceLevel:c.price_level||0,openNow:(y=c.opening_hours)==null?void 0:y.open_now,distance:t?$(t.lat,t.lng,((g=(p=c.geometry)==null?void 0:p.location)==null?void 0:g.lat())||0,((f=(m=c.geometry)==null?void 0:m.location)==null?void 0:f.lng())||0):void 0,glutenFreeOptions:["Check with restaurant for GF options"],phone:c.formatted_phone_number,website:c.website,photos:(v=c.photos)==null?void 0:v.map(b=>b.getUrl({maxWidth:400}))}});o(h)}else console.error("Places search failed:",l),o(w)})})}async function R(t,e){if(e){try{console.log("Searching with OpenStreetMap (free, no API key needed)...");const a=await F(e,5);if(a.length>0)return a}catch(a){console.warn("OpenStreetMap search failed, trying Google Places...",a)}if(I)try{return await A(e,t)}catch(a){console.error("Google Places search failed:",a)}}const n=w.filter(a=>a.name.toLowerCase().includes(t.toLowerCase())||a.glutenFreeOptions.some(r=>r.toLowerCase().includes(t.toLowerCase())));return t?n:w}class T{constructor(){u(this,"searchBar");u(this,"loadingSpinner");u(this,"emptyState");u(this,"restaurants",[]);u(this,"userLocation");this.searchBar=new L(this.handleSearch.bind(this)),this.loadingSpinner=new E,this.emptyState=new O,this.init()}async init(){console.log("App initializing..."),this.render(),await this.requestLocation(),this.handleSearch("")}render(){const e=document.querySelector("#app");if(!e){console.error("App element not found");return}e.innerHTML="",e.innerHTML=`
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

          <!-- Data attribution (required by OpenStreetMap's ODbL license) -->
          <footer class="px-4 pb-4 text-center text-xs text-gray-400">
            Restaurant data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" class="underline">OpenStreetMap</a> contributors
          </footer>
        </div>
      </div>
    `;const n=document.querySelector("#search-container");n&&n.appendChild(this.searchBar.render())}async handleSearch(e){const n=document.querySelector("#content-container");if(n){n.innerHTML="",n.appendChild(this.loadingSpinner.render()),this.loadingSpinner.show();try{console.log("Searching for:",e),this.restaurants=await R(e,this.userLocation),this.loadingSpinner.hide(),this.renderResults()}catch(a){console.error("Search error:",a),this.loadingSpinner.hide(),this.renderError()}}}renderResults(){const e=document.querySelector("#content-container");if(!e)return;if(e.innerHTML="",this.restaurants.length===0){e.appendChild(this.emptyState.render());return}const n=document.createElement("div");n.className="space-y-4",this.restaurants.forEach(a=>{const r=new C(a);n.appendChild(r.createElement())}),e.appendChild(n)}renderError(){const e=document.querySelector("#content-container");e&&(e.innerHTML=`
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p class="text-gray-500">Please try again later</p>
      </div>
    `)}async requestLocation(){try{console.log("Requesting location...");const e=await P();e?(this.userLocation=e,console.log("Location obtained:",this.userLocation)):(this.userLocation=void 0,console.log("Location not available"))}catch(e){console.error("Location error:",e),this.userLocation=void 0}}}console.log("Main script loading...");function x(){console.log("Initializing app..."),new T}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",x):x();
