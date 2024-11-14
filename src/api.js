// src/api.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/news/latest', async (req, res) => {
    try {
        const newsUrl = 'https://www.helakuru.lk/esana/news/latest';
        const { data } = await axios.get(newsUrl);
        const $ = cheerio.load(data);

        const newsTitle = $('meta[property="og:title"]').attr('content') || "Untitled News";
        const newsContent = $('meta[property="og:description"]').attr('content') || "No content available.";
        const newsImage = $('meta[property="og:image"]').attr('content') || "";

        res.status(200).json({
            title: newsTitle,
            content: newsContent,
            image: newsImage,
            url: newsUrl,
            timestamp: new Date()
        });

        logger.info("Latest news fetched and sent.");
    } catch (error) {
        logger.error('Error fetching news:', error);
        res.status(500).json({ error: "Failed to fetch news." });
    }
});

app.listen(PORT, () => {
    logger.info(`Helakuru News API is running on http://localhost:${PORT}`);
    logger.info(`⚡Powerd by RishBroProMax`);
});
