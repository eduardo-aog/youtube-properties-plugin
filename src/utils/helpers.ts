export function getYoutubeId(url: string): string | null {
  const videoId = url.split('v=')[1]?.split('&')[0];
  return videoId?.length === 11 ? videoId : null;
}
