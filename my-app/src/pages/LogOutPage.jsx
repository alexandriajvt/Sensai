import React from "react";
import LogOutDialogue from "../components/LogOutDialogue";
import ErrorBoundary from '../ErrorBoundary';

const LogOutPage = () => {
  return (
    <div>
      <h1>Log Out</h1>
      <ErrorBoundary>
        <LogOutDialogue />
      </ErrorBoundary>
    </div>
  );
};

export default LogOutPage;