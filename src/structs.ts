import { SearchableType } from "./search";

export interface SearchResult {
    ident: string;
	kind: SearchableType;
	parent: string|null;
	score: number;
}

export interface VScriptClass
{
	parent: string;
	ident: string;
	description: string;
	methods: VScriptFunction[];
	members: VScriptClassMember[];
	hooks: VScriptFunction[];
}

export interface VScriptFunction {
	retval: string;
	ident: string;
    description: string;
    parameters: VScriptFunctionParam[];
}

export interface VScriptFunctionParam {
    type: string;
	ident: string;
    description: string;
}

export interface VScriptClassMember
{
    ident: string;
	description: string;
}

export interface VScriptConstant
{
	ident: string;
	value: string;
	description: string; 
	type: string;
}

export interface VScriptEnum {
	ident: string;
    description: string;
	members: VScriptConstant[];
}