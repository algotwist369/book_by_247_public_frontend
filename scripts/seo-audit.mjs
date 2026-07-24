import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 Running BookBy247 Technical SEO Audit...\n");

let errors = 0;
let passes = 0;

function report(testName, passed, details = "") {
  if (passed) {
    passes++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    errors++;
    console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ""}`);
  }
}

// ---------------------------------------------------------------
// Test 1: Verify Base URL in SEO Config
// ---------------------------------------------------------------
try {
  const configPath = path.join(rootDir, "lib", "seo-config.ts");
  const content = fs.readFileSync(configPath, "utf-8");
  const hasCorrectBaseUrl = content.includes('baseUrl: "https://bookby247.com"');
  report("SEO Config uses strict non-www HTTPS base URL (https://bookby247.com)", hasCorrectBaseUrl);
} catch (err) {
  report("SEO Config check", false, err.message);
}

// ---------------------------------------------------------------
// Test 2: Verify Proxy / Middleware Configuration
// ---------------------------------------------------------------
try {
  const proxyPath = path.join(rootDir, "proxy.ts");
  const middlewarePath = path.join(rootDir, "middleware.ts");
  const targetFile = fs.existsSync(proxyPath) ? proxyPath : middlewarePath;
  const exists = fs.existsSync(targetFile);
  if (exists) {
    const content = fs.readFileSync(targetFile, "utf-8");
    const handlesWww = content.includes('rawHost.startsWith("www.")') || content.includes('host.startsWith("www.")');
    const handlesLowercase = content.includes('[A-Z]');
    const status301 = content.includes('status: 301');

    report("Proxy handles www 301 redirect", handlesWww);
    report("Proxy handles uppercase path 301 redirect", handlesLowercase);
    report("Proxy uses 301 permanent redirect status", status301);
  } else {
    report("Next.js proxy.ts / middleware.ts exists", false, "file missing");
  }
} catch (err) {
  report("Proxy check", false, err.message);
}

// ---------------------------------------------------------------
// Test 3: Verify Robots.txt Disallow & Sitemap Rules
// ---------------------------------------------------------------
try {
  const robotsPath = path.join(rootDir, "app", "robots.ts");
  const content = fs.readFileSync(robotsPath, "utf-8");
  const hasSitemap = content.includes('sitemap.xml');
  const hasCheckoutDisallow = content.includes('/checkout');
  const hasPaymentDisallow = content.includes('/payment');

  report("robots.ts references sitemap.xml", hasSitemap);
  report("robots.ts disallows /checkout", hasCheckoutDisallow);
  report("robots.ts disallows /payment", hasPaymentDisallow);
} catch (err) {
  report("robots.ts check", false, err.message);
}

// ---------------------------------------------------------------
// Test 4: Verify Sitemap Clean Architecture
// ---------------------------------------------------------------
try {
  const sitemapPath = path.join(rootDir, "app", "sitemap.ts");
  const content = fs.readFileSync(sitemapPath, "utf-8");
  const excludesSubpaths = !content.includes('book-appointment');
  const excludesThinTags = !content.includes('tagsResponse');

  report("sitemap.ts excludes transactional subpaths (/book-appointment)", excludesSubpaths);
  report("sitemap.ts excludes thin tags", excludesThinTags);
} catch (err) {
  report("sitemap.ts check", false, err.message);
}

// ---------------------------------------------------------------
// Test 5: Verify Tag Pages noindex Rule
// ---------------------------------------------------------------
try {
  const tagPagePath = path.join(rootDir, "app", "tags", "[slug]", "page.tsx");
  const content = fs.readFileSync(tagPagePath, "utf-8");
  const hasNoindex = content.includes('index: false') && content.includes('follow: true');

  report("Tag pages set robots index: false, follow: true", hasNoindex);
} catch (err) {
  report("Tag page check", false, err.message);
}

// ---------------------------------------------------------------
// Test 6: Verify Business Review Page Dynamic Noindex Rule
// ---------------------------------------------------------------
try {
  const reviewPagePath = path.join(rootDir, "app", "business", "[slug]", "reviews", "page.tsx");
  const content = fs.readFileSync(reviewPagePath, "utf-8");
  const hasDynamicNoindex = content.includes('hasGenuineReviews');

  report("Business review page dynamically evaluates genuine review count for indexability", hasDynamicNoindex);
} catch (err) {
  report("Review page check", false, err.message);
}

// ---------------------------------------------------------------
// Test Summary
// ---------------------------------------------------------------
console.log("\n=================================================");
console.log(`📊 Audit Summary: ${passes} Passed, ${errors} Failed`);
console.log("=================================================\n");

if (errors > 0) {
  console.error("❌ SEO Validation Failed with errors.");
  process.exit(1);
} else {
  console.log("✨ All Technical SEO Audit Checks Passed Successfully!");
  process.exit(0);
}
