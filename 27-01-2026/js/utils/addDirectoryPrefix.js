// addDirectoryPrefix.js

export const addPrefixAndSiteVersion = (path = "") => {
  //return "/" + path;
  return "/lionsheartstudios//lionsheartstudios/27-01-26/" + path; // with trailing slash
};

export const addPrefixOnly = (path = "") => {
  //return "/" + path;
  return "/lionsheartstudios/" + path; // with trailing slash
};
