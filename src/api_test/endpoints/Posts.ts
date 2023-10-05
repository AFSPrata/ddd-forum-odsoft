/**
 *
 * @remarks
 * This code is based on the project {@link https://github.com/jmfiola/jest-api-test-typescript-example}.
*/
import { AxiosResponse } from "axios";

import { AEndpoint } from "./abstracts/AEndpoint";

export default class Posts extends AEndpoint {
  constructor() {
    super("/posts", "posts");
  }

  public async getPopularPosts(): Promise<AxiosResponse> {
    let response = await this.restClient.sendGet({ route: "/popular" });
    // Sort posts by numComments in descending order
    const sortedPosts = response.data.posts.sort((a: { numComments: number; }, b: { numComments: number; }) => b.numComments - a.numComments);

    // Take the first 5 posts
    const popularPosts = sortedPosts.slice(0, 5);
    response.data.posts = popularPosts;
    return response;
  }
  public async getRecentPosts(): Promise<AxiosResponse> {
    return this.restClient.sendGet({ route: "/recent" });
  }
}
