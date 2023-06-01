import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { VScriptClass, VScriptFunction } from '../structs';


interface PreviewFunctionProps {
	functions: Map<string, VScriptFunction>;
	projectName: string;
}

const PreviewFunction = (props: PreviewFunctionProps) => {
	const { className } = useParams<{ className: string }>();
	const { fnName } = useParams<{ fnName: string }>();

	if (!fnName) {
		return <div>No fnName specified</div>;
	}

	const fn = props.functions.get(fnName);
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
				<Link to={''}>{fnName}</Link>
			</h2>
			<code>
				{fn.retval} {fn.ident}({parameters})
			</code>
			<p>{fn.description}</p>
		</div>
	);
};

export default PreviewFunction;