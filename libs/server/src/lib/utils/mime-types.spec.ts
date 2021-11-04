import { MimeDb, MimeTypes } from './mime-types';

const db: MimeDb = {
  'application/json': {
    source: 'iana',
    charset: 'UTF-8',
    compressible: true,
    extensions: ['json', 'map'],
  },
  'application/octet-stream': {
    source: 'iana',
    compressible: false,
    extensions: [
      'bin',
      'dms',
      'lrf',
      'mar',
      'so',
      'dist',
      'distz',
      'pkg',
      'bpk',
      'dump',
      'elc',
      'deploy',
      'exe',
      'dll',
      'deb',
      'dmg',
      'iso',
      'img',
      'msi',
      'msp',
      'msm',
      'buffer',
    ],
  },
};

let mimeTypes = new MimeTypes(db);

describe('mime-types', () => {
  beforeAll(() => {
    mimeTypes = new MimeTypes(db);
  });

  describe('.charset(type)', () => {
    it('should return "UTF-8" for "application/json"', () => {
      expect(mimeTypes.charset('application/json')).toEqual('UTF-8');
    });

    it('should return "UTF-8" for "application/JSON"', () => {
      expect(mimeTypes.charset('application/json')).toEqual('UTF-8');
    });

    it('should return "UTF-8" for "application/json; foo=bar"', () => {
      expect(mimeTypes.charset('application/json; foo=bar')).toEqual('UTF-8');
    });

    it('should return "UTF-8" for "text/html"', () => {
      expect(mimeTypes.charset('text/html')).toEqual('UTF-8');
    });

    it('should return "UTF-8" for any "text/*"', () => {
      expect(mimeTypes.charset('text/x-bogus')).toEqual('UTF-8');
    });

    it('should return false for any unknown types', () => {
      expect(mimeTypes.charset('application/javascript')).toEqual(false);
    });

    it('should return false for any "application/octet-stream"', () => {
      expect(mimeTypes.charset('application/octet-stream')).toEqual(false);
    });

    it('should return false for invalid arguments', () => {
      expect(mimeTypes.charset(undefined)).toEqual(false);
    });
  });

  describe('.contentType(extension)', () => {
    it('should return content-type for "json"', () => {
      expect(mimeTypes.contentType('json')).toEqual(
        'application/json; charset=utf-8'
      );
    });
    it('should return false for unknown extensions', () => {
      expect(mimeTypes.contentType('html')).toEqual(false);
    });
    it('should return false if extension is undefined', () => {
      expect(mimeTypes.contentType(undefined)).toEqual(false);
    });
  });

  describe('.contentType(type)', () => {
    it('should return content-type for "application/json"', () => {
      expect(mimeTypes.contentType('application/json')).toEqual(
        'application/json; charset=utf-8'
      );
    });

    it('should return content-type for "application/json; charset=utf-8"', () => {
      expect(mimeTypes.contentType('application/json; charset=utf-8')).toEqual(
        'application/json; charset=utf-8'
      );
    });

    it('should return false for unknown extensions', () => {
      expect(mimeTypes.contentType('html')).toEqual(false);
    });
  });

  describe('.extension(type)', () => {
    it('should return the extension for the MIME type', () => {
      expect(mimeTypes.extension('application/json')).toEqual('json');
      expect(mimeTypes.extension('application/json ')).toEqual('json');
      expect(mimeTypes.extension(' application/json')).toEqual('json');
    });

    it('should return false for unknown type', () => {
      expect(mimeTypes.extension('text/html')).toEqual(false);
    });

    it('should return false for a non type string', () => {
      expect(mimeTypes.extension('test')).toEqual(false);
    });
  });

  describe('.lookup(extension)', () => {
    it('should return the MIME type for .json', () => {
      expect(mimeTypes.lookup('.json')).toEqual('application/json');
    });

    it('should return the MIME type for json', () => {
      expect(mimeTypes.lookup('json')).toEqual('application/json');
    });

    it('should be case insensitive', () => {
      expect(mimeTypes.lookup('JSON')).toEqual('application/json');
      expect(mimeTypes.lookup('.JSON')).toEqual('application/json');
    });

    it('should return the false for unknown extensions', () => {
      expect(mimeTypes.lookup('.test')).toEqual(false);
      expect(mimeTypes.lookup('test')).toEqual(false);
    });
  });

  describe('.lookup(path)', () => {
    it('should return the mime type for a filename', () => {
      expect(mimeTypes.lookup('page.json')).toEqual('application/json');
    });

    it('should return the mime type of a relative path', () => {
      expect(mimeTypes.lookup('path/to/page.json')).toEqual('application/json');
      expect(mimeTypes.lookup('path\\to\\page.json')).toEqual(
        'application/json'
      );
    });

    it('should return the mime type of an absolute path', () => {
      expect(mimeTypes.lookup('/path/to/page.json')).toEqual(
        'application/json'
      );
      expect(mimeTypes.lookup('C:\\path\\to\\page.json')).toEqual(
        'application/json'
      );
    });

    it('should be case insensitive', () => {
      expect(mimeTypes.lookup('page.JSON')).toEqual('application/json');
    });

    it('should return the false for unknown extensions', () => {
      expect(mimeTypes.lookup('test.test')).toEqual(false);
    });

    it('should return the false for missing extension', () => {
      expect(mimeTypes.lookup('path/to/test')).toEqual(false);
    });
  });
});
