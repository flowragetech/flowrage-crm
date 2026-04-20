--
-- PostgreSQL database dump
--

\restrict NKzbUe2Uujvk5Nsggspu8AiyfEY8kUFE9WM3GnzMka4UUMojpr1FW8cHusPcwsZ

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'EDITOR',
    'AUTHOR',
    'CUSTOMER',
    'VIEWER'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AppMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AppMeta" (
    key text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AppMeta" OWNER TO postgres;

--
-- Name: AppRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AppRole" (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    "isSystem" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AppRole" OWNER TO postgres;

--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogPost" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    "featuredImage" text,
    faq text,
    "authorId" text NOT NULL,
    published boolean DEFAULT false NOT NULL,
    "seoMetadataId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BlogPost" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "seoMetadataId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Deal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Deal" (
    id text NOT NULL,
    name text NOT NULL,
    email text,
    status text DEFAULT 'new'::text NOT NULL,
    value double precision DEFAULT 0 NOT NULL,
    "pipelineStage" text DEFAULT 'new-business'::text NOT NULL,
    "customFields" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Deal" OWNER TO postgres;

--
-- Name: GlobalSeo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GlobalSeo" (
    id text NOT NULL,
    "defaultMetaTitle" text,
    "defaultMetaDescription" text,
    "ogSiteName" text,
    "ogImage" text,
    "twitterHandle" text,
    "googleAnalyticsId" text,
    "googleSearchConsoleId" text,
    "bingWebmasterId" text,
    "schemaMarkup" text,
    "schemaJson" jsonb,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."GlobalSeo" OWNER TO postgres;

--
-- Name: Homepage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Homepage" (
    id text NOT NULL,
    "heroTitle" text NOT NULL,
    "heroSubtitle" text NOT NULL,
    "heroImage" text,
    features text,
    testimonials text,
    stats text,
    faq text,
    "seoMetadataId" text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Homepage" OWNER TO postgres;

--
-- Name: Inquiry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Inquiry" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text,
    message text NOT NULL,
    status text DEFAULT 'unread'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Inquiry" OWNER TO postgres;

--
-- Name: Media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Media" (
    id text NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    key text NOT NULL,
    size integer NOT NULL,
    type text NOT NULL,
    width integer,
    height integer,
    "altText" text,
    caption text,
    description text,
    "folderId" text,
    category text DEFAULT 'uncategorized'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Media" OWNER TO postgres;

--
-- Name: MediaFolder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MediaFolder" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MediaFolder" OWNER TO postgres;

--
-- Name: MediaTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MediaTag" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MediaTag" OWNER TO postgres;

--
-- Name: NotFoundLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NotFoundLog" (
    id text NOT NULL,
    url text NOT NULL,
    "userAgent" text,
    referer text,
    hits integer DEFAULT 1 NOT NULL,
    "lastAccessed" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."NotFoundLog" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    name text,
    email text,
    phone text,
    service text NOT NULL,
    plan text NOT NULL,
    currency text NOT NULL,
    "monthlyTotal" double precision NOT NULL,
    "termMonths" integer NOT NULL,
    "contractTotal" double precision NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    details text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: Page; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Page" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text,
    template text DEFAULT 'default'::text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    "seoMetadataId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Page" OWNER TO postgres;

--
-- Name: PageSection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PageSection" (
    id text NOT NULL,
    "pageId" text NOT NULL,
    type text NOT NULL,
    title text,
    settings jsonb,
    content jsonb,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PageSection" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    key text NOT NULL,
    label text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Portfolio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Portfolio" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    client text,
    description text NOT NULL,
    image text,
    content text,
    "seoMetadataId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Portfolio" OWNER TO postgres;

--
-- Name: Redirect; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Redirect" (
    id text NOT NULL,
    source text NOT NULL,
    destination text NOT NULL,
    "statusCode" integer DEFAULT 301 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Redirect" OWNER TO postgres;

--
-- Name: ReusableComponent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReusableComponent" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    type text NOT NULL,
    schema jsonb,
    payload jsonb,
    "seoMetadataId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ReusableComponent" OWNER TO postgres;

--
-- Name: SeoMetadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SeoMetadata" (
    id text NOT NULL,
    "metaTitle" text,
    "metaDescription" text,
    keywords text,
    "focusKeyword" text,
    "ogImage" text,
    canonical text,
    "canonicalUrl" text,
    "schemaMarkup" text,
    "schemaJson" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SeoMetadata" OWNER TO postgres;

--
-- Name: Service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Service" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    icon text,
    image text,
    content text,
    features text,
    "order" integer DEFAULT 0 NOT NULL,
    "categoryId" text,
    "seoMetadataId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Service" OWNER TO postgres;

--
-- Name: ServiceCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ServiceCategory" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    icon text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ServiceCategory" OWNER TO postgres;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: SiteSettings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SiteSettings" (
    id text NOT NULL,
    "siteName" text DEFAULT 'CRM Core'::text NOT NULL,
    logo text,
    favicon text,
    "primaryColor" text,
    "secondaryColor" text,
    "contactInfo" text,
    "socialLinks" text,
    "currencyCode" text,
    "currencySymbol" text,
    "siteDescription" text,
    "smtpSettings" text,
    "footerData" text,
    "headerData" text,
    "featureFlags" text,
    "moduleSettings" text,
    "sitemapConfig" text,
    "imageSeoConfig" text,
    "aiConfig" text,
    "indexingConfig" text,
    "localSeoConfig" text,
    "roleManagerConfig" text,
    "analyticsConfig" text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SiteSettings" OWNER TO postgres;

--
-- Name: StaticPage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StaticPage" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    "seoMetadataId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StaticPage" OWNER TO postgres;

--
-- Name: SystemUpdateJob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemUpdateJob" (
    id text NOT NULL,
    "targetKind" text DEFAULT 'core'::text NOT NULL,
    "currentVersion" text NOT NULL,
    "targetVersion" text,
    status text DEFAULT 'queued'::text NOT NULL,
    strategy text NOT NULL,
    "manifestUrl" text,
    changelog text,
    "downloadUrl" text,
    "backupPath" text,
    summary text,
    "errorMessage" text,
    log text,
    "restartRequired" boolean DEFAULT false NOT NULL,
    "triggeredByUserId" text,
    "startedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SystemUpdateJob" OWNER TO postgres;

--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    id text NOT NULL,
    name text NOT NULL,
    "seoMetadataId" text,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: TeamMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamMember" (
    id text NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    slug text NOT NULL,
    "shortBio" text,
    "fullBio" text,
    photo text,
    expertise text,
    experience text,
    ordering integer DEFAULT 0 NOT NULL,
    "socialLinks" text,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TeamMember" OWNER TO postgres;

--
-- Name: TeamPage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TeamPage" (
    id text NOT NULL,
    "heroTitle" text NOT NULL,
    "heroHighlight" text,
    "heroSubtitle" text,
    "heroDescription" text,
    "introTitle" text,
    "introBody" text,
    sections text,
    "seoMetadataId" text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TeamPage" OWNER TO postgres;

--
-- Name: Tenant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tenant" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Tenant" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    "passwordHash" text NOT NULL,
    role public."Role" DEFAULT 'VIEWER'::public."Role" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isSystemAdmin" boolean DEFAULT false NOT NULL,
    "tenantId" text,
    "appRoleId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _AppRoleToPermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_AppRoleToPermission" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_AppRoleToPermission" OWNER TO postgres;

--
-- Name: _BlogPostToCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_BlogPostToCategory" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_BlogPostToCategory" OWNER TO postgres;

--
-- Name: _BlogPostToTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_BlogPostToTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_BlogPostToTag" OWNER TO postgres;

--
-- Name: _MediaToMediaTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_MediaToMediaTag" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_MediaToMediaTag" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: AppMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AppMeta" (key, value, "createdAt", "updatedAt") FROM stdin;
system.version.current	1.0.0	2026-04-19 11:39:50.329	2026-04-19 12:00:22.787
\.


--
-- Data for Name: AppRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AppRole" (id, key, name, "isSystem", "createdAt", "updatedAt") FROM stdin;
cmo5jool6000a60l96gyqlbop	super_admin	Super Admin	t	2026-04-19 09:09:41.371	2026-04-19 09:09:41.371
\.


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogPost" (id, title, slug, content, excerpt, "featuredImage", faq, "authorId", published, "seoMetadataId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, slug, "seoMetadataId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Deal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Deal" (id, name, email, status, value, "pipelineStage", "customFields", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: GlobalSeo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GlobalSeo" (id, "defaultMetaTitle", "defaultMetaDescription", "ogSiteName", "ogImage", "twitterHandle", "googleAnalyticsId", "googleSearchConsoleId", "bingWebmasterId", "schemaMarkup", "schemaJson", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Homepage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Homepage" (id, "heroTitle", "heroSubtitle", "heroImage", features, testimonials, stats, faq, "seoMetadataId", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Inquiry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Inquiry" (id, name, email, subject, message, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Media" (id, name, url, key, size, type, width, height, "altText", caption, description, "folderId", category, "createdAt", "updatedAt") FROM stdin;
cmo5jqtcc000f60l9zli1r33l	download.jpeg	/uploads/8e36d41d-0ae7-4760-9cee-b07af09d2ea3.jpeg	media-1776589880755-download.jpeg	9790	image/jpeg	1200	800	\N	\N	\N	\N	uncategorized	2026-04-19 09:11:20.844	2026-04-19 09:11:20.844
\.


--
-- Data for Name: MediaFolder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MediaFolder" (id, name, slug, "parentId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MediaTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MediaTag" (id, name, slug, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: NotFoundLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NotFoundLog" (id, url, "userAgent", referer, hits, "lastAccessed", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, name, email, phone, service, plan, currency, "monthlyTotal", "termMonths", "contractTotal", status, details, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Page" (id, title, slug, excerpt, content, template, status, "seoMetadataId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PageSection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PageSection" (id, "pageId", type, title, settings, content, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, key, label, "createdAt", "updatedAt") FROM stdin;
cmo5jookz000260l906umzhrd	dashboard:access	dashboard:access	2026-04-19 09:09:41.363	2026-04-19 09:09:41.363
cmo5jookz000360l9ak4biapl	users:manage	users:manage	2026-04-19 09:09:41.363	2026-04-19 09:09:41.363
cmo5jookz000460l9l9tiorf1	settings:manage	settings:manage	2026-04-19 09:09:41.363	2026-04-19 09:09:41.363
cmo5jookz000560l9uvfcvoet	crm:manage	crm:manage	2026-04-19 09:09:41.363	2026-04-19 09:09:41.363
cmo5jookz000660l98x46gwa6	blog:manage	blog:manage	2026-04-19 09:09:41.363	2026-04-19 09:09:41.363
cmo5jookz000760l9jclf1jt4	cms:manage	cms:manage	2026-04-19 09:09:41.363	2026-04-19 09:09:41.363
cmo5jookz000860l9a8zdw9f5	seo:manage	seo:manage	2026-04-19 09:09:41.363	2026-04-19 09:09:41.363
cmo5jookz000960l9uhif3w7a	media:manage	media:manage	2026-04-19 09:09:41.363	2026-04-19 09:09:41.363
\.


--
-- Data for Name: Portfolio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Portfolio" (id, title, slug, client, description, image, content, "seoMetadataId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Redirect; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Redirect" (id, source, destination, "statusCode", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ReusableComponent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ReusableComponent" (id, name, slug, type, schema, payload, "seoMetadataId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SeoMetadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SeoMetadata" (id, "metaTitle", "metaDescription", keywords, "focusKeyword", "ogImage", canonical, "canonicalUrl", "schemaMarkup", "schemaJson", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Service" (id, name, slug, description, icon, image, content, features, "order", "categoryId", "seoMetadataId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ServiceCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ServiceCategory" (id, name, slug, description, icon, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "sessionToken", "userId", expires, "createdAt") FROM stdin;
cmo5joomq000e60l90h3d0d6b	9ca844bf-2be8-48ec-9e84-14bffa3503e7	cmo5jooli000c60l9xga7xw1n	2026-04-26 09:09:41.425	2026-04-19 09:09:41.426
\.


--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SiteSettings" (id, "siteName", logo, favicon, "primaryColor", "secondaryColor", "contactInfo", "socialLinks", "currencyCode", "currencySymbol", "siteDescription", "smtpSettings", "footerData", "headerData", "featureFlags", "moduleSettings", "sitemapConfig", "imageSeoConfig", "aiConfig", "indexingConfig", "localSeoConfig", "roleManagerConfig", "analyticsConfig", "updatedAt") FROM stdin;
\.


--
-- Data for Name: StaticPage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StaticPage" (id, title, slug, content, "seoMetadataId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SystemUpdateJob; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemUpdateJob" (id, "targetKind", "currentVersion", "targetVersion", status, strategy, "manifestUrl", changelog, "downloadUrl", "backupPath", summary, "errorMessage", log, "restartRequired", "triggeredByUserId", "startedAt", "completedAt", "createdAt", "updatedAt") FROM stdin;
cmo5p8vt40005bagdcmytsrbc	core	1.0.0	1.0.1	failed	git	https://raw.githubusercontent.com/flowragetech/flowrage-crm/main/public/version.json	Fixed bugs and improved update system	https://github.com/flowragetech/flowrage-crm/releases/download/v1.0.1/app.zip	\N	Update failed. Review the job log and backup before retrying.	Command failed: $env:PGPASSWORD="@Sunil.2026"; pg_dump -h "localhost" -p "5432" -U "postgres" -d "flowrage-crm" -n "public" -f "F:\\Flowrage\\flowrage-crm\\backups\\system-update-2026-04-19T11-45-22-371Z.sql"\nThe filename, directory name, or volume label syntax is incorrect.\r\n\nThe filename, directory name, or volume label syntax is incorrect.	2026-04-19T11:45:22.229Z Update job started for target version 1.0.1.\n2026-04-19T11:45:22.365Z Working tree check passed.\n2026-04-19T11:45:22.422Z Update failed: Command failed: $env:PGPASSWORD="@Sunil.2026"; pg_dump -h "localhost" -p "5432" -U "postgres" -d "flowrage-crm" -n "public" -f "F:\\Flowrage\\flowrage-crm\\backups\\system-update-2026-04-19T11-45-22-371Z.sql"\nThe filename, directory name, or volume label syntax is incorrect.\r\n\nThe filename, directory name, or volume label syntax is incorrect.	f	cmo5jooli000c60l9xga7xw1n	2026-04-19 11:45:22.217	2026-04-19 11:45:22.424	2026-04-19 11:45:21.928	2026-04-19 11:45:22.425
cmo5p3pg40001bagdde2okafy	core	1.0.0	1.0.1	failed	git	https://raw.githubusercontent.com/flowragetech/flowrage-crm/main/public/version.json	Fixed bugs and improved update system	https://github.com/flowragetech/flowrage-crm/releases/download/v1.0.1/app.zip	\N	Update failed. Review the job log and backup before retrying.	Working tree has uncommitted changes. Commit or stash them, or set UPDATE_ALLOW_DIRTY=true after reviewing the risk.	2026-04-19T11:41:20.708Z Update job started for target version 1.0.1.\n2026-04-19T11:41:20.837Z Update failed: Working tree has uncommitted changes. Commit or stash them, or set UPDATE_ALLOW_DIRTY=true after reviewing the risk.	f	cmo5jooli000c60l9xga7xw1n	2026-04-19 11:41:20.7	2026-04-19 11:41:20.839	2026-04-19 11:41:20.404	2026-04-19 11:41:20.841
cmo5psjkj0001ybew3ui6tyrq	core	1.0.0	1.0.1	running	git	https://raw.githubusercontent.com/flowragetech/flowrage-crm/main/public/version.json	Fixed bugs and improved update system	https://github.com/flowragetech/flowrage-crm/releases/download/v1.0.1/app.zip	\N	Creating backup and applying update.	\N	2026-04-19T12:00:39.483Z Update job started for target version 1.0.1.\n2026-04-19T12:00:39.616Z Working tree check passed.	f	cmo5jooli000c60l9xga7xw1n	2026-04-19 12:00:39.474	\N	2026-04-19 12:00:39.187	2026-04-19 12:00:39.617
cmo5p86d60003bagdugkhmk92	core	1.0.0	1.0.1	failed	git	https://raw.githubusercontent.com/flowragetech/flowrage-crm/main/public/version.json	Fixed bugs and improved update system	https://github.com/flowragetech/flowrage-crm/releases/download/v1.0.1/app.zip	\N	Update failed. Review the job log and backup before retrying.	Working tree has uncommitted changes. Commit or stash them, or set UPDATE_ALLOW_DIRTY=true after reviewing the risk.	2026-04-19T11:44:49.217Z Update job started for target version 1.0.1.\n2026-04-19T11:44:49.336Z Update failed: Working tree has uncommitted changes. Commit or stash them, or set UPDATE_ALLOW_DIRTY=true after reviewing the risk.	f	cmo5jooli000c60l9xga7xw1n	2026-04-19 11:44:49.208	2026-04-19 11:44:49.338	2026-04-19 11:44:48.954	2026-04-19 11:44:49.339
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (id, name, "seoMetadataId", slug, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TeamMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamMember" (id, name, role, slug, "shortBio", "fullBio", photo, expertise, experience, ordering, "socialLinks", "isFeatured", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TeamPage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TeamPage" (id, "heroTitle", "heroHighlight", "heroSubtitle", "heroDescription", "introTitle", "introBody", sections, "seoMetadataId", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Tenant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tenant" (id, name, slug, "isDefault", "createdAt", "updatedAt") FROM stdin;
cmo5jooku000160l98sww4o3n	Default Tenant	default	t	2026-04-19 09:09:41.358	2026-04-19 09:09:41.358
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, "passwordHash", role, "isActive", "isSystemAdmin", "tenantId", "appRoleId", "createdAt", "updatedAt") FROM stdin;
cmo5jooli000c60l9xga7xw1n	codersunilkumar@gmail.com	Sunil Kumar Yadav	$2a$12$2KWO.V5y0jgQCyBwcy9lxeb5PFC5y726cITBby61/MuCbolvy6tPC	SUPER_ADMIN	t	t	cmo5jooku000160l98sww4o3n	cmo5jool6000a60l96gyqlbop	2026-04-19 09:09:41.383	2026-04-19 09:09:41.383
\.


--
-- Data for Name: _AppRoleToPermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_AppRoleToPermission" ("A", "B") FROM stdin;
cmo5jool6000a60l96gyqlbop	cmo5jookz000260l906umzhrd
cmo5jool6000a60l96gyqlbop	cmo5jookz000360l9ak4biapl
cmo5jool6000a60l96gyqlbop	cmo5jookz000460l9l9tiorf1
cmo5jool6000a60l96gyqlbop	cmo5jookz000560l9uvfcvoet
cmo5jool6000a60l96gyqlbop	cmo5jookz000660l98x46gwa6
cmo5jool6000a60l96gyqlbop	cmo5jookz000760l9jclf1jt4
cmo5jool6000a60l96gyqlbop	cmo5jookz000860l9a8zdw9f5
cmo5jool6000a60l96gyqlbop	cmo5jookz000960l9uhif3w7a
\.


--
-- Data for Name: _BlogPostToCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BlogPostToCategory" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _BlogPostToTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BlogPostToTag" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _MediaToMediaTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_MediaToMediaTag" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
916f7ede-460e-4c62-b74a-23fc48762234	e019ed500951f94ec566930dc937e5e45fbeee93f92ab312b4133d439d5a0454	2026-04-19 17:24:02.002683+05:45	20260419060424_init		\N	2026-04-19 17:24:02.002683+05:45	0
d2897ff1-275c-4b3f-acac-61b43f1d1e76	1c09b3ed49f70c7ce04db709a7e3c707f666bd264734340e2461ce4f6a03054b	2026-04-19 17:24:20.812549+05:45	20260419110000_system_updates	\N	\N	2026-04-19 17:24:20.652632+05:45	1
\.


--
-- Name: AppMeta AppMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppMeta"
    ADD CONSTRAINT "AppMeta_pkey" PRIMARY KEY (key);


--
-- Name: AppRole AppRole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AppRole"
    ADD CONSTRAINT "AppRole_pkey" PRIMARY KEY (id);


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Deal Deal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Deal"
    ADD CONSTRAINT "Deal_pkey" PRIMARY KEY (id);


--
-- Name: GlobalSeo GlobalSeo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GlobalSeo"
    ADD CONSTRAINT "GlobalSeo_pkey" PRIMARY KEY (id);


--
-- Name: Homepage Homepage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Homepage"
    ADD CONSTRAINT "Homepage_pkey" PRIMARY KEY (id);


--
-- Name: Inquiry Inquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Inquiry"
    ADD CONSTRAINT "Inquiry_pkey" PRIMARY KEY (id);


--
-- Name: MediaFolder MediaFolder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaFolder"
    ADD CONSTRAINT "MediaFolder_pkey" PRIMARY KEY (id);


--
-- Name: MediaTag MediaTag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaTag"
    ADD CONSTRAINT "MediaTag_pkey" PRIMARY KEY (id);


--
-- Name: Media Media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_pkey" PRIMARY KEY (id);


--
-- Name: NotFoundLog NotFoundLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotFoundLog"
    ADD CONSTRAINT "NotFoundLog_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: PageSection PageSection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PageSection"
    ADD CONSTRAINT "PageSection_pkey" PRIMARY KEY (id);


--
-- Name: Page Page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Page"
    ADD CONSTRAINT "Page_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: Portfolio Portfolio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Portfolio"
    ADD CONSTRAINT "Portfolio_pkey" PRIMARY KEY (id);


--
-- Name: Redirect Redirect_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Redirect"
    ADD CONSTRAINT "Redirect_pkey" PRIMARY KEY (id);


--
-- Name: ReusableComponent ReusableComponent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReusableComponent"
    ADD CONSTRAINT "ReusableComponent_pkey" PRIMARY KEY (id);


--
-- Name: SeoMetadata SeoMetadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SeoMetadata"
    ADD CONSTRAINT "SeoMetadata_pkey" PRIMARY KEY (id);


--
-- Name: ServiceCategory ServiceCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ServiceCategory"
    ADD CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: SiteSettings SiteSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiteSettings"
    ADD CONSTRAINT "SiteSettings_pkey" PRIMARY KEY (id);


--
-- Name: StaticPage StaticPage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StaticPage"
    ADD CONSTRAINT "StaticPage_pkey" PRIMARY KEY (id);


--
-- Name: SystemUpdateJob SystemUpdateJob_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemUpdateJob"
    ADD CONSTRAINT "SystemUpdateJob_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: TeamMember TeamMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamMember"
    ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY (id);


--
-- Name: TeamPage TeamPage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamPage"
    ADD CONSTRAINT "TeamPage_pkey" PRIMARY KEY (id);


--
-- Name: Tenant Tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tenant"
    ADD CONSTRAINT "Tenant_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AppRole_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AppRole_key_key" ON public."AppRole" USING btree (key);


--
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: Homepage_seoMetadataId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Homepage_seoMetadataId_key" ON public."Homepage" USING btree ("seoMetadataId");


--
-- Name: MediaFolder_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MediaFolder_slug_key" ON public."MediaFolder" USING btree (slug);


--
-- Name: MediaTag_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MediaTag_slug_key" ON public."MediaTag" USING btree (slug);


--
-- Name: Media_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Media_key_key" ON public."Media" USING btree (key);


--
-- Name: NotFoundLog_url_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NotFoundLog_url_key" ON public."NotFoundLog" USING btree (url);


--
-- Name: Page_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Page_slug_key" ON public."Page" USING btree (slug);


--
-- Name: Permission_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_key_key" ON public."Permission" USING btree (key);


--
-- Name: Portfolio_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Portfolio_slug_key" ON public."Portfolio" USING btree (slug);


--
-- Name: Redirect_source_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Redirect_source_key" ON public."Redirect" USING btree (source);


--
-- Name: ReusableComponent_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ReusableComponent_slug_key" ON public."ReusableComponent" USING btree (slug);


--
-- Name: ServiceCategory_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON public."ServiceCategory" USING btree (slug);


--
-- Name: Service_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Service_slug_key" ON public."Service" USING btree (slug);


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: StaticPage_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StaticPage_slug_key" ON public."StaticPage" USING btree (slug);


--
-- Name: Tag_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_slug_key" ON public."Tag" USING btree (slug);


--
-- Name: TeamMember_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TeamMember_slug_key" ON public."TeamMember" USING btree (slug);


--
-- Name: TeamPage_seoMetadataId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TeamPage_seoMetadataId_key" ON public."TeamPage" USING btree ("seoMetadataId");


--
-- Name: Tenant_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tenant_slug_key" ON public."Tenant" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: _AppRoleToPermission_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_AppRoleToPermission_AB_unique" ON public."_AppRoleToPermission" USING btree ("A", "B");


--
-- Name: _AppRoleToPermission_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_AppRoleToPermission_B_index" ON public."_AppRoleToPermission" USING btree ("B");


--
-- Name: _BlogPostToCategory_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_BlogPostToCategory_AB_unique" ON public."_BlogPostToCategory" USING btree ("A", "B");


--
-- Name: _BlogPostToCategory_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_BlogPostToCategory_B_index" ON public."_BlogPostToCategory" USING btree ("B");


--
-- Name: _BlogPostToTag_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_BlogPostToTag_AB_unique" ON public."_BlogPostToTag" USING btree ("A", "B");


--
-- Name: _BlogPostToTag_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_BlogPostToTag_B_index" ON public."_BlogPostToTag" USING btree ("B");


--
-- Name: _MediaToMediaTag_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_MediaToMediaTag_AB_unique" ON public."_MediaToMediaTag" USING btree ("A", "B");


--
-- Name: _MediaToMediaTag_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_MediaToMediaTag_B_index" ON public."_MediaToMediaTag" USING btree ("B");


--
-- Name: BlogPost BlogPost_seoMetadataId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES public."SeoMetadata"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Category Category_seoMetadataId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES public."SeoMetadata"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Homepage Homepage_seoMetadataId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Homepage"
    ADD CONSTRAINT "Homepage_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES public."SeoMetadata"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MediaFolder MediaFolder_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaFolder"
    ADD CONSTRAINT "MediaFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."MediaFolder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Media Media_folderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES public."MediaFolder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PageSection PageSection_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PageSection"
    ADD CONSTRAINT "PageSection_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Page"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Page Page_seoMetadataId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Page"
    ADD CONSTRAINT "Page_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES public."SeoMetadata"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Portfolio Portfolio_seoMetadataId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Portfolio"
    ADD CONSTRAINT "Portfolio_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES public."SeoMetadata"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReusableComponent ReusableComponent_seoMetadataId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReusableComponent"
    ADD CONSTRAINT "ReusableComponent_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES public."SeoMetadata"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Service Service_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ServiceCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Service Service_seoMetadataId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES public."SeoMetadata"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StaticPage StaticPage_seoMetadataId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StaticPage"
    ADD CONSTRAINT "StaticPage_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES public."SeoMetadata"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SystemUpdateJob SystemUpdateJob_triggeredByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemUpdateJob"
    ADD CONSTRAINT "SystemUpdateJob_triggeredByUserId_fkey" FOREIGN KEY ("triggeredByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Tag Tag_seoMetadataId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES public."SeoMetadata"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TeamPage TeamPage_seoMetadataId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TeamPage"
    ADD CONSTRAINT "TeamPage_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES public."SeoMetadata"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_appRoleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_appRoleId_fkey" FOREIGN KEY ("appRoleId") REFERENCES public."AppRole"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _AppRoleToPermission _AppRoleToPermission_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_AppRoleToPermission"
    ADD CONSTRAINT "_AppRoleToPermission_A_fkey" FOREIGN KEY ("A") REFERENCES public."AppRole"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _AppRoleToPermission _AppRoleToPermission_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_AppRoleToPermission"
    ADD CONSTRAINT "_AppRoleToPermission_B_fkey" FOREIGN KEY ("B") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BlogPostToCategory _BlogPostToCategory_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogPostToCategory"
    ADD CONSTRAINT "_BlogPostToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES public."BlogPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BlogPostToCategory _BlogPostToCategory_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogPostToCategory"
    ADD CONSTRAINT "_BlogPostToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BlogPostToTag _BlogPostToTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogPostToTag"
    ADD CONSTRAINT "_BlogPostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES public."BlogPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BlogPostToTag _BlogPostToTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogPostToTag"
    ADD CONSTRAINT "_BlogPostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _MediaToMediaTag _MediaToMediaTag_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_MediaToMediaTag"
    ADD CONSTRAINT "_MediaToMediaTag_A_fkey" FOREIGN KEY ("A") REFERENCES public."Media"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _MediaToMediaTag _MediaToMediaTag_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_MediaToMediaTag"
    ADD CONSTRAINT "_MediaToMediaTag_B_fkey" FOREIGN KEY ("B") REFERENCES public."MediaTag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict NKzbUe2Uujvk5Nsggspu8AiyfEY8kUFE9WM3GnzMka4UUMojpr1FW8cHusPcwsZ

