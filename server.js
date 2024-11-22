const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const FileType = require('file-type');
const atob = require('atob');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilities
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// POST endpoint
app.post('/bfhl', async (req, res) => {
  try {
    const { data = [], file_b64 } = req.body;
    const userId = "vikas_dhakad_22112000"; // Replace with your own logic for user ID
    const email = "vikas@xyz.com";
    const rollNumber = "ABCD123";

    // Separate numbers and alphabets
    const numbers = data.filter((item) => !isNaN(item));
    const alphabets = data.filter((item) => isNaN(item));
    const highestLowercase = alphabets
      .filter((char) => /^[a-z]$/.test(char))
      .sort((a, b) => b.localeCompare(a))[0] || null;

    // Check for prime in numbers
    const primeFound = numbers.some((num) => isPrime(parseInt(num, 10)));

    // File validation
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKB = null;

    if (file_b64) {
      try {
        const fileBuffer = Buffer.from(atob(file_b64), 'binary');
        const fileType = await FileType.fromBuffer(fileBuffer);

        if (fileType) {
          fileValid = true;
          fileMimeType = fileType.mime;
          fileSizeKB = (fileBuffer.length / 1024).toFixed(2);
        }
      } catch (err) {
        // Invalid file
        fileValid = false;
      }
    }

    res.status(200).json({
      is_success: true,
      user_id: userId,
      email,
      roll_number: rollNumber,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
      is_prime_found: primeFound,
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKB,
    });
  } catch (err) {
    res.status(500).json({ is_success: false, error: 'Server Error' });
  }
});

// GET endpoint
app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
