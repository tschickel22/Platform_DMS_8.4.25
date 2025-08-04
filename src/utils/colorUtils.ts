export function getConversionColor(value: number): string {
  if (value >= 75) return 'text-green-600';
  if (value >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'current':
    case 'completed':
      return 'text-green-600';
    case 'pending':
    case 'in_progress':
      return 'text-yellow-600';
    case 'failed':
    case 'cancelled':
    case 'expired':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high':
    case 'urgent':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}