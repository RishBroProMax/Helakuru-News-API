const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config/config');

async function fetchLatestNews() {
    console.log('🔍 Fetching the latest news...');
    const newsData = [];

    let lastNewsId = 106268; // You can store this in a database to persist across restarts
    let sentNews = new Set();

    for (let newsId = lastNewsId + 1; newsId <= lastNewsId + 10; newsId++) {
        if (sentNews.has(newsId.toString())) continue;

        const newsUrl = `${config.NEWS_URL}${newsId}`;
        try {
            const { data } = await axios.get(newsUrl);
            const $ = cheerio.load(data);
            const newsTitle = $('meta[property="og:title"]').attr('content') || 'Untitled News';
            const newsContent = $('meta[property="og:description"]').attr('content') || 'No content available.';
            let newsImage = $('meta[property="og:image"]').attr('content') || null;

            if (!newsTitle || !newsContent) {
                console.log(`⚠️ Skipping invalid news ID: ${newsId}`);
                continue;
            }

            lastNewsId = newsId;
            sentNews.add(newsId.toString());

            newsData.push({
                id: newsId,
                title: newsTitle,
                content: `${newsContent} - ${config.COPYRIGHT_TEXT}`,
                image: newsImage,
                url: newsUrl,
            });
        } catch (error) {
            console.log(`⚠️ Error fetching news ID ${newsId}:`, error.message);
        }
    }

    return newsData;
}

module.exports = {
    fetchLatestNews,
};
