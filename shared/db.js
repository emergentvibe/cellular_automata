/**
 * Cells Database Layer
 * IndexedDB via Dexie.js for storing 262k+ Life-like CA rules
 */

// Dexie.js loaded via CDN in HTML
// <script src="https://unpkg.com/dexie@latest/dist/dexie.js"></script>

const CellsDB = {
  db: null,

  /**
   * Initialize the database
   */
  async init() {
    if (this.db) return this.db;

    this.db = new Dexie('CellsDB');

    this.db.version(1).stores({
      // Primary key is ruleId (numeric 0-262143)
      // Indexed fields for range queries
      rules: 'ruleId, lambda, dimension, gamma, classification, period',
      // Collections for user favorites
      collections: '++id, name'
    });

    await this.db.open();
    console.log('[CellsDB] Database initialized');
    return this.db;
  },

  /**
   * Get total rule count
   */
  async getRuleCount() {
    await this.init();
    return await this.db.rules.count();
  },

  /**
   * Get a single rule by ID
   * @param {number} ruleId - Rule ID (0-262143)
   */
  async getRule(ruleId) {
    await this.init();
    return await this.db.rules.get(ruleId);
  },

  /**
   * Get rules by classification
   * @param {string} classification - e.g., 'chaotic', 'periodic', 'fixed', 'extinct'
   */
  async getRulesByClassification(classification) {
    await this.init();
    return await this.db.rules.where('classification').equals(classification).toArray();
  },

  /**
   * Get rules within metric ranges (for Atlas filtering)
   * @param {Object} filters - { lambda: [min, max], dimension: [min, max], gamma: [min, max] }
   */
  async getRulesInRange(filters = {}) {
    await this.init();

    let collection = this.db.rules.toCollection();

    // Apply filters - Dexie requires chaining
    // For complex multi-range queries, we filter in memory after fetching
    const rules = await collection.toArray();

    return rules.filter(rule => {
      if (filters.lambda) {
        const [min, max] = filters.lambda;
        if (rule.lambda < min || rule.lambda > max) return false;
      }
      if (filters.dimension) {
        const [min, max] = filters.dimension;
        if (rule.dimension < min || rule.dimension > max) return false;
      }
      if (filters.gamma) {
        const [min, max] = filters.gamma;
        if (rule.gamma < min || rule.gamma > max) return false;
      }
      if (filters.classification && filters.classification.length > 0) {
        if (!filters.classification.includes(rule.classification)) return false;
      }
      return true;
    });
  },

  /**
   * Get all rules (use with caution - 262k records)
   * @param {number} limit - Optional limit
   * @param {number} offset - Optional offset for pagination
   */
  async getAllRules(limit = null, offset = 0) {
    await this.init();
    let query = this.db.rules.orderBy('ruleId');
    if (offset > 0) query = query.offset(offset);
    if (limit) query = query.limit(limit);
    return await query.toArray();
  },

  /**
   * Save a single rule
   * @param {Object} rule - Rule object with ruleId and metrics
   */
  async saveRule(rule) {
    await this.init();
    // Ensure ruleId is a number
    rule.ruleId = Number(rule.ruleId);
    return await this.db.rules.put(rule);
  },

  /**
   * Bulk save rules (for survey results)
   * @param {Array} rules - Array of rule objects
   * @param {number} batchSize - Batch size for bulkPut (default 1000)
   */
  async bulkSave(rules, batchSize = 1000) {
    await this.init();

    // Process in batches to avoid memory issues
    for (let i = 0; i < rules.length; i += batchSize) {
      const batch = rules.slice(i, i + batchSize).map(r => ({
        ...r,
        ruleId: Number(r.ruleId)
      }));
      await this.db.rules.bulkPut(batch);
    }

    return rules.length;
  },

  /**
   * Check if a rule exists
   * @param {number} ruleId - Rule ID to check
   */
  async hasRule(ruleId) {
    await this.init();
    const rule = await this.db.rules.get(Number(ruleId));
    return rule !== undefined;
  },

  /**
   * Get list of surveyed rule IDs (for resume functionality)
   */
  async getSurveyedRuleIds() {
    await this.init();
    const rules = await this.db.rules.toArray();
    return new Set(rules.map(r => r.ruleId));
  },

  /**
   * Delete a rule
   * @param {number} ruleId - Rule ID to delete
   */
  async deleteRule(ruleId) {
    await this.init();
    return await this.db.rules.delete(Number(ruleId));
  },

  /**
   * Clear all rules (use with caution!)
   */
  async clearAllRules() {
    await this.init();
    return await this.db.rules.clear();
  },

  // ==================== Collections ====================

  /**
   * Create a new collection
   * @param {string} name - Collection name
   * @param {Array} ruleIds - Optional initial rule IDs
   */
  async createCollection(name, ruleIds = []) {
    await this.init();
    return await this.db.collections.add({
      name,
      ruleIds,
      created_at: new Date().toISOString()
    });
  },

  /**
   * Get all collections
   */
  async getCollections() {
    await this.init();
    return await this.db.collections.toArray();
  },

  /**
   * Add rule to collection
   * @param {number} collectionId - Collection ID
   * @param {number} ruleId - Rule ID to add
   */
  async addToCollection(collectionId, ruleId) {
    await this.init();
    const collection = await this.db.collections.get(collectionId);
    if (!collection) throw new Error('Collection not found');

    if (!collection.ruleIds.includes(ruleId)) {
      collection.ruleIds.push(ruleId);
      await this.db.collections.put(collection);
    }
    return collection;
  },

  /**
   * Remove rule from collection
   * @param {number} collectionId - Collection ID
   * @param {number} ruleId - Rule ID to remove
   */
  async removeFromCollection(collectionId, ruleId) {
    await this.init();
    const collection = await this.db.collections.get(collectionId);
    if (!collection) throw new Error('Collection not found');

    collection.ruleIds = collection.ruleIds.filter(id => id !== ruleId);
    await this.db.collections.put(collection);
    return collection;
  },

  /**
   * Delete a collection
   * @param {number} collectionId - Collection ID to delete
   */
  async deleteCollection(collectionId) {
    await this.init();
    return await this.db.collections.delete(collectionId);
  },

  // ==================== Utilities ====================

  /**
   * Convert rule ID to B/S notation
   * @param {number} ruleId - Rule ID (0-262143)
   */
  ruleIdToNotation(ruleId) {
    const birthMask = Math.floor(ruleId / 512);
    const survivalMask = ruleId % 512;

    let birth = [];
    let survival = [];

    for (let i = 0; i <= 8; i++) {
      if (birthMask & (1 << i)) birth.push(i);
      if (survivalMask & (1 << i)) survival.push(i);
    }

    return `B${birth.join('')}/S${survival.join('')}`;
  },

  /**
   * Convert B/S notation to rule ID
   * @param {string} notation - B/S notation (e.g., "B3/S23")
   */
  notationToRuleId(notation) {
    const match = notation.match(/B(\d*)\/?S(\d*)/i);
    if (!match) return null;

    let birthMask = 0;
    let survivalMask = 0;

    for (const c of match[1]) {
      birthMask |= (1 << parseInt(c));
    }
    for (const c of match[2]) {
      survivalMask |= (1 << parseInt(c));
    }

    return birthMask * 512 + survivalMask;
  },

  /**
   * Get classification color for UI
   * @param {string} classification
   */
  getClassificationColor(classification) {
    const colors = {
      'extinct': '#4a4a4a',
      'fixed': '#4a6a4a',
      'periodic': '#4a4a7a',
      'chaotic': '#7a4a4a',
      'expanding': '#7a6a4a'
    };
    return colors[classification] || '#555';
  },

  /**
   * Export rules to CSV format
   * @param {Array} rules - Rules to export (or null for all)
   */
  async exportToCSV(rules = null) {
    if (!rules) {
      await this.init();
      rules = await this.db.rules.toArray();
    }

    const headers = ['rule_id', 'rule_string', 'lambda', 'D', 'gamma', 'population', 'classification', 'period'];
    const rows = rules.map(r => [
      r.ruleId,
      this.ruleIdToNotation(r.ruleId),
      r.lambda?.toFixed(6) ?? '',
      r.dimension?.toFixed(4) ?? '',
      r.gamma?.toFixed(4) ?? '',
      r.population ?? '',
      r.classification ?? '',
      r.period ?? ''
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  /**
   * Get database stats for nav display
   */
  async getStats() {
    await this.init();
    const count = await this.db.rules.count();
    const total = 262144;
    const percentage = ((count / total) * 100).toFixed(1);

    return {
      count,
      total,
      percentage,
      display: `${count.toLocaleString()} / ${total.toLocaleString()} rules (${percentage}%)`
    };
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CellsDB;
}
