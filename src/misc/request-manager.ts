
export namespace RequestTypes {
    export interface BaseResponse<T> {
        success: boolean;
        content: T;
    }

    export interface Key {
        token: string;
        expires_at: string;
    }

    export interface MinimalQueryParams {
        query?: string;
        categories?: string[];
    }

    export interface QueryParams extends MinimalQueryParams {
        from: number;
        to: number;
    }

    export interface CountResponse {
        post_count: number;
    }

    export interface RequestParameters {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        path: string;
        authenticated?: boolean;
        parameters?: { [key: string]: string };
        body?: string;
    }

    export interface PostData {
        id: number;
        username: string;
        categories: string[];
        message: string;
        post_date: string;
        feedback: {
            up_votes: number;
            down_votes: number;
            can_vote: boolean;
            casted_vote?: PostVoteType;
        };
        attachments: {
            id: number;
            data: string;
        };
    }

    export enum PostVoteType {
        UpVote = 1,
        DownVote = 2
    }

    export interface PutPostData {
        username: string;
        message: string;
        categories?: string[];
        attachments?: string[];
    }
}

export namespace RequestManager {
    import BaseResponse = RequestTypes.BaseResponse;
    import MinimalQueryParams = RequestTypes.MinimalQueryParams;
    import CountResponse = RequestTypes.CountResponse;
    import Key = RequestTypes.Key;
    import QueryParams = RequestTypes.QueryParams;
    import PostData = RequestTypes.PostData;
    import PutPostData = RequestTypes.PutPostData;
    import PostVoteType = RequestTypes.PostVoteType;

    async function requestTo<TResult>
    ({method = "GET", path, authenticated = true, parameters, body}: RequestTypes.RequestParameters): Promise<TResult | boolean> {
        if (!path.startsWith('/'))
            path = '/' + path;

        // api.toxicuvic.es
        path = `http://localhost:10001${path}?`;

        parameters ??= {};

        for (const key in parameters)
            path += `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}&`;

        path = path.slice(0, -1);

        return fetch(path, {
            headers: authenticated ? { Authorization: await getToken() } : {},
            method: method as string,
            ...(body ? {body} : {})
        })
            .then(async (d: Response): Promise<TResult | boolean> => {
                try {
                    const result: BaseResponse<TResult> = await d.json();
                    return result.success ? result.content : d.ok;
                } catch {
                    return d.ok;
                }
            })
    }

    export async function getToken(): Promise<string> {
        const storedKey: string | null = localStorage.getItem("auth");

        if (storedKey) {
            const convertedStoredKey: Key = JSON.parse(storedKey);

            if (new Date(convertedStoredKey.expires_at).getTime() > new Date().getTime())
                return convertedStoredKey.token;
        }

        const fetchedKey: Key = <Key>await requestTo({
            path: "/tokens",
            authenticated: false
        });

        localStorage.setItem("auth", JSON.stringify(fetchedKey));

        return fetchedKey.token;
    }

    export async function getFeedCount({categories, query}: MinimalQueryParams): Promise<number> {
        const response: CountResponse | boolean = await requestTo({
            path: "/feed/length",
            parameters: {
                ...(categories !== undefined ? {categories: categories.join(',').trim()} : {}),
                ...(query !== undefined ? {query: query} : {})
            }
        });

        return typeof response === "boolean" ? 0 : response.post_count;
    }

    export async function getFeed({categories, query, from, to}: QueryParams): Promise<PostData[] | null> {
        const response: PostData[] | boolean = await requestTo({
            path: "/feed",
            parameters: {
                ...(categories ? {categories: categories.join(',').trim()} : {}),
                ...(query ? {query: query} : {}),
                from: from.toString(),
                to: to.toString()
            }
        });

        return typeof response === "boolean" ? null : response;
    }

    export async function getCategoryUsages(): Promise<{ [key: string]: number } | null> {
        const response: { [key: string]: number } | boolean
            = await requestTo({
                path: "/categories/usages"
            });

        return typeof response === "boolean" ? null : response;
    }

    export function putPost({username, message, categories, attachments}: PutPostData): Promise<boolean> {
        categories ??= [];
        attachments ??= [];

        return requestTo<boolean>({
            path: "/posts",
            method: "PUT",
            body: JSON.stringify({
                username,
                message,
                categories,
                attachments
            })
        });
    }

    export async function getPost(id: number): Promise<PostData | null> {
        const response = await requestTo<boolean | PostData>({
            path: `/posts/${id}`
        });

        return typeof response === "boolean" ? null : response;
    }

    export async function putPostFeedback(id: number, vote: PostVoteType): Promise<boolean> {
        return await requestTo<boolean>({
            path: `/posts/${id}/feedback`,
            method: "PUT",
            parameters: {
                vote: vote.toString()
            }
        });
    }

    export function deletePostFeedback(id: number): Promise<boolean> {
        return requestTo<boolean>({
            path: `/posts/${id}/feedback`,
            method: "DELETE"
        })
    }
}