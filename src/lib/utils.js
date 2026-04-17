import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getStatusBadgeClass(status) {
  const map = {
    'Menunggu Verifikasi': 'badge-waiting',
    'Diverifikasi': 'badge-verified',
    'Diproses': 'badge-processing',
    'Selesai': 'badge-completed',
    'Ditolak': 'badge-rejected',
  };
  return map[status] || 'badge-waiting';
}

export function getStatusColor(status) {
  const map = {
    'Menunggu Verifikasi': 'text-gray-600',
    'Diverifikasi': 'text-blue-600',
    'Diproses': 'text-amber-600',
    'Selesai': 'text-green-600',
    'Ditolak': 'text-red-500',
  };
  return map[status] || 'text-gray-600';
}
