import React from 'react';
import Card from './Card';

//Creates function that accepts the array of cards for this column and its column index
export default function TableauColumn({cards = [], colIndex}) {
    //Renders an empty card slot if the column has 0 cards
    if(cards.length === 0) {
        return(
            <div className="tableau-column empty-slot" />
        );
    }
    
    //If more than zero cards, this return statement renders the tableau container
    return(
        <div className="tableau-column">
            {cards.map((card, cardIndex) => (
                //Outer div wrapper that mulitiplies each successive card's position by 30 px
                //to create waterfall effect for cards
                <div 
                    key={`${card.suit}-${card.rank}-${cardIndex}`}
                    className="tableau-card-wrapper"
                    style={{top: `${cardIndex * 30}px` }}
                >

                    <Card card={card} /> 
        </div>
            ))}
            </div>
    );
}