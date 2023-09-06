const { sendResponse } = require('../../responses/index');
const { db } = require('../../services/db');

async function getEvents() {
    const { Items } = await db.scan({
        TableName: 'events',
        ProjectionExpression: 'eventId, arena, artist, #d, price, #t',
        ExpressionAttributeNames: { '#d': 'date', '#t': 'time'}
    }).promise();

    return Items;
}


exports.handler = async (event, context) => {
    try {
        const events = await getEvents();

        return sendResponse(200, { success: true, events: events });
    } catch (error) {
        console.log(error);
        return sendResponse(500, { success: false, error: 'Could not get events' });
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           