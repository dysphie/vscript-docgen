import { SearchResult, VScriptClass, VScriptClassMember, VScriptConstant, VScriptEnum, VScriptFunction } from "./structs";
var stringSimilarity = require("string-similarity");

const MIN_THRESHOLD = 0.2;

enum SearchableType
{
    Enum,
    EnumMember,
    Class,
    ClassMember,
    ClassMethod,
    ClassHook,
    Function,
    Constant,
}

const searchEnum = (results: SearchResult[], targetEnum: VScriptEnum, query: string) => {

    // Search enum name
    const enumScore = calculateScore(query, targetEnum.ident);
    if (enumScore >= MIN_THRESHOLD) {
        results.push({
            score: enumScore,
            ident: targetEnum.ident,
            parent: null,
            kind: SearchableType.Enum
        });
    }

    // Search enum members
    targetEnum.members.forEach((member: VScriptConstant) => {
        const memberScore = calculateScore(query, member.ident);
        if (memberScore >= MIN_THRESHOLD) {
            results.push({
                score: memberScore,
                ident: member.ident,
                parent: targetEnum.ident,
                kind: SearchableType.EnumMember
            });
        }
    });

    return results;
};

const searchClass = (results: SearchResult[], targetClass: VScriptClass, query: string) => {

    // Search class name
    const classScore = calculateScore(query, targetClass.ident);
    if (classScore >= MIN_THRESHOLD) {
        results.push({
            score: classScore,
            ident: targetClass.ident,
            parent: null,
            kind: SearchableType.Class
        });
    }

    // Search class properties
    targetClass.members.forEach((member: VScriptClassMember) => {
        const memberScore = calculateScore(query, member.ident);
        if (memberScore >= MIN_THRESHOLD) {
            results.push({
                score: memberScore,
                ident: member.ident,
                parent: targetClass.ident,
                kind: SearchableType.ClassMember
            });
        }
    });

    // Search class methods
    targetClass.methods.forEach((method: VScriptFunction) => {
        const methodScore = calculateScore(query, method.ident);
        if (methodScore >= MIN_THRESHOLD) {
            results.push({
                score: methodScore,
                ident: method.ident,
                parent: targetClass.ident,
                kind: SearchableType.ClassMethod
            });
        }
    });

    // Search class hooks
    targetClass.hooks.forEach((hooks: VScriptFunction) => {
        const hooksScore = calculateScore(query, hooks.ident);
        if (hooksScore >= MIN_THRESHOLD) {
            results.push({
                score: hooksScore,
                ident: hooks.ident,
                parent: targetClass.ident,
                kind: SearchableType.ClassHook
            });
        }
    });
};

const searchFunction = (results: SearchResult[], targetFn: VScriptFunction, query: string) => {

    // Search function name
    const fnScore = calculateScore(query, targetFn.ident);
    if (fnScore >= MIN_THRESHOLD) {
        results.push({
            score: fnScore,
            ident: targetFn.ident,
            parent: null,
            kind: SearchableType.Function
        });
    }
};


	const searchConstant = (results: SearchResult[], targetConst: VScriptFunction, query: string) => {

		// Search constant name
		const constScore = calculateScore(query, targetConst.ident);
		if (constScore >= MIN_THRESHOLD) {
			results.push({
				score: constScore,
				ident: targetConst.ident,
				parent: null,
				kind: SearchableType.Constant
			});
		}
	};

	export function calculateScore(a: string, b: string): number {
		if (a === b) {
			return 1.0;
		}

		const aLow = a.toLowerCase();
		const bLow = b.toLowerCase();

		if (aLow === bLow) {
			return 0.9;
		}

		if (aLow.includes(bLow)) {
			return 0.8;
		}

		return compareTwoStrings(a, b);
	}

	function compareTwoStrings(first: string, second: string) {
		first = first.replace(/\s+/g, '')
		second = second.replace(/\s+/g, '')

		if (first === second) return 1; // identical or empty
		if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

		let firstBigrams = new Map();
		for (let i = 0; i < first.length - 1; i++) {
			const bigram = first.substring(i, i + 2);
			const count = firstBigrams.has(bigram)
				? firstBigrams.get(bigram) + 1
				: 1;

			firstBigrams.set(bigram, count);
		};

		let intersectionSize = 0;
		for (let i = 0; i < second.length - 1; i++) {
			const bigram = second.substring(i, i + 2);
			const count = firstBigrams.has(bigram)
				? firstBigrams.get(bigram)
				: 0;

			if (count > 0) {
				firstBigrams.set(bigram, count - 1);
				intersectionSize++;
			}
		}

		return (2.0 * intersectionSize) / (first.length + second.length - 2);
	}


export { SearchableType, searchEnum, searchFunction, searchClass, searchConstant }
