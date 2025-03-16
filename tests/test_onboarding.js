const { handler } = require("../src/index");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// ✅ Properly Mock AWS SDK v3
jest.mock("@aws-sdk/lib-dynamodb", () => {
    const mockSend = jest.fn(); // ✅ Move mockSend inside the Jest mock

    return {
        DynamoDBDocumentClient: {
            from: jest.fn(() => ({
                send: mockSend, // ✅ Ensures send() is correctly defined
            })),
        },
        PutCommand: jest.fn(),
    };
});

describe("Onboarding Lambda Function", () => {
    let mockSend;

    beforeEach(() => {
        jest.clearAllMocks();

        // ✅ Assign `mockSend` from the Jest mock
        mockSend = DynamoDBDocumentClient.from().send;
        mockSend.mockResolvedValue({}); // ✅ Ensure it returns success
    });

    it("should successfully onboard a new client", async () => {
        const event = {
            body: JSON.stringify({
                clientName: "Acme Corp",
                clientPhone: "+1234567890",
            }),
        };

        const response = await handler(event);

        console.log("===================="); // ✅ Debug log
        console.log("Mocked Response:", response); // ✅ Debug log

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.message).toBe("Client onboarded successfully");
        expect(body.tenantId).toBeDefined();
        expect(mockSend).toHaveBeenCalled();
    });

    it("should return a 400 error if clientName is missing", async () => {
        const event = {
            body: JSON.stringify({
                clientPhone: "+1234567890",
            }),
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.message).toBe("Missing required fields: clientName");
    });

    it("should return a 500 error on database failure", async () => {
        // ✅ Mock a database error
        mockSend.mockRejectedValueOnce(new Error("DB error"));

        const event = {
            body: JSON.stringify({
                clientName: "Acme Corp",
                clientPhone: "+1234567890",
            }),
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(500);
        const body = JSON.parse(response.body);
        expect(body.message).toBe("Internal Server Error");
    });
});
