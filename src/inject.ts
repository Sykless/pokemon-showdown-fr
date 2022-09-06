import { PokemonDico } from './translator';
import { AbilitiesDico } from './translator';
import { removeDiacritics } from './translator';

const FRENCH = 0;
const ENGLISH = 1;
const SEARCH_TYPE = 2;

const Dictionnaries: Array<{ [englishName: string]: string; }> = [PokemonDico, AbilitiesDico];

// Variable defined by Showdown containing every piece of data
// (Pokémon names, moves, abilities) needed in the teambuilder research
declare var BattleSearchIndex: any;
declare var BattleSearchIndexOffset: any;

var frenchNamesDico = populateFrenchDico();

var newBattleSearchIndex = [];
var newBattleSearchIndexOffset = [];
var newBattleSearchIndexSize = BattleSearchIndex.length + frenchNamesDico.length;

var frenchIndex = 0;
var frenchWordsID: Array<number> = [];

for (var englishIndex = 0 ; newBattleSearchIndex.length < newBattleSearchIndexSize ; englishIndex++)
{
	if (frenchIndex == frenchNamesDico.length)
	{
		newBattleSearchIndex.push(BattleSearchIndex[englishIndex]);
		newBattleSearchIndexOffset.push(BattleSearchIndexOffset[englishIndex]);
	}
	else if (frenchNamesDico[frenchIndex][FRENCH] == frenchNamesDico[frenchIndex][ENGLISH])
	{
		frenchIndex++;
		englishIndex--;
		newBattleSearchIndexSize--;
	}
	else if (englishIndex == BattleSearchIndex.length || BattleSearchIndex[englishIndex][0] > frenchNamesDico[frenchIndex][FRENCH])
	{
		let englishID = binarySearch(frenchNamesDico[frenchIndex][ENGLISH]);

		newBattleSearchIndex.push([frenchNamesDico[frenchIndex][FRENCH],frenchNamesDico[frenchIndex][SEARCH_TYPE],englishID,0])
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
		newBattleSearchIndex[fusionnedIndex][2] += getDecalage(newBattleSearchIndex[fusionnedIndex][2]);
	}
}

BattleSearchIndex = newBattleSearchIndex;
BattleSearchIndexOffset = newBattleSearchIndexOffset;

console.log(BattleSearchIndex);

function populateFrenchDico()
{
	let NamesTranslation: Array<any> = [];
	let searchTypeGetter: Array<string> = ["pokemon", "ability"];

	for (var i = 0 ; i < searchTypeGetter.length ; i++)
	{
		var dico = Dictionnaries[i];
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

function getDecalage(id: number)
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