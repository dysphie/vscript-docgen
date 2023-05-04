import React, { useEffect, useState } from 'react';
import { BrowserRouter, createBrowserRouter, Link, Outlet, Route, RouterProvider, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import NotFound from './components/NotFound';
import PreviewClass from './components/PreviewClass';
import PreviewEnum from './components/PreviewEnum';
import PreviewFunc from './components/PreviewFunc';
import PreviewMethod from './components/PreviewMethod';
import RawInput from './components/RawInput';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import { SearchResult, VScriptClass, VScriptFunction, VScriptEnum, VScriptConstant, VScriptFunctionParam, VScriptClassMember } from './structs';

function App() {

	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

	const [classes, setClasses] = useState(new Map<string, VScriptClass>());
	const [functions, setFunctions] = useState(new Map<string, VScriptFunction>());
	const [enums, setEnums] = useState(new Map<string, VScriptEnum>());
	const [constants, setConstants] = useState(new Map<string, VScriptConstant>());

	const [parsed, setParsed] = useState(false);

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				searchResults={searchResults}
				setSearchResults={setSearchResults}
				classes={classes}
				setClasses={setClasses}
				functions={functions}
				setFunctions={setFunctions}
				enums={enums}
				setEnums={setEnums}
				constants={constants}
				setConstants={setConstants}
				parsed={parsed}
				setParsed={setParsed}
			/>,
			children: [
				{
					path: "class/:className",
					element: <PreviewClass classes={classes} />
				},
				{
					path: "class/:className/method/:fnName",
					element: <PreviewMethod classes={classes} />,
				},
				{
					path: "function/:fnName",
					element: <PreviewFunc functions={functions} />,
				},
				{
					path: "enum/:enumName",
					element: <PreviewEnum enums={enums} />,
				}
			],
		},
	]);

	return (
		<div className="App">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
