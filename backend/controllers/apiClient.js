const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const Client = require('android-sms-gateway').default; // Import Client as default export
const History = require('../models/History'); // Import the History model

const httpFetchClient = {
    get: async (url, headers) => {
        const response = await fetch(url, { method: "GET", headers });
        return response.json();
    },
    post: async (url, body, headers) => {
        const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
        return response.json();
    },
    delete: async (url, headers) => {
        const response = await fetch(url, { method: "DELETE", headers });
        return response.json();
    }
};

module.exports = () => {
    const apiClient = new Client(
        process.env.SMS_GATEWAY_LOGIN,
        process.env.SMS_GATEWAY_PASSWORD,
        httpFetchClient
    );

    const apiRouter = express.Router();

    // Send bulk SMS
    apiRouter.post('/send-sms', async (req, res) => {
        const { phoneNumbers, message, createdBy } = req.body;

        // Validate input
        if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
            return res.status(400).json({ error: 'Phone numbers must be a non-empty array' });
        }
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
        }
        if (!createdBy || typeof createdBy !== 'string' || createdBy.trim() === '') {
            return res.status(400).json({ error: 'Created by field is required and must be a non-empty string' });
        }

        try {
            const smsData = {
                phoneNumbers: phoneNumbers.map(num => num.trim()),
                message: message.trim(),
                simNumber: Number(process.env.SIM_NUMBER)
            };

            const result = await apiClient.send(smsData);
            
            const messageId = result.id;
            
            const historyRecord = new History({
                phoneNumbers: smsData.phoneNumbers,
                message: smsData.message,
                messageId: messageId || null, // Store the messageId if available
                createdBy: createdBy.trim(),
                status: 'Pending' // Default status
            });

            await historyRecord.save();

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.error('Error sending SMS:', error);

            const historyRecord = new History({
                phoneNumbers: phoneNumbers.map(num => num.trim()),
                message: message.trim(),
                createdBy: createdBy.trim(),
                status: 'Failed',
                error: error.message || 'Unknown error'
            });

            await historyRecord.save();

            res.status(500).json({ error: 'Failed to send SMS', details: error.message });
        }
    });

    // Get message status
    apiRouter.get('/message-status/:messageId', async (req, res) => {
        const { messageId } = req.params;

        if (!messageId) {
            return res.status(400).json({ error: 'Message ID is required' });
        }

        try {
            // Fetch the message status from the SMS gateway
            const result = await apiClient.getState(messageId);

            // Update the corresponding record in the History collection
            const historyRecord = await History.findOneAndUpdate(
                { messageId: messageId },
                { status: result.status }, // Update the status based on the result
                { new: true } // Return the updated record
            );

            if (!historyRecord) {
                return res.status(404).json({ error: 'No history record found for the given message ID' });
            }

            res.status(200).json({ success: true, data: historyRecord });
        } catch (error) {
            console.error('Error fetching message status:', error);
            res.status(500).json({ error: 'Failed to fetch message status', details: error.message });
        }
    });

    // Get message status
    // apiRouter.get('/message-status/:messageId', async (req, res) => {
    //     const { messageId } = req.params;

    //     if (!messageId) {
    //         return res.status(400).json({ error: 'Message ID is required' });
    //     }

    //     try {
    //         const result = await apiClient.getState(messageId);
    //         res.status(200).json({ success: true, data: result });
    //     } catch (error) {
    //         console.error('Error fetching message status:', error);
    //         res.status(500).json({ error: 'Failed to fetch message status', details: error.message });
    //     }
    // });

    return apiRouter;
};