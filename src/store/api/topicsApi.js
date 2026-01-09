import { baseApi } from './baseApi';

export const topicsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopicsBySkill: builder.query({
      query: (skillId) => `/api/v1/topics?skillId=${skillId}`,
      providesTags: (result, error, skillId) => [
        { type: 'Topic', id: skillId },
        'Topic',
      ],
    }),
    createTopic: builder.mutation({
      query: (data) => ({
        url: '/api/v1/topics',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Topic'],
    }),
    updateTopic: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/topics/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Topic'],
    }),
    deleteTopic: builder.mutation({
      query: (id) => ({
        url: `/api/v1/topics/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Topic'],
    }),
  }),
});

export const {
  useGetTopicsBySkillQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = topicsApi;

