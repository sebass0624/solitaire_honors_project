//Creates function for when drawing from the stock pile into the waste pile
export function drawFromStock(state) {
    const stock = state.stock || [];
    const waste = state.waste || [];

    //Case 1: Draws card from stock to waste
    if (stock.length > 0) {
        const topCard = stock[stock.length - 1];
        const updatedCard = {...topCard, faceUp: true};
    

    return {
        ...state,
        stock: stock.slice(0, -1),
        waste: [...waste, updatedCard],
        moves: (state.moves || 0) + 1
        };
    }

    //Case 2: If stock is empty, cards are recycled from waste back to stock
    if (waste.length > 0) {
        //Reverses waste cards so they maintain original order
        const recycledStock = waste
            .slice()
            .reverse()
            .map((card) => ({...card, faceUp: false}));
    
    return {
        ...state,
        stock: recycledStock,
        waste: [],
        moves: (state.moves || 0) + 1
     };
    }

    return state;
}

//Creates function for when no cards are left in stock pile and to flip back to the beginning of the pile (recycling)
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
        moves: (state.moves || 0) + 1
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

    const currentPile = foundationPile || [];

    //Ensures that if the current foundation pile has no cards, only an Ace can be placed down
    if (currentPile.length === 0) {
        return card.rank === 1; 
    }
    //Otherwise, it is ensured that the foundation card and top card's suit is identical/in ascending order
    else {
        const topCard = currentPile[currentPile.length - 1];
        return card.suit === topCard.suit && card.rank === topCard.rank + 1;
    }
}

//Creates function that defines the rules for cards that can be moved to the tableau
export function canMoveToTableau(movingCards, targetColumn) {
    //Checks if there are moving cards available/more than 1
    if (!movingCards || movingCards.length === 0) {
        return false; 
    }
    
    const leadCard = movingCards[0];
    const column = targetColumn || [];

    //If no cards present, only placeable card down is King
    if (column.length === 0) {
        return leadCard.rank === 13;
    }

    //Pulls last card from deck
    const topCard = column[column.length - 1];
    //Ensures that the cards are in opposite color (8 RED 7 BLACK 6 RED, etc)
    const isOppositeColor = leadCard.color !== topCard.color;
    //Ensures that the cards can be placed in the tableau ONLY in descending order
    const isOneRankLower = leadCard.rank === topCard.rank - 1;
    //Returns values of above variables as true
    return isOppositeColor && isOneRankLower;
}

//Creates function that can move cards to the foundation
export function moveToFoundation(state, source, sourceColIndex, foundationIndex) {
    //Handles foundationIndex passed as suit name or numeric index
    const key = typeof foundationIndex === 'number'
    ?Object.keys(state.foundation)[foundationIndex]
    :foundationIndex;

    //Creates variable for movable card
    let cardToMove;
    //Detects whether or not the card in question is from waste/tableau pile and removes the top card from it
    if (source === 'waste') {
        cardToMove = state.waste[state.waste.length - 1]; 
    } else if (source === 'tableau') {
        const sourceColumn = state.tableau[sourceColIndex];
        if (sourceColumn && sourceColumn.length > 0) {
            cardToMove = sourceColumn[sourceColumn.length - 1];
        } 
    }
    
    //Creates variable for the target pile and determines if card follows foundation rules
    const targetPile = state.foundation[key] || [];
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
                    {...topCard, faceUp: true}
                ];
            }
        }

        //Adds updated state and updates column
        newTableau = [...state.tableau];
        newTableau[sourceColIndex] = updatedColumn;
    }

    //Adds new card to foundation pile and returns state
    const newFoundation = {
        ...state.foundation,
        [key]: [...targetPile, cardToMove]
    };

    const nextState = {
        ...state,
        waste: newWaste,
        tableau: newTableau,
        foundation: newFoundation,
        moves: (state.moves || 0) + 1
    };

    nextState.isWon = checkWinCondition(nextState);
    return nextState;
}

//Creates function in charge of moving card/stack of cards from one tableau to another
export function moveToTableau(state, sourceColIndex, cardIndex, targetColIndex) {
    const sourceCol = state.tableau[sourceColIndex];
    const targetCol = state.tableau[targetColIndex];
    if(!sourceCol || !targetCol) {
        return state;
    } 

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
                {...topCard, faceUp: true}
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
        tableau: newTableau,
        moves: (state.moves || 0) + 1
    };
}

//Creates function in charge of moving cards from waste pile to tableau
export function moveWasteToTableau(state, targetColIndex) {
    //Makes sure at least a single card is present in the waste pile
    if(!state.waste || state.waste.length === 0) {
        return state;
    }
    
    //Grabs top card from waste and target column from tableau
    const cardToMove = state.waste[state.waste.length - 1];
    const targetCol = state.tableau[targetColIndex];

    //Verifies that tableau moving rules are followed
    if (!canMoveToTableau([cardToMove], targetCol)) {
        return state;
    }

    //Removes top card from the waste pile and adds card to the chosen tableau column
    const newWaste = state.waste.slice(0, -1);
    const updatedTargetCol = [...targetCol, cardToMove];

    //Creates new copy of the tableau array and updates the amount of cards in target column
    const newTableau = [...state.tableau];
    newTableau[targetColIndex] = updatedTargetCol;

    //Returns updated state object
    return {
        ...state,
        waste: newWaste,
        tableau: newTableau,
        moves: (state.moves || 0) + 1
    };
}

//Function used to move card from any of the foundation piles to any tableau column
export function moveFoundationToTableau (state, foundationIndex, targetColIndex) {
    const key = typeof foundationIndex === 'number'
        ? Object.keys(state.foundation)[foundationIndex]
        :foundationIndex;
    //Targets specific foundation pile
    const foundationPile = state.foundation[key];
    //Verifies that there are available cards to be used in the foundation piles
    if(!foundationPile || foundationPile.length === 0) {
        return state;
    }

    //Grabs top card from chosen foundation pile and chooses the target tableau column
    const cardToMove = foundationPile[foundationPile.length - 1];
    const targetCol = state.tableau[targetColIndex];

    //Valides that tableau rules are being followed
    if(!canMoveToTableau([cardToMove], targetCol)) {
        return state;
    }

    //Takes top card from foundation pile and sends it to the tableau target column
    const newFoundationPile = foundationPile.slice(0, -1);
    const updatedTargetCol = [...targetCol, cardToMove];

    //Creates new copy of the whole foundation
    const newFoundation = {
        ...state.foundation,
        [key]: newFoundationPile
    };

    //Swaps the two piles correctly
    const newTableau = [...state.tableau];
    newTableau[targetColIndex] = updatedTargetCol;

    //Returns new state object 
    return {
        ...state,
        foundation: newFoundation,
        tableau: newTableau,
        moves: (state.moves || 0) + 1
    };
}

//Function that checks whether or not every foundation pile has 13 cards (resulting in a win)
export function checkWinCondition(state) {
    //Ensures that foundation has more than 0 cards
    if(!state.foundation || Object.keys(state.foundation).length === 0) {
        return false;
    }

    //Converts foundation object into array of piles
    const piles = Array.isArray(state.foundation)
        ?state.foundation
        :Object.values(state.foundation);
    
    //Ensures legth of pile isn't 0
    if (piles.length === 0) {
        return false;
    }

    //Checks if each foundation pile has 13 cards
    return piles.every(pile => pile && pile.length === 13);
}