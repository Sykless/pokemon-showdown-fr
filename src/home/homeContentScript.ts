// Inject Showdown variables inside homeTranslate.js
var s = document.createElement('script');
s.src = chrome.runtime.getURL('homeTranslate.js');
s.onload = function() {
	// This fires after the page script finishes executing
	var spritesURL = chrome.runtime.getURL('sprites/');
	var event = new CustomEvent('RecieveContent', {detail: spritesURL});
	window.dispatchEvent(event);
};

console.log("homeContentScript loaded");

(document.head || document.documentElement).appendChild(s);