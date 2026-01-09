import { baseApi } from './baseApi';

export const examsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllExams: builder.query({
      query: () => '/api/v1/exams',
      providesTags: ['Exam'],
    }),
    getExamById: builder.query({
      query: (id) => `/api/v1/exams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Exam', id }],
    }),
    getExamsByUser: builder.query({
      query: (userId) => `/api/v1/exams/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: 'Exam', id: userId },
        'Exam',
      ],
    }),
    getExamsBySkill: builder.query({
      query: (skillId) => `/api/v1/exams/skill/${skillId}`,
      providesTags: (result, error, skillId) => [
        { type: 'Exam', id: skillId },
        'Exam',
      ],
    }),
    getExamQuestions: builder.query({
      query: (skillId) => `/api/v1/exams/questions/${skillId}`,
      providesTags: ['Exam'],
    }),
    submitExam: builder.mutation({
      query: (data) => ({
        url: '/api/v1/exams/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Exam'],
    }),
  }),
});

export const {
  useGetAllExamsQuery,
  useGetExamByIdQuery,
  useGetExamsByUserQuery,
  useGetExamsBySkillQuery,
  useGetExamQuestionsQuery,
  useSubmitExamMutation,
} = examsApi;

