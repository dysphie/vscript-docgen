import React, { MouseEvent, ChangeEvent, useState, useEffect } from 'react';
import { SavedProject } from '../App';
import { parse, SyntaxError } from '../parser/parser';
import { VScriptClass, VScriptClassMember, VScriptConstant, VScriptEnum, VScriptFunction, VScriptFunctionParam } from '../structs';
import { Link } from 'react-router-dom';

interface ProjectSelectorProps {
	projects: SavedProject[];
	setProjects: (results: SavedProject[]) => void;
	saveProjects: () => void;
}

const generateProjectKey = () => {
	let key;
	do {
		key = Math.random().toString(36).substring(7);
	} while (localStorage.getItem(`project_${key}`) !== null);

	return `project_${key}`;
};

const ProjectSelector = (props: ProjectSelectorProps) => {

	const {
		projects,
		setProjects,
		saveProjects
	}: ProjectSelectorProps = props;

	const [rawText, setRawText] = useState("");
	const [pegOutput, setPegOutput] = useState([]);
	const [parseError, setParseError] = useState("");

	const handleProjectSelectorChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setRawText(event.target.value);
	}

	const handleParse = (event: MouseEvent<HTMLButtonElement>) => {

		event.preventDefault();
		const parsed = parse(rawText);

		const projectKey = generateProjectKey();

		localStorage.setItem(projectKey, JSON.stringify(parsed));
		//localStorage.setItem(projectKey, 'stub');
		const newProject: SavedProject = { key: projectKey, name: "Project " + projectKey };
		setProjects([...props.projects, newProject]);
	}

	useEffect(() => {
		console.log('After parsing async we have ' + projects.length + ' projects');

		if (projects.length > 0) {
			saveProjects();
		}
	}, [projects, saveProjects]);

	return (
		<div className="raw-input">
			<label htmlFor="raw-input">Raw input:</label>
			<textarea id="raw-input" name="raw-input" onChange={handleProjectSelectorChange}></textarea>
			<button onClick={handleParse}>Parse</button>
			<p>{parseError}</p>
			<div>
				<h3>Previously Saved Projects: ({projects.length})</h3>
				{projects.map((project) => (
					<Link to={project.key}>{project.name}</Link>
				))}
			</div>
		</div>
	);
}

export default ProjectSelector;