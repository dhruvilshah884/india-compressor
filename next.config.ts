import type { NextConfig } from "next";

/**
 * Old cPanel site (static .htm pages) → new pages. Permanent (301/308) so Google moves
 * the rankings of the old URLs to the new ones and old links/bookmarks keep working.
 */
const oldPages: Record<string, string> = {
  "index.htm": "/",
  "about.htm": "/about",
  "contact.htm": "/contact",
  "enquiry.htm": "/contact",
  "products.htm": "/products",
  "sitemap.htm": "/products",
  "air_compressors.htm": "/products",
  "air_compressors_range.htm": "/products",
  "air_compressor_catalog.htm": "/products",
  "air_compressors_selection.htm": "/products",
  "air_compressors_maintenance.htm": "/products",
  "air_compressor_for_industries.htm": "/products",
  "applications.htm": "/products",
  "air_cooled_reciprocating_air_compressor.htm": "/products",
  "vertical_water_cooled_air_compressor.htm": "/products",
  "water_cooled.htm": "/products",
  "single_stage_air_compressors.htm": "/products/single-stage-air-compressor",
  "two_stage_air_compressors.htm": "/products/two-stage-air-compressor",
  "multi_stage_air_compressors.htm": "/products/multistage-pet-air-compressor",
  "air_dryers.htm": "/products/refrigerated-air-dryer",
  "air_filters.htm": "/products/compressed-air-filters",
  "activated_carbon_filter.htm": "/products/compressed-air-filters",
  "moisture_separator.htm": "/products/compressed-air-filters",
  "air_receiver.htm": "/products/air-receiver-tank",
  "air_compressor_parts.htm": "/products/air-compressor-parts",
  "air_compressors_parts.htm": "/products/air-compressor-parts",
  "dry_vacuum_pumps.htm": "/products/vacuum-pump",
};

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(oldPages).map(([page, destination]) => ({
      source: `/${page}`,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
