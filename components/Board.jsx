//Imports react and necessary attributes from other code files
import React from 'react';
import Pile from './Pile';
import TableauColumn from './TableauColumn';

// Creates function that accepts the game state as an object and allows for user click interaction
export default function Board({ gameState, onStockClick, onCardClick, selectedCard }) {
    // Displays loading screen if game hasn't been initialized yet
    if (!gameState) {
        return <div className="game-board-loading">Game is loading...</div>;
    }

    //Destructures board section from game state
    const {stock = [], waste = [], foundation = {}, tableau = []} = gameState;

    //Helper variables to extract the top-most cards from waste and foundation click handlers
    const topWasteCard = waste.length > 0 ? waste[waste.length - 1]: null;
    const isWasteSelected = selectedCard?.source === 'waste';

    //Returns rendered board with proper section setup
    return (
        <div className="solitaire-board">
            {/*Top row, containing stock, waste, and 4 foundation piles*/}
            <div className="top-row">
                <div className="stock-waste-group">
                    {/*Pass onStockClick to the Stock's pile prop*/}
                    <Pile cards={stock} onClick={onStockClick} />
                    {/*Waste Pile*/}
                    <Pile 
                        cards={waste}
                        onClick={() => onCardClick(topWasteCard, 'waste')}
                        isSelected={isWasteSelected} 
                    />
                </div>

                {/* Foundation piles grouping (all 4 suits) */}
                <div className="foundation-group">
                    {Object.keys(foundation).map((suit) => {
                        const pileCards = foundation[suit] || [];
                        const topFoundationCard = pileCards.length > 0 ? pileCards[pileCards.length - 1] : null;
                        const isFoundationSelected = selectedCard?.source === 'foundation' && selectedCard?.suit === suit;

                        return (
                            <Pile 
                                key={`foundation-${suit}`} 
                                cards={pileCards}
                                onClick={() => onCardClick(topFoundationCard, 'foundation', suit)}
                                isSelected={isFoundationSelected} 
                            />
                        );
                    })}
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