/*
type Element = {
	nodeName: string;
	nodeValue?: string;
	childNodes?: Element[];
	getAttribute: (attr: string) => string;
}

const mapNodes = (dom: HTMLElement, info: SerializeInfo): MessageBody => (
  !dom.childNodes ? [] : ([...dom.childNodes] as HTMLElement[]).map((n): MessageBody => {
    if (n.nodeName === '#text') return processUrls(n.nodeValue ?? '', info);
    if (n.nodeName === 'U') return { underline: mapNodes(n, info) };
    if (n.nodeName === 'CODE') return { code: n.nodeValue ?? '' };
    if (n.nodeName === 'A') return { link: mapNodes(n, info), _href: n.getAttribute('href') ?? '' } };
    if (n.nodeName === 'B') return { bold: mapNodes(n, info) };
    if (n.nodeName === 'I') return { italic: mapNodes(n, info) };
    if (n.nodeName === 'S') return { strike: mapNodes(n, info) };
    if (n.nodeName === 'DIV') return { line: mapNodes(n, info) };
    if (n.nodeName === 'UL') return { bullet: mapNodes(n, info) };
    if (n.nodeName === 'LI') return { item: mapNodes(n, info) };
    if (n.nodeName === 'IMG') return { img: n.getAttribute('src') ?? '', _alt: n.getAttribute('alt') ?? '' };
    if (n.nodeName === 'SPAN' && n.className === 'emoji') return { emoji: n.getAttribute('emoji') ?? '' };
    if (n.nodeName === 'SPAN' && n.className === 'channel') return { channel: n.getAttribute('channelId') ?? '' };
																																	 }
*/
