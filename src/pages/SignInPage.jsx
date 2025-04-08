import React from "react";
import SignInDialogue from "../components/SignInDialogue";
import ErrorBoundary from '../ErrorBoundary';

const SignInPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <ErrorBoundary>
        <SignInDialogue />
      </ErrorBoundary>
    </div>
  );
};

export default SignInPage;
