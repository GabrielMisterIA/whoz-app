import { getStore } from '@netlify/blobs';
import bcrypt from 'bcryptjs';

export default async (req, context) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { action, email, password, fullName, company } = await req.json();
    
    // Get users store
    const store = getStore('users');

    if (action === 'register') {
      // Check if user already exists
      const existingUser = await store.get(`user:${email}`);
      
      if (existingUser) {
        return new Response(JSON.stringify({ message: 'Cet email est déjà utilisé' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user object
      const user = {
        id: Date.now().toString(),
        email,
        fullName,
        company,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };

      // Store user
      await store.set(`user:${email}`, JSON.stringify(user));

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return new Response(JSON.stringify({
        success: true,
        user: userWithoutPassword
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'login') {
      // Get user
      const userData = await store.get(`user:${email}`);
      
      if (!userData) {
        return new Response(JSON.stringify({ message: 'Email ou mot de passe incorrect' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const user = JSON.parse(userData);

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return new Response(JSON.stringify({ message: 'Email ou mot de passe incorrect' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return new Response(JSON.stringify({
        success: true,
        user: userWithoutPassword
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Action invalide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Auth error:', error);
    return new Response(JSON.stringify({ message: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/auth'
};
