import { useEffect, useState } from 'react';
import { NotificationType, useNotifications } from '../contexts/Notification';
import { Button, HeartIcon, Navbar } from '../ui/nextui';
import ConnectButton from './Connect';
import {
  areNotificationsGranted,
  requestNotificationPermission,
} from '../utils/permissions';

function Header(): JSX.Element {
  const { notify } = useNotifications();
  const [notificationGranted, setNotificationGranted] = useState(true);

  useEffect(() => {
    async function fetch() {
      setNotificationGranted(await areNotificationsGranted());
    }

    fetch();
  }, []);

  return (
    <Navbar title="Open Gov">
      <>
        {!notificationGranted && (
          <Button
            color="secondary"
            rounded
            onPress={async () => {
              const permission = await requestNotificationPermission();
              if (permission !== 'granted') {
                notify({
                  type: NotificationType.Notification,
                  message: 'Notification permission has been denied',
                });
              } else {
                setNotificationGranted(true);
              }
            }}
            label="Request notification"
            icon={<HeartIcon />}
          />
        )}
        <ConnectButton color="secondary" bordered />
      </>
    </Navbar>
  );
}

export default Header;
