// addDirectoryPrefix.js

export const addPrefixAndSiteVersion = (path = "") => {
  //return path;
  return "/lionsheartstudios/site-hero-video/" + path;
};

export const addPrefixOnly = (path = "") => {
  //return path;
  return "/lionsheartstudios/" + path;
};
