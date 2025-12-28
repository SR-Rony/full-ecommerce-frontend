import { use, useState } from "react";

const useCounter = (initState: number): any => {
  const [counter, setCounter] = useState(initState);

  // add handler
  const add = () => {
    setCounter(counter + 1);
  };
  // remove handler
  const remove = () => {
    setCounter(counter - 1);
  };

  return { counter, add, remove };
};

export default useCounter;
