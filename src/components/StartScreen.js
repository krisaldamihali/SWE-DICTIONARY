import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";


function StartScreen({ numQuestions, dispatch }) {
    const startQuiz = () => {
    dispatch({ type: "start" });
  };

  return (
    <div className="start">
      <Header />
      <h2>Welcome to OPUS!</h2>
      <h3>{numQuestions} questions to test you</h3>
      <Link to="/Quiz" className="btn btn-ui" onClick={startQuiz}>
        Let's start QUIZ!
      </Link>

      
        <Link to="/KeyTermsComponent" className="btn btn-ui">
          Find the definition of key terms
        </Link>
      
    </div>
  );
}

export default StartScreen;
