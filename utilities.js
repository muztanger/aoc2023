const fs = require('node:fs/promises');

exports.fetchInput = async function (day) {
  const sessionCookie = await fs.readFile('session_cookie.txt', { encoding: 'utf8' });

  const response = await fetch(`https://adventofcode.com/2023/day/${day}/input`, {
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

