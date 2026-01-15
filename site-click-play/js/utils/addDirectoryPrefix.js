// addDirectoryPrefix.js

export const addPrefixAndSiteVersion = (path = "") => {
  //return path;
  return "/lionsheartstudios/site-click-play/" + path;
};

export const addPrefixOnly = (path = "") => {
  //return path;
  return "/lionsheartstudios/" + path;
};
