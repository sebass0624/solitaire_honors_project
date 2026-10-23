//Creates function for when drawing from the stock pile into the wastepile
export function drawFromStock(state) {
    //Checks if stock is empty and returns state unchanged
    if (!state.stock || state.stock.length === 0) {
        return state; }

    //Makes copies of stock and waste piles to prevent overwriting
    const newStock = [...state.stock];
    const newWaste = [...state.waste];

    //Draws top card from the stock pile
    const poppedCard = newStock.pop();
    //Flips the card up and adds to waste when not used
    const card = { ...poppedCard, faceUp: true };
    newWaste.push(card);

    //Returns new state
    return {
        ...state,
        stock: newStock, 
        waste: newWaste,
    };
}

//Creates function for when stock pile is completely gone through and to flip back to the beginning of the pile (recycling)
export function resetStock(state) {
    //Reverses the stock pile when no cards are left and there is at least one waste card
    if (state.stock.length === 0 && state.waste.length > 0) {
        const newStock = state.waste
        .map((card) => ({ ...card, faceUp: false }))
        .reverse();

    //Empties the waste pile
    const newWaste = [];

    //Returns new state
    return {
        ...state, 
        stock: newStock, 
        waste: newWaste,
            };
    }
    //Returns current state if these conditions aren't met
    return state; 
}

//Creates functions that defines the rules for cards that can be moved to the foundation
export function canMoveToFoundation(card, foundationPile) {
    //Ensures card is available for moving
    if(!card) {
        return false; 
    }
    //Ensures that if the current foundation pile has no cards, only an Ace can be placed down
    if (foundationPile.length === 0) {
        return card.rank === 1; 
    }
    //Otherwise, it is ensured that the foundation card and top card's suit is identical/in descending order
    else {
        const topCard = foundationPile[foundationPile.length - 1];
        return card.suit === topCard.suit && card.rank === topCard.rank + 1;
    }
}

//Creates function that defines the rules for cards that can be moved to the tableau
export function canMoveToTableau(movingCards, targetColumn) {
    //Checks if there are moving cards available/more than 1
    if (!movingCards || movingCards.length === 0) {
        return false; }
        const leadCard = movingCards[0];
    
    //If no cards present, only placeable card down is King
    if (targetColumn.length === 0) {
        return leadCard.rank === 13;
    }

    //Pulls last card from deck
    const topCard = targetColumn[targetColumn.length - 1];
    //Ensures that the cards are in opposite colo (8 RED 7 BLACK 6 RED, etc)
    const isOppositeColor = leadCard.color !== topCard.color;
    //Ensures that the cards can be placed in the tableau ONLY in descending order
    const isOneRankLower = leadCard.rank === topCard.rank - 1;
    //Returns values of above variables as true
    return isOppositeColor && isOneRankLower;
}

//Creates function that can move cards to the foundation
export function moveToFoundation(state, source, sourceColIndex, foundationIndex) {
    //Creates variable for movable card
    let cardToMove;
    //Detects whether or not the card in question is from waste/foundation pile and removes the top card from it
    if (source === 'waste') {
        cardToMove = state.waste[state.waste.length - 1]; 
    } else if (source === 'tableau') {
        const sourceColumn = state.tableau[sourceColIndex];
        cardToMove = sourceColumn[sourceColumn.length - 1]; 
    }
    
    //Creates variable for the target pile and determines if card follows foundation rules
    const targetPile = state.foundation[foundationIndex];
    if(!cardToMove || !canMoveToFoundation(cardToMove, targetPile)) {
        return state;
    }   

    //Sets variables and removes the card from source when rules are met and inserted into foundation via slice method
    let newWaste = state.waste;
    let newTableau = state.tableau;
    if(source === 'waste') {
        newWaste = state.waste.slice(0, -1);
    } else if (source === 'tableau') {
        const sourceColumn = state.tableau[sourceColIndex];
        let updatedColumn = sourceColumn.slice(0, -1);

        //Logic used to auto-flip top-most card as long as top card isn't already faced up
        if (updatedColumn.length > 0) {
            const lastIndex = updatedColumn.length - 1;
            const topCard = updatedColumn[lastIndex];

            if (!topCard.faceUp) {
                updatedColumn = [
                    ...updatedColumn.slice(0, -1),
                    { ...topCard, faceUp: true }
                ];
            }
        }

        //Adds updated state and updates column
        newTableau = [...state.tableau];
        newTableau[sourceColIndex] = updatedColumn;
    }

    //Adds new card to foundation pile and returns state
    const newFoundation = [...state.foundation];
    newFoundation[foundationIndex] = [...targetPile, cardToMove];
    return {
        ...state,
        waste: newWaste,
        tableau: newTableau,
        foundation: newFoundation,
    };
}

//Creates function in charge of moving card/stack of cards from one tableau to another
export function moveToTableau(state, sourceColIndex, cardIndex, targetColIndex) {
    const sourceCol = state.tableau[sourceColIndex];
    const targetCol = state.tableau[targetColIndex];

    //Grabs cards from cardIndex to the end
    const cardsToMove = sourceCol.slice(cardIndex);

    //Verifies that tableau moving rules are followed
    if (!canMoveToTableau(cardsToMove, targetCol)) {
        return state;
    }

    //Removes the moved card from source column
    let updatedSourceCol = sourceCol.slice(0, cardIndex);

    //Auto-filps newly exposed card
    if (updatedSourceCol.length > 0) {
        const lastIndex = updatedSourceCol.length - 1;
        const topCard = updatedSourceCol[lastIndex];

        if(!topCard.faceUp) {
            updatedSourceCol = [
                ...updatedSourceCol.slice(0, -1),
                { ...topCard, faceUp: true}
            ];
        }
    }

    //Attaches moved card to the target column
    const updatedTargetCol = [...targetCol, ...cardsToMove];

    //Updates the tableau copy and returns new state
    const newTableau = [...state.tableau];
    newTableau[sourceColIndex] = updatedSourceCol;
    newTableau[targetColIndex] = updatedTargetCol;

    return {
        ...state,
        tableau: newTableau
    };
}
