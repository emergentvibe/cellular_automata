/**
 * Rule encoding/decoding for Life-like cellular automata
 *
 * Life-like rules are defined by:
 * - B (Birth): Set of neighbor counts causing dead -> alive
 * - S (Survival): Set of neighbor counts allowing alive -> alive
 *
 * Both B and S are subsets of {0, 1, 2, 3, 4, 5, 6, 7, 8}
 *
 * Encoding:
 * - rule_id = birth_mask * 512 + survival_mask
 * - birth_mask and survival_mask are 9-bit integers (0-511)
 * - Total rules: 512 * 512 = 262,144
 */

export class Rule {
  constructor(birthSet, survivalSet) {
    // birthSet and survivalSet are arrays of numbers 0-8
    this.birthSet = new Set(birthSet);
    this.survivalSet = new Set(survivalSet);

    // Precompute masks for fast lookup
    this.birthMask = this._setToMask(this.birthSet);
    this.survivalMask = this._setToMask(this.survivalSet);
  }

  _setToMask(set) {
    let mask = 0;
    for (const n of set) {
      mask |= (1 << n);
    }
    return mask;
  }

  /**
   * Check if dead cell with n neighbors should be born
   */
  shouldBirth(neighborCount) {
    return (this.birthMask & (1 << neighborCount)) !== 0;
  }

  /**
   * Check if alive cell with n neighbors should survive
   */
  shouldSurvive(neighborCount) {
    return (this.survivalMask & (1 << neighborCount)) !== 0;
  }

  /**
   * Get the rule ID (unique identifier 0-262143)
   */
  getId() {
    return this.birthMask * 512 + this.survivalMask;
  }

  /**
   * Get B/S notation string (e.g., "B3/S23")
   */
  toString() {
    const birthStr = [...this.birthSet].sort().join('');
    const survivalStr = [...this.survivalSet].sort().join('');
    return `B${birthStr}/S${survivalStr}`;
  }

  /**
   * Create rule from rule ID
   */
  static fromId(id) {
    const birthMask = Math.floor(id / 512);
    const survivalMask = id % 512;
    return Rule.fromMasks(birthMask, survivalMask);
  }

  /**
   * Create rule from birth and survival masks
   */
  static fromMasks(birthMask, survivalMask) {
    const birthSet = [];
    const survivalSet = [];

    for (let i = 0; i <= 8; i++) {
      if (birthMask & (1 << i)) birthSet.push(i);
      if (survivalMask & (1 << i)) survivalSet.push(i);
    }

    return new Rule(birthSet, survivalSet);
  }

  /**
   * Parse B/S notation string (e.g., "B3/S23" or "B36/S23")
   */
  static parse(str) {
    const match = str.match(/B(\d*)\/?S(\d*)/i);
    if (!match) {
      throw new Error(`Invalid rule string: ${str}`);
    }

    const birthStr = match[1] || '';
    const survivalStr = match[2] || '';

    const birthSet = birthStr.split('').map(Number);
    const survivalSet = survivalStr.split('').map(Number);

    return new Rule(birthSet, survivalSet);
  }
}

/**
 * Well-known rules
 */
export const KNOWN_RULES = {
  life: new Rule([3], [2, 3]),           // B3/S23 - Conway's Life
  highlife: new Rule([3, 6], [2, 3]),    // B36/S23 - Has replicator
  daynight: new Rule([3, 6, 7, 8], [3, 4, 6, 7, 8]),  // B3678/S34678
  seeds: new Rule([2], []),              // B2/S - Chaotic, dies fast
  replicator: new Rule([1, 3, 5, 7], [1, 3, 5, 7]),   // B1357/S1357
  morley: new Rule([3, 6, 8], [2, 4, 5]),             // B368/S245
  lifewithoutdeath: new Rule([3], [0, 1, 2, 3, 4, 5, 6, 7, 8]),  // B3/S012345678
  diamoeba: new Rule([3, 5, 6, 7, 8], [5, 6, 7, 8]),  // B35678/S5678
  twoxtwo: new Rule([3, 6], [1, 2, 5]),  // B36/S125
  maze: new Rule([3], [1, 2, 3, 4, 5]),  // B3/S12345
};

/**
 * Get rule by name or B/S string
 */
export function getRule(nameOrString) {
  if (KNOWN_RULES[nameOrString.toLowerCase()]) {
    return KNOWN_RULES[nameOrString.toLowerCase()];
  }
  return Rule.parse(nameOrString);
}
