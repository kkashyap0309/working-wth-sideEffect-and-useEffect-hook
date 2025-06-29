import { useEffect, useState } from "react";

const TIMER = 3000;
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  //adding progress bar
  const [progressTimerRemaining, setProgressTimerRemaining] = useState(TIMER);

  useEffect(() => {
    // this timer will keep on going since there is no cleanup code to remove timer when this component disappears
    //hence to handle this sideEffect we need to use useEffect hook
    const interval = setInterval(() => {
      console.log("interval");
      
      setProgressTimerRemaining((prevTiming) => prevTiming - 10);
    }, 10);

    return () =>{
      console.log("clear interval");
      
      clearInterval(interval);
    }
  }, []);

  // I want feature to default delete the place if modal is remained open.

  //This timer will run when this component will be rendered since the modal will be rendered in the same flow
  //but it will not be visible which will cause the selected place to remove. So the solution is either we have
  // render this component conditionally or use  useEffect to handle this sideEffect

  useEffect(() => {
    console.log("timeout useEffect");
    const timer = setTimeout(() => {
      onConfirm();
    }, TIMER);

    return () => {
      //this method  which is the return of useEffect only will execute if this component is rendered again and this component is removed from the DOM
      console.log("clean timeout");
      clearTimeout(timer);
    };
  }, [onConfirm]); //while keeping the dependency as function (viz object in javascript) it may lead to infinite loop since each new render of
  // function/object will change so to avoid that we need to use another hook which is useCallback hook to the method
  // Here its done in App.jsx since there is the implementation of onConfirm()

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value={progressTimerRemaining} max={TIMER} />
    </div>
  );
}
