Average Calculator Microservice
Overview
This microservice calculates the average of numbers fetched from a third-party API, maintaining a sliding window of unique numbers. It supports four types of number sequences: prime, Fibonacci, even, and random numbers.

Features
Maintains a sliding window of numbers (default size: 10)

Filters duplicate numbers

Calculates average of the current window

Handles API errors and timeouts gracefully

Provides previous and current window states in responses

API Endpoints
GET /numbers/{numberid}
Fetches numbers of the specified type and updates the window.

Path Parameters:

numberid: Type of numbers to fetch (one of: p, f, e, r)

p: Prime numbers

f: Fibonacci numbers

e: Even numbers

r: Random numbers

Response:
{
  "windowPrevState": [previous window contents],
  "windowCurrState": [current window contents],
  "numbers": [new numbers received],
  "avg": average_of_current_window
}
(Refer to Screenshots)



Setup
Prerequisites
Node.js (v14 or later)
npm/yarn

Installation
Clone the repository

Install dependencies:
npm install express axios

Configuration
The service requires a valid API key for authentication. Set this in the API_KEY constant in the code.

Running the Service
node server.js
The service will start on http://localhost:9876

Testing
You can test the API using:
Postman



Error Handling
The service returns appropriate HTTP status codes for:
Invalid number IDs (400)
Authorization failures (401)
API errors (500)

Implementation Details
Window size is configurable via WINDOW_SIZE
Uses Axios for HTTP requests with a 2-second timeout
Maintains number uniqueness in the window
Implements sliding window algorithm (FIFO when window is full)

Dependencies
Express.js
Axios

License
MIT License
