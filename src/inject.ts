import { PokemonDico } from './translator';
import { AbilitiesDico } from './translator';
import { TypesDico } from './translator';
import { HeadersDico } from './translator';
import { MenuDico } from './translator';

// TODO
// Update cur for the correct input
// Don't show duplicate Pokémon (english/french name)
// "Couldn't search: You are already searching for a ${formatid} battle." (.popup)
// Le cur est basé sur l'OU

console.log("Extension successfully loaded !");

// Variable defined by Showdown containing every piece of data
// (Pokémon names, moves, abilities) needed in the teambuilder research
declare var BattleSearchIndex: any;
declare var BattleSearchIndexOffset: any;
declare var BattlePokedex: any;
declare var BattleSearch: any;

// Backup the BattlePokedex variable, we need it to erase incorrect entries
// in the BattlePokedex variable (see updatePokemonInfo method)
const originalBattlePokedex = structuredClone(BattlePokedex);

const FRENCH = 0;
const ENGLISH = 1;
const SEARCH_TYPE = 2;

// The injected script cannot access chrome.runtime.getURL
// So we need to catch an event from the content script that sends it
var SpriteURL = "";

window.addEventListener('RecieveContent', function(evt: any) {
	SpriteURL = evt.detail;
});

// Create FrenchNamesDico dictionary, containing every french to english translation alphabetically sorted
const ShowdownTradDictionnaries: Array<{ [englishName: string]: string; }> = [PokemonDico, AbilitiesDico];
const FrenchNamesDico = populateFrenchDico();

// When Showdown first loads, update the BattleSearchIndex
updateBattleSearchIndex();

// Create a MutationObserver element in order to track every page change
// So we can it dynamically translate new content
var observer = new MutationObserver(onMutation);
observer.observe(document, {
	childList: true, // report added/removed nodes
	subtree: true,   // observe any descendant elements
});

// Everytime a new element is added to the page, onMutation method is called
function onMutation(mutations: MutationRecord[]) {
	for (var i = 0, len = mutations.length; i < len; i++)
	{
		var added = mutations[i].addedNodes;

		for (var j = 0, node; (node = added[j]); j++)
		{
			var newElement = node as Element;
			//console.log(newElement);

			switch(newElement.className)
			{
				case 'utilichart': // A search field has been updated

					// We can't catch input search modification with MutationObserver, however everytime an input
					// is modified in some way, the utilichart component is updated,
					// so we still get a way to catch input modification
					updatePokemonInfo();

					// Update every search result
					for (var k = 0, result; (result = node.childNodes[k]) ; k++) {
						updateResultTag(result as Element);
					}

					break;
				
				case 'result': // New results after scrolling
					updateResultTag(node as Element);
					break;
			}
		}
	}
}

function updateResultTag(resultElement: Element)
{
	var displayedDataType = getDisplayedDataType(resultElement);

	if (displayedDataType == "pokemon")
	{
		updatePokemonName(resultElement);
		updatePokemonAbility(resultElement);
		updatePokemonType(resultElement);
	}
	else if (displayedDataType == "ability")
	{
		updateAbility(resultElement);
	}
	else if (displayedDataType == "header")
	{
		updateHeader(resultElement);
	}
}

function removeCurElement()
{
	// Cur element is the search result entry of the current selected Pokémon 
	// It is defined by the current Pokémon name, but since the current Pokémon name is in french, cur is bugged
	
	// For now we remove it, maybe we could find a way to retrieve 
	// every piece of information in order to manualy create it

	var curElements = document.getElementsByClassName("cur");

	for (var curID = 0 ; curID < curElements.length ; curID++)
	{
		var cur = curElements.item(curID);
		
		// Only remove the specific Pokemon search cur
		if (cur?.tagName == "A" && cur.parentElement?.tagName == "LI"
			&& cur.getAttribute("data-entry")?.includes("pokemon"))
		{
			// Remove cur parent node
			var curParent = cur.parentElement;
			curParent.remove();
		}
	}
}

