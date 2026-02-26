# Student Management System

A complete Node.js full-stack application for managing student records with Express backend, SQLite database, and responsive HTML/CSS/JavaScript frontend.

## Features

- ✅ **Add Students** - Create new student records with name, email, phone, course, and enrollment date
- ✅ **View Students** - Display all students in an organized table format
- ✅ **Edit Students** - Update existing student information
- ✅ **Delete Students** - Remove student records with confirmation
- ✅ **Search** - Search students by name, email, or phone number
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- ✅ **Form Validation** - Email and phone number validation
- ✅ **Toast Notifications** - User-friendly feedback messages
- ✅ **REST API** - Complete RESTful API for CRUD operations
- ✅ **SQLite Database** - Lightweight and file-based database

## Project Structure

```
├── server.js              # Express server setup
├── database.js            # SQLite database configuration and queries
├── routes.js              # API routes for CRUD operations
├── package.json           # Project dependencies
├── .gitignore             # Git ignore file
├── README.md              # This file
└── public/
    ├── index.html         # Main HTML file
    ├── styles.css         # CSS styling
    └── script.js          # Frontend JavaScript logic
```

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Middleware**: CORS, Body Parser

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd "c:\Users\HP\OneDrive\Bureau\lang C 1\APP"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

Start the development server:

```bash
npm start
```

Or use:

```bash
node server.js
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Get All Students
- **GET** `/api/students`
- Returns all students with count

### Get Student by ID
- **GET** `/api/students/:id`
- Returns a specific student

### Create New Student
- **POST** `/api/students`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "course": "Computer Science",
    "enrollmentDate": "2024-01-26"
  }
  ```

### Update Student
- **PUT** `/api/students/:id`
- **Body**: Same as POST request

### Delete Student
- **DELETE** `/api/students/:id`
- Removes the student from database

## Usage

1. **Add a Student**:
   - Fill in all the required fields in the form
   - Click "Add Student" button
   - The student will appear in the table

2. **Edit a Student**:
   - Click the "Edit" button on any student row
   - Update the information
   - Click "Update Student" button

3. **Delete a Student**:
   - Click the "Delete" button on any student row
   - Confirm the deletion in the modal
   - Student will be removed from the database

4. **Search Students**:
   - Use the search box to find students by name, email, or phone
   - Results update in real-time

## Database Schema

### Students Table
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  course TEXT NOT NULL,
  enrollmentDate TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Available Courses

- Computer Science
- Business Administration
- Engineering
- Medicine
- Law
- Arts
- Science

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Validation Rules

- **Name**: Required, non-empty string
- **Email**: Required, must be valid email format, unique
- **Phone**: Required, must be at least 10 digits
- **Course**: Required, must select from dropdown
- **Enrollment Date**: Required, must be valid date

## Features in Detail

### Form Validation
- Real-time feedback with toast notifications
- Email format validation
- Phone number length validation
- Required field validation

### Search Functionality
- Case-insensitive search
- Search by name, email, or phone
- Live filtering of results
- Shows total count of matching students

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 480px
- Touch-friendly buttons and inputs
- Readable on all screen sizes

### User Experience
- Toast notifications for all actions
- Modal confirmation for deletions
- Smooth animations and transitions
- Clear visual feedback
- Accessible form elements

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can specify a different port:
```bash
set PORT=3001 && npm start
```

### Database Issues
The database file (`students.db`) is created automatically on first run. If you need to reset:
1. Stop the server
2. Delete the `students.db` file
3. Start the server again

### CORS Issues
CORS is enabled for all origins. If you need to restrict, modify the `server.js` file.

## Future Enhancements

- User authentication and authorization
- Advanced search filters (by course, date range)
- Bulk operations (import/export CSV)
- Student performance tracking
- Attendance management
- Export to PDF/Excel
- Email notifications
- Dashboard with statistics

## License

ISC

## Author

Student Management System Developer

## Support

For issues or questions, please check the code comments or review the API documentation above.

---

**Note**: This is a development version. For production use, consider:
- Adding authentication
- Implementing error logging
- Using environment variables
- Adding database backups
- Implementing rate limiting
- Adding input sanitization
