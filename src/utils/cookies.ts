/**
 * Get a single cookie given a name
 * @param name
 * @returns string
 */
export const getCookie = (name: string): string | null => {
  const _name = name + '=';
  if (document.cookie) {
    return (
      document.cookie
        .split(';')
        .map((c) => c.trim())
        .filter((cookie) => cookie.substring(0, _name.length) === _name)
        .map((cookie) =>
          decodeURIComponent(cookie.substring(_name.length))
        )[0] || null
    );
  }
  return null;
};
