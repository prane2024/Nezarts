import React, { useState, useEffect } from 'react';
import { LogLevel, LogEntry, getLogs } from '../../lib/logger';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    level?: LogLevel;
    category?: string;
  }>({});

  const loadLogs = async () => {
    setLoading(true);
    try {
      const fetchedLogs = await getLogs(filter);
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [filter]);

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case LogLevel.WARNING:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case LogLevel.INFO:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getLevelClass = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return 'bg-red-50';
      case LogLevel.WARNING:
        return 'bg-yellow-50';
      case LogLevel.INFO:
        return 'bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <select
          value={filter.level || ''}
          onChange={(e) => setFilter({ ...filter, level: e.target.value as LogLevel || undefined })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">All Levels</option>
          {Object.values(LogLevel).map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filter.category || ''}
          onChange={(e) => setFilter({ ...filter, category: e.target.value || undefined })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(logs.map((log) => log.category))).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {logs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No logs found</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-4 rounded-lg border ${getLevelClass(log.level)}`}
            >
              <div className="flex items-start gap-3">
                {getLevelIcon(log.level)}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-900">{log.category}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{log.message}</p>
                  {log.details && (
                    <pre className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {log.details}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogViewer;