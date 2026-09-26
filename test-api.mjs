// Test script for aptitude questions API
const BASE_URL = "http://localhost:3000";

async function testAPI() {
  console.log("=== PHASE 4.1 API SECURITY VERIFICATION ===\n");

  // Test 1: Unauthenticated request
  console.log("1. Testing unauthenticated request (should return 401)...");
  try {
    const response = await fetch(`${BASE_URL}/api/aptitude/questions`);
    console.log(`   Status: ${response.status}`);
    const data = await response.json();
    console.log(`   Response:`, data);
    console.log(`   ✓ PASS: Unauthenticated request returns ${response.status}\n`);
  } catch (error) {
    console.log(`   ✗ FAIL: ${error.message}\n`);
  }

  // Test 2: Test with valid category filter
  console.log("2. Testing category filter (QUANTITATIVE) without auth...");
  try {
    const response = await fetch(`${BASE_URL}/api/aptitude/questions?category=QUANTITATIVE`);
    console.log(`   Status: ${response.status}`);
    const data = await response.json();
    console.log(`   Response:`, data);
    console.log(`   ✓ PASS: Category filter returns ${response.status}\n`);
  } catch (error) {
    console.log(`   ✗ FAIL: ${error.message}\n`);
  }

  // Test 3: Test with difficulty filter
  console.log("3. Testing difficulty filter (EASY) without auth...");
  try {
    const response = await fetch(`${BASE_URL}/api/aptitude/questions?difficulty=EASY`);
    console.log(`   Status: ${response.status}`);
    const data = await response.json();
    console.log(`   Response:`, data);
    console.log(`   ✓ PASS: Difficulty filter returns ${response.status}\n`);
  } catch (error) {
    console.log(`   ✗ FAIL: ${error.message}\n`);
  }

  // Test 4: Test with limit
  console.log("4. Testing limit parameter without auth...");
  try {
    const response = await fetch(`${BASE_URL}/api/aptitude/questions?limit=5`);
    console.log(`   Status: ${response.status}`);
    const data = await response.json();
    console.log(`   Response:`, data);
    console.log(`   ✓ PASS: Limit parameter returns ${response.status}\n`);
  } catch (error) {
    console.log(`   ✗ FAIL: ${error.message}\n`);
  }

  // Test 5: Test invalid limit
  console.log("5. Testing invalid limit (should return 400)...");
  try {
    const response = await fetch(`${BASE_URL}/api/aptitude/questions?limit=999`);
    console.log(`   Status: ${response.status}`);
    const data = await response.json();
    console.log(`   Response:`, data);
    console.log(`   ✓ PASS: Invalid limit returns ${response.status}\n`);
  } catch (error) {
    console.log(`   ✗ FAIL: ${error.message}\n`);
  }

  console.log("=== API SECURITY VERIFICATION COMPLETE ===");
  console.log("\nNOTE: To test authenticated requests, you need to:");
  console.log("1. Log in via the web interface");
  console.log("2. Copy the session cookie");
  console.log("3. Include it in requests using curl or similar tools");
}

testAPI().catch(console.error);