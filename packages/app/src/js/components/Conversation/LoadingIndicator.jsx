import { useSelector } from 'react-redux';
import { Loader } from '../../atomic/atoms/Loader';

export function LoadingIndicator() {
  const loading = useSelector((state) => state.messages.loading);
  if (!loading) return null;
  return <Loader />;
}
