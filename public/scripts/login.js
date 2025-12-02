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

// Function to handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Make API call to login
    fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Store token in localStorage
            localStorage.setItem('agrogig_token', data.token);
            
            // Redirect to dashboard
            window.location.href = 'dashboard-professional.html';
        } else {
            alert('Login failed: ' + (data.message || 'Unknown error occurred. Please try again.'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed: ' + (error.message || 'Unknown error occurred. Please try again.'));
    });
}

// Attach event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});