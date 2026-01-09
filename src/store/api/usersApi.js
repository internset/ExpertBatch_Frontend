import { baseApi } from './baseApi';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/api/v1/users',
      providesTags: ['User'],
      transformResponse: (response) => {
        // Handle different response formats
        if (response.users) return response.users;
        if (response.data) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
    }),
  }),
});

export const { useGetAllUsersQuery } = usersApi;

