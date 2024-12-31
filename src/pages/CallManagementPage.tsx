import React, { useState, useEffect } from 'react';
import { 
  Scene, Task, Batch, CallLine, SceneMonitor,
  SceneRule, Role, User
} from '../lib/types/callManagement';
import {
  sceneManagement,
  sceneMonitor
} from '../lib/services/callManagement';
import { ASRMonitor } from '../components/asr/ASRMonitor';

/**
 * 场景管理组件
 */
const SceneManagement: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [rules, setRules] = useState<SceneRule[]>([]);

  useEffect(() => {
    loadScenes();
  }, []);

  const loadScenes = async () => {
    const sceneList = await sceneManagement.listScenes();
    setScenes(sceneList);
  };

  const handleSceneSelect = async (sceneId: string) => {
    const scene = await sceneManagement.getScene(sceneId);
    setSelectedScene(scene);
    if (scene) {
      setRules(scene.rules);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4" data-testid="scene-management-title">场景管理</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="text-xl mb-3" data-testid="scene-list-title">场景列表</h3>
          {scenes.map(scene => (
            <div
              key={scene.id}
              className={`p-2 cursor-pointer ${
                selectedScene?.id === scene.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleSceneSelect(scene.id)}
            >
              <div className="font-semibold">{scene.name}</div>
              <div className="text-sm text-gray-600">{scene.description}</div>
            </div>
          ))}
        </div>
        {selectedScene && (
          <div className="border rounded p-4">
            <h3 className="text-xl mb-3">场景规则</h3>
            {rules.map(rule => (
              <div key={rule.id} className="mb-2 p-2 border-b">
                <div className="font-medium">{rule.name}</div>
                <div className="text-sm">条件: {rule.condition}</div>
                <div className="text-sm">动作: {rule.action}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 任务管理组件
 */
const TaskManagement: React.FC = () => {
  const [tasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [batches] = useState<Batch[]>([]);

  // 任务状态标签样式映射
  const statusStyles: Record<Task['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-green-100 text-green-800',
    paused: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">任务管理</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="text-xl mb-3">任务列表</h3>
          {tasks.map(task => (
            <div
              key={task.id}
              className="mb-2 p-2 border-b cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{task.name}</span>
                <span className={`px-2 py-1 rounded text-sm ${statusStyles[task.status]}`}>
                  {task.status}
                </span>
              </div>
              <div className="mt-1 text-sm">
                进度: {task.progress.completedTargets}/{task.progress.totalTargets}
                ({Math.round(task.progress.successRate)}%)
              </div>
            </div>
          ))}
        </div>
        {selectedTask && (
          <div className="border rounded p-4">
            <h3 className="text-xl mb-3">批次管理</h3>
            {batches.map(batch => (
              <div key={batch.id} className="mb-2 p-2 border-b">
                <div className="font-medium">{batch.name}</div>
                <div className="text-sm">
                  完成率: {Math.round(batch.progress.successRate)}%
                </div>
                <div className="text-sm">
                  状态: {batch.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 场景监控组件
 */
const SceneMonitoring: React.FC = () => {
  const [monitors, setMonitors] = useState<SceneMonitor[]>([]);

  useEffect(() => {
    const loadMonitors = async () => {
      const monitorData = await sceneMonitor.getAllMonitors();
      setMonitors(monitorData);
    };

    loadMonitors();
    const interval = setInterval(loadMonitors, 5000); // 每5秒更新一次
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">场景监控</h2>
      <div className="grid grid-cols-3 gap-4">
        {monitors.map(monitor => (
          <div key={monitor.sceneId} className="border rounded p-4">
            <h3 className="text-xl mb-2">场景 {monitor.sceneId}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm" data-testid="call-metrics">
              <div>活动任务数: {monitor.activeTasks}</div>
              <div>总通话数: {monitor.totalCalls}</div>
              <div>进行中通话: {monitor.ongoingCalls}</div>
              <div>完成通话: {monitor.completedCalls}</div>
              <div>失败通话: {monitor.failedCalls}</div>
              <div>平均通话时长: {monitor.averageCallDuration}s</div>
              <div>成功率: {Math.round(monitor.successRate)}%</div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">实时指标</h4>
              <div className="text-sm">
                <div>每分钟通话数: {monitor.realTimeMetrics.callsPerMinute}</div>
                <div>最近一分钟成功率: {Math.round(monitor.realTimeMetrics.successRateLastMinute)}%</div>
                <div>平均等待时间: {monitor.realTimeMetrics.averageWaitTime}s</div>
                <div>CPU使用率: {Math.round(monitor.realTimeMetrics.cpuUsage)}%</div>
                <div>内存使用率: {Math.round(monitor.realTimeMetrics.memoryUsage)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 外呼线路管理组件
 */
const CallLineManagement: React.FC = () => {
  const [lines, setLines] = useState<CallLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<CallLine | null>(null);
  const [recognizedText, setRecognizedText] = useState<Record<string, string>>({});

  const updateRecognizedText = React.useCallback((callId: string, text: string) => {
    setRecognizedText(prev => ({
      ...prev,
      [callId]: text
    }));
  }, []);

  useEffect(() => {
    let isMounted = true;

    // 添加测试数据
    const testLines: CallLine[] = [
      {
        id: 'line-1',
        name: '测试线路1',
        status: 'active',
        provider: '火山引擎',
        capacity: 100,
        currentLoad: 45,
        metrics: {
          totalChannels: 100,
          usedChannels: 45,
          failureRate: 2.5,
          averageLatency: 150,
          costPerMinute: 0.05
        },
        config: {
          maxConcurrentCalls: 50,
          retryAttempts: 3,
          retryDelay: 1000,
          timeout: 30000,
          recordCalls: true,
          qualityPreference: 'high'
        }
      }
    ];

    if (isMounted) {
      setLines(testLines);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusColor = (status: CallLine['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-gray-600';
      case 'maintenance':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">外呼线路管理</h2>
      <div className="grid grid-cols-3 gap-4">
        {lines.map(line => (
          <div key={line.id} className="border rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl">{line.name}</h3>
              <span className={`font-medium ${getStatusColor(line.status)}`}>
                {line.status}
              </span>
            </div>
            <div className="text-sm">
              <div>提供商: {line.provider}</div>
              <div>容量: {line.capacity}</div>
              <div>当前负载: {line.currentLoad}</div>
              <div className="mt-2 font-medium">指标</div>
              <div>总通道数: {line.metrics.totalChannels}</div>
              <div>使用中通道: {line.metrics.usedChannels}</div>
              <div>失败率: {Math.round(line.metrics.failureRate)}%</div>
              <div>平均延迟: {line.metrics.averageLatency}ms</div>
              <div>每分钟成本: ¥{line.metrics.costPerMinute.toFixed(2)}</div>
              <button
                className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLine(selectedLine?.id === line.id ? null : line);
                }}
              >
                {selectedLine?.id === line.id ? '关闭监控' : '开启监控'}
              </button>
              {selectedLine?.id === line.id && (
                <div className="mt-4">
                  <ASRMonitor
                    callId={line.id}
                    onRecognitionResult={(text) => updateRecognizedText(line.id, text)}
                  />
                  {recognizedText[line.id] && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <div className="font-medium">最新识别结果:</div>
                      <div className="text-sm">{recognizedText[line.id]}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 权限管理组件
 */
const PermissionManagement: React.FC = () => {
  const [roles] = useState<Role[]>([]);
  const [users] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">权限管理</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="text-xl mb-3">角色管理</h3>
          {roles.map(role => (
            <div
              key={role.id}
              className={`p-2 cursor-pointer ${
                selectedRole?.id === role.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => setSelectedRole(role)}
            >
              <div className="font-semibold">{role.name}</div>
              <div className="text-sm text-gray-600">{role.description}</div>
              <div className="text-sm mt-1">
                权限数量: {role.permissions.length}
              </div>
            </div>
          ))}
        </div>
        <div className="border rounded p-4">
          <h3 className="text-xl mb-3">用户管理</h3>
          {users.map(user => (
            <div key={user.id} className="p-2 border-b">
              <div className="font-semibold">{user.username}</div>
              <div className="text-sm">
                角色: {user.roles.map(r => r.name).join(', ')}
              </div>
              <div className="text-sm">
                状态: {user.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 主页面组件
 */
export const CallManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('scenes');

  const tabs = [
    { id: 'scenes', name: '场景管理', component: SceneManagement },
    { id: 'tasks', name: '任务管理', component: TaskManagement },
    { id: 'monitor', name: '场景监控', component: SceneMonitoring },
    { id: 'lines', name: '线路管理', component: CallLineManagement },
    { id: 'permissions', name: '权限管理', component: PermissionManagement }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">外呼管理系统</h1>
      
      {/* 导航标签 */}
      <div className="flex border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            className={`px-4 py-2 mr-2 ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="mt-4">
        {tabs.map(tab => (
          activeTab === tab.id && <tab.component key={tab.id} />
        ))}
      </div>
    </div>
  );
};

export default CallManagementPage;
