// Since progress bar will be re-executed to fetch the timer and update the value of progress bar from the hook which
//will reload whole delete confirmation component , hence making progressBar a separte component

import { useEffect, useState } from "react";

export default function ProgressBar({timer}) {
    //adding progress bar
  const [progressTimerRemaining, setProgressTimerRemaining] = useState(timer);

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
    return  <progress value={progressTimerRemaining} max={timer} />
}