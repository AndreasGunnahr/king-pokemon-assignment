import type { Card } from '@/types';

import { AbilityList } from './AbilityList';
import { AttackList } from './AttackList';
import { BattleStats } from './BattleStats';
import { CardHeading } from './CardHeading';
import { FlavorText } from './FlavorText';
import { FormatLegality } from './FormatLegality';
import { RulesBox } from './RulesBox';
import { StatsBox } from './StatsBox';

interface Props {
  card: Card;
}

/** The parsed properties of a single card, laid out for the card modal. Each
 *  block below hides itself when the card has nothing for it. */
export const CardDetails = ({ card }: Props) => (
  <div className="flex flex-col gap-3.5 text-[13px]">
    <CardHeading card={card} />
    <FormatLegality card={card} />
    <StatsBox card={card} />
    <AbilityList card={card} />
    <AttackList card={card} />
    <BattleStats card={card} />
    <RulesBox card={card} />
    <FlavorText card={card} />
  </div>
);
