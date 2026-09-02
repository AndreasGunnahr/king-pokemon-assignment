import { describe, expect, it } from 'vitest';

import { getHpValue, getMaxDamage, parseAttackDamage } from './damage';
import { makeCard } from './testFixtures';

describe('parseAttackDamage', () => {
  it('reads a plain number', () => {
    expect(parseAttackDamage('50')).toBe(50);
  });

  it('strips trailing modifiers', () => {
    expect(parseAttackDamage('10×')).toBe(10);
    expect(parseAttackDamage('20+')).toBe(20);
    expect(parseAttackDamage('40-')).toBe(40);
  });

  it('returns null for empty or non-numeric damage', () => {
    expect(parseAttackDamage('')).toBeNull();
    expect(parseAttackDamage(undefined)).toBeNull();
    expect(parseAttackDamage('×')).toBeNull();
  });
});

describe('getMaxDamage', () => {
  it('takes the largest numeric attack', () => {
    const card = makeCard({
      attacks: [
        { name: 'Weak', damage: '10×' },
        { name: 'Strong', damage: '90' },
        { name: 'Utility', damage: '' },
      ],
    });
    expect(getMaxDamage(card)).toBe(90);
  });

  it('is null when no attack has numeric damage', () => {
    expect(
      getMaxDamage(makeCard({ attacks: [{ name: 'Status', damage: '' }] })),
    ).toBeNull();
    expect(getMaxDamage(makeCard({ attacks: undefined }))).toBeNull();
  });
});

describe('getHpValue', () => {
  it('parses the HP string', () => {
    expect(getHpValue(makeCard({ hp: '120' }))).toBe(120);
  });

  it('is null without HP', () => {
    expect(getHpValue(makeCard({ hp: undefined }))).toBeNull();
  });
});
