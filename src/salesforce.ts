/**
 * URL builders for Salesforce email lookups.
 *
 * Both patterns were verified against a live org:
 *  - Lightning global search encodes its state as base64 JSON in the URL hash.
 *  - Classic UnifiedSearchResults takes a plain query string and, when you click
 *    a result, redirects into the Lightning record page.
 */

export type Target = "lightning" | "classicContacts" | "classicLeads" | "classicAll";

/** Salesforce key prefixes used to scope Classic search to a single object. */
export const KEY_PREFIX = {
  account: "001",
  contact: "003",
  opportunity: "006",
  lead: "00Q",
} as const;

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

/**
 * Pull a usable address out of whatever got pasted: a bare email, a mailto:
 * link, or a "Jane Doe <jane.doe@example.com>" style header value.
 */
export function normalizeEmail(input: string): string {
  let value = input.trim();
  const angled = value.match(/<([^<>]+)>/);
  if (angled) {
    value = angled[1];
  }
  value = value.replace(/^mailto:/i, "").trim();
  return value;
}

export function isValidEmail(input: string): boolean {
  return EMAIL_RE.test(normalizeEmail(input));
}

function lightningHost(myDomain: string): string {
  return `https://${myDomain}.lightning.force.com`;
}

function classicHost(myDomain: string): string {
  return `https://${myDomain}.my.salesforce.com`;
}

/**
 * Lightning global search. The hash is base64 of the search page's component
 * state. Only re-runs on a cold page load, which is what opening a new tab does.
 */
export function lightningSearchUrl(myDomain: string, email: string): string {
  const state = {
    componentDef: "forceSearch:searchPageDesktop",
    attributes: {
      term: email,
      scopeMap: { type: "TOP_RESULTS" },
    },
    state: {},
  };
  const encoded = encodeURIComponent(Buffer.from(JSON.stringify(state), "utf8").toString("base64"));
  return `${lightningHost(myDomain)}/one/one.app#${encoded}`;
}

/**
 * Classic search results. Pass a key prefix as `sen` to scope to one object,
 * or omit it to search everything the user has access to.
 */
export function classicSearchUrl(myDomain: string, email: string, keyPrefix?: string): string {
  const params = new URLSearchParams({ searchType: "2" });
  if (keyPrefix) {
    params.set("sen", keyPrefix);
  }
  params.set("str", email);
  return `${classicHost(myDomain)}/_ui/search/ui/UnifiedSearchResults?${params.toString()}`;
}

export function buildUrl(target: Target, myDomain: string, email: string): string {
  switch (target) {
    case "lightning":
      return lightningSearchUrl(myDomain, email);
    case "classicContacts":
      return classicSearchUrl(myDomain, email, KEY_PREFIX.contact);
    case "classicLeads":
      return classicSearchUrl(myDomain, email, KEY_PREFIX.lead);
    case "classicAll":
      return classicSearchUrl(myDomain, email);
  }
}
