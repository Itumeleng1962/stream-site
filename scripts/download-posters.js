import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const posters = {
  'oppenheimer.jpg': 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
  'oppenheimer-logo.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Oppenheimer_2023_logo.svg/1280px-Oppenheimer_2023_logo.svg.png',
  'breaking-bad.jpg': 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg',
  'better-call-saul.jpg': 'https://m.media-amazon.com/images/M/MV5BZDA4YmE0OTYtMmRmNS00Mzk2LTlhM2MtNjk4NzBjZGE1MmIyXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg',
  'inception.jpg': 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
  'dark-knight.jpg': 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
  'survivor.jpg': 'https://m.media-amazon.com/images/M/MV5BYWM5ZGRhMGQtOGE4NC00OWY4LTk3MjUtZjZmYzNhODVmNjdiXkEyXkFqcGdeQXVyMTUyNjc3NDQ4._V1_.jpg',
  'planet-earth-2.jpg': 'https://m.media-amazon.com/images/M/MV5BZWYxODViMGYtMGE2ZC00ZGQ3LThhMWUtYTVkNGE3OWU4NWRkL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMjYwNDA2MDE@._V1_.jpg',
  'serial.jpg': 'https://m.media-amazon.com/images/M/MV5BZTJmOTM1ZDQtMWJjYy00NWRlLWFiMTAtYmM2ZmU4NmY0NjJlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
};

async function downloadImage(url, filename) {
  const targetPath = path.join(process.cwd(), 'public', 'assets', 'posters', filename);
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(targetPath);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(targetPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function main() {
  // Create the posters directory if it doesn't exist
  const postersDir = path.join(process.cwd(), 'public', 'assets', 'posters');
  await fs.promises.mkdir(postersDir, { recursive: true });

  // Download all posters
  for (const [filename, url] of Object.entries(posters)) {
    console.log(`Downloading ${filename}...`);
    try {
      await downloadImage(url, filename);
      console.log(`Successfully downloaded ${filename}`);
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error);
    }
  }
}

main().catch(console.error); 