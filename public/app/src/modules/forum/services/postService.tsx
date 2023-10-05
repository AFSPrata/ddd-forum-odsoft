
import { APIResponse } from "../../../shared/infra/services/APIResponse";
import { PostType, Post } from "../models/Post";
import { BaseAPI } from "../../../shared/infra/services/BaseAPI";
import { IAuthService } from "../../users/services/authService";
import { Result } from "../../../shared/core/Result";
import { right, left } from "../../../shared/core/Either";
import { PostUtil } from "../utils/PostUtil";
import { PostDTO } from "../dtos/postDTO";
import { CommentDTO } from "../dtos/commentDTO";

export interface IPostService {
  createPost (title: string, type: PostType, text?: string, link?: string): Promise<APIResponse<void>>;
  getRecentPosts (offset?: number): Promise<APIResponse<Post[]>>;
  getPopularPosts (offset?: number): Promise<APIResponse<Post[]>>
  getPostBySlug (slug: string): Promise<APIResponse<Post>>;
  upvotePost (slug: string): Promise<APIResponse<void>>;
  downvotePost (slug: string): Promise<APIResponse<void>>;
}

export class PostService extends BaseAPI implements IPostService {

  constructor (authService: IAuthService) {
    super(authService);
  }

  public async getPostBySlug (slug: string): Promise<APIResponse<Post>> {
    try {
      const accessToken = this.authService.getToken('access-token');
      const isAuthenticated = !!accessToken === true;
      const auth = {
        authorization: accessToken
      };

      const response = await this.get('/posts', { slug }, 
        isAuthenticated ? auth : null
      );

      return right(Result.ok<Post>(
        PostUtil.toViewModel(response.data.post)
      ));
    } catch (err) {
      return left(err.response ? err.response.data.message : "Connection failed")
    }
  }
  
  /**
   * Get the 15 most recent posts with the number of first level comments for each post
   * 
   * @param {number} offset 
   * @returns {APIResponse<Post[]>}
   */
  public async getRecentPosts (offset?: number): Promise<APIResponse<Post[]>> {
    try {
      const accessToken = this.authService.getToken('access-token');
      const isAuthenticated = !!accessToken === true;
      const auth = {
        authorization: accessToken
      };

      const response = await this.get('/posts/recent', { offset }, 
        isAuthenticated ? auth : null
      );

     const posts: Post[] = await Promise.all(response.data.posts.map(async (p: PostDTO) => {
        let commentsResponse;
        try {
          commentsResponse = await this.get('/comments?slug=' + p.slug, null, 
          isAuthenticated ? auth : null
        );
        } catch (error) {
          commentsResponse = null;
        }
        
        if(commentsResponse){
          p.numComments = commentsResponse.data.comments.filter((c: CommentDTO) => c.parentCommentId === null).length;
        }

        return PostUtil.toViewModel(p);
      }));

      return right(Result.ok<Post[]>(posts));
    } catch (err) {
      return left(err.response ? err.response.data.message : "Connection failed")
    }
  }

  public async getPopularPosts (offset?: number): Promise<APIResponse<Post[]>> {
    try {
      const accessToken = this.authService.getToken('access-token');
      const isAuthenticated = !!accessToken === true;
      const auth = {
        authorization: accessToken
      };
      const response = await this.get('/posts/popular', { offset }, 
        isAuthenticated ? auth : null
      );

      return right(Result.ok<Post[]>(
        response.data.posts.map((p: PostDTO) => PostUtil.toViewModel(p)))
      );
    } catch (err) {
      return left(err.response ? err.response.data.message : "Connection failed")
    }
  }

  /**
   * Get the 5 most popular posts
   * 
   * @param {number} offset 
   * @returns {APIResponse<Post[]>}
   */
  public async get5PopularPosts(offset?: number): Promise<APIResponse<Post[]>> {
    try {
      const accessToken = this.authService.getToken('access-token');
      const isAuthenticated = !!accessToken === true;
      const auth = {
        authorization: accessToken
      };
      const response = await this.get('/posts/popular', { offset },
        isAuthenticated ? auth : null
      );
  
      // Sort posts by numComments in descending order
      const sortedPosts = response.data.posts.sort((a: { numComments: number; }, b: { numComments: number; }) => b.numComments - a.numComments);
  
      // Take the first 5 posts
      const popularPosts = sortedPosts.slice(0, 5);
  
      return right(Result.ok<Post[]>(
        popularPosts.map((p: PostDTO) => PostUtil.toViewModel(p)))
      );
    } catch (err) {
      return left(err.response ? err.response.data.message : "Connection failed");
    }
  }
  

  public async createPost (title: string, type: PostType, text?: string, link?: string): Promise<APIResponse<void>> {
    try {
      await this.post('/posts', { title, postType: type, text, link }, null, { 
        authorization: this.authService.getToken('access-token') 
      });
      return right(Result.ok<void>());
    } catch (err) {
      return left(err.response ? err.response.data.message : "Connection failed")
    }
  }

  async upvotePost (slug: string): Promise<APIResponse<void>> {
    try {
      await this.post('/posts/upvote', { slug }, null, { 
        authorization: this.authService.getToken('access-token') 
      });
      return right(Result.ok<void>());
    } catch (err) {
      return left(err.response ? err.response.data.message : "Connection failed")
    }
  }

  async downvotePost (slug: string): Promise<APIResponse<void>> {
    try {
      await this.post('/posts/downvote', { slug }, null, { 
        authorization: this.authService.getToken('access-token') 
      });
      return right(Result.ok<void>());
    } catch (err) {
      return left(err.response ? err.response.data.message : "Connection failed")
    }
  }
}