export interface SeoCheck {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export interface SeoAnalysisInput {
  focusKeyword: string;
  title: string;
  description: string;
  slug: string;
  content?: string;
}

export interface SeoAnalysisResult {
  score: number;
  checks: SeoCheck[];
  suggestions: string[];
}

const TITLE_MIN = 45;
const TITLE_MAX = 60;
const DESCRIPTION_MIN = 140;
const DESCRIPTION_MAX = 160;

function cleanText(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function keywordDensity(keyword: string, content: string) {
  if (!keyword || !content) {
    return 0;
  }

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = content.match(new RegExp(escaped, 'gi')) ?? [];
  const words = content.split(/\s+/).filter(Boolean).length;

  return words === 0 ? 0 : (matches.length / words) * 100;
}

export function analyzeSeo({
  focusKeyword,
  title,
  description,
  slug,
  content = ''
}: SeoAnalysisInput): SeoAnalysisResult {
  const checks: SeoCheck[] = [];
  const suggestions: string[] = [];
  const normalizedKeyword = focusKeyword.trim().toLowerCase();
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedDescription = description.trim().toLowerCase();
  const normalizedSlug = slug.trim().toLowerCase();
  const plainContent = cleanText(content).toLowerCase();
  const wordCount = plainContent.split(/\s+/).filter(Boolean).length;
  const density = keywordDensity(normalizedKeyword, plainContent);
  let score = 0;

  if (!normalizedKeyword) {
    return {
      score: 0,
      checks: [
        {
          id: 'focus-keyword',
          label: 'Focus Keyword',
          status: 'fail',
          message: 'Add a focus keyword to activate SEO analysis.'
        }
      ],
      suggestions: [
        'Pick one clear keyword or phrase to optimize this page for.'
      ]
    };
  }

  const pushCheck = (check: SeoCheck, points = 0, suggestion?: string) => {
    checks.push(check);
    score += points;

    if (suggestion && check.status !== 'pass') {
      suggestions.push(suggestion);
    }
  };

  pushCheck(
    {
      id: 'keyword-title',
      label: 'Keyword In Title',
      status: normalizedTitle.includes(normalizedKeyword) ? 'pass' : 'fail',
      message: normalizedTitle.includes(normalizedKeyword)
        ? 'Focus keyword appears in the SEO title.'
        : 'Focus keyword is missing from the SEO title.'
    },
    normalizedTitle.includes(normalizedKeyword) ? 20 : 0,
    'Include the focus keyword in the title, ideally near the beginning.'
  );

  const titleLengthOk = title.length >= TITLE_MIN && title.length <= TITLE_MAX;
  pushCheck(
    {
      id: 'title-length',
      label: 'Title Length',
      status: titleLengthOk ? 'pass' : 'warning',
      message: titleLengthOk
        ? `Title length is ${title.length} characters.`
        : `Title length is ${title.length} characters; aim for ${TITLE_MIN}-${TITLE_MAX}.`
    },
    titleLengthOk ? 10 : 4,
    'Keep titles concise enough to avoid SERP truncation.'
  );

  const hasCtrHook = /\d|how|best|guide|tips|template|checklist|proven/i.test(
    title
  );
  pushCheck(
    {
      id: 'ctr-hook',
      label: 'CTR Hook',
      status: hasCtrHook ? 'pass' : 'warning',
      message: hasCtrHook
        ? 'Title includes a hook that can improve click-through rate.'
        : 'Title could use a stronger click-through hook.'
    },
    hasCtrHook ? 10 : 4,
    'Test adding a number, benefit, timeframe, or intent-driven modifier.'
  );

  const descriptionHasKeyword =
    normalizedDescription.includes(normalizedKeyword);
  pushCheck(
    {
      id: 'keyword-description',
      label: 'Keyword In Description',
      status: descriptionHasKeyword ? 'pass' : 'warning',
      message: descriptionHasKeyword
        ? 'Focus keyword appears in the meta description.'
        : 'Meta description does not include the focus keyword.'
    },
    descriptionHasKeyword ? 12 : 5,
    'Work the keyword naturally into the meta description.'
  );

  const descriptionLengthOk =
    description.length >= DESCRIPTION_MIN &&
    description.length <= DESCRIPTION_MAX;
  pushCheck(
    {
      id: 'description-length',
      label: 'Description Length',
      status: descriptionLengthOk ? 'pass' : 'warning',
      message: descriptionLengthOk
        ? `Description length is ${description.length} characters.`
        : `Description length is ${description.length}; aim for ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}.`
    },
    descriptionLengthOk ? 10 : 4,
    'Aim for a description long enough to sell the click, but not so long it gets cut off.'
  );

  const slugHasKeyword =
    normalizedKeyword.length > 0 &&
    normalizedSlug.includes(normalizedKeyword.replace(/\s+/g, '-'));
  pushCheck(
    {
      id: 'keyword-slug',
      label: 'Keyword In URL',
      status: slugHasKeyword ? 'pass' : 'warning',
      message: slugHasKeyword
        ? 'URL slug reflects the focus keyword.'
        : 'URL slug could align more closely with the focus keyword.'
    },
    slugHasKeyword ? 8 : 4,
    'Use a short, readable slug that includes the focus keyword.'
  );

  const contentLengthOk = wordCount >= 400;
  pushCheck(
    {
      id: 'content-depth',
      label: 'Content Depth',
      status: contentLengthOk ? 'pass' : wordCount > 150 ? 'warning' : 'fail',
      message: `Content contains approximately ${wordCount} words.`
    },
    contentLengthOk ? 10 : wordCount > 150 ? 5 : 0,
    'Add more depth so the page can answer intent more completely.'
  );

  const keywordInContent = plainContent.includes(normalizedKeyword);
  pushCheck(
    {
      id: 'keyword-content',
      label: 'Keyword In Content',
      status: keywordInContent ? 'pass' : 'fail',
      message: keywordInContent
        ? 'Focus keyword appears in the page content.'
        : 'Focus keyword is missing from the page content.'
    },
    keywordInContent ? 10 : 0,
    'Mention the focus keyword in the opening content and one supporting section.'
  );

  const densityHealthy = density >= 0.5 && density <= 2.5;
  pushCheck(
    {
      id: 'keyword-density',
      label: 'Keyword Usage',
      status: densityHealthy ? 'pass' : density === 0 ? 'fail' : 'warning',
      message:
        density === 0
          ? 'Keyword usage is currently 0%.'
          : `Keyword density is ${density.toFixed(2)}%.`
    },
    densityHealthy ? 8 : density > 0 ? 4 : 0,
    'Keep keyword usage natural and within a healthy range.'
  );

  const internalLinks = (content.match(/href="\/(?!\/)/g) ?? []).length;
  pushCheck(
    {
      id: 'internal-links',
      label: 'Internal Linking',
      status: internalLinks > 0 ? 'pass' : 'warning',
      message:
        internalLinks > 0
          ? `Content includes ${internalLinks} internal link${internalLinks > 1 ? 's' : ''}.`
          : 'No internal links were detected in the content.'
    },
    internalLinks > 0 ? 7 : 3,
    'Add at least one relevant internal link to strengthen topical relationships.'
  );

  const readabilityOk =
    wordCount === 0 ||
    plainContent.split(/[.!?]+/).every((sentence) => {
      const words = sentence.trim().split(/\s+/).filter(Boolean);
      return words.length <= 24;
    });
  pushCheck(
    {
      id: 'readability',
      label: 'Readability',
      status: readabilityOk ? 'pass' : 'warning',
      message: readabilityOk
        ? 'Sentence length looks readable.'
        : 'Some sentences appear long; shorter sentences usually read better.'
    },
    readabilityOk ? 5 : 2,
    'Break long sentences and large paragraphs into tighter sections.'
  );

  return {
    score: Math.min(100, score),
    checks,
    suggestions: suggestions.slice(0, 5)
  };
}
