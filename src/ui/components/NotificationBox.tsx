import { useAppLifeCycle } from '../../lifecycle';
import { Card } from '../lib/index.js';

const TRANSIENT_DISPLAY_TIME_MS = 3000; //milliseconds

export function NotificationBox(): JSX.Element {
  const { state, updater } = useAppLifeCycle();
  const reports = state?.reports || [];
  const removeReport = (index: number) => updater?.removeReport(index);
  const current = reports?.at(0);
  const removeCurrent = () => {
    if (current) {
      removeReport(0);
    }
  };
  const isTransient = false;

  if (isTransient) {
    setTimeout(() => {
      removeCurrent();
    }, TRANSIENT_DISPLAY_TIME_MS);
  }

  return (
    <>
      {current && (
        <div className="absolute bottom-4 right-4 z-50 max-w-[50%] text-xs">
          {!isTransient && (
            <div
              className="absolute right-px top-1  z-50 flex h-4 w-4 cursor-pointer justify-center"
              onClick={removeCurrent}
            >
              x
            </div>
          )}
          <Card className="pl-2 pr-2">{current.message}</Card>
        </div>
      )}
    </>
  );
}
