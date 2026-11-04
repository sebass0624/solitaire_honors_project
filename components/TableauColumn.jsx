import React from 'react';
import Card from './Card';

//Creates function that accepts the array of cards for this column and its column index
export default function TableauColumn({cards = [], colIndex, onCardClick, selectedCard}) {
    //Renders an empty card slot if the column has 0 cards
    if (cards.length === 0) {
        return (
            <div 
                className="tableau-column empty" 
                onClick={() => onCardClick && onCardClick(null, 'tableau', colIndex, 0)}
            >
                <div className="card empty-slot" />
            </div>
        );
    }
    
    //If more than zero cards, this return statement renders the tableau container
    return(
        <div className="tableau-column">
            {cards.map((card, cardIndex) => {
                //Checks if card matches the active selection
                let isSelected = false;
                if(selectedCard && selectedCard.card === card) {
                    isSelected = true;
                } 

                //Handle Click event when tableau card accessed
                const handleCardClickInTableau = () => {
                    if (onCardClick) {
                        onCardClick(card, 'tableau', colIndex, cardIndex);
                    }
                };
                return (
                    <div key = {`col-${colIndex}-card-${cardIndex}`} className = "tableau-card-wrapper">
                        <Card
                            card = {card}
                            isSelected = {isSelected}
                            onClick = {handleCardClickInTableau} 
                            />
                    </div>
                );
            })}
        </div>
    );
}