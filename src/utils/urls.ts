export async function createUrlList(url: string): Promise<string[]> {
  const urlList = [url];
  // Check if url contains # or ? and remove them
  if (url.indexOf("#") > 0) {
    url = url.substring(0, url.indexOf("#"));
    urlList.push(url);
  }
  if (url.indexOf("?") > 0) {
    url = url.substring(0, url.indexOf("?"));
    urlList.push(url);
  }
  // Remove last slash of url
  if (url.endsWith("/") && !url.endsWith("//")) {
    url = url.substring(0, url.length - 1);
  }
  // Remove last directory of url
  let idx = 0;
  while ((idx = url.lastIndexOf("/")) > 0) {
    if (idx > 0 && url.substring(idx - 1, idx) === "/") {
      break;
    }
    url = url.substring(0, idx);
    urlList.push(url);
  }
  return urlList;
}

export async function parentUrl(url: string, levels: number): Promise<string> {
  const urlList = await createUrlList(url);
  const len = urlList.length;
  if (len == 0) {
    return url;
  }
  if (levels >= len) {
    return urlList[len - 1];
  }
  return urlList[levels];
}
