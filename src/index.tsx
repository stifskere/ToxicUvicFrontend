import {ReactElement, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import NavBar from "./components/nav-bar";

import "./index.css";
import Post, {PostData} from "./components/post";

function App(): ReactElement {
	const [posts, setPosts]: StateTuple<PostData[] | undefined> = useState();

	useEffect((): void => {
		
	}, []);

	function onSearch(query: string): void {

	}

	return <main>
		<NavBar onSearch={onSearch} />
		{/* TODO what are you thinking? */}
		{posts === undefined
			? <div>
				<div/>
				<div/>
				<div/>
			</div>
			: posts.map((post: PostData): ReactElement =>
					<Post post={post}/>
				)
		}
	</main>;
}

createRoot(document.getElementById('root')!).render(<App />);