import React from 'react';
import Pile from './Pile';
import TableauColumn from './TableauColumn';

//Creates function that accepts the game state as an object
export default function Board({gameState}) {
    //Displays loading screen if game hasn't been initalized yet
    if(!gameState) {
        return <div className="game-board-loading">Game is loading...</div>;
    }

    //Extracts every single seperate board section to be used on the board
    const stock = gameState.stock;
    const waste = gameState.waste;
    const foundation = gameState.foundation;
    const tableau = gameState.tableau;

//Returns the board grid
return(
    <div className="solitaire-board">
        {/* Top row, which contains stock, waste, and 4 foundation piles */}
        <div className="top-row">
            <div className="stock-waste-group">
                {/*Pass onStockClick to the Stock's pile prop*/}
                <Pile cards = {stock} onClick={onStockClick}/>
                <Pile cards = {waste} />
            </div>
            {/* Foundation piles grouping (all 4) */}
            <div className="foundation-group">
                {foundation.map((foundationPile, index) => (
                    <Pile key={`foundation-${index}`} cards={foundationPile} />
                ))}
        </div>        
    </div>
    
    {/* Bottom Row: Tableau columns grouping (all 7) */}
    <div className="tableau-row">
        {tableau.map((columnCards, index) => ( 
            <TableauColumn
                key = {`tableau-${index}`}
                cards = {columnCards}
                colIndex = {index}
                />
        ))}
        </div>
    </div>
);
}