function updatePokemonInfo()
{
	// For some reason, when an unknown Pokémon name is present in the Pokémon search input
	// and the user click on another search input, the unknown Pokémon name is added to the BattlePokedex variable,
	// even if the name is incorrect - obviously since we are using french names, the names are always incorrect

	// That causes the name to later be put in lowerCase without special chararacters
	// I think it's a bug, but to compensate I need to load the backup of the original BattlePokedex
	// everytime the Pokémon search input is updated

	// If a Showdown developer reads this, the line in your code where a specie is added is "window.BattlePokedex[id] = species;"
	BattlePokedex = structuredClone(originalBattlePokedex);
	
	// Since we update the teamchart element everytime an input is modified, we need to manually retrieve it
	var teamchartElement = document.getElementsByClassName("teamchart").item(0);
	var liComponent = teamchartElement?.firstChild;

	if (liComponent)
	{
		// Retrieve the Pokémon name provided in the Pokémon search input
		var nameInputElement = document.getElementsByName("pokemon")[0] as HTMLInputElement;
		var searchInput = nameInputElement.value;

		// Try to translate the name to check if it matches a french translation
		var translatedPokemonName = translatePokemonName(searchInput);
		var translatedPokemonNameArray = convertPokemonNameToArray(translatedPokemonName);

		// If the english translation of the search input is different than the search input
		// it means that the search input is a complete Pokémon french word
		if (translatePokemonNameToEnglish(searchInput) != searchInput)
		{
			// The provided input search is a Pokémon, remove the incomplete class
			nameInputElement.classList.remove("incomplete");

			// Only remove cur element if the provided name is a french name
			removeCurElement();
		}

		liComponent.childNodes.forEach(function(node)
		{
			switch ((node as Element).className)
			{
				case "setmenu":
					// Translate team builder menu
					node.childNodes.forEach(function(menuButton) {
						if (menuButton.lastChild?.textContent) {
							menuButton.lastChild.textContent = MenuDico[menuButton.lastChild.textContent];
						}
					})
					
					break;

				case "setchart-nickname":
					// Translate the nickname
					node.childNodes.forEach(function(nicknameNode) {
						var nicknameElement = nicknameNode as Element;

						if (nicknameElement.tagName == "LABEL") {
							nicknameElement.textContent = "Surnom";
						}
						else if (nicknameElement.tagName == "INPUT") {
							if (translatePokemonNameToEnglish(searchInput) != searchInput || PokemonDico[searchInput]) {
								(nicknameElement as HTMLInputElement).placeholder = (translatedPokemonNameArray[0] || "");
							}
		
						}
					});

					break;

				case "setchart":

					node.childNodes.forEach(function(pokemonInfoNode) {
						var classList = (pokemonInfoNode as Element).classList;

						// Pokémon name
						if (classList.contains("setcol-icon"))
						{
							// Translate the name
							pokemonInfoNode.childNodes.forEach(function(spriteNameNode) {
								spriteNameNode.childNodes.forEach(function(nameNode) {
									var nameInput = nameNode as HTMLInputElement;
			
									if (nameInput.tagName == "INPUT" && nameInput.value)
									{
										// Update the Pokémon search input with the french translation
										// (If no translation is found, the original string stays untouched)
										nameInput.value = translatedPokemonName;
									}
								})
							});
						}
						// Item, Ability, Level, Gender, Shiny
						else if (classList.contains("setcol-details"))
						{

						}
						// Moves
						else if (classList.contains("setcol-moves"))
						{
							
						}
						// Stats
						else if (classList.contains("setcol-stats"))
						{
							
						}
					})

					break;
			}
		})
		
	}
}

