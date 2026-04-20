import type { MetadataRoute } from "next";

import { navItems, siteMeta } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = navItems.flatMap((item) => [item.href, ...(item.children?.map((child) => child.href) ?? [])]);
  const uniqueRoutes = [...new Set(routes)];

  return uniqueRoutes.map((href) => ({
    url: `${siteMeta.url}${href}`,
    lastModified: now,
    changeFrequency: href === "/" ? "weekly" : "monthly",
    priority: href === "/" ? 1 : 0.7,
  }));
}
