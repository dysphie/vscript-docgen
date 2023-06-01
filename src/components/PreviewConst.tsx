import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { VScriptClass, VScriptConstant, VScriptEnum, VScriptFunction } from '../structs';


interface PreviewConstProps
{
	consts: Map<string, VScriptConstant>;
	projectName: string;
}

const PreviewConst = (props: PreviewConstProps) => {
	const { constName } = useParams<{ constName: string }>();
  
	if (!constName) {
	  return <div>No constName specified</div>;
	}
  
	const constant = props.consts.get(constName);
	if (!constant) {
	  return <div>No constant named {constName}</div>;
	}
  
	return (
	  <div>
		 <div className="const-table">
			<span>{constant.ident}</span>
			<span>{constant.value}</span>
			<span>{constant.type}</span>
			<span>{constant.description}</span>
		  </div>
	  </div>
	);
  };

export default PreviewConst;