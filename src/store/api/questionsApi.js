import { baseApi } from './baseApi';

export const questionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuestions: builder.query({
      query: ({ skillId, topicId } = {}) => {
        const params = new URLSearchParams();
        if (skillId) params.append('skillId', skillId);
        if (topicId) params.append('topicId', topicId);
        const queryString = params.toString();
        return `/api/v1/questions${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Question'],
    }),
    getQuestionsBySkill: builder.query({
      query: (skillId) => `/api/v1/questions/by-skill?skillId=${skillId}`,
      providesTags: (result, error, skillId) => [
        { type: 'Question', id: skillId },
        'Question',
      ],
    }),
    createQuestion: builder.mutation({
      query: (data) => ({
        url: '/api/v1/questions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Question'],
    }),
    updateQuestion: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/questions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Question'],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/api/v1/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),
  }),
});

export const {
  useGetAllQuestionsQuery,
  useGetQuestionsBySkillQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionsApi;

