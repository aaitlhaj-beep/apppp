const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  enrollmentDate: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);

// Initialize database connection
const initDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-management';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

// User functions
const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    return user;
  } catch (error) {
    throw error;
  }
};

const addUser = async (username, email, hashedPassword) => {
  try {
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });
    return {
      id: user._id,
      username: user.username,
      email: user.email
    };
  } catch (error) {
    throw error;
  }
};

// Student functions
const getAllStudents = async () => {
  try {
    const students = await Student.find().sort({ _id: -1 });
    return students.map(student => ({
      id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      enrollmentDate: student.enrollmentDate,
      createdAt: student.createdAt
    }));
  } catch (error) {
    throw error;
  }
};

const getStudentById = async (id) => {
  try {
    const student = await Student.findById(id);
    if (!student) return null;
    return {
      id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      enrollmentDate: student.enrollmentDate,
      createdAt: student.createdAt
    };
  } catch (error) {
    throw error;
  }
};

const addStudent = async (name, email, phone, course, enrollmentDate) => {
  try {
    const student = await Student.create({
      name,
      email: email.toLowerCase(),
      phone,
      course,
      enrollmentDate
    });
    return {
      id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      enrollmentDate: student.enrollmentDate
    };
  } catch (error) {
    throw error;
  }
};

const updateStudent = async (id, name, email, phone, course, enrollmentDate) => {
  try {
    const student = await Student.findByIdAndUpdate(
      id,
      {
        name,
        email: email.toLowerCase(),
        phone,
        course,
        enrollmentDate
      },
      { new: true }
    );
    if (!student) throw new Error('Student not found');
    return {
      id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      enrollmentDate: student.enrollmentDate
    };
  } catch (error) {
    throw error;
  }
};

const deleteStudent = async (id) => {
  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) throw new Error('Student not found');
    return {
      id: student._id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      enrollmentDate: student.enrollmentDate
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  initDatabase,
  getUserByUsername,
  getUserByEmail,
  addUser,
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};
