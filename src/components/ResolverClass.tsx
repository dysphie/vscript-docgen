import React from "react";
import { useParams } from "react-router-dom";
import { VScriptClass } from "../structs";

interface ResolverClassProps {
	classes: Map<string, VScriptClass>;
}

const ResolverClass = (props: ResolverClassProps) => {

	const { className } = useParams<{ className: string }>();

	if (className && props.classes.has(className)) {
		return (
			<div>
				Showing data for {className}
			</div>
		)
	}

	return (
		<div>
			No such class {className}
		</div>
	)
}

export default ResolverClass;