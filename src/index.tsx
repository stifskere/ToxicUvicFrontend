import {MutableRefObject, ReactElement, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';

import NavBar from "./components/nav-bar";
import TrendingCategories from "./components/trending-categories";
import PostList from "./components/post-list";

import "./index.css";
import NewPost from "./components/new-post";

function App(): ReactElement {
	const [query, setQuery]: StateTuple<string | undefined> = useState();
	const [tags, setTags]: StateTuple<string[] | undefined> = useState();

	return <main>
		<NavBar onSearch={setQuery} />
		<section className="content">
			<PostList query={query} tags={tags}/>
			<div className="controls">
				<TrendingCategories onSelect={setTags} />
				<NewPost />
			</div>
		</section>
	</main>;
}

createRoot(document.getElementById('root')!).render(<App />);