import type { TrackType } from '../types';
import type { Delegate, State } from '../../../lifecycle/types';

import { SyntheticEvent, useState } from 'react';
import { ChevronRightIcon, DelegateIcon, CloseIcon } from '../../icons';
import { Button, Card } from '../../lib';
import { Accounticon } from '../accounts/Accounticon.js';
import { DelegateInfoModal } from './delegateModal/DelegateInfo';
import { StatBar } from '../common/Stats';
import { RoleTag } from '../common/RoleTag';
import {
  extractDelegations,
  extractIsProcessing,
  extractRoles,
} from '../../../lifecycle';
import { filterTracks } from '../../../chain/index';
import { DelegateModal } from './delegateModal/Delegate';
import { useDelegation } from '../../../contexts';
import { InnerCard } from '../common/InnerCard';
import EllipsisTextbox from '../EllipsisTextbox';
import { UndelegateModal } from './delegateModal/Undelegate';
import { TracksLabeledBox } from '../common/LabeledBox';

function filterUndelegatedTracks(state: State): TrackType[] {
  const delegatedTrackIds = new Set(extractDelegations(state).keys());
  return filterTracks((t) => !delegatedTrackIds.has(t.id));
}

function DelegatedTracks({
  disabled,
  tracks,
  delegate,
}: {
  disabled: boolean;
  tracks: TrackType[];
  delegate: Delegate;
}) {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };
  const openModal = () => {
    setShowModal(true);
  };
  return (
    <>
      <InnerCard className="gap-2 bg-[#FFE4F3]">
        <TracksLabeledBox
          title="Tracks delegated"
          tracks={tracks}
          visibleCount={2}
        />
        <Button variant="ghost" disabled={disabled} onClick={() => openModal()}>
          <CloseIcon />
          <div>Undelegate All</div>
        </Button>
      </InnerCard>
      <UndelegateModal
        onClose={closeModal}
        open={showModal}
        tracks={tracks}
        address={delegate.address}
      />
    </>
  );
}

export function DelegateCard({
  delegate,
  state,
  variant,
  withTracks = false,
}: {
  delegate: Delegate;
  state: State;
  variant: 'all' | 'some' | 'none';
  withTracks?: boolean;
}) {
  const { name, address, manifesto } = delegate;
  const roles = extractRoles(address, state);
  const isProcessing = extractIsProcessing(state);

  const [txVisible, setTxVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  // transaction Modal handlers
  const closeTxModal = () => {
    setTxVisible(false);
  };
  const openTxModal = () => {
    setTxVisible(true);
  };
  const delegateHandler = (e: SyntheticEvent) => {
    e.stopPropagation();
    openTxModal();
    setInfoVisible(false); //have to close info modal to make tx modal visible - not ideal, should be replacing content within 1 modal
  };

  // more info Modal handlers
  const closeInfoModal = () => {
    setInfoVisible(false);
  };
  const openInfoModal = () => {
    setInfoVisible(true);
  };
  const expandHandler = () => {
    openInfoModal();
  };

  // extract tracks to be delegated
  const undelegatedTracks = filterUndelegatedTracks(state);
  const { selectedTracks } = useDelegation();
  const someTracks = filterTracks((t) => selectedTracks.has(t.id));
  const tracks = variant === 'all' ? undelegatedTracks : someTracks;

  // extract tracks that are already delegated
  const delegatedTrackSet = new Set(delegate.delegatedTracks);
  const delegatedTracks = filterTracks((t) => delegatedTrackSet.has(t.id));
  return (
    <div
      className={`flex h-full shrink-0  ${
        variant === 'all' ? 'w-[320px] md:w-[420px]' : 'w-full'
      }`}
    >
      <Card
        className={`flex h-full w-full flex-col gap-2 p-6 shadow-md md:gap-4`}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <h2 className="text-xl capitalize">{name || 'Anonymous'}</h2>
            <Accounticon
              address={address}
              size={24}
              textClassName="text-body font-semibold my-2"
            />
          </div>
          {variant === 'some' && (
            <Button onClick={delegateHandler} disabled={isProcessing}>
              <div className="flex w-full flex-nowrap items-center justify-center gap-1">
                <div>Select</div>
                <ChevronRightIcon />
              </div>
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {roles.map((role) => (
            <RoleTag key={role} role={role} />
          ))}
        </div>
        {manifesto && (
          <EllipsisTextbox
            className="max-h-[6rem] lg:h-[6rem]"
            text={manifesto}
            expandLinkTitle="Read more ->"
            onExpand={() => expandHandler()}
          />
        )}
        <div className="grow" />

        {/*<StatBar stats={[]} />*/}

        {withTracks && delegatedTracks?.length && (
          <DelegatedTracks
            disabled={isProcessing}
            delegate={delegate}
            tracks={delegatedTracks}
          />
        )}
        {variant === 'all' && (
          <Button
            variant="primary"
            onClick={delegateHandler}
            disabled={isProcessing}
          >
            <div>Delegate All Votes</div>
            <DelegateIcon />
          </Button>
        )}
      </Card>
      <DelegateModal
        open={txVisible}
        onClose={closeTxModal}
        delegate={delegate}
        tracks={tracks}
      />
      <DelegateInfoModal
        open={infoVisible}
        onClose={closeInfoModal}
        delegate={delegate}
      >
        <Button
          className="w-fit"
          onClick={delegateHandler}
          disabled={isProcessing}
        >
          <div className="flex w-full flex-nowrap items-center justify-center gap-1">
            <div>Select</div>
            <ChevronRightIcon />
          </div>
        </Button>
      </DelegateInfoModal>
    </div>
  );
}
