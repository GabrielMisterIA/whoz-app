import bcrypt from 'bcryptjs';

// IMPORTANT: Configurer GITHUB_TOKEN dans les variables d'environnement Netlify
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'GabrielMisterIA/whoz-app';
const FILE_PATH = 'data/users.json';

async function getUsers() {
  const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return {
    users: JSON.parse(content),
    sha: data.sha
  };
}

async function saveUsers(users, sha) {
  const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
  const content = Buffer.from(JSON.stringify(users, null, 2)).toString('base64');
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Update users database',
      content: content,
      sha: sha
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to save users');
  }
  
  return await response.json();
}

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { action, email, password, fullName, company } = await req.json();
    const { users, sha } = await getUsers();

    if (action === 'register') {
      // Check if user exists
      const existingUser = users.users.find(u => u.email === email);
      
      if (existingUser) {
        return new Response(JSON.stringify({ message: 'Cet email est déjà utilisé' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        fullName,
        company,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };

      // Add user to array
      users.users.push(newUser);

      // Save to GitHub
      await saveUsers(users, sha);

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;

      return new Response(JSON.stringify({
        success: true,
        user: userWithoutPassword
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'login') {
      // Find user
      const user = users.users.find(u => u.email === email);
      
      if (!user) {
        return new Response(JSON.stringify({ message: 'Email ou mot de passe incorrect' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

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
