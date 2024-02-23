import {ReactElement, useState} from "react";
import dayjs from "dayjs";
import "dayjs/plugin/relativeTime";
import {IoIosThumbsDown, IoIosThumbsUp} from "react-icons/io";

import "./index.css";

export interface PostData {
	post_id: number;
	username: string;
	categories: string[];
	message: string;
	post_date: string;
	feedback: PostVoteStatus;
	attachments: PostAttachment;
}

export interface PostVoteStatus {
	up_votes: number;
	down_votes: number;
	can_vote: boolean;
	casted_vote?: PostVoteType;
}

export interface PostAttachment {
	id: number;
	data: string;
}

export enum PostVoteType {
	UpVote = 1,
	DownVote = 2
}

export interface PostProps {
	post: PostData;
}

export default function Post({post}: PostProps): ReactElement {
	const [currentVote, setCurrentVote]: StateTuple<PostVoteType | undefined> = useState(post.feedback.casted_vote);

	function postFeedBack(type: PostVoteType): (() => void) {
		return (): void => {
			if (!post.feedback.can_vote)
				return;

			setCurrentVote(currentVote === type ? undefined : type);

			// do fetch.
		};
	}

	function getVoteColor(type: PostVoteType): string {
		return currentVote === type ? "#ffffff" : "#b4b4b4";
	}

	return <div className="post">
		<div className="post-profile-info">
			<img
				src={`https://ui-avatars.com/api/?background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff&name=${encodeURIComponent(post.username)}`}
				alt="profile picture"
			/>
			<h2>{post.username}</h2>
		</div>
		<p className="post-content">{post.message}</p>
		<div className="post-info">
			<p>{dayjs(post.post_date).fromNow()}</p>
			<div className="post-feedback">
				<IoIosThumbsUp color={getVoteColor(PostVoteType.UpVote)} onClick={postFeedBack(PostVoteType.UpVote)} />
				<IoIosThumbsDown color={getVoteColor(PostVoteType.DownVote)} onClick={postFeedBack(PostVoteType.DownVote)}/>
			</div>
		</div>
	</div>;
}