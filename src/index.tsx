import {ReactElement} from 'react';
import {createRoot} from 'react-dom/client';

import NavBar from "./components/nav-bar";

import "./index.css";

function App(): ReactElement {
	function onSearch(query: string): void {

	}

	return <main>
		<NavBar onSearch={onSearch} />
	</main>;
}

createRoot(document.getElementById('root')!).render(<App />);