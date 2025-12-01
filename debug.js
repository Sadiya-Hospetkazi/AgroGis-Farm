// Debug script for AgroGig application
// Tests various components of the application

// Define base API URL
const BASE_API_URL = process.env.BASE_API_URL || 'http://localhost:3001';

async function debugServers() {
    console.log('=== AgroGig Debug Script ===');
    
    // Test 1: Check if frontend server is running
    console.log('\n1. Testing frontend server...');
    try {
        const frontendResponse = await fetch('http://localhost:3001');
        console.log('   Frontend server status:', frontendResponse.status);
        if (frontendResponse.ok) {
            console.log('   ✅ Frontend server is running');
        } else {
            console.log('   ❌ Frontend server returned error');
        }
    } catch (error) {
        console.log('   ❌ Frontend server error:', error.message);
    }
    
    // Test 2: Check if backend server is running
    console.log('\n2. Testing backend server...');
    try {
        const backendResponse = await fetch(BASE_API_URL);
        console.log('   Backend server status:', backendResponse.status);
        if (backendResponse.ok) {
            console.log('   ✅ Backend server is running');
        } else {
            console.log('   ❌ Backend server returned error');
        }
    } catch (error) {
        console.log('   ❌ Backend server error:', error.message);
    }
    
    // Test 3: Test login API through backend
    console.log('\n3. Testing login API...');
    try {
        const loginResponse = await fetch(`${BASE_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'rajesh@example.com',
                password: 'password123'
            })
        });
        
        console.log('   Login API status:', loginResponse.status);
        const data = await loginResponse.json();
        
        if (data.success) {
            console.log('   ✅ Login API working correctly');
            console.log('   Token:', data.token.substring(0, 20) + '...');
        } else {
            console.log('   ❌ Login API returned error:', data.message);
        }
    } catch (error) {
        console.log('   ❌ Login API error:', error.message);
    }
    
    // Test 4: Test protected route
    console.log('\n4. Testing protected route...');
    try {
        // First get a token
        const loginResponse = await fetch(`${BASE_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'rajesh@example.com',
                password: 'password123'
            })
        });
        
        const loginData = await loginResponse.json();
        if (loginData.success) {
            const token = loginData.token;
            
            const protectedResponse = await fetch(`${BASE_API_URL}/api/protected/dashboard`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('   Protected route status:', protectedResponse.status);
            const protectedData = await protectedResponse.json();
            
            if (protectedData.success) {
                console.log('   ✅ Protected route working correctly');
                console.log('   Farmer name:', protectedData.data.farmer.name);
            } else {
                console.log('   ❌ Protected route returned error:', protectedData.message);
            }
        } else {
            console.log('   ❌ Could not get token for protected route test');
        }
    } catch (error) {
        console.log('   ❌ Protected route error:', error.message);
    }
    
    console.log('\n=== Debug Complete ===');
}

debugServers();