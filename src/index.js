const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

console.log("UUID module loaded successfully:", uuidv4);


const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);

        if (!body.clientName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields: clientName" }),
            };
        }

        const tenantId = uuidv4();
        const params = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                tenantId,
                "resourceType#resourceId": `client#${tenantId}`,
                clientName: body.clientName,
                clientPhone: body.clientPhone,
                createdAt: new Date().toISOString()
            }
        });

        console.log("DynamoDB Client:", dynamoDB); //  Debug log before calling send()
        console.log("Saving to DynamoDB:", params); //  Debug log before saving

        const response = await dynamoDB.send(params); //  Mocked in Jest tests
        console.log("DynamoDB Response:", response); //  Debug log after saving

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Client onboarded successfully", tenantId }),
        };
    } catch (error) {
        console.error("Lambda Error:", error.message); //  Debugging unexpected errors
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
        };
    }
};

module.exports = { handler };
