#!/usr/bin/env node
/**
 * SEMIAN Notion CMS Sync
 *
 * Fetches all 8 Notion databases and writes them to /data/*.json.
 * Each JSON file is consumed by client-side JS in HTML pages.
 *
 * Usage:
 *   NOTION_TOKEN=ntn_xxx node scripts/notion-sync.js
 *
 * Output:
 *   data/products.json
 *   data/news.json
 *   data/exhibitions.json
 *   data/articles.json
 *   data/applications.json
 *   data/customers.json
 *   data/certifications.json
 *   data/site-texts.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = process.env.NOTION_TOKEN;
if (!TOKEN) {
  console.error('❌ NOTION_TOKEN environment variable required');
  process.exit(1);
}

const DBS = {
  products:       'f33e5762-2f21-4a42-95c2-aa0b3d300121',
  news:           'b44b6bbd-240b-48c7-bbf4-e2cab8566a59',
  exhibitions:    'cfb39b82-ddaf-4fec-b1cb-bc8e998eddf8',
  articles:       'd0375f57-fa8b-41f1-a923-baa344728e47',
  applications:   'e3a8e931-f112-4f6d-9279-7987d0606c31',
  customers:      'e26dc0ef-4fef-46a0-bb1b-b5be4a384684',
  certifications: '4a1866bd-fcd6-4e34-b705-1e4cd0c10deb',
  siteTexts:      '3f98c80c-a247-4eaa-8246-17cd9d98fd05',
};

const OUT_DIR = path.join(__dirname, '..', 'data');

// ---- HTTP helper (uses built-in https, no external deps) ----
function notionRequest(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      path: urlPath,
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(raw)); }
          catch (e) { reject(new Error(`Parse: ${e.message}`)); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${raw}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ---- Property extraction helpers ----
function getProp(page, name) {
  return page.properties && page.properties[name];
}

function getTitle(p) {
  const arr = p?.title;
  return arr && arr.length ? arr.map(t => t.plain_text).join('') : '';
}

function getText(p) {
  const arr = p?.rich_text;
  return arr && arr.length ? arr.map(t => t.plain_text).join('') : '';
}

function getSelect(p) {
  return p?.select?.name || null;
}

function getMultiSelect(p) {
  return (p?.multi_select || []).map(s => s.name);
}

function getNumber(p) {
  return p?.number ?? null;
}

function getCheckbox(p) {
  return p?.checkbox || false;
}

function getDate(p) {
  return p?.date?.start || null;
}

function getDateEnd(p) {
  return p?.date?.end || null;
}

function getUrl(p) {
  return p?.url || null;
}

function getFiles(p) {
  return (p?.files || []).map(f => {
    if (f.type === 'external') return f.external.url;
    if (f.type === 'file') return f.file.url;
    return null;
  }).filter(Boolean);
}

function firstFile(p) {
  const arr = getFiles(p);
  return arr[0] || null;
}

// ---- Query all rows from a database (handles pagination) ----
async function queryAll(dbId, filter = null) {
  const results = [];
  let cursor = null;
  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    if (filter) body.filter = filter;
    const data = await notionRequest('POST', `/v1/databases/${dbId}/query`, body);
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return results;
}

// ---- Per-DB mappers (Notion row → clean JSON for site) ----

function mapProduct(p) {
  return {
    id: p.id,
    name: getTitle(getProp(p, 'Name')),
    code: getText(getProp(p, 'Code')),
    slug: getText(getProp(p, 'Code')).toLowerCase().replace(/\s+/g, '-'),
    category: getSelect(getProp(p, 'Category')),
    status: getSelect(getProp(p, 'Status')),
    badge: getSelect(getProp(p, 'Badge')),
    order: getNumber(getProp(p, 'Order')) ?? 100,
    tagline: getText(getProp(p, 'Tagline')),
    heroLead: getText(getProp(p, 'Hero Lead')),
    heroImage: firstFile(getProp(p, 'Hero Image')),
    cardImage: firstFile(getProp(p, 'Card Image')),
    specGlance: parseLines(getText(getProp(p, 'Spec Glance Items'))),
    overviewHeadline: getText(getProp(p, 'Overview Headline')),
    overviewBody: getText(getProp(p, 'Overview Body')),
    features: getText(getProp(p, 'Features')),
    specTable: parseLines(getText(getProp(p, 'Spec Table'))),
    applications: getMultiSelect(getProp(p, 'Applications')),
    patents: getText(getProp(p, 'Patents')),
    quote: {
      text: getText(getProp(p, 'Quote Text')),
      author: getText(getProp(p, 'Quote Author')),
      affiliation: getText(getProp(p, 'Quote Affiliation')),
    },
    brochurePdf: firstFile(getProp(p, 'Brochure PDF')),
    ctaQuoteUrl: getUrl(getProp(p, 'CTA Quote URL')),
    ctaDemoUrl: getUrl(getProp(p, 'CTA Demo URL')),
    lastEdited: p.last_edited_time,
  };
}

function mapNews(p) {
  return {
    id: p.id,
    title: getTitle(getProp(p, 'Title')),
    date: getDate(getProp(p, 'Date')),
    status: getSelect(getProp(p, 'Status')),
    category: getSelect(getProp(p, 'Category')),
    summary: getText(getProp(p, 'Summary')),
    body: getText(getProp(p, 'Body')),
    coverImage: firstFile(getProp(p, 'Cover Image')),
    externalLink: getUrl(getProp(p, 'External Link')),
    featured: getCheckbox(getProp(p, 'Featured')),
    lastEdited: p.last_edited_time,
  };
}

function mapExhibition(p) {
  return {
    id: p.id,
    eventName: getTitle(getProp(p, 'Event Name')),
    status: getSelect(getProp(p, 'Status')),
    startDate: getDate(getProp(p, 'Start Date')),
    endDate: getDate(getProp(p, 'End Date')),
    city: getText(getProp(p, 'City')),
    country: getSelect(getProp(p, 'Country')),
    venue: getText(getProp(p, 'Venue')),
    booth: getText(getProp(p, 'Booth')),
    description: getText(getProp(p, 'Description')),
    coverImage: firstFile(getProp(p, 'Cover Image')),
    website: getUrl(getProp(p, 'Website')),
    featured: getCheckbox(getProp(p, 'Featured')),
  };
}

function mapArticle(p) {
  return {
    id: p.id,
    title: getTitle(getProp(p, 'Title')),
    slug: getText(getProp(p, 'Slug')),
    status: getSelect(getProp(p, 'Status')),
    category: getSelect(getProp(p, 'Category')),
    author: getText(getProp(p, 'Author')),
    date: getDate(getProp(p, 'Date')),
    readTime: getNumber(getProp(p, 'Read Time')),
    summary: getText(getProp(p, 'Summary')),
    body: getText(getProp(p, 'Body')),
    coverImage: firstFile(getProp(p, 'Cover Image')),
    relatedProducts: splitCsv(getText(getProp(p, 'Related Products'))),
    featured: getCheckbox(getProp(p, 'Featured')),
  };
}

function mapApplication(p) {
  return {
    id: p.id,
    name: getTitle(getProp(p, 'Name')),
    slug: getText(getProp(p, 'Slug')),
    status: getSelect(getProp(p, 'Status')),
    order: getNumber(getProp(p, 'Order')) ?? 100,
    tagline: getText(getProp(p, 'Tagline')),
    heroLead: getText(getProp(p, 'Hero Lead')),
    heroImage: firstFile(getProp(p, 'Hero Image')),
    challengeTitle: getText(getProp(p, 'Challenge Title')),
    challengeBody: getText(getProp(p, 'Challenge Body')),
    body: getText(getProp(p, 'Body')),
    recommendedProducts: splitCsv(getText(getProp(p, 'Recommended Products'))),
    relatedApps: getMultiSelect(getProp(p, 'Related Apps')),
  };
}

function mapCustomer(p) {
  return {
    id: p.id,
    name: getTitle(getProp(p, 'Name')),
    status: getSelect(getProp(p, 'Status')),
    type: getSelect(getProp(p, 'Type')),
    country: getSelect(getProp(p, 'Country')),
    logo: firstFile(getProp(p, 'Logo')),
    website: getUrl(getProp(p, 'Website')),
    productUsed: getText(getProp(p, 'Product Used')),
    quote: {
      text: getText(getProp(p, 'Quote Text')),
      author: getText(getProp(p, 'Quote Author')),
    },
    order: getNumber(getProp(p, 'Order')) ?? 100,
    showOnHomepage: getCheckbox(getProp(p, 'Show on Homepage')),
  };
}

function mapCertification(p) {
  return {
    id: p.id,
    name: getTitle(getProp(p, 'Name')),
    status: getSelect(getProp(p, 'Status')),
    type: getSelect(getProp(p, 'Type')),
    number: getText(getProp(p, 'Number')),
    authority: getText(getProp(p, 'Authority')),
    issueDate: getDate(getProp(p, 'Issue Date')),
    expiryDate: getDate(getProp(p, 'Expiry Date')),
    description: getText(getProp(p, 'Description')),
    certificateImage: firstFile(getProp(p, 'Certificate Image')),
    linkedProducts: splitCsv(getText(getProp(p, 'Linked Products'))),
    order: getNumber(getProp(p, 'Order')) ?? 100,
  };
}

function mapSiteText(p) {
  return {
    key: getTitle(getProp(p, 'Key')),
    page: getSelect(getProp(p, 'Page')),
    section: getText(getProp(p, 'Section')),
    type: getSelect(getProp(p, 'Type')),
    value: getText(getProp(p, 'Value')),
    description: getText(getProp(p, 'Description')),
  };
}

// ---- String helpers ----
function parseLines(text) {
  // Parse "Key:Value" lines into [{label, value}, ...]
  if (!text) return [];
  return text.split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const idx = l.indexOf(':');
      if (idx < 0) return { label: l, value: '' };
      return { label: l.slice(0, idx).trim(), value: l.slice(idx + 1).trim() };
    });
}

function splitCsv(text) {
  if (!text) return [];
  return text.split(',').map(s => s.trim()).filter(Boolean);
}

// ---- Main ----
async function main() {
  console.log('🔄 SEMIAN Notion sync starting...');
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const tasks = [
    { name: 'products', db: DBS.products, map: mapProduct,
      sort: (a, b) => (a.order ?? 100) - (b.order ?? 100) },
    { name: 'news', db: DBS.news, map: mapNews,
      sort: (a, b) => (b.date || '').localeCompare(a.date || '') },
    { name: 'exhibitions', db: DBS.exhibitions, map: mapExhibition,
      sort: (a, b) => (b.startDate || '').localeCompare(a.startDate || '') },
    { name: 'articles', db: DBS.articles, map: mapArticle,
      sort: (a, b) => (b.date || '').localeCompare(a.date || '') },
    { name: 'applications', db: DBS.applications, map: mapApplication,
      sort: (a, b) => (a.order ?? 100) - (b.order ?? 100) },
    { name: 'customers', db: DBS.customers, map: mapCustomer,
      sort: (a, b) => (a.order ?? 100) - (b.order ?? 100) },
    { name: 'certifications', db: DBS.certifications, map: mapCertification,
      sort: (a, b) => (a.order ?? 100) - (b.order ?? 100) },
    { name: 'site-texts', db: DBS.siteTexts, map: mapSiteText, sort: null },
  ];

  const summary = {};
  for (const task of tasks) {
    process.stdout.write(`  ${task.name.padEnd(16)} `);
    try {
      const rows = await queryAll(task.db);
      let items = rows.map(task.map);
      if (task.sort) items.sort(task.sort);
      const file = path.join(OUT_DIR, `${task.name}.json`);
      fs.writeFileSync(file, JSON.stringify({
        generatedAt: new Date().toISOString(),
        count: items.length,
        items,
      }, null, 2));
      summary[task.name] = items.length;
      console.log(`✓ ${items.length} rows → data/${task.name}.json`);
    } catch (e) {
      console.error(`✗ FAILED: ${e.message}`);
      process.exitCode = 1;
    }
  }

  // Write a manifest
  fs.writeFileSync(
    path.join(OUT_DIR, '_manifest.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), summary }, null, 2)
  );

  console.log('\n✅ Sync complete.');
  console.log(JSON.stringify(summary, null, 2));
}

main().catch(e => {
  console.error('💥 Fatal:', e);
  process.exit(1);
});
