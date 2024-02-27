import {ReactElement, useEffect, useState} from "react";

import {RequestManager} from "../../misc/request-manager";
import getCategoryUsages = RequestManager.getCategoryUsages;

import {FaHashtag} from "react-icons/fa";
import {IoIosCloseCircle} from "react-icons/io";
import {ImArrowUpRight, ImArrowDownRight} from "react-icons/im";

import "./index.css";

interface TrendingCategoriesProps {
	onSelect: ((categories: string[]) => void);
}

export default function TrendingCategories({onSelect}: TrendingCategoriesProps): ReactElement {
	const [categories, setCategories]: StateTuple<{ [key: string]: number } | undefined> = useState();
	const [selected, setSelected]: StateTuple<string[]> = useState([] as string[]);
	const [order, setOrder]: StateTuple<boolean> = useState(true);

	useEffect((): void => {
		if (categories !== undefined)
			return;

		getCategoryUsages()
			.then((c) => setCategories(c || undefined));
	}, []);

	function changeCategorySelection(tag: string): (() => void) {
		return (): void => {
			let result: string[];

			if (selected.includes(tag))
				setSelected(result = selected.filter(t => t !== tag));
			else
				setSelected(result = [...selected, tag]);

			onSelect(result);
		}
	}

	function changeOrder(): void {
		setOrder(!order);
		setSelected([]);
		onSelect([]);
	}

	if (categories === undefined)
		return <div className="loading-item trending-categories"></div>;

	return <div className="trending-categories">
		<div onClick={changeOrder} className="tendencies-title"><h2>{order ? "Tendencies" : "Aversió"}</h2>
			<div>{order ? <ImArrowUpRight/> : <ImArrowDownRight/>}</div></div>
		{Object.keys(categories)
			.sort((a: string, b: string): number => {
				const comparison = categories[a] - categories[b];
				return order ? -comparison : comparison;
			})
			.splice(0, 12)
			.map((category: string, index: number): ReactElement =>
			<div onClick={changeCategorySelection(category)} key={index}
				 className={`trending-category ${selected.includes(category) ? "trending-category-selected" : ""}`}>
				<div>
					{selected.includes(category) ? <IoIosCloseCircle /> : <FaHashtag />}
					<span>{category}</span>
				</div>
			</div>
		)}
	</div>;
}