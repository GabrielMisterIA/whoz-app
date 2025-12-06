import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('whoz_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Get all users from localStorage
      const usersData = localStorage.getItem('whoz_users');
      const users = usersData ? JSON.parse(usersData) : {};
      
      // Find user
      const user = users[email];
      
      if (!user) {
        return { success: false, message: 'Email ou mot de passe incorrect' };
      }
      
      // Verify password (simple comparison since we're storing plain text for simplicity)
      if (user.password !== password) {
        return { success: false, message: 'Email ou mot de passe incorrect' };
      }
      
      // Login successful
      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem('whoz_user', JSON.stringify(userWithoutPassword));
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (email, password, fullName, company) => {
    try {
      // Get all users from localStorage
      const usersData = localStorage.getItem('whoz_users');
      const users = usersData ? JSON.parse(usersData) : {};
      
      // Check if user already exists
      if (users[email]) {
        return { success: false, message: 'Cet email est déjà utilisé' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        fullName,
        company,
        password, // Storing plain text for simplicity in this demo
        createdAt: new Date().toISOString(),
      };
      
      // Save to users database
      users[email] = newUser;
      localStorage.setItem('whoz_users', JSON.stringify(users));
      
      // Login the user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('whoz_user', JSON.stringify(userWithoutPassword));
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('whoz_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
