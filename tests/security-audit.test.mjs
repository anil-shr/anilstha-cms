// Automated Security & Route Hardening Verification Test Suite
// Run against local server on port 3000

async function runTests() {
  const BASE_URL = 'http://127.0.0.1:3000';
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  console.log('--- STARTING SECURITY & ENDPOINT VERIFICATION ---');

  // Test 1: Verify unauthenticated GET /api/contact returns 404
  try {
    const res = await fetch(`${BASE_URL}/api/contact`);
    assert(res.status === 404, `GET /api/contact data leak is blocked (Status: ${res.status}, Expected: 404)`);
  } catch (err) {
    console.error('Test 1 error:', err);
    failed++;
  }

  // Test 2: Verify unauthenticated GET /api/admin/inquiries returns 401
  try {
    const res = await fetch(`${BASE_URL}/api/admin/inquiries`);
    assert(res.status === 401, `GET /api/admin/inquiries requires auth (Status: ${res.status}, Expected: 401)`);
  } catch (err) {
    console.error('Test 2 error:', err);
    failed++;
  }

  // Test 3: Verify unauthenticated POST /api/admin/save-project returns 401
  try {
    const res = await fetch(`${BASE_URL}/api/admin/save-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: { title: 'Hacked' } })
    });
    assert(res.status === 401, `POST /api/admin/save-project requires auth (Status: ${res.status}, Expected: 401)`);
  } catch (err) {
    console.error('Test 3 error:', err);
    failed++;
  }

  // Test 4: Verify /api/data sanitization (No contact messages, no unpublished projects, no sensitive keys)
  try {
    const res = await fetch(`${BASE_URL}/api/data`);
    const data = await res.json();
    assert(res.status === 200, `GET /api/data responds with 200 OK`);
    assert(data.contactMessages === undefined || (Array.isArray(data.contactMessages) && data.contactMessages.length === 0), `GET /api/data does not leak contactMessages`);
    
    if (data.projects && Array.isArray(data.projects)) {
      const allPublished = data.projects.every(p => p.published !== false);
      assert(allPublished, `GET /api/data only returns published projects`);
    }

    if (data.siteSettings) {
      assert(data.siteSettings.ga_tracking_id === undefined && data.siteSettings.supabase_service_role_key === undefined, `GET /api/data omits sensitive internal credentials`);
    }
  } catch (err) {
    console.error('Test 4 error:', err);
    failed++;
  }

  // Test 5: Verify POST /api/contact honeypot trapping
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'bot@spam.com',
        message: 'Buy cheap goods here now!',
        _hp: 'bot_filled_value'
      })
    });
    assert(res.status === 400, `POST /api/contact traps honeypot submission (Status: ${res.status}, Expected: 400)`);
  } catch (err) {
    console.error('Test 5 error:', err);
    failed++;
  }

  // Test 6: Verify POST /api/contact validation (invalid email)
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email-string',
        message: 'Legitimate message testing'
      })
    });
    assert(res.status === 400, `POST /api/contact rejects invalid email syntax (Status: ${res.status}, Expected: 400)`);
  } catch (err) {
    console.error('Test 6 error:', err);
    failed++;
  }

  // Test 7: Verify POST /api/contact valid submission
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'QA Test User',
        email: 'qa.test@example.com',
        message: 'This is a test inquiry to verify secure backend handling.'
      })
    });
    assert(res.status === 200, `POST /api/contact accepts valid inquiry (Status: ${res.status}, Expected: 200)`);
  } catch (err) {
    console.error('Test 7 error:', err);
    failed++;
  }

  // Test 8: Security response headers
  try {
    const res = await fetch(`${BASE_URL}/api/data`);
    const nosniff = res.headers.get('x-content-type-options');
    const xframe = res.headers.get('x-frame-options');
    assert(nosniff === 'nosniff', `Header X-Content-Type-Options: nosniff present`);
    assert(xframe === 'SAMEORIGIN', `Header X-Frame-Options: SAMEORIGIN present`);
  } catch (err) {
    console.error('Test 8 error:', err);
    failed++;
  }

  console.log(`\n--- TEST SUMMARY: ${passed} Passed, ${failed} Failed ---`);
  if (failed > 0) process.exit(1);
}

runTests();
