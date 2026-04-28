const express = require('express')
const fetch = require('node-fetch');
const app = express();

// CORS

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET')
    next();
})

// Test route

app.get('/', (req, res) => {
    res.json({ message: 'Github Profile API is running!' });
});

// Main endpoint /api/github/:username
app.get('/api/github/:username', async (req, res) => {
    const username = req.params.username;

    try {
        // Fetch User Profile
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) {
            return res.status(userRes.status).json({ error: `GitHub user not found (${userRes.status})` })
        }
        const user = await userRes.json();

        // Fetch repositories (5 most recent by updated date)
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=5&sort=updated`);
        const repos = reposRes.ok ? await reposRes.json() : [];

        // Fetch gists (5 most recent)
        const gistsRes = await fetch(`https://api.github.com/users/${username}/gists?per_page=5`);
        const gists = gistsRes.ok ? await gistsRes.json() : [];

        //  Send combined response

        res.json({
            profile: user,
            repos: repos,
            gists: gists
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})