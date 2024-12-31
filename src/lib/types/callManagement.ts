/**
 * 场景管理类型定义
 */
export interface Scene {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'service' | 'survey' | 'custom';
  rules: SceneRule[];
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface SceneRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
}

/**
 * 任务管理类型定义
 */
export interface Task {
  id: string;
  name: string;
  sceneId: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  priority: number;
  schedule: TaskSchedule;
  targets: TaskTarget[];
  progress: TaskProgress;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskSchedule {
  startTime: Date;
  endTime: Date;
  timeWindows: TimeWindow[];
  maxConcurrentCalls: number;
}

export interface TimeWindow {
  dayOfWeek: number; // 0-6, 0 represents Sunday
  startHour: number;
  endHour: number;
}

export interface TaskTarget {
  id: string;
  phoneNumber: string;
  name?: string;
  attributes: Record<string, string>;
  priority: number;
  attempts: number;
  lastAttempt?: Date;
  status: 'pending' | 'completed' | 'failed' | 'blacklisted';
}

export interface TaskProgress {
  totalTargets: number;
  completedTargets: number;
  failedTargets: number;
  successRate: number;
  averageCallDuration: number;
  startTime?: Date;
  endTime?: Date;
}

/**
 * 批次管理类型定义
 */
export interface Batch {
  id: string;
  name: string;
  taskId: string;
  targets: TaskTarget[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: BatchProgress;
  createdAt: Date;
  updatedAt: Date;
}

export interface BatchProgress {
  totalCalls: number;
  completedCalls: number;
  failedCalls: number;
  successRate: number;
  startTime?: Date;
  endTime?: Date;
}

/**
 * 场景监控类型定义
 */
export interface SceneMonitor {
  sceneId: string;
  activeTasks: number;
  totalCalls: number;
  ongoingCalls: number;
  completedCalls: number;
  failedCalls: number;
  averageCallDuration: number;
  successRate: number;
  realTimeMetrics: RealTimeMetrics;
}

export interface RealTimeMetrics {
  timestamp: Date;
  callsPerMinute: number;
  successRateLastMinute: number;
  averageWaitTime: number;
  cpuUsage: number;
  memoryUsage: number;
}

/**
 * 外呼线路管理类型定义
 */
export interface CallLine {
  id: string;
  name: string;
  provider: string;
  capacity: number;
  currentLoad: number;
  status: 'active' | 'inactive' | 'maintenance';
  metrics: CallLineMetrics;
  config: CallLineConfig;
}

export interface CallLineMetrics {
  totalChannels: number;
  usedChannels: number;
  failureRate: number;
  averageLatency: number;
  costPerMinute: number;
}

export interface CallLineConfig {
  maxConcurrentCalls: number;
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
  recordCalls: boolean;
  qualityPreference: 'high' | 'medium' | 'low';
}

/**
 * 权限管理类型定义
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  roles: Role[];
  status: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
