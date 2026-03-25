import type { AuctionRecord, TeamId, TransferRecord } from "./types";

export function sortAuctionHistory(history: AuctionRecord[]) {
  return [...history].sort((left, right) => left.year - right.year);
}

export function deriveTransferHistory(
  history: AuctionRecord[],
): TransferRecord[] {
  const sortedHistory = sortAuctionHistory(history);
  const transfers: TransferRecord[] = [];

  for (let index = 1; index < sortedHistory.length; index += 1) {
    const previous = sortedHistory[index - 1];
    const current = sortedHistory[index];

    if (previous.teamId === current.teamId) {
      continue;
    }

    transfers.push({
      fromTeamId: previous.teamId,
      toTeamId: current.teamId,
      year: current.year,
      price: current.price,
    });
  }

  return transfers;
}

export function derivePreviousTeamId(
  history: AuctionRecord[],
  season: number,
  currentTeamId: TeamId,
) {
  const previousEntry = sortAuctionHistory(history)
    .filter((entry) => entry.year < season)
    .at(-1);

  if (!previousEntry || previousEntry.teamId === currentTeamId) {
    return undefined;
  }

  return previousEntry.teamId;
}

export function hasTransferInSeason(
  transferHistory: TransferRecord[],
  season: number,
) {
  return transferHistory.some((transfer) => transfer.year === season);
}

export function getLatestAuctionPrice(history: AuctionRecord[]) {
  return sortAuctionHistory(history).at(-1)?.price ?? "0.00 Cr";
}
