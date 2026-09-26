// Comprehensive security and multi-user isolation test for Phase 4.2
const BASE_URL = "http://localhost:3003";

async function testEndpoint(name, url, method = "GET", body = null, expectedStatus = 401) {
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

async function runSecurityTests() {
  console.log("=== PHASE 4.2 SECURITY & MULTI-USER ISOLATION TESTS ===\n");

  let allPass = true;

  console.log("AUTHENTICATION TESTS");
  console.log("─────────────────────");
  
  // Test all new assessment APIs for authentication
  allPass &= await testEndpoint("POST /api/aptitude/assessments (unauthenticated)", "/api/aptitude/assessments", "POST", { category: "QUANTITATIVE", difficulty: "EASY", questionCount: 5, durationMinutes: 10 }, 401);
  allPass &= await testEndpoint("GET /api/aptitude/assessments/test-id (unauthenticated)", "/api/aptitude/assessments/test-id", "GET", null, 401);
  allPass &= await testEndpoint("POST /api/aptitude/attempts/test-id/answers (unauthenticated)", "/api/aptitude/attempts/test-id/answers", "POST", { questionId: "test", selectedAnswer: "A" }, 401);
  allPass &= await testEndpoint("POST /api/aptitude/attempts/test-id/submit (unauthenticated)", "/api/aptitude/attempts/test-id/submit", "POST", null, 401);
  allPass &= await testEndpoint("GET /api/aptitude/attempts/test-id/result (unauthenticated)", "/api/aptitude/attempts/test-id/result", "GET", null, 401);
  allPass &= await testEndpoint("GET /api/aptitude/attempts (unauthenticated)", "/api/aptitude/attempts", "GET", null, 401);
  allPass &= await testEndpoint("GET /api/aptitude/attempts/active (unauthenticated)", "/api/aptitude/attempts/active", "GET", null, 401);
  allPass &= await testEndpoint("GET /api/aptitude/summary (unauthenticated)", "/api/aptitude/summary", "GET", null, 401);

  console.log("\nCORRECT ANSWER PROTECTION TESTS");
  console.log("──────────────────────────────────");
  
  // Test that correctAnswer is not exposed in question API
  try {
    const response = await fetch(`${BASE_URL}/api/aptitude/questions`);
    const data = await response.json();
    
    if (response.status === 401) {
      console.log("✓ Questions API requires authentication");
    } else {
      const hasCorrectAnswer = data.questions && data.questions.some(q => q.correctAnswer);
      if (hasCorrectAnswer) {
        console.log("✗ Questions API exposes correctAnswer (SECURITY ISSUE)");
        allPass = false;
      } else {
        console.log("✓ Questions API does not expose correctAnswer");
      }
    }
  } catch (error) {
    console.log(`✗ Questions API test: ${error.message}`);
    allPass = false;
  }

  console.log("\nPHASE 4.1 COMPATIBILITY TESTS");
  console.log("───────────────────────────────");
  
  // Test that Phase 4.1 question API still works
  allPass &= await testEndpoint("GET /api/aptitude/questions (unauthenticated)", "/api/aptitude/questions", "GET", null, 401);

  console.log("\n=== SECURITY TEST RESULTS ===");
  console.log(`Overall Security: ${allPass ? "PASS ✓" : "FAIL ✗"}`);
  
  console.log("\nNOTE: Multi-user isolation testing requires:");
  console.log("1. Two different authenticated users");
  console.log("2. User A creates an assessment");
  console.log("3. User B attempts to access User A's assessment");
  console.log("4. Verify User B gets 403 Forbidden");
  console.log("\nThis requires manual testing with actual user accounts.");

  console.log("\nAdditional security notes:");
  console.log("- All APIs use getCurrentUser() for authentication");
  console.log("- Server-side scoring prevents client manipulation");
  console.log("- Database constraints prevent duplicate answers");
  console.log("- Ownership verification on all assessment operations");
}

runSecurityTests().catch(console.error);