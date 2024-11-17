import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_management' // replace with your DB name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log('DB connection failed:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// JWT secret
const JWT_SECRET = 'your_jwt_secret_key';

// Route to register a user
app.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); 

        // Insert new user
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

// Route to sign in
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Create JWT with user's role
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        // Send token in cookie and role in response
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

// Protected route (e.g., dashboard)
app.get('/dashboard', authenticateJWT, (req, res) => {
    res.json({ message: 'Welcome to the dashboard', userId: req.user.id });
});

// Logout route
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
});

// Middleware to check if the user is a professor
const authenticateProfessor = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err || user.role !== 'professor') return res.status(403).json({ message: "Unauthorized" });
        req.user = user;
        next();
    });
};

// Fetch items for the professor dashboard
app.get('/professor/items', authenticateProfessor, (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new item
app.post('/professor/items', authenticateProfessor, (req, res) => {
    const { title } = req.body;
    db.query('INSERT INTO items (title) VALUES (?)', [title], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: "Item added successfully" });
    });
});

// Update an item
app.put('/professor/items/:id', authenticateProfessor, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    db.query('UPDATE items SET title = ? WHERE id = ?', [title, id], (err, result) => {
        if (err) throw err;
        res.json({ message: "Item updated successfully" });
    });
});

// Delete an item
app.delete('/professor/items/:id', authenticateProfessor, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM items WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.json({ message: "Item deleted successfully" });
    });
});

// Middleware to check if the user is a student
const authenticateStudent = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err || user.role !== 'student') return res.status(403).json({ message: "Unauthorized" });
        req.user = user;
        next();
    });
};

// Fetch items for the student dashboard
app.get('/student/items', authenticateStudent, (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Route to check if the user is logged in
app.get('/auth', authenticateJWT, (req, res) => {
    // If the JWT is valid, respond with the user's data or simply with a success message
    res.status(200).json({ isLoggedIn: true, userId: req.user.id, role: req.user.role });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
