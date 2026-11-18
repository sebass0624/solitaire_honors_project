'use strict';
import React from 'react';

// Maps numerical ranks to card letters
const RANK_MAP = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
// Maps suit names and symbols reliably
const SUIT_SYMBOLS = {
  hearts: '♥', HEARTS: '♥', '♥': '♥',
  diamonds: '♦', DIAMONDS: '♦', '♦': '♦',
  clubs: '♣', CLUBS: '♣', '♣': '♣',
  spades: '♠', SPADES: '♠', '♠': '♠'
};

// Function component that accepts a card object and renders empty, face-down, or face-up designs
export default function Card({ card, onClick, isSelected = false }) {
  // Renders empty card slot if card object is null
  if (!card) {
    return (
      <div 
        className="card empty-slot" 
        style={{ width: '80px', height: '116px', borderRadius: '8px', border: '1.5px dashed rgba(255,255,255,0.3)' }} 
      />
    );
  }

  // Renders face-down card and retains click handler stock flip events
  if (!card.faceUp) {
    return (
      <div 
        onClick={onClick}
        className={`card card-back ${isSelected ? 'selected' : ''}`}
        style={{
          width: '80px',
          height: '116px',
          borderRadius: '8px',
          border: '2px solid #000',
          background: 'repeating-linear-gradient(45deg, #0033cc, #0033cc 10px, #002299 10px, #002299 20px)',
          boxShadow: isSelected ? '0 0 10px 3px #ffeb3b' : '1px 2px 4px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          boxSizing: 'border-box'
        }}
      />
    );
  }

  // Normalizes suit string to be consistent with deck.js
  const rawSuit = card.suit || card.suitType || '';
  const suitSymbol = SUIT_SYMBOLS[rawSuit] || rawSuit;

  // Constant that converts numerical rank to the numbers using RANK_MAP
  const rankLabel = RANK_MAP[card.rank] || card.rank || card.value || '?';

  // Determines color based off suit
  const isRed = rawSuit === 'HEARTS' || rawSuit === 'DIAMONDS' || rawSuit === 'hearts' || rawSuit === 'diamonds' || rawSuit === '♥' || rawSuit === '♦';
  const cardColor = isRed ? '#d32f2f' : '#111111';

  // Renders face-up card with correct color/suit characteristics to the screen
  return (
    <div 
      onClick={onClick}
      className={`card card-front ${isSelected ? 'selected' : ''}`}
      style={{
        width: '80px',
        height: '116px',
        borderRadius: '8px',
        border: '1.5px solid #222',
        backgroundColor: '#ffffff',
        color: cardColor,
        boxShadow: isSelected ? '0 0 10px 3px #ffeb3b' : '1px 2px 4px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        position: 'relative',
        userSelect: 'none',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* 1. TOP-LEFT CORNER (Rank + Suit) */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '6px',
        zIndex: 10,
        color: cardColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.0'
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: cardColor }}>{rankLabel}</span>
        <span style={{ fontSize: '0.9rem', color: cardColor }}>{suitSymbol}</span>
      </div>

      {/* 2. CENTER ICON */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '1.8rem',
        lineHeight: '1',
        color: cardColor,
        zIndex: 5
      }}>
        {suitSymbol}
      </div>

      {/* 3. BOTTOM-RIGHT CORNER (Rotated 180deg) */}
      <div style={{
        position: 'absolute',
        bottom: '4px',
        right: '6px',
        zIndex: 10,
        color: cardColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: '1.0',
        transform: 'rotate(180deg)'
      }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: cardColor }}>{rankLabel}</span>
        <span style={{ fontSize: '0.9rem', color: cardColor }}>{suitSymbol}</span>
      </div>
    </div>
  );
}