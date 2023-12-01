const fs = require('node:fs/promises');

async function fetchInput(day) {
  const sessionCookie = await fs.readFile('session_cookie.txt', { encoding: 'utf8' });

  const response = await fetch(`https://adventofcode.com/2022/day/${day}/input`, {
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

fetchInput(new Date().getDate())
  .then(input => {
    console.log(input);
  })
  .catch(error => {
    console.error(error);
  });
