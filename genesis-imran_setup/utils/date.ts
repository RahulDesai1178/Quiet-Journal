import type { JournalEntry } from "@/types/database";

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeStyle: "short",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export function formatLongDateTime(value: string) {
  return longDateFormatter.format(new Date(value));
}

export function formatShortDate(value: string) {
  return shortDateFormatter.format(new Date(value));
}

export function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}

export function getWeekStart(reference = new Date()) {
  const date = new Date(reference);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getSnippet(content: string, maxLength = 140) {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

export function getWordCount(content: string) {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

export function getWeeklyEntryCount(entries: JournalEntry[], reference = new Date()) {
  const weekStart = getWeekStart(reference).getTime();

  return entries.filter((entry) => new Date(entry.created_at).getTime() >= weekStart).length;
}
