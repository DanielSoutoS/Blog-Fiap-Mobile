export const API_URL = `http://26.53.167.136:8089`;
// Função para pegar os posts por página
export function getPostsByPage(page = 1) {
  return {
    url: `${API_URL}/posts?page=${page}`,
    options: {
      method: 'GET',
      cache: 'no-store',
    },
  };
}

export function getSearchPosts(page, searchTerm) {
  const url = `${API_URL}/posts/search?page=${page}&query=${searchTerm}`;
  return { url, options: { method: 'GET' } };
}

export function userLogin(email, password) {
  return {
    url: `${API_URL}/users/login`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    },
  };
}

export function userRegister(name, email, password) {
  return {
    url: `${API_URL}/users/register`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    },
  };
}

export const autoLogin = (token) => {
  return {
    url: `${API_URL}/users/auth`,
    options: {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
};

export const createPost = (post, token) => {
  return {
    url: `${API_URL}/posts`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: post.title, body: post.body }),
    },
  };
};

export const getPostById = (id, token) => {
  return {
    url: `${API_URL}/posts/${id}`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  };
};

export const emojiReaction = (body, token) => {
  return {
    url: `${API_URL}/reaction`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  };
};

export const commentPost = (postId, text, token) => {
  return {
    url: `${API_URL}/comment`,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, text }),
    },
  };
};

export const getComments = (postId, page, token) => {
  return {
    url: `${API_URL}/comment?page=${page}&post=${postId}`,
    options: {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  };
};

export const deleteComment = (commentId, token) => {
  return {
    url: `${API_URL}/comment/${commentId}`,
    options: {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  };
};

export const updatePost = (id, post, token) => {
  return {
    url: `${API_URL}/posts/${id}`,
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: post.title, body: post.body }),
    },
  };
};

export const deletePost = (id, token) => {
  return {
    url: `${API_URL}/posts/${id}`,
    options: {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  };
};

export const getUsersByPage = (page, limit, token) => {
  return {
    url: `${API_URL}/admin/users?page=${page}&limit=${limit}`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  };
};

export const updateUser = (id, body, token) => {
  return {
    url: `${API_URL}/admin/user/${id}`,
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  };
};
