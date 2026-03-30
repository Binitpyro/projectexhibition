import { useState, useEffect } from 'react';
import { getDailyHistory } from '../utils/storage';

export default function ActivityCalendar() {
    const [history, setHistory] = useState<Record<string, string[]>>({});
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const todayNum = now.getDate();
    const todayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(todayNum).padStart(2, '0')}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    useEffect(() => {
        setHistory(getDailyHistory());
    }, []);

    const getStatus = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const games = history[dateStr] || [];
        if (games.length >= 3) return 'green';
        if (games.length > 0) return 'yellow';
        return 'none';
    };

    let score = 0;
    for (let d = 1; d <= daysInMonth; d++) {
        const st = getStatus(d);
        if (st === 'green') score += 3;
        if (st === 'yellow') score += 1;
    }

    const todayGames = history[todayDateStr] || [];
    const allGames = [
        { id: 'brushing', label: 'Brushing' },
        { id: 'handwash', label: 'Hand Washing' },
        { id: 'trash', label: 'Clean Park' }
    ];

    const completedLists = allGames.filter(g => todayGames.includes(g.id));
    const remainingLists = allGames.filter(g => !todayGames.includes(g.id));

    const daysRender = [];
    for (let i = 0; i < firstDay; i++) {
        daysRender.push(<div key={`empty-${i}`} style={{ width: 32, height: 32 }} />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const status = getStatus(d);
        const bg = status === 'green' ? 'var(--color-mint)' : status === 'yellow' ? '#FCD34D' : 'transparent';
        const color = status === 'none' ? 'var(--color-text)' : '#FFFFFF';
        const textShadow = status === 'none' ? 'none' : '0px 1px 2px rgba(0,0,0,0.2)';

        daysRender.push(
            <div key={d} style={{
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', background: bg, fontWeight: 'bold', fontSize: '0.9rem', color, textShadow
            }}>
                {d}
            </div>
        );
    }

    const monthName = now.toLocaleString('default', { month: 'long' });

    return (
        <div style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            padding: 'var(--sp-4)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-float)',
            minWidth: 260,
            textAlign: 'center',
            border: '2px solid rgba(255,255,255,0.95)',
        }}>
            <h3 style={{ margin: '0 0 var(--sp-3)', fontSize: '1.2rem', color: 'var(--color-text)' }}>
                {monthName} {year}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8, fontSize: '0.8rem', opacity: 0.6, fontWeight: 'bold' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <div key={i}>{day}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {daysRender}
            </div>
            <div style={{
                marginTop: 'var(--sp-4)',
                paddingTop: 'var(--sp-3)',
                borderTop: '2px dashed rgba(0,0,0,0.05)',
                fontWeight: 'bold',
                fontSize: '1.1rem'
            }}>
                Score: <span style={{ color: 'var(--color-sky)' }}>{score}</span>
            </div>

            <div style={{
                marginTop: 'var(--sp-3)',
                paddingTop: 'var(--sp-3)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                fontSize: '0.85rem',
                textAlign: 'left'
            }}>
                <div style={{ marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--color-mint)' }}>✓ Completed Today:</strong>
                    <div style={{ fontWeight: 'normal', opacity: 0.8 }}>
                        {completedLists.length > 0 ? completedLists.map(g => g.label).join(', ') : 'None yet!'}
                    </div>
                </div>
                <div style={{ marginTop: 'var(--sp-2)' }}>
                    <strong style={{ color: '#D97706' }}>⏳ Remaining:</strong>
                    <div style={{ fontWeight: 'normal', opacity: 0.8 }}>
                        {remainingLists.length > 0 ? remainingLists.map(g => g.label).join(', ') : 'All done! 🎉'}
                    </div>
                </div>
            </div>
        </div>
    );
}
