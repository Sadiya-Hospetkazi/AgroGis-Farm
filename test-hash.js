// Test password hashing
const bcrypt = require('bcryptjs');

console.log('Testing password hashing...');

const password = 'password123';
console.log('Original password:', password);

bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }
    
    console.log('Hashed password:', hash);
    
    // Test validation
    bcrypt.compare(password, hash, function(err, result) {
        if (err) {
            console.error('Error comparing passwords:', err);
            return;
        }
        
        console.log('Password validation result:', result);
    });
});