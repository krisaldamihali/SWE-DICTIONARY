import React, { useEffect, useReducer } from "react";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Footer from "./Footer";
import Timer from "./Timer";
import FinishScreen from "./FinishScreen";

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
      throw new Error("Action unknown");
  }
}

function Quiz() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch("https://vinayak9669.github.io/React_quiz_api/questions.json")
      .then((res) => res.json())
      .then((data) =>
        dispatch({
          type: "dataReceived",
          payload: data["questions"],
        })
      )
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error loading questions. Please try again.</div>;
  }

  if (status === "finished") {
    return <FinishScreen points={points} />;
  }

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  return (
    <>
      <Progress
        index={index}
        numQuestions={numQuestions}
        points={points}
        maxPossiblePoints={maxPossiblePoints}
        answer={answer}
      />
      <Question
        question={questions[index]}
        dispatch={dispatch}
        answer={answer}
      />
      <Footer>
        <Timer
          dispatch={dispatch}
          secondsRemaining={secondsRemaining}
        />
        <NextButton
          dispatch={dispatch}
          answer={answer}
          numQuestions={numQuestions}
          index={index}
        />
      </Footer>
    </>
  );
}

export default Quiz;
