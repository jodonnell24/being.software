// Global polyfills for build environment
if (typeof global === 'undefined') {
  global = globalThis;
}

if (typeof File === 'undefined' && typeof globalThis.File !== 'undefined') {
  global.File = globalThis.File;
}

if (typeof File === 'undefined') {
  // Minimal File constructor polyfill for build environments
  global.File = class File extends Blob {
    constructor(fileBits, fileName, options = {}) {
      super(fileBits, options);
      this.name = fileName;
      this.lastModified = options.lastModified || Date.now();
    }
  };
}
