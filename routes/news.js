const express = require('express');
const axios = require('axios');
const scraper = require('../utils/scraper');
const config = require('../config/config');
const router = express.Router();

// Middleware to check API Key in the request header
router.use((req, res, next) => {
    const apiKey = req.header('Authorization');
    if (apiKey !== `Bearer ${config.API_KEY}`) {
        return res.status(401).json({ status: 'error', message: 'Invalid API Key' });
    }
    next();
});

// Endpoint to get the latest news
router.get('/', async (req, res) => {
    try {
        const latestNews = await scraper.fetchLatestNews();
        res.json({ status: 'success', data: latestNews });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Endpoint to get a specific news article by ID
router.get('/:id', async (req, res) => {
    const newsId = req.params.id;
    const newsUrl = `${config.NEWS_URL}${newsId}`;
    try {
        const { data } = await axios.get(newsUrl);
        const $ = cheerio.load(data);
        const newsTitle = $('meta[property="og:title"]').attr('content') || 'Untitled News';
        const newsContent = $('meta[property="og:description"]').attr('content') || 'No content available.';
        let newsImage = $('meta[property="og:image"]').attr('content') || null;

        res.json({
            status: 'success',
            data: {
                id: newsId,
                title: newsTitle,
                content: `${newsContent} - ${config.COPYRIGHT_TEXT}`,
                image: newsImage,
                url: newsUrl,
            },
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
