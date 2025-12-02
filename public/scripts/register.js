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
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        // Always try to parse JSON, even for error responses
        return response.text().then(text => {
            console.log('Raw response text:', text);
            try {
                return { status: response.status, data: JSON.parse(text) };
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                return { status: response.status, data: { success: false, message: text || 'Unknown error occurred' } };
            }
        });
    })
    .then(({ status, data }) => {
        console.log('Parsed response:', { status, data });
        
        if (status >= 200 && status < 300 && data.success) {
            // Show success message
            alert('Registration successful! Please login with your credentials.');
            
            // Redirect to login page
            window.location.href = 'login.html';
        } else {
            const errorMessage = data.message || data.error || 'Registration failed. Please try again.';
            alert('Registration failed: ' + errorMessage);
        }
    })
    .catch(error => {
        console.error('Network error:', error);
        alert('Registration failed: Network error or server unavailable. Please try again.');
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