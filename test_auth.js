// Test authentication functionality
// fetch is built-in in Node 18+, so no need to require it

async function testLogin() {
    try {
        console.log('Testing login functionality...');
        
        // Test login with sample user
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
        console.log('Login response:', data);
        
        if (data.success) {
            console.log('✅ Login successful!');
            console.log('Token:', data.token);
            return data.token;
        } else {
            console.log('❌ Login failed:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error during login test:', error);
        return null;
    }
}

async function testProtectedRoute(token) {
    try {
        console.log('\nTesting protected route with token...');
        
        const response = await fetch('http://localhost:3001/api/protected/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        console.log('Protected route response:', data);
        
        if (data.success) {
            console.log('✅ Protected route access successful!');
            console.log('Farmer data:', data.data.farmer);
        } else {
            console.log('❌ Protected route access failed:', data.message);
        }
    } catch (error) {
        console.error('Error during protected route test:', error);
    }
}

// Run tests
(async () => {
    const token = await testLogin();
    if (token) {
        await testProtectedRoute(token);
    }
})();