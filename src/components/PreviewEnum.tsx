import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { VScriptClass, VScriptEnum, VScriptFunction } from '../structs';


interface PreviewEnumProps
{
	enums: Map<string,VScriptEnum>;
}

const PreviewEnum = (props: PreviewEnumProps) => {
	const { enumName } = useParams<{ enumName: string }>();
  
	console.log('preview enum called');
	if (!enumName) {
	  return <div>No enumName specified</div>;
	}
  
	const enm = props.enums.get(enumName);
	if (!enm) {
	  return <div>No enum named {enumName}</div>;
	}
  
	const members = enm.members.map((member, index) => (
		<div key={index} className="enum-member">
		  <div className="enum-table">
			<span>{enm.ident}.{member.ident}</span>
			<span>{member.value}</span>
			<span>{member.type}</span>
			<span>{member.description}</span>
		  </div>
		</div>
	  ));
  
	return (
	  <div>
		<h2>{enumName}</h2>
		<p>{enm.description}</p>
		<div className="members">	
			<h3>Members <span>({enm.members.length})</span> </h3>
			{members}
			</div>
	  </div>
	);
  };

export default PreviewEnum;