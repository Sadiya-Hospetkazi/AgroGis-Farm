const fetch = require('node-fetch').default;

async function testLogin() {
    try {
        console.log('Testing login...');
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'rajesh@example.com',
                password: 'password123'
            })
        });
        
        const data = await response.json();
        console.log('Response:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

testLogin();