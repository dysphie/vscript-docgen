import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { VScriptClass, VScriptFunction } from '../structs';


interface PreviewMethodProps {
	classes: Map<string, VScriptClass>;
	projectName: string;
}

const PreviewMethod = (props: PreviewMethodProps) => {
	const { className } = useParams<{ className: string }>();
	const { fnName } = useParams<{ fnName: string }>();

	console.log('preview function called');
	if (!fnName || !className) {
		return <div>No fnName or className specified</div>;
	}

	const cls = props.classes.get(className);
	if (!cls) {
		return <div>No cls named {className}</div>;
	}

	const fn = cls.methods.find((m) => m.ident === fnName);
	if (!fn) {
		return <div>No function {fnName}</div>;
	}

	const parameters = fn.parameters.map((param, index) => (
		<span key={index}>
			{param.type} {param.ident ? param.ident : "unnamed"}
			{index !== fn.parameters.length - 1 ? ", " : ""}
		</span>
	));

	return (
		<div>
			<h2>
				<Link to={`class/${className}`}>{className}</Link>::{fnName}
			</h2>
			<code>
				{fn.retval} {fn.ident}({parameters})
			</code>
			<p>{fn.description}</p>
		</div>
	);
};

export default PreviewMethod;