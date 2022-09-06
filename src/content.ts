import { PokemonDico } from './translator';
import { AlternateFormsDico } from './translator';
import { AbilitiesDico } from './translator';
import { TypesDico } from './translator';
import { HeadersDico } from './translator';

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

function updatePokemonName(element: Element)
{
	var pokemonElement = element.querySelector('.pokemonnamecol');
	
	if (pokemonElement != null)
	{
		var searchIndex = -1;
		var searchString = "";
		var alternameFormName = "";
		var pokemonShowdownName = pokemonElement.innerHTML;

		if (pokemonShowdownName == null)
			return;

		// Exclude alternate form
		var wholePokemonName = pokemonShowdownName.split("<small>");

		// Remove HTML tags
		for (var i = 0 ; i < wholePokemonName.length ; i++) {
			wholePokemonName[i] = wholePokemonName[i].replace(/<\/?[^>]+(>|$)/g, "");
		}
			
		 // Translate Pokémon name
		var pokemonFrenchName = PokemonDico[wholePokemonName[0]];

		if (pokemonFrenchName == null)
		{
			console.log("Unable to translate " + wholePokemonName[0]);
			return;
		}

		// Alternate forms are located in <small> tags
		if (wholePokemonName.length > 1) {
			alternameFormName = getAlternateFormName(wholePokemonName);
		}

		// Remove current Pokémon name so we can replace it
		pokemonElement.textContent = '';

		// Retrieve the searched content
		var inputElement = document.getElementsByName("pokemon")[0] as HTMLInputElement;
		var searchInput = inputElement.value;
		
		if (searchInput.length > 0)
		{
			searchString = removeDiacritics(searchInput.toLowerCase());
			searchIndex = removeDiacritics(pokemonFrenchName.toLowerCase()).indexOf(searchString);
		}

		// Make the searched content bold in the Pokémon name.
		if (searchIndex >= 0)
		{
			var boldName = pokemonFrenchName.slice(searchIndex, searchIndex + searchString.length);
			var regularName = pokemonFrenchName.slice(searchIndex + searchString.length, pokemonFrenchName.length);

			var boldElement = document.createElement("b");
			boldElement.appendChild(document.createTextNode(boldName))

			if (searchIndex > 0) { // Searched content is in the middle of the name
				pokemonElement.appendChild(document.createTextNode(pokemonFrenchName.slice(0,searchIndex)));
			}
			
			pokemonElement.appendChild(boldElement);
			pokemonElement.appendChild(document.createTextNode(regularName));
		}
		else
		{
			// No searched content, add the raw name
			pokemonElement.appendChild(document.createTextNode(pokemonFrenchName));
		}

		// If an altername form is present, add it in a small tag
		if (alternameFormName != "")
		{
			var alternateForm = document.createElement("small");
			alternateForm.appendChild(document.createTextNode(alternameFormName)); // Put the alternate form name in small tag
			pokemonElement.appendChild(alternateForm);	
		}
	}
}

function getAlternateFormName(pokemonShowdownName: string[])
{
	// Remove the "-" at the start of the form name, then translate it
	var alternameFormName = AlternateFormsDico[pokemonShowdownName[1].substring(1)];
	
	if (alternameFormName == null)
	{
		console.log("Unable to translate alternate form " + pokemonShowdownName[0] + pokemonShowdownName[1]);
		return "-" + pokemonShowdownName[1];
	}
	else if (alternameFormName.includes("|")) // If multiple Pokémons match the alternate form name
	{
		for (var i = 0, name; (name = alternameFormName.split("|")[i]); i++)
		{
			var attribute = name.split(":");

			if (attribute[0] == pokemonShowdownName[0]) { // Use the correct alterate form name for the Pokémon
				return "-" + attribute[1];
			}
		}
	}
	
	return "-" + alternameFormName;
}

function getDisplayedDataType(element: Element)
{
	var displayedDataType = "";

	// Element should be a li tag with a result class
	if (element.tagName == "LI" && element.classList.contains("result"))
	{
		var childResult = element.firstChild as Element;

		if (childResult != null)
		{
			// If result child is a tag name, it should have a data-entry
			// attribute telling what the displayed data is
			if (childResult.tagName == "A")
			{
				var attribute = childResult.getAttribute('data-entry');

				if (attribute != null) {
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

			if (frenchAbility != null) { // Directly update the textContent, no style needed
				node.textContent = frenchAbility;
			}
			else {
				console.log("Unable to translate ability " + node.textContent);
			}
		}
	}

	// There could be a node with two abilities
	if (twoAbilitiesNode != null)
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
			var abilityTextNode = document.createTextNode(frenchAbility != null ? frenchAbility : twoAbilities[i])

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

	if (abilityNode != null && abilityNode.textContent != null)
	{
		var frenchAbility = AbilitiesDico[abilityNode.textContent];

		if (frenchAbility != null) { // Directly update the textContent, no style needed
			abilityNode.textContent = frenchAbility;
		}
		else {
			console.log("Unable to translate ability " + abilityNode.textContent);
		}
	}

	if (filterNode != null) {
		translateFilter(filterNode);
	}
	
}

function updateHeader(headerElement: Element)
{
	var headerTag = headerElement.firstChild as Element;

	if (headerTag.tagName == "H3" && headerTag.textContent != null)
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
				if (possibleType != null)
				{
					headerTag.textContent = "Pokémon de type " + possibleType;
				}
				// Ability
				else
				{
					// Translate ability and insert it with the header french translation
					var filteredAbility = AbilitiesDico[filterData];

					if (filteredAbility != null) {
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

				if (possiblePokemonName != null) {
					headerTag.textContent = "Spécifique à " + possiblePokemonName;
				}
				else {
					// Default : the header should be in HeadersDico
					var translatedHeader = HeadersDico[headerTag.textContent];

					if (translatedHeader != null) {
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

			if (translatedHeader != null) {
				headerTag.textContent = translatedHeader;
			}
			else {
				console.log("Unable to translate header " + headerTag.textContent);
			}
		}
	}
	else if (!headerTag.classList.contains("result"))
	{
		console.log("Unknown header element");
		console.log(headerElement)
	}
}

function translateFilter(filterNode: Element)
{
	var filterButtonTag = filterNode.firstChild as Element;

	if (filterButtonTag != null && filterButtonTag.tagName == "EM") {
		filterButtonTag.textContent = "Filtrer";
	}
	else {
		console.log("Unkown filter element");
		console.log(filterNode);
	}
}