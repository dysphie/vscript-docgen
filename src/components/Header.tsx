import React, { useState } from "react";
import SearchBar from "./Search";

const Header = () => {

	const [openSearch, setOpenSearch] = useState(false);

	const handleClickFakeSearchBar = (e: React.MouseEvent<HTMLButtonElement>) => {
		setOpenSearch(true);
	}

	return (
		<header>
			<div className="logo"></div>
			<button className="fake-search-bar" onClick={handleClickFakeSearchBar}></button>
		</header>
	)

}