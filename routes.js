const express = require('express');
const router = express.Router();
const db = require('./database');

// GET all students
router.get('/students', async (req, res) => {
  try {
    const students = await db.getAllStudents();
    res.json({
      success: true,
      data: students,
      count: students.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
});

// GET student by ID
router.get('/students/:id', async (req, res) => {
  try {
    const student = await db.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
});

// POST create new student
router.post('/students', async (req, res) => {
  try {
    const { name, email, phone, course, enrollmentDate } = req.body;

    // Validation
    if (!name || !email || !phone || !course || !enrollmentDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const student = await db.addStudent(name, email, phone, course, enrollmentDate);
    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding student',
      error: error.message
    });
  }
});

// PUT update student
router.put('/students/:id', async (req, res) => {
  try {
    const { name, email, phone, course, enrollmentDate } = req.body;

    // Validation
    if (!name || !email || !phone || !course || !enrollmentDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const existingStudent = await db.getStudentById(req.params.id);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const student = await db.updateStudent(req.params.id, name, email, phone, course, enrollmentDate);
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
});

// DELETE student
router.delete('/students/:id', async (req, res) => {
  try {
    const student = await db.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await db.deleteStudent(req.params.id);
    res.json({
      success: true,
      message: 'Student deleted successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
});

module.exports = router;
