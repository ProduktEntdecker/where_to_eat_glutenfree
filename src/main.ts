@@ .. @@
 import './style.css';
 import { GlutenFreeFinderApp } from './app';

+console.log('Main script loading...');
+
 // Initialize the app when DOM is loaded
-document.addEventListener('DOMContentLoaded', () => {
+function initApp() {
+  console.log('Initializing app...');
   new GlutenFreeFinderApp();
-});
+}
+
+if (document.readyState === 'loading') {
+  document.addEventListener('DOMContentLoaded', initApp);
+} else {
+  initApp();
+}