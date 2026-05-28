const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const SAFE_RESOURCE_PROTOCOLS = new Set(["http:", "https:"]);
const CONTROL_CHAR_PATTERN = /[\u0000-\u001F\u007F]/;

function cleanUrl(value: string) {
  const trimmed = value.trim();
  return trimmed && !CONTROL_CHAR_PATTERN.test(trimmed) ? trimmed : null;
}

export function safeInternalPath(value: string, siteUrl: string): string | null {
  const cleaned = cleanUrl(value);
  if (!cleaned || !cleaned.startsWith("/") || cleaned.startsWith("//")) {
    return null;
  }

  try {
    const base = new URL(siteUrl);
    const url = new URL(cleaned, base);
    if (url.origin !== base.origin) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function safeLinkHref(value: string): string | null {
  const cleaned = cleanUrl(value);
  if (!cleaned) return null;

  try {
    const url = new URL(cleaned);
    return SAFE_LINK_PROTOCOLS.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function safeResourceUrl(value: string, siteUrl: string): string | null {
  const internalPath = safeInternalPath(value, siteUrl);
  if (internalPath) return internalPath;

  const cleaned = cleanUrl(value);
  if (!cleaned) return null;

  try {
    const url = new URL(cleaned);
    return SAFE_RESOURCE_PROTOCOLS.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function youtubeEmbedUrl(value: string): string | null {
  const cleaned = cleanUrl(value);
  if (!cleaned) return null;

  try {
    const url = new URL(cleaned);
    const host = url.hostname.replace(/^www\./, "");
    let id = "";

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") id = url.searchParams.get("v") ?? "";
      if (url.pathname.startsWith("/embed/")) id = url.pathname.split("/")[2] ?? "";
    } else if (host === "youtu.be") {
      id = url.pathname.slice(1).split("/")[0] ?? "";
    }

    return /^[\w-]{11}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}
