import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { VScriptClass } from '../structs';


interface PreviewClassProps
{
	classes: Map<string,VScriptClass>;
}

const PreviewClass = (props: PreviewClassProps) => {

	const { className } = useParams<{ className: string }>();

	const [showMethods, setShowMethods] = useState(true);
	const [showMembers, setShowMembers] = useState(true);
	const [showHooks, setShowHooks] = useState(true);

	if (!className) {
		return <div>No classname specified</div>
	}

	const cls = props.classes.get(className);
	if (!cls) {
		return <div>No class named {className}</div>
	}

	function handleMethodsToggle() {
		setShowMethods(!showMethods);
	}

	function handleHooksToggle() {
		setShowHooks(!showHooks);
	}

	function handleMembersToggle() {
		setShowMembers(!showMembers);
	}
	
	return (
<div>
	<h2>{className}</h2>

	<div className="methods">	
		<h3>Methods <span>({cls.methods.length})</span> </h3>
		<button onClick={handleMethodsToggle}>Toggle Methods</button>
		<ul style={{ display: showMethods ? 'block' : 'none' }}>
			{cls.methods.map(method => {
				return <li>
					<Link to={`/class/${className}/method/${method.ident}`}>
						{method.ident}
					</Link>
					
				</li>
			})}
		</ul>
	</div>

	<div className="members">	
		<h3>Members <span>({cls.members.length})</span> </h3>
		<button onClick={handleMembersToggle}>Toggle Members</button>
		<ul style={{ display: showMembers ? 'block' : 'none' }}>
			{cls.members.map(member => {
				return <li>{member.ident}</li>
			})}
		</ul>
	</div>

	<div className="hooks">	
		<h3>Hooks <span>({cls.hooks.length})</span> </h3>
		<button onClick={handleHooksToggle}>Toggle Hooks</button>
		<ul style={{ display: showHooks ? 'block' : 'none' }}>
			{cls.hooks.map(hook => {
				return <li>
				<Link to={`/class/${className}/hook/${hook.ident}`}>
					{hook.ident}
				</Link>
				
			</li>
			})}
		</ul>
	</div>

</div>
	);
  };

export default PreviewClass;