function updatePokemonName(element: Element)
{
	var pokemonElement = element.querySelector('.pokemonnamecol');
	
	if (pokemonElement)
	{
		var pokemonShowdownName = pokemonElement.textContent;

		if (pokemonShowdownName == null)
			return;

		var pokemonTranslatedName = translatePokemonName(pokemonShowdownName);
		
		// Don't update HTML if no translation is found
		if (pokemonTranslatedName != pokemonShowdownName)
		{
			// Convert the Pokémon french name to [baseName, alternateForm]
			var pokemonTranslatedNameArray = convertPokemonNameToArray(pokemonTranslatedName);

			// Remove current Pokémon name so we can replace it
			pokemonElement.textContent = '';

			// Retrieve the searched content
			var inputElement = document.getElementsByName("pokemon")[0] as HTMLInputElement;
			var searchInput = inputElement.value;
			
			if (searchInput.length > 0)
			{
				var searchString = removeDiacritics(searchInput.toLowerCase());
				var searchedPokemon: Array<string> = [];

				if (searchString.includes("-")) {
					// Split the search result in an array [baseName, formName]
					searchedPokemon = convertPokemonNameToArray(searchString);
				}
				else {
					// No "-" means the result could be a base name or a form name, so we try to match both
					searchedPokemon = [searchString, searchString];
				}

				// Search for the baseName in the translatedBaseName
				var baseNameSearchIndex = removeDiacritics(pokemonTranslatedNameArray[0].toLowerCase()).indexOf(searchedPokemon[0]);
				var fullNameBolded = false;

				if (baseNameSearchIndex >= 0)
				{
					var boldBaseName = document.createElement("b");

					// Make only the searched part bold
					var boldName = pokemonTranslatedNameArray[0].slice(baseNameSearchIndex, baseNameSearchIndex + searchedPokemon[0].length);
					var regularName = pokemonTranslatedNameArray[0].slice(baseNameSearchIndex + searchedPokemon[0].length, pokemonTranslatedNameArray[0].length);

					boldBaseName.appendChild(document.createTextNode(boldName));

					if (baseNameSearchIndex > 0) { // Searched content is in the middle of the name
						pokemonElement.appendChild(document.createTextNode(pokemonTranslatedNameArray[0].slice(0,baseNameSearchIndex)));
					}

					// Add the bold searched part
					pokemonElement.appendChild(boldBaseName);

					if (regularName) {
						// If the whole name is not bold, add the rest in a regular text node
						pokemonElement.appendChild(document.createTextNode(regularName));
					}
					else {
						// Useful for alternate form styling process
						fullNameBolded = true;
					}
				}
				else
				{
					// No name match, add the raw name
					pokemonElement.appendChild(document.createTextNode(pokemonTranslatedNameArray[0]));
				}

				// If an altername form is present, add it in a small tag
				if (pokemonTranslatedNameArray[1])
				{
					var alternateForm = document.createElement("small");

					// Search for the formName in the translatedFormName
					var formNameSearchIndex = removeDiacritics(pokemonTranslatedNameArray[1].toLowerCase()).indexOf(searchedPokemon[1]);

					if (formNameSearchIndex >= 0)
					{
						var boldFormName = document.createElement("b");

						// A part of the alternate form is in the searched content
						var boldForm = pokemonTranslatedNameArray[1].slice(formNameSearchIndex, formNameSearchIndex + searchedPokemon[1].length);
						var regularForm = pokemonTranslatedNameArray[1].slice(formNameSearchIndex + searchedPokemon[1].length, pokemonTranslatedNameArray[1].length);

						if (formNameSearchIndex > 0) { // Searched content is in the middle of the form name
							alternateForm.appendChild(document.createTextNode("-" + pokemonTranslatedNameArray[1].slice(0,formNameSearchIndex)));
							boldFormName.appendChild(document.createTextNode(boldForm));
						}
						else { // Searched content is at the start of 
							if (fullNameBolded) {
								boldFormName.appendChild(document.createTextNode("-" + boldForm));
							}
							else {
								alternateForm.appendChild(document.createTextNode("-"));
								boldFormName.appendChild(document.createTextNode(boldForm));
							}
						}

						alternateForm.appendChild(boldFormName);

						if (regularForm) {
							// If the whole form is not bold, add the rest in a regular text node
							alternateForm.appendChild(document.createTextNode(regularForm));
						}
					}
					else
					{
						// No form match, add the raw altername form in the small tag
						alternateForm.appendChild(document.createTextNode("-" + pokemonTranslatedNameArray[1]));
					}

					pokemonElement.appendChild(alternateForm);	
				}
			}
			else
			{
				// Add Pokémon base name in a text node
				pokemonElement.appendChild(document.createTextNode(pokemonTranslatedNameArray[0]));

				// If an alterate name is present, add it in a node with a small tag
				if (pokemonTranslatedNameArray[1]) {
					var smallNode = document.createElement("small");
					smallNode.appendChild(document.createTextNode("-" + pokemonTranslatedNameArray[1]));

					pokemonElement.appendChild(smallNode);
				}
			}
		}	
	}
}

