import useSignIn from 'react-auth-kit/hooks/useSignIn';



function SignInDialogue() {
  const signIn = useSignIn();

  const handleLogin = () => {
    const success = signIn({
      token: 'mock-token',
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hour
      authState: { user: 'test-user' }
    });

    if (success) {
      console.log(' Login successful!');
    } else {
      console.error('Login failed. Check payload and AuthProvider.');
    }
  };

  return (
    <div>
      <p>Click below to simulate sign-in:</p>
      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
}

export default SignInDialogue;