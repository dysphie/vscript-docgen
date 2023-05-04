import React, { MouseEvent, ChangeEvent, useState } from 'react';
import { parse, SyntaxError } from '../parser/parser';
import { VScriptClass, VScriptClassMember, VScriptConstant, VScriptEnum, VScriptFunction, VScriptFunctionParam } from '../structs';

interface RawInputProps
{
	setClasses: (classes: Map<string,VScriptClass>) => void;
	setFunctions: (functions: Map<string,VScriptFunction>) => void;
	setEnums: (enums: Map<string,VScriptEnum>) => void;
	setConstants: (constants: Map<string,VScriptConstant>) => void;
	setParsed: (state: boolean) => void;
}

const RawInput = (props: RawInputProps) => {

	const [rawText, setRawText] = useState("");
	const [pegOutput, setPegOutput] = useState([]);
	const [parseError, setParseError] = useState("");

	const pegJsonToMemory = (json: any): void => {

		const newClasses = new Map<string,VScriptClass>();
		const newFunctions = new Map<string, VScriptFunction>();
		const newEnums = new Map<string,VScriptEnum>();
		const newConstants = new Map<string,VScriptConstant>();

		// Iterate once to get the classes and enums, we need them first
		for (const key of Object.keys(json)) {
			console.log('found key in object keys');
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

		console.log("Now get funcs etc");

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

							console.log(`Added ${constant.ident} to enum`);
						} else {
							console.log(`Couldn't find enum ${entry.enum[0]} that ${constant.ident} is specifying`);
						}
					} else {
						newConstants.set(entry.id, constant);
					}
					break;
				}
			}
		}

		props.setClasses(newClasses);
		props.setFunctions(newFunctions);
		props.setConstants(newConstants);
		props.setEnums(newEnums);

		props.setParsed(true);

		console.log(`We ended up with ${newEnums.size} newEnums`);
		console.log(`We ended up with ${newFunctions.size} newFunctions`);
		console.log(`We ended up with ${newConstants.size} newConstants`);
		console.log(`We ended up with ${newClasses.size} newClasses`);
	}

	const handleRawInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setRawText(event.target.value);
	}

	const handleProcessClicked = (event: MouseEvent<HTMLButtonElement>) => {

		try {
			const parsed = parse(rawText);
			console.log(parsed);
			pegJsonToMemory(parsed);
		} catch (e) {
			console.log(e);
			return;
		}
	}

	return (
		<div className="raw-input">
			<label htmlFor="raw-input">Raw input:</label>
			<textarea id="raw-input" name="raw-input" onChange={handleRawInputChange}>
			</textarea>
			<button onClick={handleProcessClicked}>Parse</button>
			<p>{parseError}</p>
		</div>
	)


}

export default RawInput;