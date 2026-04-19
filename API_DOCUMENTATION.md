# Flowrage Admin Panel - Public API Documentation

This documentation outlines the public REST API endpoints available for frontend development.

## Base URL
All API requests are relative to:
`[YOUR_DOMAIN]/api/v1`

---

## 1. Content Endpoints

### Blog Posts
#### Get List of Blog Posts
- **Endpoint**: `GET /content/blog`
- **Query Parameters**:
  - `page` (number): Page number (default: `1`)
  - `limit` (number): Number of posts per page (default: `10`)
  - `category` (string): Filter by category slug
  - `tag` (string): Filter by tag slug
  - `q` (string): Search query (searches title, content, and excerpt)
- **Response**:
  ```json
  {
    "posts": [
      {
        "id": "string",
        "title": "string",
        "slug": "string",
        "content": "string (HTML)",
        "excerpt": "string",
        "featuredImage": "string (URL)",
        "published": true,
        "createdAt": "ISO Date",
        "updatedAt": "ISO Date",
        "seoMetadata": { ... },
        "categories": [ ... ],
        "tags": [ ... ]
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
  ```

#### Get Single Blog Post
- **Endpoint**: `GET /content/blog/[slug]`
- **Response**: Single blog post object with full relations (SEO, categories, tags).

### Services
#### Get List of Services
- **Endpoint**: `GET /content/services`
- **Response**: Array of service objects.

#### Get Single Service
- **Endpoint**: `GET /content/services/[slug]`
- **Response**: Single service object.

### Portfolio
#### Get List of Projects
- **Endpoint**: `GET /content/portfolio`
- **Response**: Array of portfolio project objects.

#### Get Single Project
- **Endpoint**: `GET /content/portfolio/[slug]`
- **Response**: Single project object.

### Static Pages
#### Get All Pages
- **Endpoint**: `GET /content/pages`
- **Response**: Array of static page objects.

#### Get Single Page
- **Endpoint**: `GET /content/pages/[slug]`
- **Response**: Single static page object.

### Categories & Tags
#### Get All Categories
- **Endpoint**: `GET /content/categories`
- **Response**: Array of categories with post counts.

#### Get All Tags
- **Endpoint**: `GET /content/tags`
- **Response**: Array of tags with post counts.

---

## 2. Page Endpoints

### Homepage
- **Endpoint**: `GET /content/homepage`
- **Response**: Homepage configuration object including hero section, SEO metadata, and other configured sections.

---

## 3. Configuration & SEO

### Global SEO
- **Endpoint**: `GET /seo`
- **Response**:
  ```json
  {
    "defaultMetaTitle": "string",
    "defaultMetaDescription": "string",
    "ogSiteName": "string",
    "ogImage": "string (URL)",
    "twitterHandle": "string",
    "googleAnalyticsId": "string",
    "googleSearchConsoleId": "string",
    "bingWebmasterId": "string",
    "schemaMarkup": { ... }
  }
  ```

### Redirects
- **Endpoint**: `GET /redirects`
- **Response**: Array of active redirect rules.
  ```json
  [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "statusCode": 301
    }
  ]
  ```

### Site Settings
- **Endpoint**: `GET /settings`
- **Response**:
  ```json
  {
    "id": "string",
    "siteName": "string",
    "siteDescription": "string",
    "logo": "string (URL)",
    "favicon": "string (URL)",
    "contactEmail": "string",
    "contactPhone": "string",
    "address": "string",
    "socialLinks": {
      "facebook": "string",
      "twitter": "string",
      "instagram": "string",
      "linkedin": "string"
    }
  }
  ```

---

## 4. Interaction Endpoints

### Submit Inquiry (Contact Form)
- **Endpoint**: `POST /inquiries`
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "subject": "string (optional)",
    "message": "string"
  }
  ```
- **Response**: Returns the created inquiry object.

---

## 5. Media Upload
- **Endpoint**: `POST /upload` (Requires Authentication)
- **Body**: `FormData` containing a `file` field.
- **Response**:
  ```json
  {
    "url": "string (Public URL)",
    "name": "string",
    "size": number,
    "type": "string"
  }
  ```

---

## Notes for Frontend Developers
1. **Rich Text (Tiptap)**: Content fields (blog posts, services, static pages, etc.) are returned as HTML strings. These strings include standard HTML tags (e.g., `<h2>`, `<p>`, `<ul>`, `<a>`, `<img>`) and should be rendered using a component that can handle HTML (e.g., `dangerouslySetInnerHTML` in React or a similar mechanism).
2. **SEO & Metadata**: Most content objects include a `seoMetadata` object. Use these for setting document title, meta description, and OpenGraph tags on the frontend.
3. **Images**: Image fields (like `featuredImage` or `ogImage`) return URLs. These can be relative to the server or absolute if hosted externally.
4. **Pagination**: The Blog list endpoint is the only one with pagination enabled by default. Other lists currently return all items ordered by creation date.
5. **Slug-based Routing**: Use the `slug` field for dynamic routing on the frontend. All slug-based endpoints return a 404 if the item is not found or not published (where applicable).
