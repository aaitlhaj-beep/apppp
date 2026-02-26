const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'students.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database and create tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Users table created or already exists');
          }
        }
      );

      // Create students table
      db.run(
        `CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          phone TEXT NOT NULL,
          course TEXT NOT NULL,
          enrollmentDate TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Students table created or already exists');
            resolve();
          }
        }
      );
    });
  });
};

// Get all students
const getAllStudents = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM students ORDER BY id DESC', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
};

// Get student by ID
const getStudentById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Add new student
const addStudent = (name, email, phone, course, enrollmentDate) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO students (name, email, phone, course, enrollmentDate) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, course, enrollmentDate],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, name, email, phone, course, enrollmentDate });
        }
      }
    );
  });
};

// Update student
const updateStudent = (id, name, email, phone, course, enrollmentDate) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE students SET name = ?, email = ?, phone = ?, course = ?, enrollmentDate = ? WHERE id = ?',
      [name, email, phone, course, enrollmentDate, id],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, name, email, phone, course, enrollmentDate });
        }
      }
    );
  });
};

// Delete student
const deleteStudent = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true, deletedId: id });
      }
    });
  });
};

// Get user by username
const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Get user by email
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Add new user
const addUser = (username, email, hashedPassword) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, username, email });
        }
      }
    );
  });
};

module.exports = {
  db,
  initDatabase,
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  getUserByUsername,
  getUserByEmail,
  addUser
};
