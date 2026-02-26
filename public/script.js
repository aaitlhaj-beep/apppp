// API Base URL
const API_BASE_URL = '/api';

// DOM Elements
const studentForm = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const courseInput = document.getElementById('course');
const enrollmentDateInput = document.getElementById('enrollmentDate');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const tableBody = document.getElementById('tableBody');
const studentsTable = document.getElementById('studentsTable');
const emptyMessage = document.getElementById('emptyMessage');
const totalCount = document.getElementById('totalCount');
const confirmModal = document.getElementById('confirmModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const toast = document.getElementById('toast');
const logoutBtn = document.getElementById('logoutBtn');
const userGreeting = document.getElementById('userGreeting');

let currentStudentId = null;
let allStudents = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadStudents();
    setupEventListeners();
    // Set today's date as default enrollment date
    enrollmentDateInput.valueAsDate = new Date();
});

// Setup Event Listeners
function setupEventListeners() {
    studentForm.addEventListener('submit', handleFormSubmit);
    resetBtn.addEventListener('click', resetForm);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    confirmBtn.addEventListener('click', confirmDelete);
    cancelBtn.addEventListener('click', closeConfirmModal);
    logoutBtn.addEventListener('click', handleLogout);
}

// Check authentication and load user info
async function checkAuthentication() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check`);
        const result = await response.json();

        if (!result.isAuthenticated) {
            window.location.href = '/auth.html';
        } else {
            userGreeting.textContent = `Welcome, ${result.user.username}!`;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = '/auth.html';
    }
}

// Handle logout
async function handleLogout() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST'
        });

        const result = await response.json();

        if (result.success) {
            showToast('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = '/auth.html';
            }, 1000);
        }
    } catch (error) {
        console.error('Error logging out:', error);
        showToast('Error logging out', 'error');
    }
}

// Load all students
async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        const result = await response.json();

        if (result.success) {
            allStudents = result.data;
            displayStudents(allStudents);
        } else {
            showToast('Failed to load students', 'error');
        }
    } catch (error) {
        console.error('Error loading students:', error);
        showToast('Error loading students', 'error');
    }
}

// Display students in table
function displayStudents(students) {
    tableBody.innerHTML = '';

    if (students.length === 0) {
        studentsTable.style.display = 'none';
        emptyMessage.style.display = 'block';
        totalCount.textContent = '0';
        return;
    }

    studentsTable.style.display = 'table';
    emptyMessage.style.display = 'none';
    totalCount.textContent = students.length;

    students.forEach((student) => {
        const row = document.createElement('tr');
        const enrollDate = new Date(student.enrollmentDate).toLocaleDateString();

        row.innerHTML = `
            <td>${student.id}</td>
            <td><strong>${escapeHtml(student.name)}</strong></td>
            <td>${escapeHtml(student.email)}</td>
            <td>${escapeHtml(student.phone)}</td>
            <td><span class="course-badge">${escapeHtml(student.course)}</span></td>
            <td>${enrollDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn btn-delete" onclick="deleteStudent(${student.id})">Delete</button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const course = courseInput.value.trim();
    const enrollmentDate = enrollmentDateInput.value;

    // Validation
    if (!name || !email || !phone || !course || !enrollmentDate) {
        showToast('Please fill all fields', 'warning');
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email', 'warning');
        return;
    }

    // Phone validation
    if (!isValidPhone(phone)) {
        showToast('Please enter a valid phone number', 'warning');
        return;
    }

    try {
        let url = `${API_BASE_URL}/students`;
        let method = 'POST';
        let successMessage = 'Student added successfully';

        if (currentStudentId) {
            url += `/${currentStudentId}`;
            method = 'PUT';
            successMessage = 'Student updated successfully';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                course,
                enrollmentDate
            })
        });

        const result = await response.json();

        if (result.success) {
            showToast(successMessage, 'success');
            resetForm();
            loadStudents();
        } else {
            showToast(result.message || 'Error saving student', 'error');
        }
    } catch (error) {
        console.error('Error saving student:', error);
        showToast('Error saving student', 'error');
    }
}

// Edit student
async function editStudent(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${id}`);
        const result = await response.json();

        if (result.success) {
            const student = result.data;
            nameInput.value = student.name;
            emailInput.value = student.email;
            phoneInput.value = student.phone;
            courseInput.value = student.course;
            enrollmentDateInput.value = student.enrollmentDate;
            currentStudentId = id;

            // Change button text
            const submitBtn = studentForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update Student';

            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        showToast('Error loading student data', 'error');
    }
}

// Delete student with confirmation
function deleteStudent(id) {
    currentStudentId = id;
    openConfirmModal();
}

// Confirm delete
async function confirmDelete() {
    if (!currentStudentId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/students/${currentStudentId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showToast('Student deleted successfully', 'success');
            closeConfirmModal();
            loadStudents();
        } else {
            showToast('Failed to delete student', 'error');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showToast('Error deleting student', 'error');
    }
}

// Search students
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        displayStudents(allStudents);
        return;
    }

    const filtered = allStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.phone.includes(searchTerm)
    );

    displayStudents(filtered);
}

// Reset form
function resetForm() {
    studentForm.reset();
    currentStudentId = null;
    enrollmentDateInput.valueAsDate = new Date();
    const submitBtn = studentForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Add Student';
}

// Open confirmation modal
function openConfirmModal() {
    confirmModal.classList.add('show');
}

// Close confirmation modal
function closeConfirmModal() {
    confirmModal.classList.remove('show');
    currentStudentId = null;
}

// Show toast notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        closeConfirmModal();
    }
});
