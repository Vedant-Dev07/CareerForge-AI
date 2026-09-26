// Comprehensive regression test for Phase 1, 2, and 3
const BASE_URL = "http://localhost:3003";

async function testEndpoint(name, url, method = "GET", body = null, expectedStatus = 200) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${url}`, options);
    const status = response.status;
    const data = await response.json().catch(() => null);
    
    const pass = status === expectedStatus;
    console.log(`${pass ? "✓" : "✗"} ${name}: ${status} (expected ${expectedStatus})`);
    if (!pass && data) {
      console.log(`  Response:`, JSON.stringify(data).substring(0, 200));
    }
    return pass;
  } catch (error) {
    console.log(`✗ ${name}: ${error.message}`);
    return false;
  }
}

async function runRegressionTests() {
  console.log("=== PHASE 1, 2, 3 REGRESSION TESTS ===\n");

  let phase1Pass = true;
  let phase2Pass = true;
  let phase3Pass = true;

  console.log("PHASE 1: AUTHENTICATION & USER MANAGEMENT");
  console.log("─────────────────────────────────────────");
  
  // Test auth endpoints
  phase1Pass &= await testEndpoint("GET /api/auth/me (unauthenticated)", "/api/auth/me", "GET", null, 401);
  phase1Pass &= await testEndpoint("GET /api/career/roles (unauthenticated)", "/api/career/roles", "GET", null, 401);
  phase1Pass &= await testEndpoint("GET /api/profile (unauthenticated)", "/api/profile", "GET", null, 401);
  
  console.log("\nPHASE 2: ROADMAP FUNCTIONALITY");
  console.log("──────────────────────────────");
  
  // Test roadmap endpoints
  phase2Pass &= await testEndpoint("GET /api/roadmap (unauthenticated)", "/api/roadmap", "GET", null, 401);
  phase2Pass &= await testEndpoint("GET /api/roadmap/test-id (unauthenticated)", "/api/roadmap/test-id", "GET", null, 401);
  phase2Pass &= await testEndpoint("PUT /api/roadmap/tasks/test-id (unauthenticated)", "/api/roadmap/tasks/test-id", "PUT", null, 401);
  
  console.log("\nPHASE 3: RESUME FUNCTIONALITY");
  console.log("──────────────────────────────");
  
  // Test resume endpoints
  phase3Pass &= await testEndpoint("GET /api/resume (unauthenticated)", "/api/resume", "GET", null, 401);
  phase3Pass &= await testEndpoint("GET /api/resume/test-id (unauthenticated)", "/api/resume/test-id", "GET", null, 401);
  phase3Pass &= await testEndpoint("POST /api/resume/upload (unauthenticated)", "/api/resume/upload", "POST", null, 401);
  phase3Pass &= await testEndpoint("POST /api/resume/test-id/analyze (unauthenticated)", "/api/resume/test-id/analyze", "POST", null, 401);
  
  console.log("\nPHASE 4.1: NEW APTITUDE API");
  console.log("─────────────────────────────");
  
  // Test new aptitude API
  const aptitudePass = await testEndpoint("GET /api/aptitude/questions (unauthenticated)", "/api/aptitude/questions", "GET", null, 401);

  console.log("\nPHASE 4.2: ASSESSMENT ENGINE");
  console.log("────────────────────────────");
  
  // Test new assessment APIs
  const assessmentPass1 = await testEndpoint("POST /api/aptitude/assessments (unauthenticated)", "/api/aptitude/assessments", "POST", { category: "QUANTITATIVE", difficulty: "EASY", questionCount: 5, durationMinutes: 10 }, 401);
  const assessmentPass2 = await testEndpoint("GET /api/aptitude/attempts (unauthenticated)", "/api/aptitude/attempts", "GET", null, 401);
  const assessmentPass3 = await testEndpoint("GET /api/aptitude/summary (unauthenticated)", "/api/aptitude/summary", "GET", null, 401);
  
  console.log("\n=== REGRESSION TEST RESULTS ===");
  console.log(`Phase 1 (Auth & User Management): ${phase1Pass ? "PASS ✓" : "FAIL ✗"}`);
  console.log(`Phase 2 (Roadmap): ${phase2Pass ? "PASS ✓" : "FAIL ✗"}`);
  console.log(`Phase 3 (Resume): ${phase3Pass ? "PASS ✓" : "FAIL ✗"}`);
  console.log(`Phase 4.1 (Aptitude API): ${aptitudePass ? "PASS ✓" : "FAIL ✗"}`);
  console.log(`Phase 4.2 (Assessment Engine): ${assessmentPass1 && assessmentPass2 && assessmentPass3 ? "PASS ✓" : "FAIL ✗"}`);
  
  console.log("\nNOTE: These tests verify that unauthenticated requests are properly rejected.");
  console.log("Full authentication flow testing requires manual interaction with the web interface.");
}

runRegressionTests().catch(console.error);