import API from './api';

export const commentService = {
    getComments: async (postId: number) => {
        const response = await API.get(`/posts/${postId}/comments`);
        return response.data;
    },
    addComment: async (postId: number, content: string) => {
        const response = await API.post(`/posts/${postId}/comments`, { content });
        return response.data;
    },
    deleteComment: async (postId: number, commentId: number) => {
        const response = await API.delete(`/posts/${postId}/comments/${commentId}`);
        return response.data;
    }
};
