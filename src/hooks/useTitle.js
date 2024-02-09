import { useEffect } from "react";

// Custom React hook for managing document title
const useTitle = (title) => {
  // Effect hook to update document title on mount and title change
  useEffect(() => {
    // Save the previous document title
    const prevTitle = document.title;

    // Set the new document title
    document.title = title;

    // Clean-up function to restore previous document title on unmount or title change
    return () => {
      document.title = prevTitle;
    };
  }, [title]); // Dependency array ensures the effect runs only when 'title' changes
};

export default useTitle;
