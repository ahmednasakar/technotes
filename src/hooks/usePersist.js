import { useState, useEffect } from "react";

// Custom hook for persisting state in localStorage
const usePersist = () => {
  // State to manage the persist value, initially set to the value in localStorage or false
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  // Effect to update localStorage whenever the persist state changes
  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  // Return the current persist state and the function to update it
  return [persist, setPersist];
};

export default usePersist;
