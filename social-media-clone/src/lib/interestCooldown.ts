export const INTEREST_UPDATE_COOLDOWN_DAYS = 7;
export const INTEREST_UPDATE_COOLDOWN_MS =
  INTEREST_UPDATE_COOLDOWN_DAYS * 24 * 60 * 60 * 1_000;

export function getNextInterestUpdateAt(lastUpdatedAt: Date) {
  return new Date(lastUpdatedAt.getTime() + INTEREST_UPDATE_COOLDOWN_MS);
}
