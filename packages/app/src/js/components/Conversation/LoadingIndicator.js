import { h } from 'preact';
import { useSelector } from 'react-redux';
import { Loader } from './elements/loader';

export function LoadingIndicator() {
  const loading = useSelector((state) => state.messages.loading);
  if (!loading) return null;
  return <Loader />;
}
