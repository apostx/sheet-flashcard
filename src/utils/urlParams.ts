/**
 * Utility functions for handling URL parameters
 */

export interface AutoplayTimings {
  flipTime: number; // Time to wait before flipping card (milliseconds)
  nextTime: number; // Time to wait before going to next card (milliseconds)
}

/**
 * Parse autoplay timing parameters from URL
 * @returns AutoplayTimings object with parsed values or defaults
 */
export const parseAutoplayTimings = (): AutoplayTimings => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Parse flip time (default: 3000ms = 3 seconds)
  const flipTimeParam = urlParams.get('flipTime') || urlParams.get('flip_time');
  const flipTime = flipTimeParam ? parseInt(flipTimeParam, 10) : 3000;
  
  // Parse next card time (default: 3000ms = 3 seconds)
  const nextTimeParam = urlParams.get('nextTime') || urlParams.get('next_time');
  const nextTime = nextTimeParam ? parseInt(nextTimeParam, 10) : 3000;
  
  // Validate values (minimum 500ms, maximum 30000ms)
  const validatedFlipTime = Math.max(500, Math.min(30000, isNaN(flipTime) ? 3000 : flipTime));
  const validatedNextTime = Math.max(500, Math.min(30000, isNaN(nextTime) ? 3000 : nextTime));
  
  return {
    flipTime: validatedFlipTime,
    nextTime: validatedNextTime
  };
};

/**
 * Update URL parameters with new timing values
 * @param timings - AutoplayTimings object
 */
export const updateUrlTimings = (timings: AutoplayTimings): void => {
  const url = new URL(window.location.href);
  
  // Only add parameters if they're different from defaults
  if (timings.flipTime !== 3000) {
    url.searchParams.set('flipTime', timings.flipTime.toString());
  } else {
    url.searchParams.delete('flipTime');
    url.searchParams.delete('flip_time');
  }
  
  if (timings.nextTime !== 3000) {
    url.searchParams.set('nextTime', timings.nextTime.toString());
  } else {
    url.searchParams.delete('nextTime');
    url.searchParams.delete('next_time');
  }
  
  // Update URL without reloading page
  window.history.replaceState({}, '', url.toString());
};
