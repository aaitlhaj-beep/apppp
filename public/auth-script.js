// API Base URL
const API_BASE_URL = '/api';

// DOM Elements
const loginForm = document.getElementById('loginFormElement');
const registerForm = document.getElementById('registerFormElement');
const loginFormDiv = document.getElementById('loginForm');
const registerFormDiv = document.getElementById('registerForm');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
}

// Check if user is already authenticated
async function checkAuthentication() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check`);
        const result = await response.json();

        if (result.isAuthenticated) {
            // Redirect to dashboard
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validation
    if (!username || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }

    try {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success) {
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            showToast(result.message || 'Login failed', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    } catch (error) {
        console.error('Error logging in:', error);
        showToast('Error logging in', 'error');
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showToast('Please fill all fields', 'error');
        return;
    }

    if (username.length < 3) {
        showToast('Username must be at least 3 characters', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    try {
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                confirmPassword
            })
        });

        const result = await response.json();

        if (result.success) {
            showToast('Registration successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            showToast(result.message || 'Registration failed', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    } catch (error) {
        console.error('Error registering:', error);
        showToast('Error registering', 'error');
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
}

// Toggle between login and register forms
function toggleForms(e) {
    e.preventDefault();

    loginFormDiv.classList.toggle('active');
    registerFormDiv.classList.toggle('active');

    // Clear form fields
    loginForm.reset();
    registerForm.reset();
}

// Show toast notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