function updatePokemonAbility(element: Element)
{
	var abilityNodeList = element.querySelectorAll('.abilitycol');
	var twoAbilitiesNode = element.querySelector('.twoabilitycol');

	for (var i = 0, node; (node = abilityNodeList[i]) ; i++)
	{
		// The Pokemon might only have one ability, so we check if null before using it
		if (node.textContent)
		{
			var frenchAbility = AbilitiesDico[node.textContent];

			if (frenchAbility) { // Directly update the textContent, no style needed
				node.textContent = frenchAbility;
			}
			else {
				console.log("Unable to translate ability " + node.textContent);
			}
		}
	}

	// There could be a node with two abilities
	if (twoAbilitiesNode)
	{
		var twoAbilities = twoAbilitiesNode.innerHTML.split("<br>");
		twoAbilitiesNode.textContent = '';
		
		for (var i = 0 ; i < twoAbilities.length ; i++)
		{
			// If two abilities are present, add a br tag to separate them
			if (i == 1) {
				twoAbilitiesNode.appendChild(document.createElement("br"));
			}

			// Use the untranslated ability if no translation is found
			var frenchAbility = AbilitiesDico[twoAbilities[i]];
			var abilityTextNode = document.createTextNode(frenchAbility ? frenchAbility : twoAbilities[i])

			if (frenchAbility == null) {
				console.log("Unable to translate ability " + twoAbilities[i]);
			} 

			twoAbilitiesNode.appendChild(abilityTextNode)
		}
	}
}

function updateAbility(element: Element)
{
	var abilityNode = element.querySelector('.namecol');
	var filterNode = element.querySelector('.filtercol');

	if (abilityNode && abilityNode.textContent)
	{
		var frenchAbility = AbilitiesDico[abilityNode.textContent];

		if (frenchAbility) { // Directly update the textContent, no style needed
			abilityNode.textContent = frenchAbility;
		}
		else {
			console.log("Unable to translate ability " + abilityNode.textContent);
		}
	}

	if (filterNode) {
		translateFilter(filterNode);
	}
}

function updatePokemonType(typesElement: Element)
{
	var twoAbilitiesNode = typesElement.querySelector('.typecol');

	twoAbilitiesNode?.childNodes.forEach(function(typeNode) {
		updatePokemonTypeSprite(typeNode as HTMLImageElement)
	})
}

function updatePokemonTypeSprite(spriteImage: HTMLImageElement)
{
	if (spriteImage.tagName == "IMG") {
		// Get the fileName in the URL
		var typeImageName = spriteImage.src.split("/").at(-1);
		var typeName = typeImageName?.replace(".png", "");

		// The type might already have been updated so we check the presence of the "French" tag
		if (typeName && !typeName.includes("French")) {
			spriteImage.src = SpriteURL + "French_Type_" + typeName + ".png"
		}
		else {
			// Default : keep the Showdown sprite as is
			console.log("Cannot find type in image " + spriteImage.src);
		}
	}
}

function updateHeader(headerElement: Element)
{
	var headerTag = headerElement.firstChild as Element;

	if (headerTag.tagName == "H3" && headerTag.textContent)
	{
		// Get all header words
		var headerWords = headerTag.textContent.split(" ");

		if (headerWords.length > 1)
		{
			// Either ability of type filter
			if (headerWords.at(-1) == "Pokémon")
			{
				var filterData = headerTag.textContent.replace(" Pokémon","");
				var possibleType = TypesDico[filterData.replace("-type", "")];

				// Type
				if (possibleType)
				{
					headerTag.textContent = "Pokémon de type " + possibleType;
				}
				// Ability
				else
				{
					// Translate ability and insert it with the header french translation
					var filteredAbility = AbilitiesDico[filterData];

					if (filteredAbility) {
						headerTag.textContent = "Pokémon avec " + filteredAbility;
					}
				}
			}
			else if (headerWords.at(-1) == "technicality")
			{
				headerTag.textContent = headerWords[0] + " par technicalité";
			}
			else if (headerWords[0] == "Generation")
			{
				headerTag.textContent = "Génération " + headerWords[1];
			}
			else
			{
				var possiblePokemonName = PokemonDico[headerWords.at(-1) as string];

				if (possiblePokemonName) {
					headerTag.textContent = "Spécifique à " + possiblePokemonName;
				}
				else {
					// Default : the header should be in HeadersDico
					var translatedHeader = HeadersDico[headerTag.textContent];

					if (translatedHeader) {
						headerTag.textContent = translatedHeader;
					}
					else {
						console.log("Unable to translate header " + headerTag.textContent);
					}
				}
			}
		}
		else
		{
			// One-word headers, we can translate directly
			var translatedHeader = HeadersDico[headerTag.textContent];

			if (translatedHeader) {
				headerTag.textContent = translatedHeader;
			}
			else {
				console.log("Unable to translate header " + headerTag.textContent);
			}
		}
	}
	else if (!headerElement.classList.contains("result"))
	{
		console.log("Unknown header element");
		console.log(headerElement)
	}
}

