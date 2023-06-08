import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import PreviewClass from './components/PreviewClass';
import PreviewConst from './components/PreviewConst';
import PreviewEnum from './components/PreviewEnum';
import PreviewFunc from './components/PreviewFunc';
import PreviewHook from './components/PreviewHook';
import PreviewMethod from './components/PreviewMethod';
import ProjectSelector from './components/ProjectSelector';
import { SearchResult, VScriptClass, VScriptFunction, VScriptEnum, VScriptConstant } from './structs';

export interface SavedProject {
	name: string;
	key: string;
}

function App() {

	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

	const [classes, setClasses] = useState(new Map<string, VScriptClass>());
	const [functions, setFunctions] = useState(new Map<string, VScriptFunction>());
	const [enums, setEnums] = useState(new Map<string, VScriptEnum>());
	const [constants, setConstants] = useState(new Map<string, VScriptConstant>());

	const [parsed, setParsed] = useState(false);

	const [projects, setProjects] = useState<SavedProject[]>([]);

	const [projectName, setProjectName] = useState('');

	const saveProjects = () => {
		localStorage.setItem("projects", JSON.stringify(projects));
	}

	useEffect(() => {
		const storedProjects = localStorage.getItem("projects");
		console.log(`When the app was loaded we had ${storedProjects} projects`);
		if (storedProjects) {
			setProjects(JSON.parse(storedProjects));
		}
	}, []);

	const router = createBrowserRouter([
		{
			path: "/",
			element: <ProjectSelector

				projects={projects}
				setProjects={setProjects}
				saveProjects={saveProjects}
			/>,
		},
		{
			path: "/:nameSpace",
			element: <Home
				setClasses={setClasses}
				setFunctions={setFunctions}
				setEnums={setEnums}
				setConstants={setConstants}
				setParsed={setParsed}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				searchResults={searchResults}
				setSearchResults={setSearchResults}
				classes={classes}
				functions={functions}
				enums={enums}
				constants={constants}
				setProjectName={setProjectName}
			/>,
			children: [
				{
					path: "class/:className",
					element: <PreviewClass classes={classes} projectName={projectName} />
				},
				{
					path: "class/:className/method/:fnName",
					element: <PreviewMethod classes={classes} projectName={projectName} />,
				},
				{
					path: "class/:className/hook/:fnName",
					element: <PreviewHook classes={classes} projectName={projectName} />,
				},
				{
					path: "function/:fnName",
					element: <PreviewFunc functions={functions} projectName={projectName} />,
				},
				{
					path: "const/:constName",
					element: <PreviewConst consts={constants} projectName={projectName} />,
				},
				{
					path: "enum/:enumName",
					element: <PreviewEnum enums={enums} projectName={projectName} />,
				}
			]
		}
	]);

	return (
		<div className="App">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
