const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const numberStore = [];

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAzMjMzLCJpYXQiOjE3NDM2MDI5MzMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImY2MDYzNDIwLTk3ZmMtNGE0OC1hNjdjLTJjMmQ0NzU2M2I1YyIsInN1YiI6Imdob3Noa2F1c2hpa2kyMDA0QGdtYWlsLmNvbSJ9LCJlbWFpbCI6Imdob3Noa2F1c2hpa2kyMDA0QGdtYWlsLmNvbSIsIm5hbWUiOiJrYXVzaGlraSBnaG9zaCIsInJvbGxObyI6IjIyMDU5ODgiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiJmNjA2MzQyMC05N2ZjLTRhNDgtYTY3Yy0yYzJkNDc1NjNiNWMiLCJjbGllbnRTZWNyZXQiOiJtUFV0ZVBrYllUTXNqWWZ0In0.wKEFwclqzCf1STkm4EwwW89mwH5DzCk1dgNCJMoJ9V8";

const API_ENDPOINTS = {
    p: "http://20.244.56.144/evaluation-service/primes",
    f: "http://20.244.56.144/evaluation-service/fibo",
    e: "http://20.244.56.144/evaluation-service/even",
    r: "http://20.244.56.144/evaluation-service/rand"
};

app.get("/numbers/:numberid", async (req, res) => {
    const { numberid } = req.params;
    if (!API_ENDPOINTS[numberid]) {
        return res.status(400).json({ error: "Invalid number ID" });
    }

    try {
        const response = await axios.get(API_ENDPOINTS[numberid], {
            headers: { "Authorization": `Bearer ${API_KEY}` },
            timeout: 2000
        });

        if (response.status === 401) {
            return res.status(401).json({ error: "Unauthorized - Invalid API key" });
        }

        if (!response.data || !Array.isArray(response.data.numbers)) {
            return res.status(500).json({ error: "Invalid API response" });
        }

        const newNumbers = response.data.numbers.filter(n => !numberStore.includes(n));

        if (numberStore.length + newNumbers.length > WINDOW_SIZE) {
            numberStore.splice(0, (numberStore.length + newNumbers.length) - WINDOW_SIZE);
        }

        numberStore.push(...newNumbers);

        const avg = numberStore.length > 0
            ? (numberStore.reduce((sum, num) => sum + num, 0) / numberStore.length).toFixed(2)
            : 0;

        res.json({
            windowPrevState: numberStore.slice(0, -newNumbers.length),
            windowCurrState: [...numberStore],
            numbers: newNumbers,
            avg: parseFloat(avg)
        });

    } catch (error) {
        console.error("Error fetching numbers:", error.message);
        if (error.response && error.response.status === 401) {
            return res.status(401).json({ error: "Unauthorized - Check API Key" });
        }
        return res.status(500).json({ error: "Failed to fetch numbers from API" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});