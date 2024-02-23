declare module "*.png" {
	const value: any;
	export = value;
}

declare type StateTuple<S> = [S, React.Dispatch<React.SetStateAction<S>>];