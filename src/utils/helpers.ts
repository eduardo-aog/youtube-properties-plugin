export function getYoutubeId(url: string): string | null {
  const videoId = url.split('v=')[1]?.split('&')[0];
  return videoId?.length === 11 ? videoId : null;
}

export function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return dateStr;
    
    try {
        return date.toISOString().split('T')[0] || '';
    } catch (e) {
        return dateStr;
    }
}