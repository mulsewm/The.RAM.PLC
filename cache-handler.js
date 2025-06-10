// Simple cache handler that disables caching for API routes
module.exports = class CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    return null; // Always return null to force revalidation
  }

  async set(key, data) {
    // No-op - don't cache anything
  }

  async revalidateTag(tag) {
    // No-op - don't handle tags
  }
};