function translateFilter(filterNode: Element)
{
	var filterButtonTag = filterNode.firstChild as Element;

	if (filterButtonTag && filterButtonTag.tagName == "EM") {
		filterButtonTag.textContent = "Filtrer";
	}
	else {
		console.log("Unkown filter element");
		console.log(filterNode);
	}
}

function convertPokemonNameToArray(pokemonName: string)
{
	const HyphenPokemonName = ["nidoran-f", "nidoran-d", "ho-oh", "porygon-z", "jangmo-o", "hakamo-o", "kommo-o", "ama-ama"]
	var pokemonRawName = pokemonName.split("-");

	if (pokemonRawName.length == 1)
	{
		// No "-" in the name so no alternate form
		return [pokemonRawName[0], ""];
	}
	else
	{
		// Check if the "-" is present because there was one in the base name
		var possibleHyphenPokemon = pokemonRawName[0] + "-" + pokemonRawName[1];
		var basePokemonName = "";

		if (HyphenPokemonName.includes(removeDiacritics(possibleHyphenPokemon.toLowerCase()))) {
			// There is a "-" in the base Pokémon name
			basePokemonName = possibleHyphenPokemon;

			// If the only "-" in the whole name was in the raw name, there is no alternate form
			if (pokemonRawName.length == 2) {
				return [basePokemonName, ""];
			}
		}
		else {
			// No "-" in the base Pokémon name, so the first element is the english Pokémon name
			basePokemonName = pokemonRawName[0];
		}

		// Remove the pokemon name from the whole name to get the alternate form
		var alternatePokemonFormName = pokemonName.replace(basePokemonName + "-", "");

		// Return the translated Pokémon name and its form
		return [basePokemonName, alternatePokemonFormName]
	}
}

function translatePokemonName(pokemonEnglishName: string)
{
	var frenchName = PokemonDico[pokemonEnglishName];

	if (frenchName) {
		return frenchName;
	}
	else {
		console.log("Unable to translate Pokémon " + pokemonEnglishName);
		return pokemonEnglishName;
	}
}

function translatePokemonNameToEnglish(pokemonFrenchName: string)
{
	var pokemonEnglishName = Object.keys(PokemonDico).find(key => PokemonDico[key] === pokemonFrenchName);
	return pokemonEnglishName ? pokemonEnglishName : pokemonFrenchName;
}

function getDisplayedDataType(element: Element)
{
	var displayedDataType = "";

	// Element should be a li tag with a result class
	if (element.tagName == "LI" && element.classList.contains("result"))
	{
		var childResult = element.firstChild as Element;

		if (childResult)
		{
			// If result child is a tag name, it should have a data-entry
			// attribute telling what the displayed data is
			if (childResult.tagName == "A")
			{
				var attribute = childResult.getAttribute('data-entry');

				if (attribute) {
					displayedDataType = attribute.split("|")[0];
				}
				else {
					console.log("No data-entry present in tag ");
					console.log(childResult);
				}
			}
			// The result child is probably a header
			else {
				displayedDataType = "header";
			}
		}
	}
	else
	{
		console.log("Unknown result element");
		console.log(element)
	}
	
	return displayedDataType;
}

