import { PokemonDico } from './translator';
import { AlternateFormsDico } from './translator';
import { AbilitiesDico } from './translator';
import { TypesDico } from './translator';
import { HeadersDico } from './translator';
import { MenuDico } from './translator';

import { removeDiacritics } from './translator';

// Inject Showdown variables inside inject.js
var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(s);

var observer = new MutationObserver(onMutation);
observer.observe(document, {
	childList: true, // report added/removed nodes
	subtree: true,   // observe any descendant elements
});

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
				case 'utilichart': // Search results have been reset

					updatePokemonInfo();

					for (var k = 0, result; (result = node.childNodes[k]) ; k++)
					{
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

function updateCurElement()
{
	// Cur element is the 
	var curElements = document.getElementsByClassName("cur");
}

function updatePokemonInfo()
{
	var teamchartElement = document.getElementsByClassName("teamchart").item(0);
	var liComponent = teamchartElement?.firstChild;

	var inputElement = document.getElementsByName("pokemon")[0] as HTMLInputElement;
	var searchInput = inputElement.value;

	if (liComponent && searchInput)
	{
		var translatedPokemonName = getTranslatedPokemonNameArray(searchInput);

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
							(nicknameElement as HTMLInputElement).placeholder = (translatedPokemonName[0] || "");
						}
					});

					break;

				case "setchart":

					node.childNodes.forEach(function(pokemonInfoNode) {
						var classList = (pokemonInfoNode as Element).classList;

						// Name
						if (classList.contains("setcol-icon"))
						{
							// Translate the name
							// If the utilichart component is updated, the name is most likely correct
							pokemonInfoNode.childNodes.forEach(function(spriteNameNode) {
								spriteNameNode.childNodes.forEach(function(nameNode) {
									var nameInput = nameNode as HTMLInputElement;
			
									if (nameInput.tagName == "INPUT" && nameInput.value) {

										if (translatedPokemonName && translatedPokemonName[0])
										{
											if (translatedPokemonName[1]) {
												nameInput.value = translatedPokemonName[0] + "-" + translatedPokemonName[1];
											}
											else {
												nameInput.value = translatedPokemonName[0];
											}
										}
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

function getTranslatedPokemonNameArray(pokemonShowdownName: string)
{
	const HyphenPokemonName = ["Nidoran-F", "Nidoran-M", "Ho-Oh", "Porygon-Z", "Jangmo-o", "Hakamo-o", "Kommo-o"]
	var pokemonRawName = pokemonShowdownName.split("-");

	if (pokemonRawName.length == 1)
	{
		// No "-" in the name so no alternate form
		return [translatePokemonName(pokemonRawName[0]), ""];
	}
	else
	{
		// Check if the "-" is present because there was one in the raw name
		var possibleHyphenPokemon = pokemonRawName[0] + "-" + pokemonRawName[1];
		var pokemonEnglishBaseName = "";

		if (HyphenPokemonName.includes(possibleHyphenPokemon)) {
			// "-" in the base Pokémon name
			pokemonEnglishBaseName = possibleHyphenPokemon;

			// If the only "-" in the whole name was in the raw name, there is no alternate form
			if (pokemonRawName.length == 2) {
				return [translatePokemonName(pokemonEnglishBaseName), ""];
			}
		}
		else {
			// No "-" in the base Pokémon name, so the first element is the english Pokémon name
			pokemonEnglishBaseName = pokemonRawName[0];
		}

		// Remove the pokemon name from the whole name to get the alternate form
		var alternatePokemonFormName = pokemonShowdownName.replace(pokemonEnglishBaseName + "-", "");

		// Return the translated Pokémon name and its form
		return [translatePokemonName(pokemonEnglishBaseName),
			translateAlternateFormName(pokemonEnglishBaseName, alternatePokemonFormName)]
	}
}

function getTranslatedPokemonName(pokemonShowdownName: string)
{
	var translatedPokemonName = getTranslatedPokemonNameArray(pokemonShowdownName);

	if (translatedPokemonName && translatedPokemonName[0])
	{
		if (translatedPokemonName[1]) {
			return translatedPokemonName[0] + "-" + translatedPokemonName[1];
		}
		else {
			return translatedPokemonName[0];
		}
	}
	else
	{
		return pokemonShowdownName;
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

function translateAlternateFormName(pokemonEnglishName: string, alternatePokemonFormName: string)
{
	var frenchAlternateFormName = AlternateFormsDico[alternatePokemonFormName];

	if (frenchAlternateFormName)
	{
		var possibleMultipleMatches = frenchAlternateFormName.split("|");

		if (possibleMultipleMatches.length > 1) // If multiple Pokémons match the alternate form name
		{
			for (var i = 0, name; (name = possibleMultipleMatches[i]); i++)
			{
				var attribute = name.split(":");

				if (attribute[0] == pokemonEnglishName) { // Use the correct alterate form name for the Pokémon
					return attribute[1];
				}
			}
		}
		else
		{
			return frenchAlternateFormName;
		}
	}
	else {
		console.log("Unable to translate form " + alternatePokemonFormName);
		return alternatePokemonFormName;
	}
}

function updatePokemonName(element: Element)
{
	var pokemonElement = element.querySelector('.pokemonnamecol');
	
	if (pokemonElement)
	{
		var searchIndex = -1;
		var searchString = "";
		var pokemonShowdownName = pokemonElement.textContent;

		if (pokemonShowdownName == null)
			return;

		var pokemonTranslatedName = getTranslatedPokemonNameArray(pokemonShowdownName);

		// Don't update HTML if no translation is found
		if (pokemonTranslatedName[0])
		{
			// Remove current Pokémon name so we can replace it
			pokemonElement.textContent = '';

			// Retrieve the searched content
			var inputElement = document.getElementsByName("pokemon")[0] as HTMLInputElement;
			var searchInput = inputElement.value;
			
			if (searchInput.length > 0)
			{
				searchString = removeDiacritics(searchInput.toLowerCase());
				searchIndex = removeDiacritics(pokemonTranslatedName[0].toLowerCase()).indexOf(searchString);
			}

			// Make the searched content bold in the Pokémon name.
			if (searchIndex >= 0)
			{
				var boldName = pokemonTranslatedName[0].slice(searchIndex, searchIndex + searchString.length);
				var regularName = pokemonTranslatedName[0].slice(searchIndex + searchString.length, pokemonTranslatedName[0].length);

				var boldElement = document.createElement("b");
				boldElement.appendChild(document.createTextNode(boldName))

				if (searchIndex > 0) { // Searched content is in the middle of the name
					pokemonElement.appendChild(document.createTextNode(pokemonTranslatedName[0].slice(0,searchIndex)));
				}
				
				pokemonElement.appendChild(boldElement);
				pokemonElement.appendChild(document.createTextNode(regularName));
			}
			else
			{
				// No searched content, add the raw name
				pokemonElement.appendChild(document.createTextNode(pokemonTranslatedName[0]));
			}

			// If an altername form is present, add it in a small tag
			if (pokemonTranslatedName[1])
			{
				var alternateForm = document.createElement("small");
				alternateForm.appendChild(document.createTextNode("-" + pokemonTranslatedName[1])); // Put the alternate form name in small tag
				pokemonElement.appendChild(alternateForm);	
			}
		}	
	}
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

function updatePokemonAbility(element: Element)
{
	var displayedDataType = getDisplayedDataType(element);
	
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
						headerTag.textContent = "Pokémon avec " + filterData;
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