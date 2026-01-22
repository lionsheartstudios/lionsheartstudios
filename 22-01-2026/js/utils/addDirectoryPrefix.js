// addDirectoryPrefix.js

export const addPrefixAndSiteVersion = (path = "") => {
  //return "/" + path;
  return "/lionsheartstudios/22-01-2026/" + path; // with trailing slash
};

export const addPrefixOnly = (path = "") => {
  //return "/" + path;
  return "/lionsheartstudios/" + path; // with trailing slash
};
