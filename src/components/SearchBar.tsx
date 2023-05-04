import React, { useState } from 'react';
import { searchClass, searchEnum, searchFunction } from '../search';
import { SearchResult, VScriptClass, VScriptConstant, VScriptEnum, VScriptFunction } from '../structs';

interface SearchBarProps
{
	searchTerm: string;
	setSearchTerm: (name: string) => void;
	setSearchResults: (results: SearchResult[]) => void;
	classes: Map<string,VScriptClass>;
	functions: Map<string,VScriptFunction>;
	enums: Map<string,VScriptEnum>;
	constants: Map<string,VScriptConstant>;
}

const SearchBar = (props: SearchBarProps) => {

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		props.setSearchTerm(e.target.value);

		let results: SearchResult[] = [];

		for (let [key, value] of props.classes) {
			searchClass(results, value, props.searchTerm);
		}

		for (let [key, value] of props.functions) {
			searchFunction(results, value, props.searchTerm);
		}
		
		for (let [key, value] of props.enums) {
			searchEnum(results, value, props.searchTerm);
		}

		// move filter to arr push logic
		results.sort((res1, res2) => res2.score - res1.score);

		props.setSearchResults(results);
	}

	return (
		<div>
			<input type="search" onChange={handleChange} value={props.searchTerm}/>
		</div>
	)
}

export default SearchBar;