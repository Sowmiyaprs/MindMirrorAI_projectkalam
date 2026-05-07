// Authentication Service with LocalStorage

export const authService = {
  // Register new user
  register(email, password, username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this should be hashed
      username,
      createdAt: new Date().toISOString(),
      profile: {
        bio: '',
        avatar: null,
        theme: 'light'
      }
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  },

  // Login user
  login(email, password, rememberMe = false) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const session = {
      userId: user.id,
      email: user.email,
      username: user.username,
      loginTime: new Date().toISOString(),
      rememberMe
    };

    localStorage.setItem('currentUser', JSON.stringify(session));
    return user;
  },

  // Logout user
  logout() {
    localStorage.removeItem('currentUser');
  },

  // Get current user
  getCurrentUser() {
    const session = localStorage.getItem('currentUser');
    if (!session) return null;

    const { userId } = JSON.parse(session);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === userId);
  },

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('currentUser');
  },

  // Update user profile
  updateProfile(userId, updates) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    return users[userIndex];
  },

  // Validate email
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate password
  validatePassword(password) {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      errors: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial
      }
    };
  }
};
