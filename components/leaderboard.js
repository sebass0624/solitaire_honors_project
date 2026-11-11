'use client';

//Imports React
import {useState, useEffect} from 'react';

//Renders leaderboard table, refetching the table as refreshKey updates
export default function Leaderboard({refreshKey}) {
    //Local state that stores leaderboard entries
    const [scores, setScores] = useState([]);
    //Local state that manages asynchronous loading indicators
    const [loading, setLoading] = useState(true);
    //Local state for fetching proper error messages
    const [error, setError] = useState(null);

    //Asynchronously fetches all leaderboard data from Next.js API
    const fetchScores = async () => {
        //Sets loading state and clears all previous errors
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/games/leaderboard');
            if (!res.ok) {
                console.warn('Leaderboard API returned status:', res.status);
                setError('Failed to load leaderboard scores.')
                setScores([]);
                return;
            }
        //Parses JSON response payload and normalizes data structure
        const result = await res.json();
        const scoresArray = Array.isArray(result) ? result : (result.data || []);
        setScores(scoresArray);
            } 
        catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load leaderboard scores.');
            setScores([]);
        }
        finally {
            //Ensures loading state is set to false once the request is complete
            setLoading(false);
        }
    };

    //Refetches score once refreshKey changes
    useEffect(() =>  {
        fetchScores();
    }, [refreshKey]);

    //Returns container with leaderboard
    return (
        <div style={containerStyle}>
            <h3 style={{margin: '0 0 12px 0' }}> Top Leaderboard</h3>

            {/*Displays feedback message if error occurs*/}
            {loading && <p style={{fontSize: '0.875rem'}}> Loading scores...</p>}
            {error && <p style={{color: 'red', fontSize: '0.875rem'}}> {error} </p>}

            {/*Displays below when no scores are found to be displayed on leaderboard*/}
            {!loading && !error && scores.length === 0 && (
                <p style={{fontSize: '0.875rem'}}> No scores have been saved yet. </p>
            )}

            {/*Leaderboard displayed when data exists*/}
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
                            <td style={cellStyle}>{score.player_name || score.playerName || 'Anonymous'}</td>
                            <td style={cellStyle}>{score.moves}</td>
                            <td style={cellStyle}>{score.time_seconds ?? score.timeSeconds ?? 0}s</td>                                                        
                        </tr>
                     ))}
                </tbody>
             </table>
            )}
        </div>
    );
}

//Styling that centers leaderboard on the page
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

//Layout styling
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
};

//Table cell padding helper style
const cellStyle = {
    padding: '6px 8px',
};