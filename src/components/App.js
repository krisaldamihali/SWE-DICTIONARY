import React from "react";
import { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Main";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Quiz from "./Quiz";
import KeyTermsComponent from "./KeyTermsComponent";
import quizData from "./quiz.json"
import "../index.css";



const SECS_PER_QUESTION = 5;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        highscore:
          state.secondsRemaining === 0
            ? state.points > state.highscore
              ? state.points
              : state.highscore
            : state.highscore,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [
    { questions, status },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  

  useEffect(() => {
    dispatch({
      type: "dataReceived",
      payload: quizData.questions,
    });
  }, []);
  
  useEffect(() => {
    if (status === "ready") {
      dispatch({ type: "start" });
    }
  }, [status]);


  return (
    <Router>
      <div className="wrapper">
        <div className="app">
          <div className="headerWrapper">
            
            <Main>
           
              <Routes>
                <Route path="/Quiz" element={<Quiz />} />
                <Route path="/KeyTermsComponent" element={<KeyTermsComponent />} />
                <Route path="/" element={<StartScreen numQuestions={numQuestions} dispatch={dispatch} status={status} />} />
              </Routes>
            </Main>
          </div>
        </div>
      </div>
    </Router>
  );
}


