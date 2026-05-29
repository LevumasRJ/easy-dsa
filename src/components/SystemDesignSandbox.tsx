import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, ShieldAlert, Cpu, Database, Network, TrendingUp, 
  Settings, Zap, Sparkles, RefreshCw, Layers 
} from 'lucide-react';

export default function SystemDesignSandbox({ triggerXp }: { triggerXp?: (x: number, reason: string) => void }) {
  // Traffic state: Requests Per Second
  const [trafficRps, setTrafficRps] = useState<number>(500);

  // Architecture scaling states
  const [replicasCount, setReplicasCount] = useState<number>(1);
  const [redisCacheActive, setRedisCacheActive] = useState<boolean>(false);
  const [dbShardingActive, setDbShardingActive] = useState<boolean>(false);
  const [rateLimitingActive, setRateLimitingActive] = useState<boolean>(true);

  // Derived real-time indicators
  const dbWriteStress = Math.min(100, Math.floor((trafficRps / (dbShardingActive ? 22000 : 7500)) * 100));
  const serviceCpuLoad = Math.min(100, Math.floor((trafficRps / (replicasCount * 6000)) * 100));
  const redisHitRate = redisCacheActive ? Math.min(95, 65 + Math.floor(trafficRps / 11000)) : 0;
  const isHealthy = serviceCpuLoad < 85 && dbWriteStress < 85;

  const getSystemStatusMessage = () => {
    if (trafficRps > 80000 && !dbShardingActive) {
      return 'CRITICAL DISK I/O EXHAUSTED: Main Database writes blocking. Scale db sharding!';
    }
    if (serviceCpuLoad > 90) {
      return 'SERVICES CRASHING: Service cluster bottlenecked at 100% CPU thread starvation. Spin replicas!';
    }
    if (rateLimitingActive && trafficRps > 50000 && !redisCacheActive) {
      return 'API GATEWAY WARNING: Extreme rate-limit denial exceptions throttling 40% user connections.';
    }
    if (!isHealthy) {
      return 'SYSTEM BOTTLENECKED: Latency spiking to > 850ms. Optimize scale filters below.';
    }
    return 'SYSTEM HEALTHY: Load balances routed. Cluster latency stable at 24ms.';
  };

  // Give micro achievements if they scale to 100,000 RPS and stay healthy
  useEffect(() => {
    if (trafficRps >= 80000 && isHealthy && replicasCount >= 3 && redisCacheActive && dbShardingActive) {
      if (triggerXp) {
        triggerXp(80, 'System Design Wizard! Scaled infrastructure to 100K RPS stably 🎉');
      }
    }
  }, [trafficRps, replicasCount, redisCacheActive, dbShardingActive]);

  return (
    <div id="system-design-canvas" className="w-full h-full flex flex-col bg-bg-panel border border-border-custom rounded-2xl overflow-hidden shadow-2xl">
      
      {/* 1. Header Toolbar details */}
      <div className="p-4 bg-bg-card/95 border-b border-border-custom flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-black text-white text-sm sm:text-base tracking-tight">
            Interactive System Design Canvas & Scaling Sandbox
          </h3>
        </div>

        {/* Dynamic status ribbon */}
        <div className={`px-3 py-1 rounded-full border text-[10px] font-mono font-black uppercase flex items-center gap-1.5 ${
          serviceCpuLoad > 90 || dbWriteStress > 90
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            : isHealthy 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
        }`}>
          <Server className="w-3.5 h-3.5" />
          <span>Status: {getSystemStatusMessage()}</span>
        </div>
      </div>

      {/* 2. Visual layout nodes representation with Framer motion */}
      <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto min-h-[300px]">
        
        {/* Static graphical micro service diagram mapping */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-3 items-center justify-center p-2 mb-4 font-mono text-center">
          
          {/* Node 1: Client users */}
          <div className="p-3 rounded-xl border border-border-custom bg-bg-card/45 relative">
            <span className="text-[8px] text-zinc-500 block">NODE_A</span>
            <span className="text-white font-black text-xs block mt-1">User Clients</span>
            <div className="text-[10px] text-zinc-400 font-bold mt-1.5">{trafficRps.toLocaleString()} Reqs/Sec</div>
            <div className="mt-2 text-[9px] text-[#5de6ff] uppercase tracking-wide font-black">HTTP GET/POST</div>
          </div>

          {/* Node 2: DNS & CDN Routing */}
          <div className="p-3 rounded-xl border border-border-custom bg-bg-card/45 relative">
            <span className="text-[8px] text-zinc-500 block">NODE_B</span>
            <span className="text-white font-black text-xs block mt-1">Nginx Gateway</span>
            <div className="text-[10px] text-emerald-400 font-bold mt-1.5">DNS Route GeoIP</div>
            <div className="w-16 h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Node 3: API Gateway Rate Limiter */}
          <div className={`p-3 rounded-xl border relative ${
            rateLimitingActive && trafficRps > 50000 && !redisCacheActive
              ? 'border-rose-500/60 bg-rose-500/5 text-rose-400'
              : 'border-border-custom bg-bg-card/45 text-white'
          }`}>
            <span className="text-[8px] text-zinc-500 block">NODE_C</span>
            <span className="font-black text-xs block mt-1">API Rate Limiter</span>
            <div className="text-[10px] font-bold mt-1.5">
              {rateLimitingActive ? 'Redis Token Bucket' : 'Disabled (No Limit)'}
            </div>
            {rateLimitingActive && trafficRps > 50000 && !redisCacheActive && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] bg-rose-400 text-bg-app font-black px-1.5 py-0.2 rounded animate-bounce">
                429 EXC
              </span>
            )}
          </div>

          {/* Node 4: Replicas Pod Clusters */}
          <div className={`p-3 rounded-xl border relative ${
            serviceCpuLoad > 85
              ? 'border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
              : 'border-border-custom bg-bg-card/45 text-white'
          }`}>
            <span className="text-[8px] text-zinc-500 block">NODE_D</span>
            <span className="font-black text-xs block mt-1">App Servers</span>
            <div className="text-[10px] font-bold mt-1.5">Replicas: {replicasCount} x Pods</div>
            <div className="text-[10px] text-amber-400 mt-1">Load: {serviceCpuLoad}% CPU</div>
            {serviceCpuLoad > 85 && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] bg-red-400 text-bg-app font-black px-1.5 py-0.2 rounded animate-pulse">
                Starving
              </span>
            )}
          </div>

          {/* Node 5: Redis Cache layer */}
          <div className={`p-3 rounded-xl border relative ${
            redisCacheActive 
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
              : 'border-border-custom/30 bg-bg-card/20 text-zinc-600'
          }`}>
            <span className="text-[8px] text-zinc-500 block">NODE_E</span>
            <span className="font-black text-xs block mt-1">Redis In-Memory</span>
            <div className="text-[10px] font-bold mt-1.5">Hit Rate: {redisHitRate}%</div>
            <div className="text-[9px] text-[#5de6ff] uppercase tracking-wide font-black mt-2">Cache Lookups</div>
          </div>

          {/* Node 6: Databases with sharding rules */}
          <div className={`p-3 rounded-xl border relative ${
            dbWriteStress > 85
              ? 'border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
              : 'border-border-custom bg-bg-card/45 text-white'
          }`}>
            <span className="text-[8px] text-zinc-500 block">NODE_F</span>
            <span className="font-black text-xs block mt-1">PostgreSQL DB</span>
            <div className="text-[10px] font-bold mt-1.5">{dbShardingActive ? 'Horizontal Sharding' : 'Primary Only'}</div>
            <div className="text-[10px] text-amber-500 mt-1">Disk I/O: {dbWriteStress}%</div>
            {dbWriteStress > 85 && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] bg-rose-400 text-bg-app font-black px-1.5 py-0.2 rounded animate-bounce">
                I/O Lock
              </span>
            )}
          </div>

        </div>

        {/* Linear flow system topology summary table metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-bg-card/40 border border-border-custom p-4 rounded-xl text-xs font-mono mb-4 text-[#dae2fd]">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">NETWORK METRICS</span>
            <p>● Total Bandwidth: <strong className="text-white">{(trafficRps * 0.12).toFixed(1)} Gbps</strong></p>
            <p>● Concurrency: <strong className="text-amber-400 font-bold">{(trafficRps * 7).toLocaleString()} sessions</strong></p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">ELAPSED TIME LATENCY</span>
            <p>● DNS Routing lookup: <strong className="text-white">1.8 ms</strong></p>
            <p>● HTTP Handshake delay: <strong className="text-emerald-400">{(12 + (serviceCpuLoad > 85 ? 150 : 0)).toFixed(1)} ms</strong></p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">CACHE HIT EFFICIENCY</span>
            <p>● Redis Hits count: <strong className="text-white">{redisCacheActive ? (trafficRps * 0.82).toFixed(0) : '0'} RPS</strong></p>
            <p>● Main DB Writes stress: <strong className={dbWriteStress > 85 ? 'text-rose-400 font-bold' : 'text-slate-300'}>{dbWriteStress}%</strong></p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">MICROSERVICE SPEC</span>
            <p>● Container Health: <span className={isHealthy ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{isHealthy ? 'STABLE' : 'Starved'}</span></p>
            <p>● CPU Thread pools: <strong className="text-white">Active ({replicasCount * 128} Threads)</strong></p>
          </div>
        </div>

        {/* Slider Controls for Traffic Input & System Tuning Options Form */}
        <div className="p-4 bg-bg-card/70 border border-border-custom rounded-xl flex flex-col gap-4">
          
          {/* Traffic Meter range slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-400 uppercase tracking-wider font-bold">Adjust Simulated Traffic Stream Throttling (RPS)</span>
              <span className="text-indigo-400 font-black text-sm">{trafficRps.toLocaleString()} requests/second</span>
            </div>
            
            <input 
              type="range"
              min="100"
              max="100000"
              step="500"
              value={trafficRps}
              onChange={e => {
                const val = parseInt(e.target.value);
                setTrafficRps(val);
              }}
              className="accent-indigo-500 w-full bg-slate-900 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Scaling actions layout controls */}
          <div className="flex flex-wrap gap-2.5 justify-between items-center bg-bg-panel/40 p-3 rounded-xl border border-border-custom/50">
            <div className="flex flex-wrap gap-2.5 items-center">
              
              {/* Spinner Replicas */}
              <div className="flex items-center gap-1.5 bg-bg-card border border-border-custom px-3 py-1.5 rounded-lg">
                <span className="text-[11px] font-mono text-zinc-400">Replicas:</span>
                <button 
                  onClick={() => setReplicasCount(prev => Math.max(1, prev - 1))}
                  className="text-xs bg-bg-panel hover:bg-zinc-800 text-white px-1.5 rounded font-black cursor-pointer"
                >
                  -
                </button>
                <span className="text-xs text-white font-mono font-bold w-4 text-center">{replicasCount}</span>
                <button 
                  onClick={() => {
                    setReplicasCount(prev => Math.min(6, prev + 1));
                    if (triggerXp) triggerXp(15, `Scaled service microservice cluster to ${replicasCount + 1} pods`);
                  }}
                  className="text-xs bg-bg-panel hover:bg-zinc-800 text-white px-1.5 rounded font-black cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Toggle Caching */}
              <button
                onClick={() => {
                  setRedisCacheActive(!redisCacheActive);
                  if (triggerXp) triggerXp(20, `Redis caching layer ${!redisCacheActive ? 'ACTIVATED' : 'DEACTIVATED'}`);
                }}
                className={`text-xs font-mono font-bold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  redisCacheActive 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'bg-bg-card text-text-muted hover:text-white border border-border-custom'
                }`}
              >
                {redisCacheActive ? 'Redis Caching: ACTIVE' : 'Redis Caching: DISABLED'}
              </button>

              {/* Toggle Database Sharding */}
              <button
                onClick={() => {
                  setDbShardingActive(!dbShardingActive);
                  if (triggerXp) triggerXp(30, `Database Horizontal Sharding partitions ${!dbShardingActive ? 'SET' : 'RELOAD'}`);
                }}
                className={`text-xs font-mono font-bold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  dbShardingActive 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'bg-bg-card text-text-muted hover:text-white border border-border-custom'
                }`}
              >
                {dbShardingActive ? 'Database Sharding: ACTIVE' : 'Database Sharding: SINGLE NODE'}
              </button>

              {/* Toggle API Gateway Limit */}
              <button
                onClick={() => setRateLimitingActive(!rateLimitingActive)}
                className={`text-xs font-mono font-bold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  rateLimitingActive 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'bg-bg-card text-text-muted hover:text-white border border-border-custom'
                }`}
              >
                {rateLimitingActive ? 'Rate Limiter: ON' : 'Rate Limiter: BYPASSED'}
              </button>

            </div>

            {/* Quick reset button */}
            <button
              onClick={() => {
                setTrafficRps(500);
                setReplicasCount(1);
                setRedisCacheActive(false);
                setDbShardingActive(false);
                setRateLimitingActive(true);
              }}
              className="text-[#94a3b8] hover:text-white text-xs font-mono flex items-center gap-1.5 py-1 px-2 border border-border-custom rounded-lg transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Config
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
