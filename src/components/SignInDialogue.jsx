import { useState } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';

function SignInDialogue() {
  // Authentication state
  const signIn = useSignIn();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registration state
  const [name, setName] = useState('');
  const [stuId, setStuId] = useState('');
  const [major, setMajor] = useState('');
  const [classification, setClassification] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [residence, setResidence] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data.error);
        return;
      }

      const success = signIn({
        auth: { token: data.token, type: 'Bearer' },
        userState: {
          name: data.user.name,
          id: data.user.id,
          email: data.user.email,
          role: data.user.role
        }
      });

      if (success) {
        console.log('Login successful!');
      } else {
        console.error('SignIn failed');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          stu_id: stuId,
          major,
          classification,
          role,
          residence
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Registration failed:', data.error);
        return;
      }

      console.log('Registration successful!', data);
      setIsLogin(true); // Switch to login after successful registration
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      
      {/* Login Form */}
      {isLogin ? (
        <>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <button 
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </>
      ) : (
        /* Registration Form */
        <>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Student ID</label>
            <input
              type="text"
              value={stuId}
              onChange={(e) => setStuId(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Major</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Classification</label>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">Select classification</option>
              <option value="freshman">Freshman</option>
              <option value="sophomore">Sophomore</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
              <option value="graduate">Graduate</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Residence</label>
            <input
              type="text"
              value={residence}
              onChange={(e) => setResidence(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <button 
            onClick={handleRegister}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </>
      )}

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        {isLogin ? 'Need an account? ' : 'Already have an account? '}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: 'none',
            border: 'none',
            color: '#2196F3',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
}

export default SignInDialogue;