/**
 *
 * @remarks
 * This code is based on the project {@link https://github.com/jmfiola/jest-api-test-typescript-example}.
*/
import { Logger } from "tslog";
import ConfigHandler from "./config/ConfigHandler";

import Posts from "./endpoints/Posts";
import { PostDTO } from "../modules/forum/dtos/postDTO";
import { CommentDTO } from "../modules/forum/dtos/commentDTO";

const config = ConfigHandler.getInstance();
const log = new Logger({
  minLevel: config.environmnetConfig.log_level,
  dateTimeTimezone:
    config.environmnetConfig.time_zone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone,
});

let posts: Posts;

describe("Posts endpoint", (): void => {
  beforeAll(async (): Promise<void> => {
    posts = new Posts();
    
    log.debug("1. Posts Base url: "+posts.getBaseUrl());
  });

  // Unit test for Popular posts
  it("Unit Tests- Get popular posts", async (): Promise<void> => {
    const response = await posts.getPopularPosts();
    expect(response.status).toBe(200);
    expect(response.data.posts).toBeDefined();
    expect(response.data.posts.length).toBeLessThanOrEqual(5); // Check if it as the max of 5 posts
  });

  // Unit test for Recent Post
  it("Unit Tests - Get recent posts", async (): Promise<void> => {
    const response = await posts.getRecentPosts();
    expect(response.status).toBe(200);
    expect(response.data.posts).toBeDefined();

    await response.data.posts.map(async (p: PostDTO) => {
      let commentsResponse;
      let total;
      try {
        commentsResponse = await  posts.getComments(p.slug);
      } catch (error) {
        commentsResponse = null;
      }
      total = p.numComments;
      
      if(commentsResponse){
        p.numComments = commentsResponse.data.comments.filter((c: CommentDTO) => c.parentCommentId === null).length;
        expect(total).not.toBe(p.numComments);
      }

    });
  });
});

export default {};
