/**
 * Grid class for cellular automata
 * Supports toroidal (wrap) and fixed boundary conditions
 */

export class Grid {
  constructor(rows, cols, boundary = 'wrap') {
    this.rows = rows;
    this.cols = cols;
    this.boundary = boundary;
    this.cells = new Uint8Array(rows * cols);
  }

  /**
   * Get flat array index from row/col
   */
  idx(row, col) {
    return row * this.cols + col;
  }

  /**
   * Get cell value at row, col
   */
  get(row, col) {
    if (this.boundary === 'wrap') {
      row = ((row % this.rows) + this.rows) % this.rows;
      col = ((col % this.cols) + this.cols) % this.cols;
      return this.cells[this.idx(row, col)];
    } else {
      if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
        return 0; // Fixed boundary treats outside as dead
      }
      return this.cells[this.idx(row, col)];
    }
  }

  /**
   * Set cell value at row, col
   */
  set(row, col, value) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.cells[this.idx(row, col)] = value;
    }
  }

  /**
   * Count live neighbors (Moore neighborhood - 8 surrounding cells)
   */
  countNeighbors(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        if (this.get(row + dr, col + dc) > 0) count++;
      }
    }
    return count;
  }

  /**
   * Fill grid randomly with given density
   */
  randomize(density = 0.3, seed = null) {
    // Simple seeded random for reproducibility
    const random = seed !== null ? seededRandom(seed) : Math.random;
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = random() < density ? 1 : 0;
    }
  }

  /**
   * Clear all cells
   */
  clear() {
    this.cells.fill(0);
  }

  /**
   * Copy grid state to another grid
   */
  copyTo(target) {
    target.cells.set(this.cells);
  }

  /**
   * Create a deep copy of this grid
   */
  clone() {
    const copy = new Grid(this.rows, this.cols, this.boundary);
    this.copyTo(copy);
    return copy;
  }

  /**
   * Compute Hamming distance (number of differing cells) from another grid
   */
  hammingDistance(other) {
    let diff = 0;
    for (let i = 0; i < this.cells.length; i++) {
      // Compare binary: both alive or both dead
      const a = this.cells[i] > 0 ? 1 : 0;
      const b = other.cells[i] > 0 ? 1 : 0;
      if (a !== b) diff++;
    }
    return diff;
  }

  /**
   * Count total live cells
   */
  population() {
    let count = 0;
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i] > 0) count++;
    }
    return count;
  }

  /**
   * Flip a single cell (0 -> 1, >0 -> 0)
   */
  flipCell(row, col) {
    const i = this.idx(row, col);
    this.cells[i] = this.cells[i] > 0 ? 0 : 1;
  }

  /**
   * Get a hash of the current state (for periodicity detection)
   * Uses simple FNV-1a hash
   */
  hash() {
    let hash = 2166136261; // FNV offset basis
    for (let i = 0; i < this.cells.length; i++) {
      hash ^= this.cells[i] > 0 ? 1 : 0;
      hash = Math.imul(hash, 16777619); // FNV prime
      hash = hash >>> 0; // Convert to unsigned 32-bit
    }
    return hash;
  }

  /**
   * Check if grid is empty (all dead)
   */
  isEmpty() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i] > 0) return false;
    }
    return true;
  }

  /**
   * Check if two grids have identical state
   */
  equals(other) {
    if (this.rows !== other.rows || this.cols !== other.cols) return false;
    for (let i = 0; i < this.cells.length; i++) {
      const a = this.cells[i] > 0 ? 1 : 0;
      const b = other.cells[i] > 0 ? 1 : 0;
      if (a !== b) return false;
    }
    return true;
  }
}

/**
 * Seeded random number generator (Mulberry32)
 * Returns a function that produces random numbers in [0, 1)
 */
export function seededRandom(seed) {
  return function() {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
