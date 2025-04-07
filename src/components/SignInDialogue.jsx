import React from "react";
import useSignIn from "react-auth-kit";

function SignInDialogue() {
  console.log("SignInDialogue is rendering"); // Debug log
  const signIn = useSignIn();

  console.log('SignIn function exists?', !!signIn); // Should log `true`

  

  const handleLogin = async () => {
    // Mocking a successful response from the backend
    const mockResponse = {
      success: true,
      token: "mock-jwt-token",
      expiresIn: 3600, // 1 hour in seconds
      user: { username: "exampleUser" }, // Mock user details
    };

    if (mockResponse.success) {
      // Store the mock token using signIn
      signIn({
        token: mockResponse.token,
        expiresIn: mockResponse.expiresIn,
        tokenType: "Bearer",
        authState: { user: mockResponse.user , role: "admin"},
      });
      console.log("Mock login successful");
    } else {
      console.error("Mock login failed");
    }


    // try {
    //   const response = await fetch('http://localhost:5000/login', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       username: 'exampleUser',
    //       password: 'examplePassword',
    //     }),
    //     headers: { 'Content-Type': 'application/json' },
    //   });

    //   const data = await response.json();
    //   if (data.success) {
    //     // Store the token using React Auth Kit's signIn function
    //     signIn({
    //       token: data.token, // Token returned from the backend
    //       expiresIn: data.expiresIn, // Token expiration time
    //       tokenType: 'Bearer',
    //       authState: { user: data.user }, // Additional user details
    //     });
    //   } else {
    //     console.error('Login failed:', data.message);
    //   }
    // } catch (error) {
    //   console.error('Error logging in:', error);
    // }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Sign in</button>
    </div>
  );
};

export default SignInDialogue;
