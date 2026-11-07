'use client';

import {useState, useEffect} from 'react';

export default function Leaderboard({refreshKey}) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    //Fetches all leaderboard data from API
    const fetchScores = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leaderboard');
            if (!res.ok) throw new Error("Failed to load scores");
            const data = await res.json();
            setScores(data);
        }
        catch (err) {
            console.error(err);
            setError('Could not get leaderboard');
        }
        finally {
            setLoading(false);
        }
    };

    //Refetches score once refreshKey changes
    useEffect(() =>  {
        fetchScores();
    }, [refreshKey]);

    return (
        <div style={containerStyle}>
            <h3 style={{margin: '0 0 12px 0' }}> Top Leaderboard</h3>

            {loading && <p style={{fontSize: '0.875rem'}}> Loading scores...</p>}
            {error && <p style={{color: 'red', fontSize: '0.875rem'}}> {error} </p>}

            {!loading && !error && scores.length === 0 && (
                <p style={{fontSize: '0.875rem'}}> No scores have been saved yet. </p>
            )}

            {!loading && !error && scores.length > 0 && (
                <table style= {tableStyle}>
                    <thead>
                        <tr style={{borderBottom: '2px solid #ccc', textAlign: 'left',}}>
                            <th style={cellStyle}>#</th>
                            <th style={cellStyle}>Player</th>
                            <th style={cellStyle}>Moves</th>
                            <th style={cellStyle}>Time</th>
                        </tr>
                    </thead>
                <tbody>
                    {scores.map((score, index) => (
                        <tr key= {score.id || index} style= {{borderBottom: '1px solid #eee'}}>
                            <td style={cellStyle}>{index + 1}</td>
                            <td style={cellStyle}>{score.player_name}</td>
                            <td style={cellStyle}>{score.moves}</td>
                            <td style={cellStyle}>{score.time_seconds}s</td>                                                        
                        </tr>
                     ))}
                </tbody>
             </table>
            )}
        </div>
    );
}

const containerStyle = {
    background: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    color: '#333',
    marginTop: '15px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '390px',
    margin: '20px auto 0 auto',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
};

const cellStyle = {
    padding: '6px 8px',
};