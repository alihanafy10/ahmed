/**
 * Simple API Test Script
 * Run with: node test-api.js
 * 
 * This script tests the basic functionality of the API
 */

import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
let authToken = '';
let userId = '';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Test 1: Health Check
const testHealthCheck = async () => {
  try {
    log('\n📋 Test 1: Health Check', 'blue');
    const response = await axios.get(`${API_BASE}/health`);
    log(`✅ Status: ${response.data.status}`, 'green');
    log(`✅ Message: ${response.data.message}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Health check failed: ${error.message}`, 'red');
    return false;
  }
};

// Test 2: Register User
const testRegister = async () => {
  try {
    log('\n📋 Test 2: User Registration', 'blue');
    const userData = {
      fullName: 'اختبار المستخدم',
      nationalId: '12345678901234',
      phone: '01012345678',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      birthDate: '1990-01-01',
      address: '123 شارع الاختبار',
      governorate: 'القاهرة'
    };
    
    const response = await axios.post(`${API_BASE}/auth/register`, userData);
    authToken = response.data.token;
    userId = response.data.user._id;
    
    log(`✅ User registered successfully`, 'green');
    log(`✅ User ID: ${userId}`, 'green');
    log(`✅ Token received: ${authToken.substring(0, 20)}...`, 'green');
    return true;
  } catch (error) {
    log(`❌ Registration failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
};

// Test 3: Login
const testLogin = async () => {
  try {
    log('\n📋 Test 3: User Login', 'blue');
    const loginData = {
      identifier: '01012345678',
      password: 'password123'
    };
    
    const response = await axios.post(`${API_BASE}/auth/login`, loginData);
    authToken = response.data.token;
    
    log(`✅ Login successful`, 'green');
    log(`✅ User: ${response.data.user.fullName}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Login failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
};

// Test 4: Get Current User
const testGetMe = async () => {
  try {
    log('\n📋 Test 4: Get Current User', 'blue');
    const response = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log(`✅ User fetched: ${response.data.user.fullName}`, 'green');
    log(`✅ Email: ${response.data.user.email}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Get user failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
};

// Test 5: Create Accident Report
const testCreateReport = async () => {
  try {
    log('\n📋 Test 5: Create Accident Report', 'blue');
    
    // Using JSON instead of FormData for simplicity in testing
    const reportData = {
      description: 'حادث سير اختباري على طريق القاهرة الإسكندرية الصحراوي',
      location: JSON.stringify({
        latitude: 30.0444,
        longitude: 31.2357,
        address: 'طريق القاهرة الإسكندرية الصحراوي',
        accuracy: 10
      })
    };
    
    const response = await axios.post(`${API_BASE}/reports`, reportData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    log(`✅ Report created successfully`, 'green');
    log(`✅ Report ID: ${response.data.report._id}`, 'green');
    log(`✅ Status: ${response.data.report.status}`, 'green');
    log(`✅ Priority: ${response.data.report.priority}`, 'green');
    return response.data.report._id;
  } catch (error) {
    log(`❌ Create report failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
};

// Test 6: Get My Reports
const testGetMyReports = async () => {
  try {
    log('\n📋 Test 6: Get My Reports', 'blue');
    const response = await axios.get(`${API_BASE}/reports/my-reports`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    log(`✅ Reports fetched: ${response.data.count} report(s)`, 'green');
    return true;
  } catch (error) {
    log(`❌ Get reports failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
};

// Test 7: Get Nearby Reports
const testGetNearbyReports = async () => {
  try {
    log('\n📋 Test 7: Get Nearby Reports', 'blue');
    const response = await axios.get(
      `${API_BASE}/reports/nearby?longitude=31.2357&latitude=30.0444&maxDistance=10000`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    log(`✅ Found ${response.data.count} nearby report(s)`, 'green');
    return true;
  } catch (error) {
    log(`❌ Get nearby reports failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
};

// Run all tests
const runTests = async () => {
  log('\n' + '='.repeat(50), 'yellow');
  log('🧪 Starting API Tests', 'yellow');
  log('='.repeat(50), 'yellow');
  
  const results = [];
  
  // Run tests sequentially
  results.push(await testHealthCheck());
  results.push(await testRegister());
  results.push(await testLogin());
  results.push(await testGetMe());
  results.push(await testCreateReport());
  results.push(await testGetMyReports());
  results.push(await testGetNearbyReports());
  
  // Summary
  const passed = results.filter(r => r).length;
  const failed = results.length - passed;
  
  log('\n' + '='.repeat(50), 'yellow');
  log('📊 Test Summary', 'yellow');
  log('='.repeat(50), 'yellow');
  log(`Total Tests: ${results.length}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log('='.repeat(50) + '\n', 'yellow');
  
  if (failed === 0) {
    log('🎉 All tests passed!', 'green');
  } else {
    log('⚠️  Some tests failed. Check the output above.', 'red');
  }
};

// Check if server is running
const checkServer = async () => {
  try {
    await axios.get(`${API_BASE}/health`);
    return true;
  } catch (error) {
    log('\n❌ Server is not running on http://localhost:5000', 'red');
    log('Please start the server with: npm run dev', 'yellow');
    return false;
  }
};

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
  process.exit(0);
})();
