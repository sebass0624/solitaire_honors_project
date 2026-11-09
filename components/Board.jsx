import React from 'react';
import Pile from './Pile';
import TableauColumn from './TableauColumn';

// Creates function that accepts the game state as an object
export default function Board({ gameState, onStockClick, onCardClick, selectedCard }) {
    // Displays loading screen if game hasn't been initialized yet
    if (!gameState) {
        return <div className="game-board-loading">Game is loading...</div>;
    }

    // Extracts every single separate board section to be used on the board
    const stock = gameState.stock;
    const waste = gameState.waste;
    const foundation = gameState.foundation;
    const tableau = gameState.tableau;

    return (
        <div className="solitaire-board">
            {/* Top row, which contains stock, waste, and 4 foundation piles */}
            <div className="top-row">
                <div className="stock-waste-group">
                    {/* Pass onStockClick to the Stock's pile prop */}
                    <Pile cards={stock} onClick={onStockClick} />
                    <Pile 
                        cards={waste}
                        onCardClick={(card) => onCardClick(card, 'waste')}
                        selectedCard={selectedCard} 
                    />
                </div>

                {/* Foundation piles grouping (all 4 suits) */}
                <div className="foundation-group">
                    {Object.keys(foundation).map((suit) => (
                        <Pile 
                            key={`foundation-${suit}`} 
                            cards={foundation[suit]}
                            onCardClick={(card) => onCardClick(card, 'foundation', suit)}
                            selectedCard={selectedCard} 
                        />
                    ))}
                </div>
            </div>
        
            {/* Bottom Row: Tableau columns grouping (all 7) */}
            <div className="tableau-row">
                {tableau.map((columnCards, index) => ( 
                    <TableauColumn
                        key={`tableau-${index}`}
                        cards={columnCards}
                        colIndex={index}
                        onCardClick={onCardClick}
                        selectedCard={selectedCard}
                    />
                ))}
            </div>
        </div>
    );
}