// Returns a random number between min and max (inclusive)
export const uniform = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Basic Gaussian random using Box-Muller transform
export const gaussian = (mean = 0, stdev = 1) => {
  let u = 1 - Math.random(); // Converting [0,1) to (0,1]
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
};
