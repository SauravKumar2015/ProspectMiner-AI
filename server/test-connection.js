const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('Testing MongoDB Atlas connection...');
  console.log('Connection string:', process.env.MONGODB_URI.replace(/saurav12/, '****'));
  
  try {
    // Test with basic options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    
    console.log('✅ Connected successfully!');
    const result = await mongoose.connection.db.admin().ping();
    console.log('✅ Database ping:', result);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Check your internet connection');
    console.error('2. Check if MongoDB Atlas IP whitelist includes your IP');
    console.error('3. Verify username/password are correct');
    console.error('4. Try using a VPN if in a restricted network');
  }
}

testConnection();