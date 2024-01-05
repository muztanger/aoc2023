const fs = require('node:fs/promises');
const crypto = require('node:crypto');

exports.fetchInput = async function (day, year = 2023) {
  const sessionCookie = await fs.readFile('session_cookie.txt', { encoding: 'utf8' });

  const response = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
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

exports.gcd = function (a, b) {
    if (b === 0) return a;
    if (b == 0n) return a;
    return exports.gcd(b, a % b);
}

exports.lcm = function (a, b) {
    return a * b / exports.gcd(a, b);
}

String.prototype.regexIndexOf = function(regex, startpos) {
  var indexOf = this.substring(startpos || 0).search(regex);
  return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};

String.prototype.hashCode = function() {
  return crypto.createHash('sha256').update(this.normalize()).digest('hex');
};