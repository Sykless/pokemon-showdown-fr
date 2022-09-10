console.log("BattleTranslate successfully loaded !");

// The injected script cannot access chrome.runtime.getURL
// So we need to catch an event from the content script that sends it
var SpriteURL = "";

window.addEventListener('RecieveContent', function(evt: any) {
	SpriteURL = evt.detail;
});