// scripts/fetch-projects.mjs
// Fetch WP Projects CPT and write to public/data/projects.json for Vite.

import fs from "fs";
import path from "path";

const WP_BASE = process.env.WP_BASE_URL;
if (!WP_BASE) {
    console.error("Missing WP_BASE_URL env var (e.g. https://cms.firstnamelastname.com).");
    process.exit(1);
}

const endpoint =
    `${WP_BASE.replace(/\/$/, "")}/wp-json/wp/v2/projects?_embed&per_page=100&status=publish`;

function pickFeaturedImage(item) {
    const media = item?._embedded?.["wp:featuredmedia"]?.[0];
    if (!media) return null;

    const sizes = media?.media_details?.sizes ?? {};
    const src =
        sizes.large?.source_url ||
        sizes.medium_large?.source_url ||
        sizes.medium?.source_url ||
        media.source_url;

    return {
        src,
        alt: media.alt_text || item.title?.rendered || "",
        width: media.media_details?.width ?? null,
        height: media.media_details?.height ?? null,
    };
}

async function run() {
    const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`WP fetch failed (${res.status}): ${text.slice(0, 200)}`);
    }

    const items = await res.json();

    const projects = items
        .map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title?.rendered ?? "",
            excerpt: item.excerpt?.rendered ?? "",
            content: item.content?.rendered ?? "",
            date: item.date,
            modified: item.modified,
            featuredImage: pickFeaturedImage(item),
        }))
        .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    const outPath = path.resolve("public", "data", "projects.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(projects, null, 2), "utf8");

    console.log(`Wrote ${projects.length} projects to ${outPath}`);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
