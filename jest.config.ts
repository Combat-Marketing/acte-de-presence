const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: [
    ...getJestProjects(),
    '<rootDir>/libs/logger',
    '<rootDir>/libs/banner',
    '<rootDir>/libs/api/banner',
    '<rootDir>/apps/admin',
    '<rootDir>/apps/api',
    '<rootDir>/libs/api/vfs',
    '<rootDir>/libs/vfs/driver-memory',
    '<rootDir>/libs/vfs/vfs-driver-local',
    '<rootDir>/libs/vfs/vfs-driver-zip',
    '<rootDir>/libs/api/lib-zip',
    '<rootDir>/libs/api/utils',
  ],
};
