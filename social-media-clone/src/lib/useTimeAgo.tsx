import { useEffect, useState } from "react";

export function formatTimeAgo(createdAt: Date, now = new Date()) {
  const seconds = Math.max(
    0,
    Math.floor((now.getTime() - createdAt.getTime()) / 1_000),
  );

  if (seconds < 60) return "now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  return `${Math.floor(days / 365)}y`;
}

export default function useTimeAgo(createdAt: Date) {
  const createdAtTime = createdAt.getTime();
  const [timeAgo, setTimeAgo] = useState(() => formatTimeAgo(createdAt));

  useEffect(() => {
    function updateTimeAgo() {
      setTimeAgo(formatTimeAgo(new Date(createdAtTime)));
    }

    updateTimeAgo();
    const interval = window.setInterval(updateTimeAgo, 60_000);

    return () => window.clearInterval(interval);
  }, [createdAtTime]);

  return timeAgo;
}
