import API from './api';

export const likeService = {
    getLikes: async (postId: number) => {
        const response = await API.get(`/posts/${postId}/likes`);
        return response.data;
    },
    toggleLike: async (postId: number) => {
        const response = await API.post(`/posts/${postId}/likes`);
        return response.data;
    }
};
