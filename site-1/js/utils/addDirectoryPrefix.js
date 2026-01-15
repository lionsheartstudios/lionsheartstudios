// addDirectoryPrefix.js

export const addPrefixAndSiteVersion = (path = "") => {
  return "/lionsheartstudios/site-1/" + path;
};

export const addPrefixOnly = (path = "") => {
  return "/lionsheartstudios/" + path;
};
