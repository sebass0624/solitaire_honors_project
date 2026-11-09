import React from 'react';
import Card from './Card';

//Function responsible for rendering individual column in tableau area and handles rendering both empty drops/vertical stacking of cards
export default function TableauColumn({cards = [], colIndex, onCardClick, selectedCard}) {
    //Renders an empty card slot if the column doesn't exist
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
    
    //If more than zero cards, this return statement renders the tableau container with overlapping cards
    return(
        <div className="tableau-column">
            {cards.map((card, cardIndex) => {
                //Checks if card matches the active selection using unique card ID
                let isSelected = false;
                if(selectedCard && selectedCard.card) {
                    isSelected = selectedCard.card.id === card.id || selectedCard.card === card;
                } 

                //Handle click event when tableau card within specified column is accessed
                const handleCardClickInTableau = () => {
                    if (onCardClick) {
                        onCardClick(card, 'tableau', colIndex, cardIndex);
                    }
                };
                //Returns rendered tableau column with proper vertical card offset
                return (
                    <div 
                        key={`col-${colIndex}-card-${cardIndex}`} 
                        className="tableau-card-wrapper"
                        style={{top: `${cardIndex * 25}px`}}
                    >
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