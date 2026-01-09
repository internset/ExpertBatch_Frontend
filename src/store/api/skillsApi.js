import { baseApi } from './baseApi';

export const skillsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSkills: builder.query({
      query: () => '/api/v1/skills',
      providesTags: ['Skill'],
    }),
    getSkillById: builder.query({
      query: (id) => `/api/v1/skills/${id}`,
      providesTags: (result, error, id) => [{ type: 'Skill', id }],
    }),
    createSkill: builder.mutation({
      query: (data) => ({
        url: '/api/v1/skills',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Skill'],
    }),
    updateSkill: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/skills/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Skill'],
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `/api/v1/skills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skill'],
    }),
  }),
});

export const {
  useGetAllSkillsQuery,
  useGetSkillByIdQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = skillsApi;

