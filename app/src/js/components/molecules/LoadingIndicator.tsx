import { useSelector } from '../../store';
import { Loader } from '../atoms/Loader';

export function LoadingIndicator() {
  const loading = useSelector((state) => state.messages.loading);
  if (!loading) return null;
  return <Loader />;
}
