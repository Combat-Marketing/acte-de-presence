"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RefreshHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle F5 key (code 116)
      if (event.key === 'F5' || event.keyCode === 116) {
        console.log('F5 key detected - forcing refresh');
        event.preventDefault();
        
        // Force a hard refresh to reload the page entirely
        window.location.reload();
      }
    };

    // Add the event listener for keydown
    window.addEventListener('keydown', handleKeyDown);

    // Check the current state
    console.log('RefreshHandler mounted, monitoring for F5 key press');

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

  // This component doesn't render anything visible
  return null;
}