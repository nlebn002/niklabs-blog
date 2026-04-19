import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteApiPostsId, getApiPosts, getApiPostsId, postApiPosts, putApiPostsId } from "../../generated-openapi/blog/blog.js";
import { UpsertPostRequest } from "../../generated-openapi/models/index.js";

const postKeys = {
  all: ["posts"] as const,
  admin: ["posts", "admin"] as const,
  published: ["posts", "published"] as const,
  detail: (postId: string) => ["posts", "detail", postId] as const
};

export function usePublishedPosts() {
  return useQuery({
    queryKey: postKeys.published,
    queryFn: async () => {
      const response = await getApiPosts({ isPublished: true });
      return response.data;
    }
  });
}

export function useAdminPosts() {
  return useQuery({
    queryKey: postKeys.admin,
    queryFn: async () => {
      const response = await getApiPosts({ onlyEditable: true });
      return response.data;
    }
  });
}

export function usePublicPost(postId: string) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    enabled: Boolean(postId),
    queryFn: async () => {
      const response = await getApiPostsId(postId);

      if (response.status === 404) {
        throw new Error("Post not found.");
      }

      return response.data;
    }
  });
}

export function useAdminPost(postId: string) {
  return useQuery({
    queryKey: [...postKeys.detail(postId), "admin"] as const,
    enabled: Boolean(postId),
    queryFn: async () => {
      const response = await getApiPostsId(postId);

      if (response.status === 404) {
        throw new Error("Post not found.");
      }

      return response.data;
    }
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpsertPostRequest) => {
      const response = await postApiPosts(payload);

      if (response.status === 403) {
        throw new Error("You cannot create posts.");
      }

      if (response.status !== 201) {
        throw new Error("Failed to create post.");
      }

      return response.data;
    },
    onSuccess: async (post) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.all }),
        queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id) })
      ]);
    }
  });
}

export function useUpdatePost(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpsertPostRequest) => {
      const response = await putApiPostsId(postId, payload);

      if (response.status === 200) {
        return response.data;
      }

      if (response.status === 404) {
        throw new Error("Post not found.");
      }

      if (response.status === 403) {
        throw new Error("You cannot update this post.");
      }

      throw new Error("Failed to update post.");
    },
    onSuccess: async (post) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.all }),
        queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id) })
      ]);
    }
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await deleteApiPostsId(postId);

      if (response.status === 404) {
        throw new Error("Post not found.");
      }

      if (response.status === 403) {
        throw new Error("You cannot delete this post.");
      }

      return postId;
    },
    onSuccess: async (postId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.all }),
        queryClient.removeQueries({ queryKey: postKeys.detail(postId) })
      ]);
    }
  });
}
