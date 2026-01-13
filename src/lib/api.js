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
    // Handle query parameters
    let url = endpoint;
    if (options.params && Object.keys(options.params).length > 0) {
      const queryString = new URLSearchParams(options.params).toString();
      url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}${queryString}`;
    }
    const { params, ...restOptions } = options;
    return this.request(url, { ...restOptions, method: 'GET' });
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

  async postFormData(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const skipAuth = options.skipAuth || false;

    const config = {
      ...options,
      method: 'POST',
      headers: {
        ...(token && !skipAuth && { Authorization: `Bearer ${token}` }),
        ...options.headers,
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
      body: formData,
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
  // Get skill by name
  getSkillByName: (skillName, skipAuth = false) => api.get(`/api/v1/exams/skill/${encodeURIComponent(skillName)}`, { skipAuth }),
  
  // Get questions with sessionId (returns sessionId)
  // Backend route: questions/:skillId/:userId
  // Backend expects 'name' parameter via @Param('name') but route doesn't include :name
  // This is a backend bug - the route should be questions/:skillId/:userId/:name
  // OR the backend should use @Query('name') instead of @Param('name')
  // Workaround: Add name to path even though route doesn't define it
  getQuestions: (skillId, userId = 'public-user-id', skipAuth = false, skillName = null) => {
    if (skillName) {
      // Add skillName to path - backend route should include :name but doesn't
      // This might work if NestJS is lenient with extra path segments
      const encodedSkillName = encodeURIComponent(skillName);
      return api.get(`/api/v1/exams/questions/${skillId}/${userId}/${encodedSkillName}`, { skipAuth });
    }
    // Without skillName, backend will throw "Skill name is required" error
    return api.get(`/api/v1/exams/questions/${skillId}/${userId}`, { skipAuth });
  },
  
  // Submit exam
  submit: (data, skipAuth = false) => api.post('/api/v1/exams/submit', data, { skipAuth }),
  
  // Submit individual answer
  submitAnswer: (data, skipAuth = false) => api.post('/api/v1/exams/submit-answer', data, { skipAuth }),
  
  // Get all exams
  getAll: () => api.get('/api/v1/exams'),
  
  // Get exam by ID
  getOne: (id) => api.get(`/api/v1/exams/${id}`),
  
  // Delete exam
  delete: (id) => api.delete(`/api/v1/exams/${id}`),
  
  // Get exams by user
  getByUser: (userId) => api.get(`/api/v1/exams/user/${userId}`),
  
  // Get exams by skill ID
  getBySkill: (skillId) => api.get(`/api/v1/exams/skill/${skillId}`),
  
  // Get exam session by sessionId
  getSession: (sessionId, skipAuth = false) => api.get(`/api/v1/exams/session/${sessionId}`, { skipAuth }),
  
  // Upload picture
  uploadPicture: (formData, skipAuth = false) => api.postFormData('/api/v1/exams/upload-picture', formData, { skipAuth }),
  
  // Proctoring API - expects FormData with file, type, and sessionId
  proctoring: async (formData, skipAuth = false) => {
    const url = `${api.baseURL}/api/v1/exams/proctoring`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    console.log('🌐 Proctoring API call initiated:', {
      url,
      skipAuth,
      hasToken: !!token,
      formDataKeys: Array.from(formData.keys())
    });

    const config = {
      method: 'POST', 
      headers: {
        ...(token && !skipAuth && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
      body: formData,
    };

    try {
      console.log('📡 Fetching to:', url);
      const response = await fetch(url, config);
      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        console.error('❌ API Error:', data);
        throw new Error(data.message || 'An error occurred');
      }

      console.log('✅ Proctoring API call successful');
      return data;
    } catch (error) {
      console.error('❌ Proctoring API call failed:', error);
      throw error;
    }
  },
  
  // Legacy methods for backward compatibility
  getQuestionsBySkillName: (skillName, skipAuth = false) => api.get(`/api/v1/exams/skill/${encodeURIComponent(skillName)}`, { skipAuth }),
};






