# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
Open PowerShell or Command Prompt in the project directory and run:
```powershell
npm install
```

This will install all required packages:
- express
- sqlite3
- cors
- body-parser

### Step 2: Start the Server
```powershell
npm start
```

You should see:
```
Connected to SQLite database
Students table created or already exists
Server is running on http://localhost:3000
```

### Step 3: Open in Browser
Open your web browser and go to:
```
http://localhost:3000
```

## ✨ What You Can Do

1. **Add a Student** - Fill the form and click "Add Student"
2. **View All Students** - They appear in the table below
3. **Edit a Student** - Click Edit on any row, modify, and click Update
4. **Delete a Student** - Click Delete and confirm
5. **Search** - Use the search box to find students

## 📁 Project Files

- `server.js` - Main Express server
- `database.js` - SQLite database operations
- `routes.js` - API endpoints
- `public/index.html` - Frontend HTML
- `public/styles.css` - Frontend styling
- `public/script.js` - Frontend JavaScript
- `package.json` - Dependencies and scripts

## 🔧 Troubleshooting

**Problem**: Port 3000 is already in use
**Solution**: 
```powershell
$env:PORT=3001; npm start
```

**Problem**: Dependencies not installing
**Solution**: 
```powershell
npm cache clean --force
npm install
```

**Problem**: Database file corrupted
**Solution**: Delete `students.db` and restart the server

## 📞 API Examples

### Get All Students
```bash
GET http://localhost:3000/api/students
```

### Add Student
```bash
POST http://localhost:3000/api/students
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "1234567890",
  "course": "Engineering",
  "enrollmentDate": "2024-01-26"
}
```

### Update Student
```bash
PUT http://localhost:3000/api/students/1
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "0987654321",
  "course": "Computer Science",
  "enrollmentDate": "2024-01-26"
}
```

### Delete Student
```bash
DELETE http://localhost:3000/api/students/1
```

## 📊 Database

The SQLite database is automatically created as `students.db` in the project root when you first run the server.

### Student Fields
- ID (Auto-generated)
- Name
- Email (Unique)
- Phone
- Course
- Enrollment Date
- Created At (Auto-generated timestamp)

## 🎨 Features

- ✅ Full CRUD operations
- ✅ Real-time search and filter
- ✅ Input validation
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Toast notifications
- ✅ Delete confirmation modal
- ✅ Professional UI/UX

## 🛑 Stop the Server

Press `Ctrl + C` in the terminal where the server is running.

---

**Happy Managing!** 📚
