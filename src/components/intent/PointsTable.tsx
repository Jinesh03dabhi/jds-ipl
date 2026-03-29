"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import PointsTablePanel from "./PointsTablePanel";
import type { IplLiveResponse, IplMatch } from "@/lib/ipl-data";
import { formatEditorialTimestamp } from "@/lib/content";
import { IPL_SEASON_YEAR } from "@/lib/site";
import {
  applyMatchUpdate,
  createPointsTableState,
  getCompletedMatchInputs,
  parsePointsTableMatch,
  type PointsTableMatchInput,
} from "@/lib/points-table";

type PointsTableProps = {
  initialMatches: IplMatch[];
  initialRealtimeMatch?: IplMatch | null;
  initialRealtimeUpdatedAt?: string | null;
  baselineUpdatedAt?: string | null;
  pollIntervalMs?: number;
};

const STORAGE_KEY = `ipl-points-table-pending-${IPL_SEASON_YEAR}`;

function isPointsTableMatchInput(value: unknown): value is PointsTableMatchInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PointsTableMatchInput>;
  return (
    typeof candidate.matchId === "string" &&
    typeof candidate.teamA === "string" &&
    typeof candidate.teamB === "string" &&
    typeof candidate.scoreA === "number" &&
    typeof candidate.scoreB === "number" &&
    (typeof candidate.oversA === "number" || typeof candidate.oversA === "string") &&
    (typeof candidate.oversB === "number" || typeof candidate.oversB === "string")
  );
}

function withCompletedAt(
  match: PointsTableMatchInput | null,
  completedAt?: string | null,
) {
  if (!match) {
    return null;
  }

  return {
    ...match,
    completedAt: completedAt || match.completedAt || new Date().toISOString(),
  } satisfies PointsTableMatchInput;
}

function readStoredPendingMatches() {
  if (typeof window === "undefined") {
    return [] as PointsTableMatchInput[];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [] as PointsTableMatchInput[];
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter(isPointsTableMatchInput)
      : ([] as PointsTableMatchInput[]);
  } catch {
    return [] as PointsTableMatchInput[];
  }
}

function sortPendingMatches(matches: PointsTableMatchInput[]) {
  return [...matches].sort((left, right) => {
    const leftTime = left.completedAt ? new Date(left.completedAt).getTime() : 0;
    const rightTime = right.completedAt ? new Date(right.completedAt).getTime() : 0;
    return leftTime - rightTime;
  });
}

export default function PointsTable({
  initialMatches,
  initialRealtimeMatch = null,
  initialRealtimeUpdatedAt = null,
  baselineUpdatedAt = null,
  pollIntervalMs = 60_000,
}: PointsTableProps) {
  const [pendingMatches, setPendingMatches] = useState<PointsTableMatchInput[]>(() =>
    readStoredPendingMatches(),
  );

  const baselineState = useMemo(
    () => createPointsTableState(getCompletedMatchInputs(initialMatches)),
    [initialMatches],
  );

  const realtimeMatchUpdate = useMemo(
    () =>
      withCompletedAt(
        initialRealtimeMatch ? parsePointsTableMatch(initialRealtimeMatch) : null,
        initialRealtimeUpdatedAt,
      ),
    [initialRealtimeMatch, initialRealtimeUpdatedAt],
  );

  const effectivePendingMatches = useMemo(() => {
    const appliedMatchIds = new Set(baselineState.appliedMatchIds);
    const mergedPending = [...pendingMatches];

    if (
      realtimeMatchUpdate &&
      !appliedMatchIds.has(realtimeMatchUpdate.matchId) &&
      !mergedPending.some((match) => match.matchId === realtimeMatchUpdate.matchId)
    ) {
      mergedPending.push(realtimeMatchUpdate);
    }

    return sortPendingMatches(
      mergedPending.filter((match) => !appliedMatchIds.has(match.matchId)),
    );
  }, [baselineState.appliedMatchIds, pendingMatches, realtimeMatchUpdate]);

  const tableState = useMemo(
    () =>
      effectivePendingMatches.reduce(
        (state, match) => applyMatchUpdate(state, match),
        baselineState,
      ),
    [baselineState, effectivePendingMatches],
  );

  const deferredRows = useDeferredValue(tableState.rows);
  const displayUpdatedAt =
    effectivePendingMatches.length > 0
      ? tableState.lastUpdated
      : baselineUpdatedAt || tableState.lastUpdated;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(effectivePendingMatches));
  }, [effectivePendingMatches]);

  const addCompletedMatch = useEffectEvent((match: PointsTableMatchInput) => {
    startTransition(() => {
      setPendingMatches((currentMatches) => {
        if (currentMatches.some((currentMatch) => currentMatch.matchId === match.matchId)) {
          return currentMatches;
        }

        return sortPendingMatches([...currentMatches, match]);
      });
    });
  });

  const pollLatestCompletion = useEffectEvent(async () => {
    try {
      const response = await fetch("/api/live-score?mode=points-table", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as IplLiveResponse;
      if (payload.type !== "completed" || !payload.match) {
        return;
      }

      const completedMatch = parsePointsTableMatch(payload.match);
      if (!completedMatch) {
        return;
      }

      addCompletedMatch(withCompletedAt(completedMatch, payload.lastUpdated) || completedMatch);
    } catch {
      // Ignore transient polling failures and try again on the next tick.
    }
  });

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void pollLatestCompletion();
    }, 0);
    const intervalId = window.setInterval(() => {
      void pollLatestCompletion();
    }, pollIntervalMs);

    return () => {
      window.clearTimeout(timerId);
      window.clearInterval(intervalId);
    };
  }, [pollIntervalMs]);

  return (
    <PointsTablePanel
      rows={deferredRows}
      lastUpdatedLabel={
        displayUpdatedAt ? formatEditorialTimestamp(new Date(displayUpdatedAt)) : null
      }
      isRealtime={effectivePendingMatches.length > 0}
    />
  );
}
