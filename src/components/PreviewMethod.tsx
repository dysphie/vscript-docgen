import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { VScriptClass } from '../structs';

interface PreviewMethodProps {
	classes: Map<string, VScriptClass>;
	projectName: string;
}

const PreviewMethod = (props: PreviewMethodProps) => {

	const { classes, projectName } = props;
	const { className, fnName } = useParams<{ className: string; fnName: string }>();

	console.log('preview function called');

	if (!fnName || !className) {
		return <div>No fnName or className specified</div>;
	}

	const cls = classes.get(className) ?? null;
	const fn = cls?.methods.find((m) => m.ident === fnName) ?? null;

	if (!cls) {
		return <div>No class named {className}</div>;
	}

	if (!fn) {
		return <div>No function {fnName}</div>;
	}

	const parameters = fn.parameters.map(
		(param) => `${param.type} ${param.ident ?? 'unnamed'}`
	).join(', ');

	return (
		<div>
			<h2>
				<Link to={`/${projectName}/class/${className}`}>{className}</Link>::{fnName}
			</h2>
			<code>
				{fn.retval} {fn.ident}({parameters})
			</code>
			<p>{fn.description}</p>
		</div>
	);
};

export default PreviewMethod;
