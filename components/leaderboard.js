'use client';

import {useState, useEffect} from 'react';

export default function({refreshKey}) {
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
            console.err(err);
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

const ContainerStyle = {
    
}