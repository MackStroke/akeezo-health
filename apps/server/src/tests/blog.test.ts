import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { app } from "../main.js";
import { UserModel, BlogPostModel } from "../db/models/index.js";
import { hashPassword, signToken } from "../utils/auth.js";
import { calculateSeoContentScore } from "@akeezo/contracts";

describe("Blog Manager & Real-Time SEO Content Suite", async () => {
  let serverInstance: any;
  let baseUrl = "";
  let adminToken = "";
  let createdPostId = "";
  const testSlug = `test-oncology-guide-${Date.now()}`;

  before(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/akeezo_local");
    }

    let adminUser = await UserModel.findOne({ email: "priti@akeezo.com" });
    if (!adminUser) {
      adminUser = await UserModel.create({
        name: "Priti",
        email: "priti@akeezo.com",
        phone: "+91 82876 39443",
        role: "admin",
        passwordHash: hashPassword("Akeezo@2026!"),
        status: "active",
        phoneVerified: true,
      });
    }

    adminToken = signToken({ userId: adminUser._id.toString(), role: "admin" });

    await new Promise<void>((resolve) => {
      serverInstance = app.listen(0, "127.0.0.1", () => {
        const port = (serverInstance.address() as any).port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (createdPostId) {
      try {
        await BlogPostModel.findByIdAndDelete(createdPostId);
      } catch {
        // cleanup ignore
      }
    }
    if (serverInstance) {
      await new Promise<void>((resolve) => serverInstance.close(() => resolve()));
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test("1. GET /api/v1/admin/blog returns seeded articles and pagination metadata", async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/blog`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data), "data must be an array of articles");
    assert.ok(json.data.length >= 3, "Must contain at least the 3 seeded clinical articles");
    assert.ok(json.pagination, "Must return pagination object");
    assert.ok(json.pagination.total >= 3);

    const slugs = json.data.map((p: any) => p.slug);
    assert.ok(slugs.includes("robotic-knee-replacement-india-cost-hospitals"), "Must have robotic knee post");
  });

  test("2. POST /api/v1/admin/blog/seo-audit standalone evaluation works accurately", async () => {
    const auditPayload = {
      title: "Comprehensive Cancer Treatment in Delhi Hospitals: Costs & Best Oncologists",
      slug: "cancer-treatment-delhi-costs-oncologists",
      content: `## Comprehensive Cancer Treatment in Delhi\n\nCancer treatment in Delhi offers advanced proton beam therapy, surgical oncology, and immunotherapies at JCI-accredited hospitals. Patients travelling from Nigeria, Kenya, and Uzbekistan receive priority international care.\n\n### Cancer Treatment in Delhi Procedure Options\n\nState of the art cancer treatment in Delhi includes PET-CT diagnostics, linear accelerators, and robotic surgery.\n\n### Travel & Accommodation Support\n\nAkeezo provides dedicated medical visa assistance, airport transfers, and multilingual language interpreters for your cancer treatment in Delhi.`,
      focusKeyword: "cancer treatment in Delhi",
      seoTitle: "Cancer Treatment in Delhi Hospitals | Top Oncologists & Cost Guide",
      metaDescription: "Explore cancer treatment in Delhi with JCI-accredited hospitals, robotic surgery, and dedicated international patient care coordinators.",
      featuredImageAlt: "Advanced cancer treatment in Delhi hospital radiation suite",
    };

    const res = await fetch(`${baseUrl}/api/v1/admin/blog/seo-audit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(auditPayload),
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(typeof json.data.score === "number");
    assert.ok(json.data.score >= 70, `Score should be solid, got ${json.data.score}`);
    assert.ok(Array.isArray(json.data.checks), "checks must be an array");
    assert.ok(json.data.keywordDensity > 0, "keyword density must be calculated");
  });

  test("3. POST /api/v1/admin/blog creates a new blog post and auto-calculates SEO score", async () => {
    const newArticle = {
      title: "Proton Beam Therapy in India: Breakthrough Cancer Care",
      slug: testSlug,
      excerpt: "Learn how proton beam therapy in India delivers ultra-precise radiation targeting tumors while sparing healthy surrounding tissues.",
      content: `# Proton Beam Therapy in India\n\nProton beam therapy in India represents the pinnacle of modern radiation oncology. Unlike conventional photon radiation, proton beam therapy in India stops precisely at the tumor site with zero exit dose.\n\n## Benefits of Proton Beam Therapy in India\n\nChildren and adult patients with skull-base, prostate, and spinal tumors experience significantly lower long-term toxicities with proton beam therapy in India.\n\n## Costs and Hospital Options\n\nApollo Proton Cancer Centre in Chennai is South Asia's first certified proton therapy centre, offering treatments at 70% lower cost than the US.`,
      category: "Oncology",
      tags: ["Proton Therapy", "Oncology", "India Healthcare", "Cancer Cure"],
      featuredImage: {
        url: "/hero/hero-bg.webp",
        alt: "Proton beam therapy in India treatment gantry",
        caption: "High precision pencil beam scanning gantry",
      },
      author: {
        name: "Dr. Arvind Sharma",
        role: "Senior Radiation Oncology Advisor",
      },
      status: "published",
      seo: {
        focusKeyword: "proton beam therapy in India",
        seoTitle: "Proton Beam Therapy in India | Costs, Centers & Survival Rates",
        metaDescription: "Comprehensive guide to proton beam therapy in India at JCI-accredited centers. Discover treatment procedures, hospital costs, and international patient benefits.",
        canonicalUrl: `https://akeezo.com/blog/${testSlug}`,
        noIndex: false,
        schemaType: "MedicalWebPage",
      },
      medicalDisclaimerEnabled: true,
    };

    const res = await fetch(`${baseUrl}/api/v1/admin/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(newArticle),
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data._id);
    createdPostId = json.data._id;
    assert.equal(json.data.slug, testSlug);
    assert.ok(json.data.seo.seoScore >= 75, `SEO Score was auto-calculated: ${json.data.seo.seoScore}`);
    assert.ok(json.data.publishedAt, "publishedAt must be set for published status");
  });

  test("4. POST /api/v1/admin/blog rejects duplicate slug with HTTP 409", async () => {
    const duplicateArticle = {
      title: "Another Proton Post",
      slug: testSlug, // same slug
      excerpt: "Another excerpt",
      content: "Short content",
      category: "Oncology",
    };

    const res = await fetch(`${baseUrl}/api/v1/admin/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(duplicateArticle),
    });

    assert.equal(res.status, 409);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.ok(json.error.includes("already exists"));
  });

  test("5. GET /api/v1/admin/blog/:id returns article with live SEO audit", async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/blog/${createdPostId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data._id, createdPostId);
    assert.ok(json.seoAudit, "Response should include live seoAudit details");
    assert.ok(typeof json.seoAudit.score === "number");
  });

  test("6. PUT /api/v1/admin/blog/:id updates content and recalculates SEO score", async () => {
    const updatePayload = {
      title: "Proton Beam Therapy in India: Complete Clinical Guide 2026",
      excerpt: "Updated 2026 comprehensive overview of proton beam therapy in India with latest hospital pricing data and patient recovery timelines.",
      content: `# Proton Beam Therapy in India: Complete Clinical Guide 2026\n\nProton beam therapy in India represents modern oncology at its highest level. Patients seeking proton beam therapy in India receive pencil-beam scanning with robotic patient positioning.\n\n## Clinical Indications for Proton Beam Therapy in India\n\nTumors of the brain, spine, pediatric cancers, and head-and-neck malignancies are prime candidates for proton beam therapy in India.\n\n## Cost Savings & Quality of Life\n\nInternational patients achieve world-class cancer control while saving up to 75% compared to Western centers.`,
      status: "published",
    };

    const res = await fetch(`${baseUrl}/api/v1/admin/blog/${createdPostId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updatePayload),
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.title, "Proton Beam Therapy in India: Complete Clinical Guide 2026");
    assert.ok(json.data.seo.seoScore >= 75);
  });

  test("7. POST /api/v1/admin/blog/:id/publish toggles publish status", async () => {
    // Unpublish to draft
    const unpubRes = await fetch(`${baseUrl}/api/v1/admin/blog/${createdPostId}/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "draft" }),
    });

    assert.equal(unpubRes.status, 200);
    const unpubJson = await unpubRes.json();
    assert.equal(unpubJson.data.status, "draft");

    // Re-publish to published
    const pubRes = await fetch(`${baseUrl}/api/v1/admin/blog/${createdPostId}/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: "published" }),
    });

    assert.equal(pubRes.status, 200);
    const pubJson = await pubRes.json();
    assert.equal(pubJson.data.status, "published");
  });

  test("8. GET /api/v1/blog public endpoint lists published articles", async () => {
    const res = await fetch(`${baseUrl}/api/v1/blog?page=1&limit=10`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.data.length >= 1);

    const found = json.data.find((p: any) => p.slug === testSlug);
    assert.ok(found, "Newly published post must appear in public blog list");
    assert.equal(found.content, undefined, "Public summary should omit full content payload for efficiency");
  });

  test("9. GET /api/v1/blog/:slug public endpoint returns full article and increments views", async () => {
    const res = await fetch(`${baseUrl}/api/v1/blog/${testSlug}`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.slug, testSlug);
    assert.ok(json.data.content, "Full article content must be returned");
    assert.ok(json.data.viewCount >= 1, "View count should increment on access");
    assert.ok(Array.isArray(json.related), "Related articles list must be present");
  });

  test("10. SSR GET /blog serves rendered HTML with blog directory structure", async () => {
    const res = await fetch(`${baseUrl}/blog`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("<title>"), "Must contain title tag");
    assert.ok(text.includes("Medical Travel Blog"), "Must contain blog heading");
    assert.ok(text.includes("Robotic Knee Replacement") || text.includes("Proton Beam Therapy"), "Must render article cards");
  });

  test("11. SSR GET /blog/:slug serves full article with clinical disclaimer and SEO tags", async () => {
    const res = await fetch(`${baseUrl}/blog/${testSlug}`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("Proton Beam Therapy in India"), "Must render article title in SSR");
    assert.ok(text.includes("Medical Information & Editorial Disclaimer"), "Must render clinical disclaimer");
    assert.ok(text.includes("Book Priority Consultation") || text.includes("Get a Free Treatment Estimate"), "Must render consultation CTA");
  });

  test("12. DELETE /api/v1/admin/blog/:id deletes the article cleanly", async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/blog/${createdPostId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);

    // Verify it is gone
    const check = await BlogPostModel.findById(createdPostId);
    assert.equal(check, null, "Document must be removed from MongoDB");
    createdPostId = ""; // clear so after() doesn't double-delete
  });
});
