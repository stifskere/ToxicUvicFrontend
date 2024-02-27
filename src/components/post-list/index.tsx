import {MutableRefObject, ReactElement, useEffect, useRef, useState} from "react";

import {RequestManager, RequestTypes} from "../../misc/request-manager";
import PostData = RequestTypes.PostData;

import Post from "../post";

import "./index.css";

interface PostListProps {
	query?: string;
	tags?: string[];
}

class PostListManager {
	private static loadedPosts: PostData[] = [];
	private static currentQuery: string | undefined;
	private static currentCategories: string[] | undefined;
	private static postNumber: number | undefined;

	public static async grabMorePostsOrResetFor(query?: string, categories?: string[]): Promise<PostData[] | undefined> {
		if (this.currentQuery !== query || this.currentCategories !== categories || !this.postNumber) {
			if (query !== undefined && query.length <= 0)
				query = undefined;

			if (categories !== undefined && categories.length <= 0)
				categories = undefined;

			this.postNumber = await RequestManager.getFeedCount({categories, query});
			this.loadedPosts = [];
			this.currentCategories = categories;
			this.currentQuery = query;
		}

		if (this.postNumber == this.loadedPosts.length && this.loadedPosts.length !== 0)
			return this.loadedPosts;

		const feed: PostData[] | null = await RequestManager.getFeed({
			query,
			categories,
			from: this.loadedPosts.length,
			to: Math.min(this.loadedPosts.length + 5, this.postNumber)
		});

		if (feed === null)
			return undefined;

		return this.loadedPosts = [...this.loadedPosts, ...feed];
	}

	public static get isEmpty(): boolean {
		return this.loadedPosts.length === 0;
	}
}

export default function PostList({query, tags}: PostListProps): ReactElement {
	const [posts, setPosts]: StateTuple<PostData[] | undefined> = useState();
	const processing: MutableRefObject<boolean> = useRef(false);

	function onScroll(event: Event): void {
		const element: HTMLDivElement = event.target as HTMLDivElement;
		if (element.scrollTop + element.clientHeight >= element.scrollHeight - 5 && !processing.current) {
			processing.current = true;

			PostListManager
				.grabMorePostsOrResetFor(query, tags)
				.then((result: PostData[] | undefined) => {
					processing.current = false;
					setPosts(result);
				});
		}
	}

	useEffect((): (() => void) => {
		const element: HTMLDivElement
			= document.querySelector(".posts-container") as HTMLDivElement;

		PostListManager
			.grabMorePostsOrResetFor(query, tags)
			.then(setPosts);

		element.addEventListener("scroll", onScroll);
		return (): void => element.removeEventListener("scroll", onScroll);
	}, [query, tags]);

	if (!posts)
		return <div className="posts-container">
			<div className="loading-item"/>
			<div className="loading-item"/>
			<div className="loading-item"/>
			<div className="loading-item"/>
			<div className="loading-item"/>
		</div>;

	query ??= "";
	tags ??= [];

	if (PostListManager.isEmpty) {
		return <div className="posts-container empty-post-container">
			{query.length <= 0 && tags.length <= 0
				? <>
					<h2 className="not-selectable">No hi ha posts disponibles.</h2>
				</>
				: <>
					<h2>No s'ha pogut trobat res amb {
						query.length > 0
							? tags.length > 0
								? `la cerca: "${query}" amb les categories seleccionades.`
								: `la cerca: "${query}"`
							: "les tags seleccionades."
					}
					</h2>
					<h3>Siusplau, fes una altra cerca...</h3>
				</>
			}
		</div>
	}

	return <div className="posts-container">
		{posts.map((p: PostData, k: number): ReactElement => <Post key={k} post={p} />)}
	</div>
}