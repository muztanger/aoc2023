/**
 * Fetches the input from Advent of Code website.
 * @returns {Promise<string>} The fetched input.
 * @throws {Error} If failed to fetch the input.
 */
const fs = require('fs');
const fetch = require('node-fetch');

async function fetchInput() {
    const sessionCookie = fs.readFileSync('../session_cookie.txt', 'utf8').trim();

    const response = await fetch('https://adventofcode.com/2022/day/1/input', {
        headers: {
            cookie: `session=${sessionCookie}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch input: ${response.status} ${response.statusText}`);
    }

    const input = await response.text();
    return input.trim();
}

fetchInput()
  .then(input => {
    console.log(input);
  })
  .catch(error => {
    console.error(error);
  });
