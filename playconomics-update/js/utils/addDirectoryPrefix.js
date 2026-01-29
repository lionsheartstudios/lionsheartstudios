// addDirectoryPrefix.js

export const addPrefixAndSiteVersion = (path = "") => {
  //return "/" + path;
  return "/lionsheartstudios/playconomics-update/" + path; // with trailing slash
};

export const addPrefixOnly = (path = "") => {
  //return "/" + path;
  return "/lionsheartstudios/" + path; // with trailing slash
};
