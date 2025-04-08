import useSignIn from 'react-auth-kit/hooks/useSignIn';



function SignInDialogue() {
  const signIn = useSignIn();

  const handleLogin = () => {
    const success = signIn({//something in here is causing an error. type cannot be read
      auth : {
        token: 'mock-token',
        type: 'Bearer'
      },
      userState:{
        name: 'Alex is Testing'
      }
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