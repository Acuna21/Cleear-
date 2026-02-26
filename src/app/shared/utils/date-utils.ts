export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const publishedDate = new Date(date);

  // Diferencia en milisegundos
  const diffInMs = now.getTime() - publishedDate.getTime();

  // Convertir a unidades
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  // Lógica de retorno
  if (diffInSeconds < 60) {
    return 'Recientemente';
  }

  if (diffInHours < 1) {
    return `${diffInMinutes}m`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  return 'Más de 1 día';
}
