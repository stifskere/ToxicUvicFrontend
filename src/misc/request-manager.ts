
interface BaseResponse<T> {
    success: boolean;
    content: T;
}

interface Key {
    token: string;
    expires_at: string;
}

export interface MinimalQueryParams {
    query: string;
    tags: string[];
}

export interface QueryParams extends MinimalQueryParams {
    from: number;
    to: number;
}

export default class RequestManager {
    private static async requestTo<TResult, TParams extends any[]>(path: string, authenticated: boolean, parameters?: TParams)
        : Promise<TResult | null> {
        if (!path.startsWith('/'))
            path = '/' + path;

        // TODO finish this.
        path = `https://api.toxicuvic.me${path}`;

        return fetch(path, {
            headers: authenticated ? { Authorization: await this.getToken() } : {}
        }).then(async (d: Response): Promise<TResult | null> => {
            const result: BaseResponse<TResult> = await d.json();
            return result.success ? result.content : null;
        })
    }

    public static async getToken(): Promise<string> {
        const storedKey: string | null = localStorage.getItem("auth");

        if (storedKey !== null) {
            const convertedStoredKey: Key = JSON.parse(storedKey);

            if (new Date(convertedStoredKey.expires_at).getTime() > new Date().getTime())
                return convertedStoredKey.token;
        }

        const fetchedKey: Key = <Key>await RequestManager.requestTo("/tokens", false);

        localStorage.setItem("auth", JSON.stringify(fetchedKey));

        return fetchedKey?.token;
    }

    public static async getPostCount({tags, query}: MinimalQueryParams): Promise<number> {

    }

    public static async getPosts() {

    }
}