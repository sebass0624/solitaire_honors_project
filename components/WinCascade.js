'use client';

//Imports required react hooks for effect
import {useEffect, useRef} from "react";

//Defines suit symbols and colors matching standard playing cards
const SUITS = [
  { symbol: '♠', color: '#111827' },
  { symbol: '♥', color: '#dc2626' },
  { symbol: '♣', color: '#111827' },
  { symbol: '♦', color: '#dc2626' },
];

//Defines card ranks in descending order
const RANKS = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];

//Renders classic Solitaire bouncing card effect upon game win
export default function WinCascade({isActive}) {
    //Refers to canvas element
    const canvasRef = useRef(null);

    useEffect(() => {
        //Ensures nothing happens if game hasn't been won yet
        if(!isActive) {
            return;
        }

        const canvas = canvasRef.current;
        if(!canvas) {
            return;
        }
        const ctx = canvas.getContext('2d'); 

        //Ensures canva dimensions stay within user browser window
        const resize = () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        //Builds 52 card launch queue in descending order
        const queue = [];
        for (const rank of RANKS) {
            for (let s = 0; s < SUITS.length; s++) {
                queue.push({rank, suit: SUITS[s], foundationIndex:s})
            }
        }

        //Controls card dimensions and movement properties
        const cardW = 80;
        const cardH = 112;
        const gravity = 0.65;
        let activeCard = null;
        let animationID;

        //Drags next card from the queue and gives it starting coordinates
        const spawnNextCard = () => {
            if (queue.length === 0) {
                return null;
            }
            const next = queue.shift();

            //Approximates the X position for each foundation pile
            const startX = Math.max(60, canvas.width - 420 + next.foundationIndex * 95);
            const startY = 80;

            //Randomly launches a card left or right across the screen
            const dir = Math.random() < 0.4 ? 1:-1;

            //Returns object
            return {
                ...next,
                x: startX,
                y: startY,
                vx: dir * (3 + Math.random() * 4.5), //Speeds up cards left to right
                vy: -(2 + Math.random() * 4),
            };
        };

        //Draws single card face onto canvas without clearing previous frames
        const drawCard = (c) => {
            ctx.fillStyle = '#ffffff',
            ctx.strokeStyle = '#1f2937',
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(c.x, c.y, cardW, cardH, 6);
            ctx.fill();
            ctx.stroke();

            //Controls top left of card (suit and symbol)
            ctx.fillStyle = c.suit.color;
            ctx.font = 'bold 17px sans-serif';
            ctx.textAlign = 'left',
            ctx.textBaseline = 'top',
            ctx.fillText(`${c.rank}${c.suit.symbol}`, c.x + 7, c.y + 7);

            //Controls center icon
            ctx.font = '34px sans-serif',
            ctx.textAlign = 'center',
            ctx.textBaseline = 'middle',
            ctx.fillText(c.suit.symbol, c.x + cardW/2, c.y + cardH/2+4);
        };

            //Launches first card off canvas
            activeCard = spawnNextCard();

            //Created animation loop
            const step = () => {
                //Launches card if previous one is gone
                if(!activeCard) {
                    activeCard = spawnNextCard();
                    if(!activeCard) {
                        return;
                    }
                }
            
            

                //Stamps card at current position
                drawCard(activeCard);
            

                //Updates position and movement property of card in motion
                activeCard.x += activeCard.vx;
                activeCard.y += activeCard.vy
                activeCard.vy += gravity;

                //Bounces off bottom of screen 
                if (activeCard.y + cardH >= canvas.height) {
                    activeCard.y = canvas.height - cardH;
                    activeCard.vy = -activeCard.vy * 0.82;
                    //Prevents card from crashing/glitching on screen
                    if (Math.abs(activeCard.vy) < 2) {
                        activeCard.vy = -6;
                    }
                }

                //Clear the current card in motion once it exits the screen/hits edge
                if (activeCard.x >= canvas.width || activeCard.x + cardW < 0) {
                    activeCard = null;
                }
                animationID = requestAnimationFrame(step);
            };

            //Starts animation
            animationID = requestAnimationFrame(step);

            //Stops animation when game unmounts/resets
            return () => {
                cancelAnimationFrame(animationID);
                window.removeEventListener('resize', resize);
            };
        }, [isActive]);

        //Deny modifying canvas if game is in progress
        if (!isActive) {
            return null;
        }

        //Return object
        return (
            <canvas 
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    inset: 0, 
                    pointerEvents: 'none',
                    zIndex: 999 
                }}
            />
    );
}