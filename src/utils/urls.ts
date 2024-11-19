import log from './logger';

export function generateParentUrls(url: string): string[] {
  try {
    const urlObj = new URL(url);
    let pathname = urlObj.pathname;
    const urlList = [urlObj.toString()];

    log.debug("Generating parent URLs for:", url);
    log.debug("URL object:", urlObj);

    // Remove hash
    if (urlObj.hash !== '') {
      urlObj.hash = '';
      urlList.push(urlObj.toString());
      log.debug("URL object:", urlObj);
    }

    // Remove search
    if (urlObj.search !== '') {
      urlObj.search = '';
      urlList.push(urlObj.toString());
      log.debug("URL object:", urlObj);
    }

    // Remove trailing slash
    if (pathname.endsWith("/") && !pathname.endsWith("//")) {
      pathname = pathname.slice(0, -1);
      urlObj.pathname = pathname;
      log.debug("URL object:", urlObj);
    }

    // Remove last directory
    while (pathname.lastIndexOf("/") >= 0) {
      pathname = pathname.substring(0, pathname.lastIndexOf("/"));
      urlObj.pathname = pathname;
      urlList.push(urlObj.toString());
      log.debug("URL object:", urlObj);
    }

    log.debug("Parent URLs:", urlList);

    return urlList;
  } catch (error) {
    log.error("Invalid URL provided:", url, error);
    return [url];
  }
}

export function getParentUrl(url: string, levels: number): string {
  const urlList = generateParentUrls(url);
  if (urlList.length === 0) {
    return url;
  }
  return urlList[Math.min(levels, urlList.length - 1)];
}