import { ClassNames, cn } from '../../utils';

type NotificationProps = {
  className?: ClassNames;
  children?: React.ReactNode;
}

export const Notification = ({ children, className = [] }: NotificationProps) => (
  <div className={cn('notification', className)}>
    {children}
  </div>
);
