
const db = require('../config/db');


function checkStockAvailability(items, callback) {

    if (!items || !Array.isArray(items) || items.length === 0) {
        return callback(new Error('Items array is required'), null);
    }
    
    const unavailableItems = [];
    let checkedCount = 0;
    const totalChecks = items.length;
    

    if (totalChecks === 0) {
        return callback(null, { success: true, message: 'All items are available for purchase', unavailable: [] });
    }
    

    function onCheckComplete() {
        checkedCount++;
        

        if (checkedCount === totalChecks) {
            if (unavailableItems.length > 0) {
                return callback(null, {
                    success: false,
                    message: 'Some items are no longer available',
                    unavailable: unavailableItems
                });
            } else {
                return callback(null, { 
                    success: true, 
                    message: 'All items are available for purchase',
                    unavailable: []
                });
            }
        }
    }
    
    items.forEach(function(item) {
        const gameId = item.game_id;
        const requestedQuantity = item.quantity || 1;
        

        if (!gameId) {
            onCheckComplete();
            return;
        }
        
        const countQuery = 'SELECT COUNT(*) as available FROM game_keys WHERE game_id = ? AND status = \'available\'';
        
        db.query(countQuery, [gameId], function(countErr, countResult) {
            if (countErr) {
                console.error('Errore nel controllo stock per game_id', gameId, countErr);
                unavailableItems.push({
                    game_id: gameId,
                    reason: 'Unable to verify availability'
                });
                onCheckComplete();
                return;
            }
            
            const availableKeys = countResult[0].available;
        
            if (availableKeys < requestedQuantity) {
                db.query('SELECT title FROM games WHERE id = ?', [gameId], function(titleErr, titleResult) {
                    let gameTitle = `Product #${gameId}`;
                    
                    if (!titleErr && titleResult && titleResult[0] && titleResult[0].title) {
                        gameTitle = titleResult[0].title;
                    }
                    
                    unavailableItems.push({
                        game_id: gameId,
                        title: gameTitle,
                        requested: requestedQuantity,
                        available: availableKeys,
                        reason: availableKeys === 0 ? 'Out of stock' : 'Insufficient stock'
                    });
                    onCheckComplete();
                });
            } else {
                onCheckComplete();
            }
        });
    });
}

module.exports = {
    checkStockAvailability: checkStockAvailability
};