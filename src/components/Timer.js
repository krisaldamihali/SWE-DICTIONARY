import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  useEffect(() => {
    if (secondsRemaining <= 0) {
      dispatch({ type: "finish" });
      return;
    }

    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(id);
  }, [dispatch, secondsRemaining]);

  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="timer">
      {mins < 10 ? "0" + mins : mins}:{seconds < 10 ? "0" + seconds : seconds}
    </div>
  );
}

export default Timer;
