import { 
  Scene, SceneRule, Task, TaskTarget, Batch, BatchProgress,
  SceneMonitor, CallLine, CallLineMetrics, Permission, Role, User 
} from '../types/callManagement';

/**
 * 场景管理服务
 */
export class SceneManagementService {
  private scenes: Map<string, Scene> = new Map();
  private rules: Map<string, SceneRule[]> = new Map();

  /**
   * 创建新场景
   */
  async createScene(scene: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scene> {
    const id = `scene_${Date.now()}`;
    const newScene: Scene = {
      ...scene,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      rules: []
    };
    this.scenes.set(id, newScene);
    return newScene;
  }

  /**
   * 更新场景规则
   */
  async updateSceneRules(sceneId: string, rules: SceneRule[]): Promise<void> {
    const scene = this.scenes.get(sceneId);
    if (!scene) {
      throw new Error('场景不存在');
    }
    this.rules.set(sceneId, rules);
    scene.rules = rules;
    scene.updatedAt = new Date();
  }

  /**
   * 获取场景详情
   */
  async getScene(sceneId: string): Promise<Scene | null> {
    return this.scenes.get(sceneId) || null;
  }

  /**
   * 列出所有场景
   */
  async listScenes(): Promise<Scene[]> {
    return Array.from(this.scenes.values());
  }
}

/**
 * 任务管理服务
 */
export class TaskManagementService {
  private tasks: Map<string, Task> = new Map();
  private batches: Map<string, Batch[]> = new Map();

  /**
   * 创建新任务
   */
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'progress'>): Promise<Task> {
    const id = `task_${Date.now()}`;
    const newTask: Task = {
      ...task,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: {
        totalTargets: task.targets.length,
        completedTargets: 0,
        failedTargets: 0,
        successRate: 0,
        averageCallDuration: 0
      }
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  /**
   * 创建任务批次
   */
  async createBatch(taskId: string, targets: TaskTarget[]): Promise<Batch> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error('任务不存在');
    }

    const batch: Batch = {
      id: `batch_${Date.now()}`,
      name: `${task.name}_batch_${Date.now()}`,
      taskId,
      targets,
      status: 'pending',
      progress: {
        totalCalls: targets.length,
        completedCalls: 0,
        failedCalls: 0,
        successRate: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const taskBatches = this.batches.get(taskId) || [];
    taskBatches.push(batch);
    this.batches.set(taskId, taskBatches);

    return batch;
  }

  /**
   * 更新任务状态
   */
  async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error('任务不存在');
    }
    task.status = status;
    task.updatedAt = new Date();
  }

  /**
   * 更新批次进度
   */
  async updateBatchProgress(
    taskId: string, 
    batchId: string, 
    progress: Partial<BatchProgress>
  ): Promise<void> {
    const batches = this.batches.get(taskId);
    if (!batches) {
      throw new Error('任务批次不存在');
    }

    const batch = batches.find(b => b.id === batchId);
    if (!batch) {
      throw new Error('批次不存在');
    }

    Object.assign(batch.progress, progress);
    batch.updatedAt = new Date();

    // 更新任务整体进度
    this.updateTaskProgress(taskId);
  }

  /**
   * 更新任务整体进度
   */
  private async updateTaskProgress(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    const batches = this.batches.get(taskId);
    if (!task || !batches) return;

    const progress = batches.reduce(
      (acc, batch) => ({
        totalTargets: acc.totalTargets + batch.progress.totalCalls,
        completedTargets: acc.completedTargets + batch.progress.completedCalls,
        failedTargets: acc.failedTargets + batch.progress.failedCalls,
        successRate: 0,
        averageCallDuration: 0
      }),
      {
        totalTargets: 0,
        completedTargets: 0,
        failedTargets: 0,
        successRate: 0,
        averageCallDuration: 0
      }
    );

    // 计算成功率
    progress.successRate = progress.totalTargets > 0
      ? (progress.completedTargets / progress.totalTargets) * 100
      : 0;

    task.progress = progress;
    task.updatedAt = new Date();
  }
}