function updateBattleSearchIndex()
{
	var newBattleSearchIndex = [];
	var newBattleSearchIndexOffset = [];
	var newBattleSearchIndexSize = BattleSearchIndex.length + FrenchNamesDico.length;

	var frenchIndex = 0;
	var frenchWordsID: Array<number> = [];

	for (var englishIndex = 0 ; newBattleSearchIndex.length < newBattleSearchIndexSize ; englishIndex++)
	{
		if (frenchIndex == FrenchNamesDico.length)
		{
			newBattleSearchIndex.push(BattleSearchIndex[englishIndex]);
			newBattleSearchIndexOffset.push(BattleSearchIndexOffset[englishIndex]);
		}
		else if (FrenchNamesDico[frenchIndex][FRENCH] == FrenchNamesDico[frenchIndex][ENGLISH])
		{
			frenchIndex++;
			englishIndex--;
			newBattleSearchIndexSize--;
		}
		else if (englishIndex == BattleSearchIndex.length || BattleSearchIndex[englishIndex][0] > FrenchNamesDico[frenchIndex][FRENCH])
		{
			let englishID = binarySearch(FrenchNamesDico[frenchIndex][ENGLISH]);

			newBattleSearchIndex.push([FrenchNamesDico[frenchIndex][FRENCH],FrenchNamesDico[frenchIndex][SEARCH_TYPE],englishID,0])
			newBattleSearchIndexOffset.push('');

			frenchWordsID.push(englishIndex);
			frenchIndex++;
			englishIndex--;
		}
		else
		{
			newBattleSearchIndex.push(BattleSearchIndex[englishIndex]);
			newBattleSearchIndexOffset.push(BattleSearchIndexOffset[englishIndex]);
		}
	}

	for (var fusionnedIndex = 0 ; fusionnedIndex < newBattleSearchIndexSize ; fusionnedIndex++)
	{
		if (newBattleSearchIndex[fusionnedIndex].length > 2)
		{
			newBattleSearchIndex[fusionnedIndex][2] += getDecalage(frenchWordsID, newBattleSearchIndex[fusionnedIndex][2]);
		}
	}

	BattleSearchIndex = newBattleSearchIndex;
	BattleSearchIndexOffset = newBattleSearchIndexOffset;

	// Always log BattleSearchIndex to help with debug
	console.log(BattleSearchIndex);
}

function populateFrenchDico()
{
	let NamesTranslation: Array<any> = [];
	let searchTypeGetter: Array<string> = ["pokemon", "ability"];

	for (var i = 0 ; i < searchTypeGetter.length ; i++)
	{
		var dico = ShowdownTradDictionnaries[i];
		var searchType = searchTypeGetter[i];

		for (var englishName in dico)
		{
			var frenchName = dico[englishName].toLowerCase();
			
			// Remove everything that is not a regular letter or number
			var formattedFrenchName = removeSpecialCharacters(frenchName);
			var formattedEnglishName = removeSpecialCharacters(englishName.toLowerCase());

			// Remove diacritics (é -> e) from a name and see if it changes anything
			// If so, add this copy in BattleSearchIndex in order to match accented characters with regular letters
			var notAccented = removeDiacritics(frenchName);

			if (notAccented != frenchName) { // Add the copy
				NamesTranslation.push([notAccented, formattedEnglishName, searchType]);
			}

			// Add the regular translated name
			NamesTranslation.push([formattedFrenchName, formattedEnglishName, searchType]);
		}
	}
	
	// BattleSearchIndex is alphabatically sorted in order to perform a binary search
	// so we absolutely need to sort our dictionary so we can insert the names in the right spot
	var sortedNamesTranslation = NamesTranslation.sort(function(a, b) {
		if (a[0] < b[0]) return -1;
		   if (a[0] > b[0]) return 1;
		   return 0;
	});

	return sortedNamesTranslation;
}

function removeSpecialCharacters(text: string) {
	return text.replace(/[^a-z0-9]+/g, "");
}

function removeDiacritics(text: string) {
	return text
	  .normalize('NFD')
	  .replace(/[\u0300-\u036f]/g, '');
}

function getDecalage(frenchWordsID:Array<number>, id: number)
{
	for (var i = 0 ; i < frenchWordsID.length ; i++)
	{
		if (id < frenchWordsID[i])
		{
			return i;
		}
	}

	return frenchWordsID.length;
}

function binarySearch(query: string) {
	// Binary search through BattleSearchIndex, better performances than regular search
	let left = 0;
	let right = BattleSearchIndex.length - 1;
	while (right > left) {
		let mid = Math.floor((right - left) / 2 + left);
		if (BattleSearchIndex[mid][0] === query && (mid === 0 || BattleSearchIndex[mid - 1][0] !== query)) {
			return mid; // Exact match
		} else if (BattleSearchIndex[mid][0] < query) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	if (left >= BattleSearchIndex.length - 1) left = BattleSearchIndex.length - 1;
	else if (BattleSearchIndex[left + 1][0] && BattleSearchIndex[left][0] < query) left++;
	if (left && BattleSearchIndex[left - 1][0] === query) left--;
	return left;
}

function getPokemonCurHTMLElement(englishPokemonID: string)
{
	var battleSearchElement = new BattleSearch("","");
	return battleSearchElement.renderRow(englishPokemonID, "pokemon", 0, 0, "", ' class="cur"');
}