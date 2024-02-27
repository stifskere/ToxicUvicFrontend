import {ReactElement, useState} from "react";
import {FaFeatherAlt} from "react-icons/fa";
import {RequestManager} from "../../misc/request-manager";
import {IoMdCloseCircle} from "react-icons/io";

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
		"Cuina algo",
		"Fes-ho viral!",
		"Encén les xarxes!",
		"Deixa la teva empremta!"
	];

	function changeText(): void {
		setText(catalanPhrases[Math.floor(Math.random() * catalanPhrases.length)]);
	}

	function showModal(): void {
		const modal: HTMLDivElement
			= document.querySelector(".new-post-modal") as HTMLDivElement;

		modal.style.visibility = "visible";
	}

	async function publish(): Promise<void> {
		const username: HTMLInputElement = document.getElementById("new-username-input") as HTMLInputElement;
		const message: HTMLTextAreaElement = document.getElementById("new-text-input") as HTMLTextAreaElement;
		const modal: HTMLDivElement = document.getElementById("new-post-modal") as HTMLDivElement;

		const tags: string[] = message.value
			.split(' ')
			.filter(w => w.startsWith("#"))
			.map(w => w.substring(1, w.length))

		await RequestManager.putPost({
			message: message.value,
			username: username.value,
			...(tags.length > 0 ? {categories: tags} : {})
		});

		username.value = "";
		message.value = "";

		modal.style.visibility = "hidden";

		location.reload();
	}

	function close(): void {
		const modal: HTMLDivElement = document.getElementById("new-post-modal") as HTMLDivElement;
		modal.style.visibility = "hidden";
	}

	return <>
		<div className="new-post-modal" id="new-post-modal">
			<div>
				<IoMdCloseCircle onClick={close} />
				<input placeholder="nom d'usuari" type="text" id="new-username-input"/>
			</div>
			<textarea id="new-text-input"></textarea>
			<button onClick={publish}>Publicar</button>
		</div>
		<div className="new-post">
			<button onMouseEnter={changeText} onClick={showModal}>
				<FaFeatherAlt/>
				{text}
			</button>
		</div>
	</>;
}