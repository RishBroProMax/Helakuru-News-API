const express = require('express');
const newsRoutes = require('./routes/newsRoutes');
const configRoutes = require('./routes/configRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/config', configRoutes);

// Show API documentation and showcase
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

app.listen(PORT, () => {
    console.log(`🌐 Helakuru News API is running on http://localhost:${PORT}`);
    console.log('📚 Visit the documentation at the root URL');
});

module.exports = app;
