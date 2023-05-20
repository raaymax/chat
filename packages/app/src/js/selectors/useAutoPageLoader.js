import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import usePageLoader from './usePageLoader';

export default (stream, date, loaded) => {
  const {loadPage, getPage} = usePageLoader(stream);
  const page = getPage(date);
  useEffect(() => {
    if (!loaded) return;
    loadPage(page - 1);
    loadPage(page);
    loadPage(page + 1);
  }, [loadPage, page, loaded]);
};
