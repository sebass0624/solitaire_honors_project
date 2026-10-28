import React from 'react';
import Card from './Card';

//Creates function that receives array of cards and allows user to click
export default function Pile({cards = [], onClick}) {
    //Grabs top card from the pile (last in the array)
    const topCard = cards.length > 0 ? cards[cards.length - 1]:null;
    //Created variable to hold the card (JSX)
    let content;
    //Checks if the selected card is the top one and renders it if so
    if(topCard) {
        content = <Card card={topCard} />;
    }
    //If not the top card, empty slot is rendered
    else {
        content = <div className="card empty-slot" />;
    }

    //Returns the pile content rendered to screen
    return (
        <div className="pile" onClick={onClick}>
            {content}
        </div>
    );
}