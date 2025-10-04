interface NotificationsBadgeProps {
  notifications: number;
  style?: any;
}

export const NotificationsBadge: React.FC<NotificationsBadgeProps> = ({
  notifications,
  style,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[100px] bg-Negative-500 p-tiny"
      style={style}
    >
      <p className="subtitle-sm min-w-large text-center text-white">
        {notifications}
      </p>
    </div>
  );
};
