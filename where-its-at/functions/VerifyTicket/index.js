const { sendResponse } = require('../../responses/index');
const { db } = require('../../services/db');

async function getTicket(ticketId) {
    const { Item } = await db.get({
      TableName: 'tickets',
      Key: {
        ticketId: ticketId,
      },
    }).promise();

  return Item
}

async function verify(ticketId) {
    await db.update({
        TableName: 'tickets',
        Key: {
            ticketId: ticketId
        },
        UpdateExpression: 'SET verified = :nowVerified',
        ConditionExpression: 'verified = :notVerified',
        ExpressionAttributeValues: {
            ':nowVerified': true,
            ':notVerified': false
        }
    }).promise();
}

exports.handler = async (event, context) => {
    const { ticketId } = JSON.parse(event.body);

    try {
        const ticket = await getTicket(ticketId);

        if (!ticket) return sendResponse(500, { success: false, error: 'Ticket not found' });

        await verify(ticketId);

        return sendResponse(200, { success: true, message: 'Ticket verified!' });
    } catch (error) {
        console.log(error);
        if (error.code === 'ConditionalCheckFailedException') return sendResponse(403, { success: false, error: 'Ticket already verified' });
        return sendResponse(500, { success: false, error: 'Could not verify ticket' });
    }
}