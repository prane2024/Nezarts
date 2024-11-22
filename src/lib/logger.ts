import { openDB } from 'idb';

export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface LogEntry {
  id?: number;
  timestamp: Date;
  level: LogLevel;
  category: string;
  message: string;
  details?: any;
}

const LOG_DB_NAME = 'nezarts-logs';
const LOG_DB_VERSION = 1;

export const initLogDb = async () => {
  return openDB(LOG_DB_NAME, LOG_DB_VERSION, {
    upgrade(db) {
      const logStore = db.createObjectStore('logs', { 
        keyPath: 'id',
        autoIncrement: true 
      });
      logStore.createIndex('timestamp', 'timestamp');
      logStore.createIndex('level', 'level');
      logStore.createIndex('category', 'category');
    },
  });
};

export const log = async (
  level: LogLevel,
  category: string,
  message: string,
  details?: any
) => {
  const db = await initLogDb();
  const entry: LogEntry = {
    timestamp: new Date(),
    level,
    category,
    message,
    details: details ? JSON.stringify(details) : undefined
  };

  try {
    await db.add('logs', entry);
  } catch (error) {
    console.error('Failed to write log:', error);
  }
};

export const getLogs = async (
  options: {
    level?: LogLevel;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}
): Promise<LogEntry[]> => {
  const db = await initLogDb();
  const tx = db.transaction('logs', 'readonly');
  const store = tx.objectStore('logs');
  let logs = await store.getAll();

  // Apply filters
  logs = logs.filter(log => {
    if (options.level && log.level !== options.level) return false;
    if (options.category && log.category !== options.category) return false;
    if (options.startDate && log.timestamp < options.startDate) return false;
    if (options.endDate && log.timestamp > options.endDate) return false;
    return true;
  });

  // Sort by timestamp descending
  logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Apply limit
  if (options.limit) {
    logs = logs.slice(0, options.limit);
  }

  return logs;
};

export const clearLogs = async () => {
  const db = await initLogDb();
  await db.clear('logs');
};