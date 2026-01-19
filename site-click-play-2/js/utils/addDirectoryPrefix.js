// addDirectoryPrefix.js

export const addPrefixAndSiteVersion = (path = "") => {
  //return path;
  return "/lionsheartstudios/site-click-play-2/" + path;
};

export const addPrefixOnly = (path = "") => {
  //return path;
  return "/lionsheartstudios/" + path;
};
