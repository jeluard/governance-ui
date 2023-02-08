import type {
  AccountVote,
  ReferendumDetails,
  ReferendumOngoing,
  Track,
} from '../../types';

import { memo, useState } from 'react';
import { Remark } from 'react-remark';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { createStandardAccountVote } from '../../chain/conviction-voting';
import { Card, Loading } from '../lib';

function Header({
  index,
  title,
  track,
}: {
  index: number;
  title?: string;
  track?: Track;
}): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full columns-2 flex-row justify-between">
        <div className="font-brand text-base font-medium">
          #{index} {title}
        </div>
        <div className="flex items-center justify-center">
          <hr className="w-2" />
          <div className="rounded-full border px-2 py-1 text-center align-middle text-xs font-bold uppercase">
            deciding
          </div>
          <hr className="w-2" />
        </div>
      </div>
      <div className="flex w-full columns-2 justify-between text-sm font-bold uppercase text-primary">
        <div>{track?.name || ''}</div>
      </div>
    </div>
  );
}

const ReferendumCard = memo(
  ({
    index,
    details,
    track,
  }: {
    index: number;
    details: ReferendumDetails | undefined;
    track?: Track;
  }) => {
    if (details && details.posts.length > 0) {
      const { title, content } = details.posts[0];
      const isHTML = content.startsWith('<p'); // A bug in polkascan made some posts in HTML. They should always be markdown.
      return (
        <Card className="flex h-[640px] w-screen flex-col gap-8 md:w-[640px]">
          <Header index={index} title={title} track={track} />
          <div className="w-full overflow-y-scroll break-words">
            {isHTML ? (
              // ToDo: This should be removed, after making sure it does not break the UX, or we should find a new source to pull this info.
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <Remark>{content}</Remark>
            )}
          </div>
        </Card>
      );
    } else {
      return (
        <Card className="flex h-[640px] w-screen flex-col gap-8 md:w-[640px]">
          <Header index={index} track={track} />
          <div className="flex w-[32rem] flex-auto flex-col items-center justify-center">
            <Loading />
          </div>
        </Card>
      );
    }
  }
);

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
  x: 0,
  y: 0,
  scale: 1,
  delay: i * 100,
});

const from = () => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform

export function ReferendaDeck({
  tracks,
  referenda,
  details,
  onCastVote,
}: {
  tracks: Map<number, Track>;
  referenda: Array<ReferendumOngoing & { index: number }>;
  details: Map<number, ReferendumDetails>;
  onCastVote: (index: number, accountVote: AccountVote) => void;
}): JSX.Element {
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [sProps, sApi] = useSprings(referenda.length, (i) => ({
    ...to(i),
    from: from(),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      const trigger = vx > 0.5; // If you flick hard enough it should trigger the card to fly out
      if (!active && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      sApi.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        if (isGone) {
          onCastVote(referenda[i].index, createStandardAccountVote(xDir == 1));
        }
        const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? xDir * 10 * vx : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = active ? 1 : 1; // Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
        };
      });
      if (!active && gone.size === referenda.length)
        setTimeout(() => {
          gone.clear();
          sApi.start((i) => to(i));
        }, 600);
    }
  );

  if (referenda.length == 0) {
    return <div>No new referenda to vote on</div>;
  } else {
    // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
    return (
      <div className="grid">
        {sProps.map(({ x, y }, i) => {
          const { index, trackIndex } = referenda[i];
          const track = tracks.get(trackIndex);
          return (
            <animated.div
              key={i}
              style={{ width: '100%', gridArea: 'inner-div', x, y }}
            >
              {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
              <animated.div {...bind(i)}>
                <ReferendumCard
                  index={index}
                  details={details.get(index)}
                  track={track}
                />
              </animated.div>
            </animated.div>
          );
        })}
      </div>
    );
  }
}
