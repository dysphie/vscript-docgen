import React from "react";
import { Link } from "react-router-dom";
import { SearchableType } from "../search";

interface SearchResultsProps {
	results: SearchResult[];
}

export interface SearchResult {
	ident: string;
	kind: SearchableType;
	parent: string | null;
	score: number;
}
interface SearchResultRowProps {
	result: SearchResult;
}

const SearchResultRow = ({ result }: SearchResultRowProps) => {

	let data: JSX.Element | null;

	let tagText = '';
	let tagColor = '';

	switch (result.kind) {

		case SearchableType.Enum:
		{
			const enumName = result.ident;

			data = (
				<div className="search-result-data">
					<Link to={`enum/${enumName}`}>{enumName}</Link>
				</div>
			);

			tagText = 'E';
			tagColor = '#3498db';
			break;
		}

		case SearchableType.Function:
		{
			const fnName = result.ident;

			data = (
				<div className="search-result-data">
					<Link to={`function/${fnName}`}>{fnName}</Link>
				</div>
			);

			tagText = 'F';
			tagColor = '#3498db';
			break;
		}

		case SearchableType.ClassMethod:
		{
			const className = result.parent;
			const methodName = result.ident;

			data = (
				<div className="search-result-data">
					<Link to={`class/${className}`}>{className}</Link>::
					<Link to={`class/${className}/method/${methodName}`}>
						{methodName}
					</Link>
				</div>
			);

			tagText = 'M';
			tagColor = '#3498db';
			break;
		}

		case SearchableType.ClassHook:
		{

			const className = result.parent;
			const hookName = result.ident;

			data = (
				<div className="search-result-data">
					<Link to={`class/${className}`}>{className}</Link>::
					<Link to={`class/${className}/hook/${hookName}`}>
						{hookName}
					</Link>
				</div>
			);

			tagText = 'H';
			tagColor = '#3498db';
			break;
		}


		case SearchableType.Class:
		{
			data = (
				<div className="search-result-data">
					<Link to={`class/${result.ident}`}>{result.ident}</Link>
				</div>
			);

			tagText = 'C';
			tagColor = '#27ae60';
			break;
		}

		default:
		{
			data = (
				<div className="search-result-data">
					{result.ident} {result.kind} {result.parent}
				</div>
			);

			tagText = 'O';
			tagColor = '#f39c12';
			break;
		}
	}

	return (
		<div className="search-result-row">
			<div className="search-result-info">
				<span className="search-result-tag">({tagText})</span> <span className="search-result-links">{data}</span>
			</div>
		</div>
	);
};


const SearchResults = ({ results }: SearchResultsProps) => {

	if (results.length === 0) {
		return null;
	  }


	const sortedResults = results.sort((a, b) => b.score - a.score).slice(0, 20);

	console.log(sortedResults);

	// const rows = sortedResults.map((result) => {
	// 	return <SearchResultRow key={result.ident} result={result} />;
	// });

	const mappedResults = sortedResults.map((result) => {
		return <SearchResultRow result={result} />;
	});

	return (
		<div>
			<div>Num results: {sortedResults.length}</div>
			<div className="resultTable">
				<div>{mappedResults}</div>
			</div>
		</div>
	);
};



export default SearchResults;
