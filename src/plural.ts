export function plural(
  plural: string,
  singular: string,
  count: number
): string {
  if (count === 1) {
    return singular;
  } else {
    return plural;
  }
};