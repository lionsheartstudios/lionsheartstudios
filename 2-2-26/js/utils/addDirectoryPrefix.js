// addDirectoryPrefix.js

export const addPrefixAndSiteVersion = (path = "") => {
  //return "/" + path;
  return "/lionsheartstudios/2-2-26/" + path; // with trailing slash
};

export const addPrefixOnly = (path = "") => {
  //return "/" + path;
  return "/lionsheartstudios/" + path; // with trailing slash
};
