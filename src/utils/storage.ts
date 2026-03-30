export const getStreak = (): number => {
  const streak = localStorage.getItem('hygiene-streak');
  return streak ? Number.parseInt(streak, 10) : 0;
};

export const setStreak = (value: number): void => {
  localStorage.setItem('hygiene-streak', value.toString());
};

export const incrementStreak = (): number => {
  const today = new Date().toISOString().split('T')[0];
  const lastPlayed = localStorage.getItem('hygiene-last-played');
  const current = getStreak();

  if (lastPlayed === today) {
    return current; // Already incremented today
  }

  const newStreak = current + 1;
  setStreak(newStreak);
  localStorage.setItem('hygiene-last-played', today);
  return newStreak;
};

// --- Calendar tracking logic ---
const HISTORY_KEY = 'hygiene-history';

export const getDailyHistory = (): Record<string, string[]> => {
  try {
    const dataStr = localStorage.getItem(HISTORY_KEY);

    if (dataStr) {
      return JSON.parse(dataStr);
    }

    let history: Record<string, string[]> = {};
    const today = new Date();

    // Sequence of daily completions to make the calendar look realistic
    const mockPatterns = [
      ['brushing', 'handwash', 'trash'],
      ['brushing', 'handwash', 'trash'],
      ['brushing', 'trash'],
      ['brushing', 'handwash', 'trash'],
      [],
      ['brushing', 'handwash'],
      ['brushing', 'handwash', 'trash'],
      ['brushing', 'handwash', 'trash'],
      ['handwash', 'trash'],
      ['brushing', 'handwash', 'trash'],
      ['brushing'],
      ['brushing', 'handwash', 'trash'],
      ['brushing', 'trash'],
      ['brushing', 'handwash', 'trash']
    ];

    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      if (!history[dateStr]) {
        history[dateStr] = mockPatterns[i - 1];
      }
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch {
    return {};
  }
};

export const markGameComplete = (gameId: string): void => {
  const history = getDailyHistory();
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

  if (!history[today]) {
    history[today] = [];
  }

  if (!history[today].includes(gameId)) {
    history[today].push(gameId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
};
