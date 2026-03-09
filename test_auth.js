const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  console.log(`Testing connectivity to: ${supabaseUrl}`);
  try {
    // Testing health/connectivity by just trying a simple call
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Auth error:", error.message);
    } else {
      console.log("✅ Successfully connected to Supabase Auth!");
      console.log("Current session status:", data.session ? "Active" : "No session (expected)");
    }
  } catch (err) {
    console.error("❌ Fetch failed physically:", err.message);
    if (err.cause) {
        console.error("Cause:", err.cause);
    }
  }
}

testAuth();
