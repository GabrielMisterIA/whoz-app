import bcrypt from 'bcryptjs';

const SUPABASE_URL = 'https://zscvspazoifgliyqnfte.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzY3ZzcGF6b2lmZ2xpeXFuZnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDA1NjksImV4cCI6MjA4MDYxNjU2OX0.n_-qHs1crRQ1tmdURypancvrGrOy3u2Uy-FXVBXa6v4';

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

    if (action === 'register') {
      // Check if user already exists
      const checkResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          }
        }
      );

      const existingUsers = await checkResponse.json();
      
      if (existingUsers && existingUsers.length > 0) {
        return new Response(JSON.stringify({ message: 'Cet email est déjà utilisé' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in Supabase
      const createResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/users`,
        {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            email,
            password: hashedPassword,
            full_name: fullName,
            company
          })
        }
      );

      if (!createResponse.ok) {
        const error = await createResponse.text();
        console.error('Supabase error:', error);
        return new Response(JSON.stringify({ message: 'Erreur lors de la création du compte' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const newUser = await createResponse.json();
      const user = Array.isArray(newUser) ? newUser[0] : newUser;

      // Return user without password
      return new Response(JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          company: user.company
        }
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'login') {
      // Get user from Supabase
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          }
        }
      );

      const users = await response.json();
      
      if (!users || users.length === 0) {
        return new Response(JSON.stringify({ message: 'Email ou mot de passe incorrect' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return new Response(JSON.stringify({ message: 'Email ou mot de passe incorrect' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Return user without password
      return new Response(JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          company: user.company
        }
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
