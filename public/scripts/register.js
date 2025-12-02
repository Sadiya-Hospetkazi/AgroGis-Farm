// Get BASE_API_URL from environment or use default
const BASE_API_URL = window._env_ && window._env_.BASE_API_URL 
    ? window._env_.BASE_API_URL 
    : window.location.hostname.includes('railway.app') 
        ? `https://${window.location.hostname}` 
        : window.location.hostname.includes('vercel.app')
            ? `https://${window.location.hostname}`
            : 'http://localhost:3001';

// Use relative URL if BASE_API_URL is empty (same domain deployment)
const API_BASE = BASE_API_URL ? BASE_API_URL : '';

console.log('Using API base URL:', BASE_API_URL);

// Function to handle registration form submission
function handleRegister(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const language = document.getElementById('language').value;
    
    // Make API call to register
    fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, phone, location, language })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Show success message
            alert('Registration successful! Please login with your credentials.');
            
            // Redirect to login page
            window.location.href = 'login.html';
        } else {
            alert('Registration failed: ' + (data.message || 'Unknown error occurred. Please try again.'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Registration failed: ' + (error.message || 'Unknown error occurred. Please try again.'));
    });
}

// Attach event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Language selector change event
    const languageSelector = document.getElementById('language');
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            // In a real app, this would change the UI language
            console.log('Language changed to:', this.value);
        });
    }

    // Form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});