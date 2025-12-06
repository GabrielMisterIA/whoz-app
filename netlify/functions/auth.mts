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
      const existingUser = await store.get(`user:${email}`, { type: 'text' });
      
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

      // Store user as JSON string
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
      // Get user with explicit text type
      const userData = await store.get(`user:${email}`, { type: 'text' });
      
      console.log('Login attempt for:', email);
      console.log('User data found:', userData ? 'Yes' : 'No');
      
      if (!userData) {
        return new Response(JSON.stringify({ message: 'Email ou mot de passe incorrect' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Parse user data
      let user;
      try {
        user = JSON.parse(userData);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return new Response(JSON.stringify({ message: 'Erreur de lecture des données utilisateur' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log('User object parsed successfully');
      console.log('Stored password hash exists:', !!user.password);

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      console.log('Password validation result:', isValidPassword);

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
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ 
      message: 'Erreur serveur',
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/auth'
};
