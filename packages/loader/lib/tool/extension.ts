export function getExtension(url: string): string {
  let ext = '';

  const queryStart = url.indexOf('?');
  const hashStart = url.indexOf('#');
  const index = Math.min(
    queryStart > -1 ? queryStart : url.length,
    hashStart > -1 ? hashStart : url.length
  );

  url = url.substring(0, index);
  ext = url.substring(url.lastIndexOf('.') + 1);


  return ext.toLowerCase();
}