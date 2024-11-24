import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 5000;

// CORS setup
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Ensure the 'uploads' directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Set up file storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // File name with timestamp
  }
});

const upload = multer({ storage: storage });

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_management'  // replace with your DB name
});

db.connect((err) => {
  if (err) {
    console.log('DB connection failed:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// JWT secret
const JWT_SECRET = 'your_jwt_secret_key';

// Register route
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'User created successfully' });
      }
    );
  });
});

// Sign-in route
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', role: user.role });
  });
});

// Middleware to check authentication
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Logout route to clear the cookie
app.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true });
  res.status(200).json({ message: 'Logged out successfully' });
});

// Route for professors to upload files with a note
app.post('/professor/upload', authenticateJWT, upload.single('file'), (req, res) => {
  console.log('Received request body:', req.body); // Log the incoming form data
  console.log('Received file:', req.file);         // Log the file

  const { title, note } = req.body;

  if (!title || !note || !req.file) {
    return res.status(400).json({ message: 'Title, note, and file are required' });
  }

  const filePath = req.file.filename;

  // Insert the note and file into the database
  db.query('INSERT INTO notes (title, note, file_path) VALUES (?, ?, ?)', [title, note, filePath], (err, result) => {
    if (err) {
      console.error('Database insertion error:', err); // Log the database error
      return res.status(500).json({ message: 'Error saving file and note to database' });
    }
    res.status(201).json({ message: 'File and note uploaded successfully' });
  });
});

// Route for professors to add a note (without file upload)
app.post('/professor/addNote', authenticateJWT, (req, res) => {
  const { title, note } = req.body;

  db.query('INSERT INTO notes (title, note) VALUES (?, ?)', [title, note], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving note to database' });
    }
    res.status(201).json({ message: 'Note added successfully' });
  });
});

// Serve files from 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Fetch notes for the student dashboard
app.get('/student/items', authenticateJWT, (req, res) => {
  db.query('SELECT * FROM notes', (err, results) => {
    if (err) throw err;
    res.json(results);  // Send the data containing the note and file_path
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
