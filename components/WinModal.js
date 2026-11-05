'use client';
import {useState} from 'react';

export default function WinModal({moves, timeSeconds, isOpen, onSubmitSuccess}) {
    const [playerName, setPlayerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if(!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!playerName.trim()) {
            setErrorMsg('Please enter your name.');
            return;
        }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
        const res = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                player_name: playerName.trim(),
                moves: moves,
                time_seconds: timeSeconds,
            }),
        });
        
        if(!res.ok) throw new Error('Failed to save score');

        setPlayerName('');
        onSubmitSuccess(); 
    }
    
    catch (err) {
        console.error(err);
        setErrorMsg('Failed to save score, please try again.');
    }

    finally {
        setIsSubmitting(false);
    }
  };


return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2> You Won! </h2>
        <p>Moves: <strong>{moves}</strong> | Time: <strong>{timeSeconds}s</strong></p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            disabled={isSubmitting}
            maxLength={50}
            style={inputStyle}
          />
          {errorMsg && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errorMsg}</p>}
          
          <button type="submit" disabled={isSubmitting} style={buttonStyle}>
            {isSubmitting ? 'Saving...' : 'Submit Score'}
          </button>
        </form>
      </div>
    </div>
 );
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalStyle = {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    textAlign: 'center',
    minWidth: '300px',
    color: '#333',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '12px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
};

const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: 'green',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};