// Inject Showdown variables inside battleTranslate.js
var s = document.createElement('script');
s.src = chrome.runtime.getURL('battleTranslate.js');
s.onload = function() {
	// This fires after the page script finishes executing
	var spritesURL = chrome.runtime.getURL('sprites/');
	var event = new CustomEvent('RecieveContent', {detail: spritesURL});
	window.dispatchEvent(event);
};

console.log("battleContentScript loaded");

(document.head || document.documentElement).appendChild(s);