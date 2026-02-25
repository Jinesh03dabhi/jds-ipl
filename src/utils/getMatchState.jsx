export function getMatchState(data) {

if (!data) return "loading";

if (data.type === "loading") return "loading";

if (data.type === "error") return "error";

if (data.type === "live" && data.match) return "live";

if (data.type === "upcoming" && data.match) return "upcoming";

if (data.type === "last" && data.match) return "completed";

return "waiting";
}
