'use client';
//Imports React
import {useState} from 'react';

//Renders win screen when player places all 52 cards into foundation pile correctly
export default function WinScreen({moves, timeSeconds, isOpen, onSubmitSuccess}) {
    //Tracks input for player name
    const [playerName, setPlayerName] = useState('');
    //Handles loading state of asynchronous API 
    const [isSubmitting, setIsSubmitting] = useState(false);
    //Handles state for stored submission validation/other server error messages 
    const [errorMsg, setErrorMsg] = useState('');

    //Hides win functionality if game is not won
    if(!isOpen) return null;

    //Handles form submission that saves player score to database/leaderboard
    const handleSubmit = async (e) => {
        //Prevents refresh
        e.preventDefault();
        //Validates player name field isn't blank
        if (!playerName.trim()) {
            setErrorMsg('Please enter your name.');
            return;
        }

    //Sets submission loading state and clears prior error messages
    setIsSubmitting(true);
    setErrorMsg('');

    try {
        //Sends POST request containing API data to next.js
        const res = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                player_name: playerName.trim(), //Modified player name
                moves: moves, //Displays total moves made in won game
                time_seconds: timeSeconds, //Displays total time elapsed in won gamea
            }),
        });
        
        //Throws error if server responds with not-200 HTTP status
        if(!res.ok) throw new Error('Failed to save score');

        //Clears input field and hides leaderbaord once leaderboard insertion is successful
        setPlayerName('');
        onSubmitSuccess(); 
    }
    

    catch (err) {
        //Logs the error to console and notifies user
        console.error(err);
        setErrorMsg('Failed to save score, please try again.');
    }

    finally {
        //Resets submission flag regardless of outcome
        setIsSubmitting(false);
    }
  };

//Displays overlay backdrop upon won game
return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2> You Won! </h2>
        <p>Moves: <strong>{moves}</strong> | Time: <strong>{timeSeconds}s</strong></p>
        
        {/* Score submission form*/}
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
          {/*Displays validation/error text*/}
          {errorMsg && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errorMsg}</p>}
          
          {/*Submission button that displays dynamic state*/}
          <button type="submit" disabled={isSubmitting} style={buttonStyle}>
            {isSubmitting ? 'Saving...' : 'Submit Score'}
          </button>
        </form>
      </div>
    </div>
 );
}

//Modified styling that darkens background when win screen is on display
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

//Box container styling for the win box
const modalStyle = {
    background: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    textAlign: 'center',
    minWidth: '300px',
    color: '#333',
};

//Styling for the input field
const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '12px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
};

//Styling for the submission button
const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: 'green',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};