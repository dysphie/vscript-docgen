import React, { useState } from "react";
import { Link } from "react-router-dom";
import { VScriptFunction, VScriptEnum, VScriptClass, VScriptConstant } from "../structs";

interface OverviewProps {
  functions: Map<string, VScriptFunction>;
  enums: Map<string, VScriptEnum>;
  classes: Map<string, VScriptClass>;
  constants: Map<string, VScriptConstant>;
  projectName: string;
}

const Overview = (props: OverviewProps) => {

  const {
    functions,
    enums,
    classes,
    constants,
    projectName
  }: OverviewProps = props;

  const [classCollapsed, setClassCollapsed] = useState(false);
  const [enumCollapsed, setEnumCollapsed] = useState(false);
  const [funcCollapsed, setFuncCollapsed] = useState(false);
  const [constantCollapsed, setConstantCollapsed] = useState(false);

  const functionDivs = Array.from(functions.values()).map((func) => (
    <li key={func.ident}>
      <Link to={`function/${func.ident}`}>{func.ident}</Link>
    </li>
  ));

  const enumDivs = Array.from(enums.values()).map((enumObj) => (
    <li key={enumObj.ident}>
      <Link to={`enum/${enumObj.ident}`}>{enumObj.ident}</Link>
    </li>
  ));

  const classDivs = Array.from(classes.values()).map((cls) => (
    <li key={cls.ident}>
      <Link to={`class/${cls.ident}`}>{cls.ident}</Link>
    </li>
  ));

  const constantDivs = Array.from(constants.values()).map((constant) => (
    <li key={constant.ident}>
      <Link to={`const/${constant.ident}`}>{constant.ident}</Link>
    </li>
  ));

  const toggleClassCollapse = () => {
    setClassCollapsed(!classCollapsed);
  };

  const toggleEnumCollapse = () => {
    setEnumCollapsed(!enumCollapsed);
  };

  const toggleFuncCollapse = () => {
    setFuncCollapsed(!funcCollapsed);
  };

  const toggleConstantCollapse = () => {
    setConstantCollapsed(!constantCollapsed);
  };

  return (
    <div>
      <h2>
        <button onClick={toggleClassCollapse}>
          {classCollapsed ? "Expand" : "Collapse"} Classes
        </button>
      </h2>
      {!classCollapsed && <ul>{classDivs}</ul>}

      <h2>
        <button onClick={toggleEnumCollapse}>
          {enumCollapsed ? "Expand" : "Collapse"} Enums
        </button>
      </h2>
      {!enumCollapsed && <ul>{enumDivs}</ul>}

      <h2>
        <button onClick={toggleFuncCollapse}>
          {funcCollapsed ? "Expand" : "Collapse"} Functions
        </button>
      </h2>
      {!funcCollapsed && <ul>{functionDivs}</ul>}

      <h2>
        <button onClick={toggleConstantCollapse}>
          {constantCollapsed ? "Expand" : "Collapse"} Constants
        </button>
      </h2>
      {!constantCollapsed && <ul>{constantDivs}</ul>}
    </div>
  );
};



export default Overview;