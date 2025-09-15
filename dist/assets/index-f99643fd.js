var E=Object.defineProperty;var O=(t,e,s)=>e in t?E(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var h=(t,e,s)=>(O(t,typeof e!="symbol"?e+"":e,s),s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))d(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&d(o)}).observe(document,{childList:!0,subtree:!0});function s(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function d(i){if(i.ep)return;i.ep=!0;const a=s(i);fetch(i.href,a)}})();class G{constructor(e){h(this,"container");h(this,"searchInput");h(this,"onSearch");h(this,"debounceTimer",null);this.onSearch=e,this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4",e.innerHTML=`
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
    `,this.searchInput=e.querySelector("#search-input"),this.setupEventListeners(),e}debounce(e,s){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(e,s)}setupEventListeners(){this.searchInput.addEventListener("input",e=>{const s=e.target;this.debounce(()=>{this.onSearch(s.value)},500)}),this.searchInput.addEventListener("keypress",e=>{e.key==="Enter"&&this.onSearch(this.searchInput.value)})}render(){return this.container}}class k{constructor(e){this.restaurant=e}createElement(){var i;const e=document.createElement("div");e.className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow";const s="★".repeat(Math.floor(this.restaurant.rating))+"☆".repeat(5-Math.floor(this.restaurant.rating)),d="$".repeat(this.restaurant.priceLevel);return e.innerHTML=`
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg text-gray-900">${this.restaurant.name}</h3>
        <span class="text-sm text-gray-500">${((i=this.restaurant.distance)==null?void 0:i.toFixed(1))||"—"} km</span>
      </div>
      
      <div class="flex items-center mb-2">
        <span class="text-yellow-400 mr-2">${s}</span>
        <span class="text-sm text-gray-600">${this.restaurant.rating}</span>
        <span class="mx-2 text-gray-400">•</span>
        <span class="text-sm text-gray-600">${d}</span>
        ${this.restaurant.openNow!==void 0?`
          <span class="mx-2 text-gray-400">•</span>
          <span class="text-sm ${this.restaurant.openNow?"text-green-600":"text-red-600"}">
            ${this.restaurant.openNow?"Open":"Closed"}
          </span>
        `:""}
      </div>
      
      <p class="text-sm text-gray-600 mb-3">${this.restaurant.address}</p>
      
      <div class="space-y-2">
        <p class="text-sm font-medium text-gray-900">Gluten-free info:</p>
        <div class="flex flex-wrap gap-1">
          ${this.restaurant.glutenFreeOptions.map(a=>{let o="bg-gray-100 text-gray-700";return a.includes("Fully gluten-free")||a.includes("Certified")?o="bg-green-100 text-green-800 font-semibold":a.includes("naturally GF")||a.includes("Rice")||a.includes("Corn tortillas")?o="bg-blue-100 text-blue-800":a.includes("No GF info")||a.includes("call to confirm")?o="bg-orange-100 text-orange-800":(a.includes("available")||a.includes("options"))&&(o="bg-green-50 text-green-700"),`<span class="inline-block ${o} text-xs px-2 py-1 rounded-full">
              ${a}
            </span>`}).join("")}
        </div>
        ${this.restaurant.phone?`
          <div class="mt-2">
            <a href="tel:${this.restaurant.phone}" class="text-sm text-blue-600 hover:underline">
              📞 ${this.restaurant.phone}
            </a>
          </div>
        `:""}
        ${this.restaurant.website?`
          <div class="mt-1">
            <a href="${this.restaurant.website}" target="_blank" class="text-sm text-blue-600 hover:underline">
              🌐 Visit website
            </a>
          </div>
        `:""}
      </div>
    `,e}}class P{constructor(){h(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex justify-center items-center py-12",e.innerHTML=`
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    `,e}render(){return this.container}show(){this.container.style.display="flex"}hide(){this.container.style.display="none"}}class _{constructor(){h(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex flex-col items-center justify-center py-12 text-center",e.innerHTML=`
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
      <p class="text-gray-500">Try adjusting your search or location</p>
    `,e}render(){return this.container}}async function I(){return new Promise(t=>{if(!navigator.geolocation){console.log("Geolocation not supported"),t(null);return}navigator.geolocation.getCurrentPosition(e=>{t({lat:e.coords.latitude,lng:e.coords.longitude})},e=>{console.error("Geolocation error:",e),t(null)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})})}const R="https://overpass-api.de/api/interpreter";function A(t,e,s,d){const a=(s-t)*Math.PI/180,o=(d-e)*Math.PI/180,c=Math.sin(a/2)*Math.sin(a/2)+Math.cos(t*Math.PI/180)*Math.cos(s*Math.PI/180)*Math.sin(o/2)*Math.sin(o/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}async function T(t,e=5){const s=e*1e3,d=`
    [out:json][timeout:25];
    (
      // Priority 1: Explicitly marked gluten-free places
      node["amenity"~"restaurant|cafe|fast_food"]["diet:gluten_free"](around:${s},${t.lat},${t.lng});
      node["amenity"~"restaurant|cafe|fast_food"]["gluten_free"](around:${s},${t.lat},${t.lng});
      node["shop"="bakery"]["gluten_free"="yes"](around:${s},${t.lat},${t.lng});
      node["shop"="health_food"](around:${s},${t.lat},${t.lng});

      // Priority 2: Cuisines typically with good GF options
      node["amenity"~"restaurant|cafe"]["cuisine"~"thai|vietnamese|indian|mexican|sushi|japanese"](around:${s},${t.lat},${t.lng});

      // Priority 3: Health-conscious places
      node["amenity"~"restaurant|cafe"]["organic"="yes"](around:${s},${t.lat},${t.lng});
      node["amenity"~"restaurant|cafe"]["diet:vegetarian"="yes"](around:${s},${t.lat},${t.lng});

      // Priority 4: All other restaurants (limit to closer ones)
      node["amenity"~"restaurant|cafe|fast_food"](around:${Math.min(s/2,2e3)},${t.lat},${t.lng});
    );
    out body;
  `;try{const i=await fetch(R,{method:"POST",body:`data=${encodeURIComponent(d)}`,headers:{"Content-Type":"application/x-www-form-urlencoded"}});if(!i.ok)throw new Error(`Overpass API error: ${i.status}`);return(await i.json()).elements.filter(c=>{var n;return(n=c.tags)==null?void 0:n.name}).map(c=>{var u,y,v;const n=c.tags||{},r=[];if(n["diet:gluten_free"]==="yes"&&r.push("Gluten-free options available"),n["diet:gluten_free"]==="only"&&r.push("Fully gluten-free restaurant"),n.gluten_free==="yes"&&r.push("Gluten-free menu available"),(u=n.cuisine)!=null&&u.includes("gluten_free")&&r.push("Gluten-free cuisine"),r.length===0){const p=((y=n.cuisine)==null?void 0:y.toLowerCase())||"",w=((v=n.name)==null?void 0:v.toLowerCase())||"";p.includes("thai")||p.includes("vietnamese")?r.push("Thai/Vietnamese - Rice noodles & GF options available"):p.includes("indian")?r.push("Indian - Many naturally GF dishes (dal, rice, etc.)"):p.includes("mexican")?r.push("Mexican - Corn tortillas are naturally GF"):p.includes("sushi")||p.includes("japanese")?r.push("Japanese - GF soy sauce often available, rice-based"):p.includes("steak")||p.includes("grill")?r.push("Steakhouse - Grilled meats naturally GF"):n.shop==="health_food"||n.organic==="yes"?r.push("Health food store - Often stocks GF products"):n.shop==="bakery"&&w.includes("gluten")?r.push("Bakery with potential GF options"):n["diet:vegetarian"]==="yes"||n["diet:vegan"]==="yes"?r.push("Vegetarian/Vegan - Ask about GF options"):r.push("No GF info available - call to confirm")}const l=A(t.lat,t.lng,c.lat,c.lon),g=n.opening_hours,m=void 0;return{id:c.id.toString(),name:n.name,address:[n["addr:street"],n["addr:housenumber"],n["addr:city"],n["addr:postcode"]].filter(Boolean).join(" ")||n.vicinity||"Address not available",rating:0,priceLevel:n.price_range?parseInt(n.price_range):0,openNow:m,distance:Math.round(l*10)/10,glutenFreeOptions:r,phone:n.phone||n["contact:phone"],website:n.website||n["contact:website"],photos:[]}}).sort((c,n)=>{const r=!c.glutenFreeOptions.some(g=>g.includes("Call to confirm")),l=!n.glutenFreeOptions.some(g=>g.includes("Call to confirm"));return r&&!l?-1:!r&&l?1:(c.distance||0)-(n.distance||0)}).slice(0,20)}catch(i){throw console.error("OpenStreetMap search error:",i),i}}const $={}.VITE_FOURSQUARE_API_KEY||"",N="https://api.foursquare.com/v3/places/search",j=["4bf58dd8d48988d1c5941735","4bf58dd8d48988d10c941735","4bf58dd8d48988d1d3941735"];function q(t,e,s,d){const a=(s-t)*Math.PI/180,o=(d-e)*Math.PI/180,c=Math.sin(a/2)*Math.sin(a/2)+Math.cos(t*Math.PI/180)*Math.cos(s*Math.PI/180)*Math.sin(o/2)*Math.sin(o/2);return 6371*(2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c)))}async function H(t,e="gluten free",s=5e3){if(!$)return console.log("Foursquare API key not configured"),[];const d=new URLSearchParams({query:e,ll:`${t.lat},${t.lng}`,radius:s.toString(),categories:j.join(","),limit:"50",fields:"fsq_id,name,location,categories,rating,price,hours,website,tel,description,tips,photos"}),i=new AbortController,a=setTimeout(()=>i.abort(),1e4);try{const o=await fetch(`${N}?${d}`,{headers:{Accept:"application/json",Authorization:$},signal:i.signal});if(clearTimeout(a),!o.ok)throw new Error(`Foursquare API error: ${o.status}`);const c=await o.json();return(await Promise.all(c.results.map(async r=>{var v,p,w,x,F,L;const l=[];if(((v=r.categories)==null?void 0:v.some(f=>{var b;return((b=f.name)==null?void 0:b.toLowerCase().includes("gluten"))||f.id==="4bf58dd8d48988d1c5941735"}))&&l.push("Certified gluten-free restaurant"),((p=r.tips)==null?void 0:p.length)>0){const f=r.tips.filter(b=>{var M;return(M=b.text)==null?void 0:M.toLowerCase().includes("gluten")});f.length>0&&l.push(`${f.length} user tips mention gluten-free options`)}((w=r.categories)==null?void 0:w.some(f=>f.id==="4bf58dd8d48988d10c941735"))&&l.length===0&&l.push("Health food restaurant - likely has GF options"),l.length===0&&l.push("Check with restaurant for gluten-free options");const u=((x=r.geocodes)==null?void 0:x.main)||r.location,y=u!=null&&u.latitude&&(u!=null&&u.longitude)?q(t.lat,t.lng,u.latitude,u.longitude):r.distance?r.distance/1e3:void 0;return{id:r.fsq_id,name:r.name,address:r.location.formatted_address||`${r.location.address||""} ${r.location.locality||""}`.trim(),rating:r.rating?r.rating/2:0,priceLevel:r.price||0,openNow:(F=r.hours)==null?void 0:F.open_now,distance:y?Math.round(y*10)/10:void 0,glutenFreeOptions:l,phone:r.tel,website:r.website,photos:((L=r.photos)==null?void 0:L.map(f=>`${f.prefix}300x300${f.suffix}`))||[]}}))).sort((r,l)=>{const g=r.glutenFreeOptions.some(u=>u.includes("Certified")),m=l.glutenFreeOptions.some(u=>u.includes("Certified"));return g&&!m?-1:!g&&m?1:(r.distance||0)-(l.distance||0)})}catch(o){return console.error("Foursquare search error:",o),[]}}const C=[{id:"1",name:"Green Garden Café",address:"123 Main St, Downtown",rating:4.5,priceLevel:2,openNow:!0,distance:.5,glutenFreeOptions:["Gluten-free bread","GF pasta","GF desserts"]},{id:"2",name:"Healthy Bites",address:"456 Oak Ave, Midtown",rating:4.2,priceLevel:2,openNow:!0,distance:1.2,glutenFreeOptions:["GF pizza","GF sandwiches","GF salads"]},{id:"3",name:"Pure Kitchen",address:"789 Pine St, Uptown",rating:4.7,priceLevel:3,openNow:!1,distance:2.1,glutenFreeOptions:["Dedicated GF menu","GF bakery items"]}];async function B(t,e){const s=[],d=[];if(e){d.push(H(e,t||"gluten free",5e3).catch(o=>(console.warn("Foursquare search failed:",o),[]))),d.push(T(e,5).catch(o=>(console.warn("OpenStreetMap search failed:",o),[])));const i=await Promise.all(d),a=new Map;for(const o of i)for(const c of o){const n=`${c.name.toLowerCase()}_${c.address.toLowerCase()}`,r=a.get(n);(!r||c.glutenFreeOptions.some(l=>l.includes("Certified")||l.includes("Dedicated"))&&!r.glutenFreeOptions.some(l=>l.includes("Certified")||l.includes("Dedicated")))&&a.set(n,c)}s.push(...a.values())}if(s.length===0){const i=C.filter(a=>!t||a.name.toLowerCase().includes(t.toLowerCase())||a.glutenFreeOptions.some(o=>o.toLowerCase().includes(t.toLowerCase())));return t?i:C}return s.sort((i,a)=>{const o=i.glutenFreeOptions.some(n=>n.includes("Certified"))?3:i.glutenFreeOptions.some(n=>n.includes("Dedicated"))?2:i.glutenFreeOptions.some(n=>n.includes("user tips"))?1:0,c=a.glutenFreeOptions.some(n=>n.includes("Certified"))?3:a.glutenFreeOptions.some(n=>n.includes("Dedicated"))?2:a.glutenFreeOptions.some(n=>n.includes("user tips"))?1:0;return o!==c?c-o:(i.distance||999)-(a.distance||999)})}class U{constructor(){h(this,"searchBar");h(this,"loadingSpinner");h(this,"emptyState");h(this,"restaurants",[]);h(this,"userLocation");this.searchBar=new G(this.handleSearch.bind(this)),this.loadingSpinner=new P,this.emptyState=new _,this.init()}async init(){console.log("App initializing..."),this.render(),await this.requestLocation(),this.handleSearch("")}render(){const e=document.querySelector("#app");if(!e){console.error("App element not found");return}e.innerHTML="",e.innerHTML=`
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
    `;const s=document.querySelector("#search-container");s&&s.appendChild(this.searchBar.render())}async handleSearch(e){const s=document.querySelector("#content-container");if(s){s.innerHTML="",s.appendChild(this.loadingSpinner.render()),this.loadingSpinner.show();try{console.log("Searching for:",e),this.restaurants=await B(e,this.userLocation),this.loadingSpinner.hide(),this.renderResults()}catch(d){console.error("Search error:",d),this.loadingSpinner.hide(),this.renderError()}}}renderResults(){const e=document.querySelector("#content-container");if(!e)return;if(e.innerHTML="",this.restaurants.length===0){e.appendChild(this.emptyState.render());return}const s=document.createElement("div");s.className="space-y-4",this.restaurants.forEach(d=>{const i=new k(d);s.appendChild(i.createElement())}),e.appendChild(s)}renderError(){const e=document.querySelector("#content-container");e&&(e.innerHTML=`
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p class="text-gray-500">Please try again later</p>
      </div>
    `)}async requestLocation(){try{console.log("Requesting location...");const e=await I();e?(this.userLocation=e,console.log("Location obtained:",this.userLocation)):(this.userLocation=void 0,console.log("Location not available"))}catch(e){console.error("Location error:",e),this.userLocation=void 0}}}console.log("Main script loading...");function S(){console.log("Initializing app..."),new U}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",S):S();
