import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { SearchResult, VScriptClass, VScriptFunction, VScriptEnum, VScriptConstant, VScriptClassMember, VScriptFunctionParam } from '../structs';
import SearchBar from './Search';
import SearchResults from './SearchResults';
import Overview from './Overview';
import NotFound from './NotFound';

interface HomeProps {
	searchTerm: string;
	setSearchTerm: (name: string) => void;
	searchResults: SearchResult[];
	setSearchResults: (results: SearchResult[]) => void;
	classes: Map<string, VScriptClass>;
	functions: Map<string, VScriptFunction>;
	enums: Map<string, VScriptEnum>;
	constants: Map<string, VScriptConstant>;

	setClasses: (classes: Map<string, VScriptClass>) => void;
	setFunctions: (functions: Map<string, VScriptFunction>) => void;
	setEnums: (enums: Map<string, VScriptEnum>) => void;
	setConstants: (constants: Map<string, VScriptConstant>) => void;
	setParsed: (state: boolean) => void;
	setProjectName: (name: string) => void;
}

const Home = (props: HomeProps) => {

	const { nameSpace } = useParams<{ nameSpace: string }>();
	console.log(`namespace is ${nameSpace}`);
	//return <h1> {nameSpace}</h1>

	const {
		setClasses,
		setFunctions,
		setEnums,
		setConstants,
		setParsed,
		setProjectName
	}: HomeProps = props;

	useEffect(() => {

		if (!nameSpace) {
			return;
		}

		setProjectName(nameSpace);

		const localJson = localStorage.getItem(nameSpace);
		if (!localJson) {
			return;
		}

		const json = JSON.parse(localJson);
		pegJsonToMemory(json);
	}, []);


	const pegJsonToMemory = (json: any): void => {

		const newClasses = new Map<string, VScriptClass>();
		const newFunctions = new Map<string, VScriptFunction>();
		const newEnums = new Map<string, VScriptEnum>();
		const newConstants = new Map<string, VScriptConstant>();

		// Iterate once to get the classes and enums, we need them first
		for (const key of Object.keys(json)) {
			//console.log('found key in object keys');
			const entry = json[key];
			switch (entry.kind) {
				case 'class': {
					const name = entry.id;
					newClasses.set(name, {
						description: entry.description,
						parent: entry.parent,
						ident: entry.id,
						methods: [],
						members: [],
						hooks: []
					});

					break;
				}

				case 'enum': {
					newEnums.set(entry.id, {
						ident: entry.id,
						description: entry.desc,
						members: []
					})
					break;
				}
			}
		}

		//console.log("Now get funcs etc");

		// Now get functions, constants, and hooks, and populate previously found classes and enums
		for (const key of Object.keys(json)) {
			const entry = json[key];

			switch (entry.kind) {
				case 'class_member': {

					const cls = newClasses.get(entry.class);
					if (!cls) {
						break;
					}

					const member: VScriptClassMember = {
						ident: entry.id,
						description: entry.desc
					}
					cls.members.push(member);
					break;
				}

				case 'function': {

					const params: VScriptFunctionParam[] = [];

					entry.args?.forEach((arg: any) => {
						const param: VScriptFunctionParam = {
							ident: arg.id,
							type: arg.type,
							description: ''
						}
						params.push(param);
					})
					const func: VScriptFunction = {
						ident: entry.id,
						description: entry.desc,
						retval: entry.ret,
						parameters: params
					}

					if (entry.class) {
						const cls = newClasses.get(entry.class);
						if (cls) {
							cls.methods.push(func);
						}
					}
					else {
						newFunctions.set(entry.id, func);
					}
					break;
				}
				case 'hook': {
					const cls = newClasses.get(entry.class);
					if (cls) {

						const params: VScriptFunctionParam[] = [];

						entry.args?.forEach((arg: any) => {
							const param: VScriptFunctionParam = {
								ident: arg.id,
								type: arg.type,
								description: ''
							}
							params.push(param);
						})

						cls.hooks.push({
							description: entry.desc,
							ident: entry.id,
							retval: entry.ret,
							parameters: params
						});
					}
					break;
				}
				case 'constant': {
					const constant: VScriptConstant = {
						ident: entry.id,
						value: entry.value,
						description: entry.desc,
						type: entry.type
					};

					// FIXME: enum should be a str but it's giving us an array, bad pegjs grammar
					if (entry.enum) {
						const enum_ = newEnums.get(entry.enum[0]);
						if (enum_) {
							enum_.members.push(constant);

							//console.log(`Added ${constant.ident} to enum`);
						} else {
							//console.log(`Couldn't find enum ${entry.enum[0]} that ${constant.ident} is specifying`);
						}
					} else {
						newConstants.set(entry.id, constant);
					}
					break;
				}
			}
		}

		setClasses(newClasses);
		setFunctions(newFunctions);
		setConstants(newConstants);
		setEnums(newEnums);

		setParsed(true);

		//console.log(`We ended up with ${newEnums.size} newEnums`);
		//console.log(`We ended up with ${newFunctions.size} newFunctions`);
		//console.log(`We ended up with ${newConstants.size} newConstants`);
		//console.log(`We ended up with ${newClasses.size} newClasses`);
	}

	if (!nameSpace) {
		return <NotFound />
	}

	return (
		<div className='Home'>
			<div className="overview">
				<Overview
					functions={props.functions}
					enums={props.enums}
					classes={props.classes}
					constants={props.constants}
					projectName={nameSpace}
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