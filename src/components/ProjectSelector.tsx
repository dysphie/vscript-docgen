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
	const { projects, setProjects, saveProjects }: ProjectSelectorProps = props;

	const [rawText, setRawText] = useState('');
	const [pegOutput, setPegOutput] = useState([]);
	const [parseError, setParseError] = useState('');

	const handleProjectSelectorChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setRawText(event.target.value);
	};

	const handleParse = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const parsed = parse(rawText);
		const projectKey = generateProjectKey();
		localStorage.setItem(projectKey, JSON.stringify(parsed));
		const newProject: SavedProject = { key: projectKey, name: 'Project ' + projectKey };
		setProjects([...props.projects, newProject]);
	};

	const handleDeleteProject = (projectKey: string) => {
		setProjects(projects.filter((project) => project.key !== projectKey));
		localStorage.removeItem(projectKey);
	};

	// Define a function to handle exporting a project as a json file
	const handleExportProject = (projectKey: string) => {

		const projectData = localStorage.getItem(projectKey);
		const blob = new Blob([projectData ?? ''], { type: 'application/json' });

		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${projectKey}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	useEffect(() => {
		if (projects.length > 0) {
			saveProjects();
		}
	}, [projects, saveProjects]);

	return (
		<div className="raw-input">
			<div>
				<div className="old-projects">
					<h3>Previously Saved Projects: ({projects.length})</h3>
					<ul>
						{projects.map((project) => (
							<li key={project.key}>
								<Link to={project.key}>{project.name}</Link>
								<button onClick={() => handleExportProject(project.key)}>Export</button>
								<button onClick={() => handleDeleteProject(project.key)}>Delete</button>
							</li>
						))}
					</ul>
				</div>

				<div className="new-project">
					<label htmlFor="raw-input">Raw input:</label>
					<textarea id="raw-input" name="raw-input" onChange={handleProjectSelectorChange}></textarea>
					<button onClick={handleParse}>Parse</button>
					<p>{parseError}</p>
				</div>
			</div>
		</div>
	);
};

export default ProjectSelector;
