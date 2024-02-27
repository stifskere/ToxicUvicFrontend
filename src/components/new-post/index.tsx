import {ReactElement, useState} from "react";
import {FaFeatherAlt} from "react-icons/fa";

import "./index.css";

export default function NewPost(): ReactElement {
	const [text, setText]: StateTuple<string> = useState("Escriu un nou post!");

	const catalanPhrases: string[] = [
		"Publica un post",
		"Contingut fresc",
		"Història viral",
		"Text divertit",
		"Entrada original",
		"Notícia interessant",
		"Post nou brillant",
		"Cuina algo"
	];

	function changeText(): void {
		setText(catalanPhrases[Math.floor(Math.random() * catalanPhrases.length)]);
	}

	function showModal(): void {
		const modal: HTMLDivElement
			= document.querySelector(".new-post-modal") as HTMLDivElement;

		modal.hidden = false;
	}

	// TODO: acabar publicar post modal

	return <>
		<div className="new-post-modal" hidden>
			<textarea></textarea>
			<input type="file"/>
			<button>Publicar</button>
		</div>
		<div className="new-post">
			<button onMouseEnter={changeText} onClick={showModal}>
				<FaFeatherAlt />
				{text}
			</button>
		</div>
	</>;
}