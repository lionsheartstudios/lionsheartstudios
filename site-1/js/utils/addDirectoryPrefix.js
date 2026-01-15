// addDirectoryPrefix.js

const clean = (s = "") => String(s).replace(/^\/+|\/+$/g, "");
const join = (...parts) => parts.map(clean).filter(Boolean).join("/");

const PATH_PREFIX = env.VITE_PATH_PREFIX || env.PATH_PREFIX || "";
const SITE_VERSION = env.VITE_SITE_VERSION || env.SITE_VERSION || "";

const withLeadingSlash = (s = "") => {
  const c = clean(s);
  return c ? `/${c}` : "";
};

export const addPrefixAndSiteVersion = (path = "") => {
  return withLeadingSlash(join(PATH_PREFIX, SITE_VERSION, path));
};

export const addPrefixOnly = (path = "") => {
  return withLeadingSlash(join(PATH_PREFIX, path));
};
