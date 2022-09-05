import { PokemonDico } from './translator';

const FRENCH = 0;
const ENGLISH = 1;

declare var BattleSearchIndex: any;
declare var BattleSearchIndexOffset: any;

let NamesTranslation: Array<any> = [];

for (var englishName in PokemonDico)
{
	var frenchName = PokemonDico[englishName].toLowerCase();
	
	var formattedFrenchName = removeSpecialCharacters(frenchName);
	var formattedEnglishName = removeSpecialCharacters(englishName.toLowerCase());

	var notAccented = updateSpecialCharacters(frenchName);

	if (notAccented != frenchName)
	{
		NamesTranslation.push([notAccented, formattedEnglishName]);
	}

	NamesTranslation.push([formattedFrenchName, formattedEnglishName]);
}

var sortedArray = NamesTranslation.sort(function(a, b) {
	if (a[0] < b[0]) return -1;
   	if (a[0] > b[0]) return 1;
   	return 0;
});

console.log(sortedArray);

var newBattleSearchIndex = [];
var newBattleSearchIndexOffset = [];
var newBattleSearchIndexSize = BattleSearchIndex.length + sortedArray.length;

var frenchIndex = 0;
var frenchWordsID: Array<number> = [];

for (var englishIndex = 0 ; newBattleSearchIndex.length < newBattleSearchIndexSize ; englishIndex++)
{
	if (frenchIndex == sortedArray.length)
	{
		newBattleSearchIndex.push(BattleSearchIndex[englishIndex]);
		newBattleSearchIndexOffset.push(BattleSearchIndexOffset[englishIndex]);
	}
	else if (sortedArray[frenchIndex][FRENCH] == sortedArray[frenchIndex][ENGLISH])
	{
		frenchIndex++;
		englishIndex--;
		newBattleSearchIndexSize--;
	}
	else if (englishIndex == BattleSearchIndex.length || BattleSearchIndex[englishIndex][0] > sortedArray[frenchIndex][FRENCH])
	{
		let englishID = getClosestJS(sortedArray[frenchIndex][ENGLISH]);

		newBattleSearchIndex.push([sortedArray[frenchIndex][FRENCH],"pokemon",englishID,0])
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

console.log(frenchWordsID);
console.log(BattleSearchIndex);
console.log(BattleSearchIndexOffset);

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

function removeSpecialCharacters(text: string) {
	return text.replace(/[^a-z0-9]+/g, "");
}

function updateSpecialCharacters(text: string) {
	return text.replace(/é|è|ê/g,'e')
		.replace('â','a')
		.replace('ç','c')
		.replace('ï','i')
		.replace('ô','o');
}

function getClosestJS(query: string) {
	// binary search through the index!
	let left = 0;
	let right = BattleSearchIndex.length - 1;
	while (right > left) {
		let mid = Math.floor((right - left) / 2 + left);
		if (BattleSearchIndex[mid][0] === query && (mid === 0 || BattleSearchIndex[mid - 1][0] !== query)) {
			// that's us
			return mid;
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