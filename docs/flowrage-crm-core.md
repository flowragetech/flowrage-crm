# Flowrage CRM Core

## Updated folder structure

```text
src/
  app/
    dashboard/
      crm/
        deals/
      blog/
      cms/
      franker/
      media/
      settings/
    actions/
      search.ts
  components/
    kbar/
      dynamic-search-actions.tsx
  config/
    branding.ts
    module-registry.ts
    nav-config.ts
  features/
    crm/
      actions/
        deals.ts
      components/
        deals-client.tsx
      hooks/
        use-deal-filters.ts
      schema/
        deal.ts
    seo/
      components/
        seo-panel.tsx
      utils/
        analyze-seo.ts
  lib/
    site-settings.ts
prisma/
  schema.prisma
```

## Refactored Prisma schema notes

- `Order` becomes `Deal` in the target schema, with JSON `customFields`.
- `SeoMetadata` becomes reusable and model-agnostic with JSON-LD support.
- `SiteSettings` owns branding and module flags.
- CMS moves to `Page`, `PageSection`, and `ReusableComponent`.
- Media gains folders and tags for WordPress-style reuse.

## Example clean module

`src/features/crm` is the reference implementation for a plug-and-play feature:

- `actions/deals.ts`
- `components/deals-client.tsx`
- `hooks/use-deal-filters.ts`
- `schema/deal.ts`

This gives one self-contained module shape that other features can follow.

## Migration plan

1. Apply the Prisma schema update and generate a migration.
2. Backfill `Deal` records from `Order` and move `details` into `customFields`.
3. Migrate CMS data from homepage, services, portfolio, and static pages into `Page` plus `PageSection`.
4. Move SEO data into the new `SeoMetadata` shape and render it through the shared `SeoPanel`.
5. Repoint dashboard routes from legacy feature pages to module-based routes.
6. Delete deprecated legacy routes and actions once data is verified in the new tables.
