export const addPrefixAndSiteVersion = (path = "") => {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
};

export const addPrefixOnly = (path = "") => {
  const prefix = import.meta.env.VITE_PATH_PREFIX || "";
  const cleanPrefix = prefix.replace(/^\/|\/$/g, "");
  const cleanPath = path.replace(/^\//, "");

  if (!cleanPrefix) return cleanPath ? `/${cleanPath}` : "/";

  return cleanPath
    ? `/${cleanPrefix}/${cleanPath}`
    : `/${cleanPrefix}`;
};
