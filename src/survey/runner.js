/**
 * Survey Runner
 *
 * Orchestrates the 262,144 rule survey using Web Workers for parallelism.
 * Supports checkpointing, progress tracking, and CSV export.
 */

import { Rule } from '../core/rule.js';

const TOTAL_RULES = 262144;  // 512 * 512
const CHECKPOINT_INTERVAL = 1000;  // Save every N rules
const STORAGE_KEY = 'cells_survey_checkpoint';

/**
 * Survey runner class
 */
export class SurveyRunner {
  constructor(options = {}) {
    this.options = {
      workerCount: navigator.hardwareConcurrency || 4,
      rows: 256,
      cols: 256,
      steps: 1000,
      classificationSteps: 10000,
      density: 0.3,
      boundary: 'wrap',
      batchSize: 10,  // Rules per worker batch
      ...options
    };

    this.workers = [];
    this.results = [];
    this.completedRules = new Set();
    this.pendingRules = [];
    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.callbacks = {
      onProgress: null,
      onResult: null,
      onComplete: null,
      onError: null
    };
  }

  /**
   * Set callback functions
   */
  on(event, callback) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event] = callback;
    }
    return this;
  }

  /**
   * Initialize workers
   */
  async initWorkers() {
    const workerPromises = [];

    for (let i = 0; i < this.options.workerCount; i++) {
      const promise = new Promise((resolve, reject) => {
        const worker = new Worker(
          new URL('./worker.js', import.meta.url),
          { type: 'module' }
        );

        worker.onmessage = (e) => {
          if (e.data.type === 'ready') {
            resolve(worker);
          }
        };

        worker.onerror = (error) => {
          reject(error);
        };

        this.workers.push(worker);
      });

      workerPromises.push(promise);
    }

    await Promise.all(workerPromises);
    console.log(`Initialized ${this.workers.length} workers`);
  }

  /**
   * Load checkpoint from localStorage
   */
  loadCheckpoint() {
    try {
      const checkpoint = localStorage.getItem(STORAGE_KEY);
      if (checkpoint) {
        const data = JSON.parse(checkpoint);
        this.results = data.results || [];
        this.completedRules = new Set(data.completedRules || []);
        console.log(`Loaded checkpoint: ${this.completedRules.size} rules completed`);
        return true;
      }
    } catch (error) {
      console.error('Failed to load checkpoint:', error);
    }
    return false;
  }

  /**
   * Save checkpoint to localStorage
   */
  saveCheckpoint() {
    try {
      const data = {
        results: this.results,
        completedRules: Array.from(this.completedRules),
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save checkpoint:', error);
    }
  }

  /**
   * Clear checkpoint
   */
  clearCheckpoint() {
    localStorage.removeItem(STORAGE_KEY);
    this.results = [];
    this.completedRules.clear();
  }

  /**
   * Get remaining rules to process
   */
  getRemainingRules() {
    const remaining = [];
    for (let id = 0; id < TOTAL_RULES; id++) {
      if (!this.completedRules.has(id)) {
        remaining.push(id);
      }
    }
    return remaining;
  }

  /**
   * Start the survey
   */
  async start(resume = true) {
    if (this.isRunning) {
      console.warn('Survey already running');
      return;
    }

    // Initialize workers if needed
    if (this.workers.length === 0) {
      await this.initWorkers();
    }

    // Load checkpoint if resuming
    if (resume) {
      this.loadCheckpoint();
    } else {
      this.clearCheckpoint();
    }

    this.pendingRules = this.getRemainingRules();
    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now();

    console.log(`Starting survey: ${this.pendingRules.length} rules remaining`);

    // Start processing
    this.processNextBatches();
  }

  /**
   * Pause the survey
   */
  pause() {
    this.isPaused = true;
    console.log('Survey paused');
  }

  /**
   * Resume the survey
   */
  resume() {
    if (!this.isRunning) {
      this.start(true);
    } else {
      this.isPaused = false;
      this.processNextBatches();
      console.log('Survey resumed');
    }
  }

  /**
   * Stop the survey completely
   */
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.saveCheckpoint();
    console.log('Survey stopped');
  }

  /**
   * Process next batches across all workers
   */
  processNextBatches() {
    if (!this.isRunning || this.isPaused) return;

    // Assign work to idle workers
    for (const worker of this.workers) {
      if (worker._busy) continue;
      if (this.pendingRules.length === 0) continue;

      // Get next batch of rules
      const batch = this.pendingRules.splice(0, this.options.batchSize);
      if (batch.length === 0) continue;

      worker._busy = true;

      // Set up message handler for this batch
      const handler = (e) => {
        const { type, data } = e.data;

        if (type === 'progress') {
          // Individual rule progress within batch
          if (this.callbacks.onProgress) {
            this.callbacks.onProgress({
              completed: this.completedRules.size,
              total: TOTAL_RULES,
              currentRule: data.ruleId,
              elapsed: Date.now() - this.startTime
            });
          }
        } else if (type === 'batchComplete') {
          // Batch finished
          worker.removeEventListener('message', handler);
          worker._busy = false;

          // Store results
          for (const result of data) {
            this.results.push(result);
            this.completedRules.add(result.rule_id);

            if (this.callbacks.onResult) {
              this.callbacks.onResult(result);
            }
          }

          // Checkpoint periodically
          if (this.completedRules.size % CHECKPOINT_INTERVAL === 0) {
            this.saveCheckpoint();
          }

          // Check if complete
          if (this.completedRules.size >= TOTAL_RULES) {
            this.onSurveyComplete();
          } else {
            // Process more
            this.processNextBatches();
          }
        }
      };

      worker.addEventListener('message', handler);

      // Send batch to worker
      worker.postMessage({
        type: 'measureBatch',
        data: {
          ruleIds: batch,
          options: {
            rows: this.options.rows,
            cols: this.options.cols,
            steps: this.options.steps,
            classificationSteps: this.options.classificationSteps,
            density: this.options.density,
            boundary: this.options.boundary
          }
        }
      });
    }

    // Check if all done and no workers busy
    if (this.pendingRules.length === 0 && !this.workers.some(w => w._busy)) {
      if (this.completedRules.size >= TOTAL_RULES) {
        this.onSurveyComplete();
      }
    }
  }

  /**
   * Called when survey completes
   */
  onSurveyComplete() {
    this.isRunning = false;
    this.saveCheckpoint();

    const elapsed = Date.now() - this.startTime;
    console.log(`Survey complete! ${this.results.length} rules measured in ${(elapsed / 1000 / 60).toFixed(1)} minutes`);

    if (this.callbacks.onComplete) {
      this.callbacks.onComplete({
        results: this.results,
        elapsed
      });
    }
  }

  /**
   * Get current progress
   */
  getProgress() {
    const completed = this.completedRules.size;
    const total = TOTAL_RULES;
    const elapsed = this.startTime ? Date.now() - this.startTime : 0;
    const rate = elapsed > 0 ? completed / (elapsed / 1000) : 0;
    const remaining = total - completed;
    const eta = rate > 0 ? remaining / rate : 0;

    return {
      completed,
      total,
      percent: (completed / total) * 100,
      elapsed,
      rate,  // rules per second
      eta,   // seconds remaining
      isRunning: this.isRunning,
      isPaused: this.isPaused
    };
  }

  /**
   * Export results to CSV
   */
  exportCSV() {
    const headers = [
      'rule_id', 'birth_mask', 'survival_mask', 'rule_string',
      'lambda', 'D', 'D_r_squared', 'gamma',
      'bdm_initial', 'bdm_final', 'population_final',
      'period', 'classification', 'generations', 'runtime_ms'
    ];

    const rows = [headers.join(',')];

    for (const r of this.results) {
      const row = [
        r.rule_id,
        r.birth_mask,
        r.survival_mask,
        `"${r.rule_string}"`,
        r.lambda.toFixed(6),
        r.D.toFixed(4),
        r.D_r_squared.toFixed(4),
        r.gamma.toFixed(4),
        r.bdm_initial.toFixed(2),
        r.bdm_final.toFixed(2),
        r.population_final,
        r.period ?? '',
        r.classification,
        r.generations,
        r.runtime_ms.toFixed(1)
      ];
      rows.push(row.join(','));
    }

    return rows.join('\n');
  }

  /**
   * Download results as CSV file
   */
  downloadCSV(filename = 'lifelike-survey.csv') {
    const csv = this.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Get statistics summary
   */
  getStats() {
    if (this.results.length === 0) {
      return null;
    }

    const lambdas = this.results.map(r => r.lambda).filter(l => l > -10);
    const dimensions = this.results.map(r => r.D);
    const gammas = this.results.map(r => r.gamma);

    const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = arr => {
      const m = mean(arr);
      return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
    };
    const min = arr => Math.min(...arr);
    const max = arr => Math.max(...arr);

    // Classification counts
    const classifications = {};
    for (const r of this.results) {
      classifications[r.classification] = (classifications[r.classification] || 0) + 1;
    }

    return {
      count: this.results.length,
      lambda: {
        mean: mean(lambdas),
        std: std(lambdas),
        min: min(lambdas),
        max: max(lambdas)
      },
      D: {
        mean: mean(dimensions),
        std: std(dimensions),
        min: min(dimensions),
        max: max(dimensions)
      },
      gamma: {
        mean: mean(gammas),
        std: std(gammas),
        min: min(gammas),
        max: max(gammas)
      },
      classifications
    };
  }

  /**
   * Terminate all workers
   */
  terminate() {
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
  }
}

/**
 * Create and return a survey runner instance
 */
export function createSurveyRunner(options) {
  return new SurveyRunner(options);
}
