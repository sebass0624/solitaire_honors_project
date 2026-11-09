import React from 'react';
import Card from './Card';

//Creates function that is responsible for rendering single-style stacks
export default function Pile({cards = [], onClick, isSelected = false}) {
    //Grabs top card from the pile (last element in the array)
    const topCard = cards.length > 0 ? cards[cards.length - 1]:null;
    //Renders top card or empty drop slot container
    let content;
    //Checks if the selected card is the top one and renders it if so
    if(topCard) {
        content = <Card card={topCard} isSelected = {isSelected}/>;
    }
    //If not the top card, empty slot is rendered
    else {
        content = <div className="card empty-slot" />;
    }

    //Returns the pile content rendered to screen with click handler
    return (
        <div className="pile" onClick={onClick}>
            {content}
        </div>
    );
}