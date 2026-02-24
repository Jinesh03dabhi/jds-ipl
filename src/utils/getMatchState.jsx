export function getMatchState(data) {
  if (!data) return "loading";

  if (data.type === "live") return "live";

  if (data.type === "upcoming") return "upcoming";

  if (data.type === "last") return "completed";

  return "waiting";
}