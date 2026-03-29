export const getStreak = (): number => {
  const streak = localStorage.getItem('hygiene-streak');
  return streak ? parseInt(streak, 10) : 0;
};

export const setStreak = (value: number): void => {
  localStorage.setItem('hygiene-streak', value.toString());
};

export const incrementStreak = (): number => {
  const current = getStreak();
  const newStreak = current + 1;
  setStreak(newStreak);
  return newStreak;
};
