import React from 'react';
import { Outlet } from 'react-router-dom';
import { SearchResult, VScriptClass, VScriptFunction, VScriptEnum, VScriptConstant } from '../structs';
import RawInput from './RawInput';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import Overview from './Overview';

interface HomeProps {
	searchTerm: string;
	setSearchTerm: (name: string) => void;
	searchResults: SearchResult[];
	setSearchResults: (results: SearchResult[]) => void;
	classes: Map<string, VScriptClass>;
	setClasses: (classes: Map<string, VScriptClass>) => void;
	functions: Map<string, VScriptFunction>;
	setFunctions: (functions: Map<string, VScriptFunction>) => void;
	enums: Map<string, VScriptEnum>;
	setEnums: (enums: Map<string, VScriptEnum>) => void;
	constants: Map<string, VScriptConstant>;
	setConstants: (constants: Map<string, VScriptConstant>) => void;
	parsed: boolean;
	setParsed: (parsed: boolean) => void;
}

const Home = (props: HomeProps) => {

	if (!props.parsed) {
		return (
			<RawInput
				setClasses={props.setClasses}
				setFunctions={props.setFunctions}
				setEnums={props.setEnums}
				setConstants={props.setConstants}
				setParsed={props.setParsed}
			/>
		)
	}

	return (
		<div className='Home'>
			<div className="overview">
				<Overview
					functions={props.functions}
					enums={props.enums}
					classes={props.classes}
					constants={props.constants}
				/>
			</div>
			<div className="content">
				<Outlet />
			</div>
			<div className="search">
				<SearchBar
						searchTerm={props.searchTerm}
						setSearchTerm={props.setSearchTerm}
						setSearchResults={props.setSearchResults}
						classes={props.classes}
						functions={props.functions}
						enums={props.enums}
						constants={props.constants}
				/>
				<SearchResults results={props.searchResults} />
			</div>
		</div>
	)
}

export default Home;