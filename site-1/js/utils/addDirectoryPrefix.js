export const addPrefixAndSiteVersion = (path) => {
  const base = import.meta?.env?.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

export const addPrefixOnly = (path = "") => {
  const prefix = import.meta?.env?.VITE_PATH_PREFIX || "";

  const base =
    "/" +
    prefix.replace(/^\/|\/$/g, "") +
    "/";

  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};