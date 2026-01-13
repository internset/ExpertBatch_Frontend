const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const skipAuth = options.skipAuth || false;

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && !skipAuth && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    // Remove skipAuth from config before sending
    delete config.skipAuth;

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/api/v1/auth/super-admin/login', { email, password }),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/api/v1/users'),
};

// Skills API
export const skillsAPI = {
  getAll: () => api.get('/api/v1/skills'),
  getOne: (id) => api.get(`/api/v1/skills/${id}`),
  create: (data) => api.post('/api/v1/skills', data),
  update: (id, data) => api.patch(`/api/v1/skills/${id}`, data),
  delete: (id) => api.delete(`/api/v1/skills/${id}`),
};

// Topics API
export const topicsAPI = {
  getBySkill: (skillId) => api.get(`/api/v1/topics?skillId=${skillId}`),
  create: (data) => api.post('/api/v1/topics', data),
  update: (id, data) => api.patch(`/api/v1/topics/${id}`, data),
  delete: (id) => api.delete(`/api/v1/topics/${id}`),
};

// Questions API
export const questionsAPI = {
  getAll: (skillId, topicId) => {
    const params = new URLSearchParams();
    if (skillId) params.append('skillId', skillId);
    if (topicId) params.append('topicId', topicId);
    return api.get(`/api/v1/questions?${params.toString()}`);
  },
  getBySkill: (skillId) => api.get(`/api/v1/questions/by-skill?skillId=${skillId}`),
  create: (data) => api.post('/api/v1/questions', data),
  update: (id, data) => api.patch(`/api/v1/questions/${id}`, data),
  delete: (id) => api.delete(`/api/v1/questions/${id}`),
};

// Exams API
export const examsAPI = {
  getQuestions: (skillId, skipAuth = false) => api.get(`/api/v1/exams/questions/${skillId}`, { skipAuth }),
  getQuestionsBySkillName: (skillName, skipAuth = false) => api.get(`/api/v1/exams/skill/${encodeURIComponent(skillName)}`, { skipAuth }),
  submit: (data, skipAuth = false) => api.post('/api/v1/exams/submit', data, { skipAuth }),
  getAll: () => api.get('/api/v1/exams'),
  getOne: (id) => api.get(`/api/v1/exams/${id}`),
  getByUser: (userId) => api.get(`/api/v1/exams/user/${userId}`),
  getBySkill: (skillId) => api.get(`/api/v1/exams/skill/${skillId}`),
  delete: (id) => api.delete(`/api/v1/exams/${id}`),
};






