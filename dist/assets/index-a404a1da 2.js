var d=Object.defineProperty;var u=(r,e,t)=>e in r?d(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var o=(r,e,t)=>(u(r,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();class p{constructor(e){o(this,"container");o(this,"searchInput");o(this,"onSearch");this.onSearch=e,this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4",e.innerHTML=`
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
    `,this.searchInput=e.querySelector("#search-input"),this.setupEventListeners(),e}setupEventListeners(){this.searchInput.addEventListener("input",e=>{const t=e.target;this.onSearch(t.value)}),this.searchInput.addEventListener("keypress",e=>{e.key==="Enter"&&this.onSearch(this.searchInput.value)})}render(){return this.container}}class h{constructor(e){this.restaurant=e}createElement(){var n;const e=document.createElement("div");e.className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow";const t="★".repeat(Math.floor(this.restaurant.rating))+"☆".repeat(5-Math.floor(this.restaurant.rating)),s="$".repeat(this.restaurant.priceLevel);return e.innerHTML=`
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg text-gray-900">${this.restaurant.name}</h3>
        <span class="text-sm text-gray-500">${((n=this.restaurant.distance)==null?void 0:n.toFixed(1))||"—"} km</span>
      </div>
      
      <div class="flex items-center mb-2">
        <span class="text-yellow-400 mr-2">${t}</span>
        <span class="text-sm text-gray-600">${this.restaurant.rating}</span>
        <span class="mx-2 text-gray-400">•</span>
        <span class="text-sm text-gray-600">${s}</span>
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
          ${this.restaurant.glutenFreeOptions.map(a=>`
            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              ${a}
            </span>
          `).join("")}
        </div>
      </div>
    `,e}}class m{constructor(){o(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex justify-center items-center py-12",e.innerHTML=`
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    `,e}render(){return this.container}show(){this.container.style.display="flex"}hide(){this.container.style.display="none"}}class g{constructor(){o(this,"container");this.container=this.createElement()}createElement(){const e=document.createElement("div");return e.className="flex flex-col items-center justify-center py-12 text-center",e.innerHTML=`
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
      <p class="text-gray-500">Try adjusting your search or location</p>
    `,e}render(){return this.container}}async function f(){return new Promise(r=>{if(!navigator.geolocation){console.log("Geolocation not supported"),r(null);return}navigator.geolocation.getCurrentPosition(e=>{r({lat:e.coords.latitude,lng:e.coords.longitude})},e=>{console.error("Geolocation error:",e),r(null)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:3e5})})}const c=[{id:"1",name:"Green Garden Café",address:"123 Main St, Downtown",rating:4.5,priceLevel:2,openNow:!0,distance:.5,glutenFreeOptions:["Gluten-free bread","GF pasta","GF desserts"]},{id:"2",name:"Healthy Bites",address:"456 Oak Ave, Midtown",rating:4.2,priceLevel:2,openNow:!0,distance:1.2,glutenFreeOptions:["GF pizza","GF sandwiches","GF salads"]},{id:"3",name:"Pure Kitchen",address:"789 Pine St, Uptown",rating:4.7,priceLevel:3,openNow:!1,distance:2.1,glutenFreeOptions:["Dedicated GF menu","GF bakery items"]}];async function y(r,e){await new Promise(s=>setTimeout(s,1e3));const t=c.filter(s=>s.name.toLowerCase().includes(r.toLowerCase())||s.glutenFreeOptions.some(n=>n.toLowerCase().includes(r.toLowerCase())));return r?t:c}class v{constructor(){o(this,"searchBar");o(this,"loadingSpinner");o(this,"emptyState");o(this,"restaurants",[]);o(this,"userLocation");this.searchBar=new p(this.handleSearch.bind(this)),this.loadingSpinner=new m,this.emptyState=new g,this.init()}async init(){console.log("App initializing..."),this.render(),await this.requestLocation(),this.handleSearch("")}render(){const e=document.querySelector("#app");if(!e){console.error("App element not found");return}e.innerHTML="",e.innerHTML=`
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
    `;const t=document.querySelector("#search-container");t&&t.appendChild(this.searchBar.render())}async handleSearch(e){const t=document.querySelector("#content-container");if(t){t.innerHTML="",t.appendChild(this.loadingSpinner.render()),this.loadingSpinner.show();try{console.log("Searching for:",e),this.restaurants=await y(e,this.userLocation),this.loadingSpinner.hide(),this.renderResults()}catch(s){console.error("Search error:",s),this.loadingSpinner.hide(),this.renderError()}}}renderResults(){const e=document.querySelector("#content-container");if(!e)return;if(e.innerHTML="",this.restaurants.length===0){e.appendChild(this.emptyState.render());return}const t=document.createElement("div");t.className="space-y-4",this.restaurants.forEach(s=>{const n=new h(s);t.appendChild(n.createElement())}),e.appendChild(t)}renderError(){const e=document.querySelector("#content-container");e&&(e.innerHTML=`
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p class="text-gray-500">Please try again later</p>
      </div>
    `)}async requestLocation(){try{console.log("Requesting location...");const e=await f();e?(this.userLocation=e,console.log("Location obtained:",this.userLocation)):(this.userLocation=void 0,console.log("Location not available"))}catch(e){console.error("Location error:",e),this.userLocation=void 0}}}console.log("Main script loading...");function l(){console.log("Initializing app..."),new v}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",l):l();