/**
 * 场景监控服务
 */
export class SceneMonitorService {
  private monitors: Map<string, SceneMonitor> = new Map();

  /**
   * 更新场景监控数据
   */
  async updateMonitor(sceneId: string, metrics: Partial<SceneMonitor>): Promise<void> {
    const monitor = this.monitors.get(sceneId) || {
      sceneId,
      activeTasks: 0,
      totalCalls: 0,
      ongoingCalls: 0,
      completedCalls: 0,
      failedCalls: 0,
      averageCallDuration: 0,
      successRate: 0,
      realTimeMetrics: {
        timestamp: new Date(),
        callsPerMinute: 0,
        successRateLastMinute: 0,
        averageWaitTime: 0,
        cpuUsage: 0,
        memoryUsage: 0
      }
    };

    Object.assign(monitor, metrics);
    this.monitors.set(sceneId, monitor);
  }

  /**
   * 获取场景监控数据
   */
  async getMonitor(sceneId: string): Promise<SceneMonitor | null> {
    return this.monitors.get(sceneId) || null;
  }

  /**
   * 获取所有场景监控数据
   */
  async getAllMonitors(): Promise<SceneMonitor[]> {
    return Array.from(this.monitors.values());
  }
}

/**
 * 外呼线路管理服务
 */
export class CallLineManagementService {
  private lines: Map<string, CallLine> = new Map();

  /**
   * 添加新线路
   */
  async addLine(line: Omit<CallLine, 'id'>): Promise<CallLine> {
    const id = `line_${Date.now()}`;
    const newLine: CallLine = { ...line, id };
    this.lines.set(id, newLine);
    return newLine;
  }

  /**
   * 更新线路状态
   */
  async updateLineStatus(lineId: string, status: CallLine['status']): Promise<void> {
    const line = this.lines.get(lineId);
    if (!line) {
      throw new Error('线路不存在');
    }
    line.status = status;
  }

  /**
   * 更新线路指标
   */
  async updateLineMetrics(lineId: string, metrics: Partial<CallLineMetrics>): Promise<void> {
    const line = this.lines.get(lineId);
    if (!line) {
      throw new Error('线路不存在');
    }
    Object.assign(line.metrics, metrics);
  }

  /**
   * 获取可用线路
   */
  async getAvailableLines(): Promise<CallLine[]> {
    return Array.from(this.lines.values()).filter(
      line => line.status === 'active' && line.currentLoad < line.capacity
    );
  }
}

/**
 * 权限管理服务
 */
export class PermissionManagementService {
  private permissions: Map<string, Permission> = new Map();
  private roles: Map<string, Role> = new Map();
  private users: Map<string, User> = new Map();

  /**
   * 创建权限
   */
  async createPermission(permission: Omit<Permission, 'id'>): Promise<Permission> {
    const id = `perm_${Date.now()}`;
    const newPermission: Permission = { ...permission, id };
    this.permissions.set(id, newPermission);
    return newPermission;
  }

  /**
   * 创建角色
   */
  async createRole(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> {
    const id = `role_${Date.now()}`;
    const newRole: Role = {
      ...role,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.roles.set(id, newRole);
    return newRole;
  }

  /**
   * 分配用户角色
   */
  async assignUserRoles(userId: string, roleIds: string[]): Promise<void> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    const roles = roleIds
      .map(id => this.roles.get(id))
      .filter((role): role is Role => role !== undefined);

    user.roles = roles;
  }

  /**
   * 检查权限
   */
  async checkPermission(
    userId: string,
    resource: string,
    action: Permission['action']
  ): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user || user.status !== 'active') {
      return false;
    }

    return user.roles.some(role =>
      role.permissions.some(
        perm => perm.resource === resource && perm.action === action
      )
    );
  }
}

// 导出服务实例
export const sceneManagement = new SceneManagementService();
export const taskManagement = new TaskManagementService();
export const sceneMonitor = new SceneMonitorService();
export const callLineManagement = new CallLineManagementService();
export const permissionManagement = new PermissionManagementService();
