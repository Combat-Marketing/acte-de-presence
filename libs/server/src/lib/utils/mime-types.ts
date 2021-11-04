/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * Copyright(c) 2021 Christiaan Benedictus
 * MIT Licensed
 */
import { extname } from 'path';

const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
const TEXT_TYPE_REGEXP = /^text\//i;

export interface MimeDbEntry {
  source?: string;
  compressible?: boolean;
  extensions?: string[];
  charset?: string;
}

export type MimeDb = Record<string, MimeDbEntry>;

export class MimeTypes {
  private readonly db: MimeDb;
  private readonly extensions: Record<string, string[]> = {};
  private readonly types: Record<string, string> = {};

  constructor(db: MimeDb) {
    this.db = db;
    this.populateMaps();
  }

  /**
   * Get the default charset for the MIME type
   *
   * @param type the MIME type to check
   * @returns false if not found otherwise the charset of the MIME type
   */
  charset = (type?: string): false | string => {
    if (!type || typeof type !== 'string') {
      return false;
    }

    const match = EXTRACT_TYPE_REGEXP.exec(type);
    const mime = match && this.db[match[1].toLowerCase()];

    if (mime && mime.charset) {
      return mime.charset.toUpperCase();
    }

    if (match && TEXT_TYPE_REGEXP.test(match[1])) {
      return 'UTF-8';
    }

    return false;
  };

  charsets = { lookup: this.charset };

  /**
   * Create full content-type header given the MIME type or extension.
   *
   * @param value
   * @returns
   */
  contentType = (value?: string): false | string => {
    if (!value || typeof value !== 'string') {
      return false;
    }

    let mime = value.indexOf('/') === -1 ? this.lookup(value) : value;

    if (!mime) {
      console.error('No mime found');
      return false;
    }

    if (mime.indexOf('charset') === -1) {
      const c = this.charset(mime);
      if (c) mime += `; charset=${c.toLowerCase()}`;
    }

    return mime;
  };

  /**
   * Lookup the MIME type for the path/extension.
   *
   * @param path
   * @returns
   */
  lookup = (path?: string): false | string => {
    if (!path || typeof path !== 'string') {
      return false;
    }

    const extension = extname(`x.${path}`).toLowerCase().substr(1);

    if (!extension) {
      return false;
    }

    return this.types[extension] || false;
  };

  /**
   * Get the default extension for the MIME type
   *
   * @param type
   * @returns
   */
  extension = (type: string): false | string => {
    if (!type || typeof type !== 'string') {
      return false;
    }

    const match = EXTRACT_TYPE_REGEXP.exec(type);
    const exts = match && this.extensions[match[1].toLowerCase()];

    if (!exts || !exts.length) {
      return false;
    }

    return exts[0];
  };

  /**
   * Populate the extensions and types maps.
   *
   * @param extensions
   * @param types
   */
  private populateMaps() {
    const preference = ['nginx', 'apache', undefined, 'iana'];

    for (const type in this.db) {
      const mime = this.db[type];
      const exts = mime.extensions;

      if (!exts || !exts.length) {
        continue;
      }

      this.extensions[type] = exts;

      exts.forEach((e) => {
        if (this.types[e]) {
          const from = preference.indexOf(this.db[this.types[e]].source);
          const to = preference.indexOf(mime.source);

          if (
            this.types[e] !== 'application/octet-stream' &&
            (from > to ||
              (from === to && this.types[e].substr(0, 12) === 'application/'))
          ) {
            return;
          }
        }
        this.types[e] = type;
      });
    }
  }
}
