// Inject Showdown variables inside teambuilderTranslate.js
var s = document.createElement('script');
s.src = chrome.runtime.getURL('teambuilderTranslate.js');
s.onload = function() {
	// This fires after the page script finishes executing
	var spritesURL = chrome.runtime.getURL('sprites/');
	var event = new CustomEvent('RecieveContent', {detail: spritesURL});
	window.dispatchEvent(event);
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'isTeambuilderContentScriptLoaded') {
      sendResponse({status: "yes"});
    }
});

console.log("teambuilderContentScript loaded");

(document.head || document.documentElement).appendChild(s);