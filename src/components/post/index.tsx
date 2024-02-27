import {ReactElement, useEffect, useState} from "react";
import {ImArrowDown, ImArrowUp} from "react-icons/im";

import {RequestManager, RequestTypes} from "../../misc/request-manager";
import PostVoteType = RequestTypes.PostVoteType;
import PostData = RequestTypes.PostData;

import {formatDistanceToNow} from "date-fns";
import {ca} from "date-fns/locale";

import "./index.css";

export interface PostProps {
	post: PostData;
}

export default function Post({post}: PostProps): ReactElement {
	const [currentVote, setCurrentVote]: StateTuple<PostVoteType | undefined> = useState(post.feedback.casted_vote ?? undefined);
	const [pfpData, setPfpData]: StateTuple<string> = useState("");

	useEffect((): void => {
		fetch(`https://ui-avatars.com/api/?background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff&name=${encodeURIComponent(post.username)}`)
			.then(async (image: Response): Promise<void> => setPfpData(URL.createObjectURL(await image.blob())))
	}, []);

	function postFeedBack(type: PostVoteType): () => void {
		return async () => {
			if (!post.feedback.can_vote) return;

			type === currentVote
				? await RequestManager.deletePostFeedback(post.id)
				: await RequestManager.putPostFeedback(post.id, type);

			post.feedback.casted_vote = undefined;
			setCurrentVote(type === currentVote ? undefined : type);
		};
	}

	function getVoteColor(type: PostVoteType): string {
		return !post.feedback.can_vote ? "#414141" : currentVote === type ? "#ffffff" : "#b4b4b4";
	}

	// TODO: arreglar calcul vots.
	// TODO: prop drilling per buscar en clicar hashtag

	const feedbackCount = (post.feedback.up_votes - post.feedback.down_votes)
		+ (post.feedback.casted_vote
			? 0
			: (currentVote === PostVoteType.UpVote
				? 1
				: currentVote == PostVoteType.DownVote
					? -1
					: 0
			));

	function escapeHTML(str: string) {
		return str.replace(/[&<>"'`]/g, (char: string): string =>
			({
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&apos;",
				"`": "&grave;"
			} satisfies { [key: string]: string })[char]!);
	}

	function clickHashtag(category: string): (() => void) {
		return (): void => {
			console.log(category);
		}
	}

	return <div className="post">
		<div className="post-profile-info">
			<img
				src={pfpData}
				alt="profile picture"
			/>
			<h2>{post.username}</h2>
		</div>
		<p className="post-content">
			{escapeHTML(post.message).split(' ').map((part, index) => (
				part.match(/#\w+/g) ? (
					<button key={index} onClick={clickHashtag(part.slice(1))} className="in-post-category">
						#{part.slice(1)}
					</button>
				) : (
					<span key={index}>{part} </span>
				)
			))}
		</p>
		<div className="post-info">
			<p>fa {formatDistanceToNow(new Date(post.post_date), {locale: ca})}</p>
			<div className="post-feedback">
				<ImArrowUp color={getVoteColor(PostVoteType.UpVote)} onClick={postFeedBack(PostVoteType.UpVote)}/>
				<span>{feedbackCount}</span>
				<ImArrowDown color={getVoteColor(PostVoteType.DownVote)} onClick={postFeedBack(PostVoteType.DownVote)}/>
			</div>
		</div>
	</div>;
}