import React, { useState } from 'react';
import { searchClass, searchEnum, searchFunction } from '../search';
import { SearchResult, VScriptClass, VScriptConstant, VScriptEnum, VScriptFunction } from '../structs';

interface SearchProps {
	searchTerm: string;
	setSearchTerm: (name: string) => void;
	setSearchResults: (results: SearchResult[]) => void;
	classes: Map<string, VScriptClass>;
	functions: Map<string, VScriptFunction>;
	enums: Map<string, VScriptEnum>;
	constants: Map<string, VScriptConstant>;
}

const Search = (props: SearchProps) => {

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

		props.setSearchTerm(e.target.value);

		if (e.target.value.length < 2) {
			props.setSearchResults([]);
			return;
		}

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

		props.setSearchResults(results);
	}

	return (
		<div>
			<input className='search-input' type="search" onChange={handleChange} value={props.searchTerm} />
		</div>
	)
}

export default Search;