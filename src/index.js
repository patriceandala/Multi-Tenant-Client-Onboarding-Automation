const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const tenantId = uuidv4();

        const params = {
            TableName: TABLE_NAME,
            Item: {
                tenantId: tenantId,
                "resourceType#resourceId": "client#" + tenantId,
                clientName: body.clientName,
                clientPhone: body.clientPhone,
                createdAt: new Date().toISOString()
            }
        };

        await dynamoDB.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Client onboarded successfully", tenantId }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error }),
        };
    }
};
