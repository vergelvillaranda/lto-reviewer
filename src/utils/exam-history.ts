export function formatExamHistoryDate(completedAt: string): string {
  return new Date(completedAt).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatExamHistoryTime(completedAt: string): string {
  return new Date(completedAt).toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
  });
}
