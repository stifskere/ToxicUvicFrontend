import {ReactElement, KeyboardEvent} from "react";

import logo from "../../../public/logo.png";

import "./index.css";

export interface NavBarProps {
	onSearch: (query: string) => void;
}

export default function NavBar({onSearch}: NavBarProps): ReactElement {
	function onInputKeyPress(event: KeyboardEvent<HTMLInputElement>): void {
		if (event.key === "Enter")
			onSearch(event.currentTarget.value);
	}

	function onClickSubmit(): void {
		const searchBar: HTMLInputElement
			= document.querySelector("#nav-bar-nav > input") as HTMLInputElement;
		onSearch(searchBar.value);
	}

	return <nav id="nav-bar">
		<img src={logo} alt="toxic-uvic-logo" className="nav-bar-logo" />
		<div id="nav-bar-nav">
			<input onKeyDown={onInputKeyPress} placeholder="Busca algo..."/>
			<button onClick={onClickSubmit}>Buscar</button>
		</div>
	</nav>;
}