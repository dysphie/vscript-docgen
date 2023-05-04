import { SearchResult, VScriptClass, VScriptClassMember, VScriptConstant, VScriptEnum, VScriptFunction } from "./structs";
var stringSimilarity = require("string-similarity");

enum SearchableType
{
	Enum,
	EnumMember,
	Class,
	ClassMember,
	ClassMethod,
	Function,
	Constant,
}

const searchEnum = (results: SearchResult[], targetEnum: VScriptEnum, query: string) => {

	// Search enum name
	
	results.push({
			score: stringSimilarity.compareTwoStrings(query, targetEnum.ident),
			ident: targetEnum.ident,
			parent: null,
			kind: SearchableType.Enum
		})

	// Search enum members
	targetEnum.members.forEach((member: VScriptConstant) => {
		results.push({
			score: stringSimilarity.compareTwoStrings(query, member.ident),
			ident: member.ident,
			parent: targetEnum.ident,
			kind: SearchableType.EnumMember
		});
	});

	return results;
}

const searchClass = (results: SearchResult[], targetClass: VScriptClass, query: string) => {

	// Search class name
	results.push({
		score: stringSimilarity.compareTwoStrings(query, targetClass.ident),
		ident: targetClass.ident,
		parent: null,
		kind: SearchableType.Class
	});

	// Search class properties
	targetClass.members.forEach((member: VScriptClassMember) => {
		results.push({
			score: stringSimilarity.compareTwoStrings(query, member.ident),
			ident: member.ident,
			parent: targetClass.ident,
			kind: SearchableType.ClassMember
		});
	});	
	
	// Search class methods
	targetClass.methods.forEach((method: VScriptFunction) => {
		results.push({
			score: stringSimilarity.compareTwoStrings(query, method.ident),
			ident: method.ident,
			parent: targetClass.ident,
			kind: SearchableType.ClassMethod
		});
	});
}

const searchFunction = (results: SearchResult[], targetFn: VScriptFunction, query: string) => {

	// Search function name
	results.push({
		score: stringSimilarity.compareTwoStrings(query, targetFn.ident),
		ident: targetFn.ident,
		parent: null,
		kind: SearchableType.Function
	});	
}

const searchConstant = (results: SearchResult[], targetConst: VScriptFunction, query: string) => {

	// Search function name
	results.push({
		score: stringSimilarity.compareTwoStrings(query, targetConst.ident),
		ident: targetConst.ident,
		parent: null,
		kind: SearchableType.Constant
	});	
}

export { SearchableType, searchEnum, searchFunction, searchClass, searchConstant }
