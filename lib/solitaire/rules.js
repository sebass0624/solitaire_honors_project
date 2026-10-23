//Creates function for when drawing from the stock pile into the wastepile
export function drawFromStock(state) {
    //Checks if stock is empty and returns state unchanged
    if (!state.stock || state.stock.length === 0) {
        return state; }

    //Makes copies of stock and waste piles to prevent overwriting
    const newStock = [...state.stock];
    const newWaste = [...state.waste];

    //Draws top card from the stock pile
    const card = newStock.pop();
    //Flips the card up and adds to waste when not used
    card.faceUp = true;
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