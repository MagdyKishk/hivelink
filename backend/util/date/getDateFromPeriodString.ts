export default (period: string) => {
  const match = period.match(/^(\d+)([dhms])$/);

  if (!match) return null; // Return null if the format is invalid

  const value = parseInt(match[1], 10);
  const unit = match[2];

  // Define multipliers for each unit type
  const multipliers: Record<string, number> = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };

  // Calculate and return the result in milliseconds
  return value * (multipliers[unit] || 0);
};
