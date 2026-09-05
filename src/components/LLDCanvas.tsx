import React, { useState, useEffect } from 'react';
import { Layers, Play, RefreshCw, Cpu, Box, GitBranch, ArrowRight, ShieldCheck, Eye, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Snapshot, LLDState, LLDClassNode, LLDLink } from '../types';
import { soundSynth } from '../utils/soundSynthesizer';

interface LLDCanvasProps {
  currentSnapshot?: Snapshot;
  onSnapshotsGenerated: (snapshots: Snapshot[]) => void;
}

export type LLDScenarioId = 'parking_lot' | 'splitwise' | 'elevator' | 'notification';

interface ScenarioConfig {
  id: LLDScenarioId;
  name: string;
  pattern: string;
  patternDesc: string;
  badgeColor: string;
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'parking_lot',
    name: 'Parking Lot Architecture',
    pattern: 'Strategy + Factory Pattern',
    patternDesc: 'Decoupled pricing computation and polymorphic vehicle spot allocation',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'splitwise',
    name: 'Splitwise Expense Engine',
    pattern: 'Strategy + Observer Pattern',
    patternDesc: 'Equal, Exact, and Percent split calculation with group activity listeners',
    badgeColor: 'text-[#5de6ff] bg-[#5de6ff]/10 border-[#5de6ff]/20'
  },
  {
    id: 'elevator',
    name: 'Elevator Dispatch Controller',
    pattern: 'State + Strategy Pattern',
    patternDesc: 'LOOK / SCAN algorithmic elevator scheduling with direction state transitions',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 'notification',
    name: 'Multi-Channel Notifier',
    pattern: 'Factory + Observer Pattern',
    patternDesc: 'Event publishing with dynamic SMS, Email, and Push notification channel creation',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  }
];

export function generateLLDSnapshots(scenarioId: LLDScenarioId): Snapshot[] {
  if (scenarioId === 'parking_lot') {
    const baseClasses: LLDClassNode[] = [
      {
        id: 'c1',
        name: 'ParkingLot',
        type: 'class',
        pattern: 'Singleton',
        attributes: ['- instance: ParkingLot', '- levels: List<Level>', '- activeTickets: Map<Id, Ticket>'],
        methods: ['+ getInstance(): ParkingLot', '+ parkVehicle(v: Vehicle): Ticket', '+ unparkVehicle(t: Ticket): Bill'],
        x: 60,
        y: 40
      },
      {
        id: 'c2',
        name: 'FeeCalculationStrategy',
        type: 'interface',
        pattern: 'Strategy',
        attributes: [],
        methods: ['+ calculateFee(ticket: Ticket): double'],
        x: 420,
        y: 40
      },
      {
        id: 'c3',
        name: 'HourlyFeeStrategy',
        type: 'class',
        pattern: 'Strategy',
        attributes: ['- hourlyRate: double', '- vehicleMultiplier: double'],
        methods: ['+ calculateFee(ticket: Ticket): double'],
        x: 320,
        y: 240
      },
      {
        id: 'c4',
        name: 'FlatRateStrategy',
        type: 'class',
        pattern: 'Strategy',
        attributes: ['- flatRate: double'],
        methods: ['+ calculateFee(ticket: Ticket): double'],
        x: 520,
        y: 240
      },
      {
        id: 'c5',
        name: 'Vehicle',
        type: 'abstract',
        attributes: ['# licensePlate: String', '# type: VehicleType'],
        methods: ['+ getRequiredSpotType(): SpotType'],
        x: 60,
        y: 240
      },
      {
        id: 'c6',
        name: 'Car',
        type: 'class',
        attributes: ['- brand: String'],
        methods: ['+ getRequiredSpotType(): SpotType (COMPACT)'],
        x: 60,
        y: 400
      }
    ];

    const baseLinks: LLDLink[] = [
      { source: 'c1', target: 'c2', relation: 'uses', active: false },
      { source: 'c3', target: 'c2', relation: 'implements', active: false },
      { source: 'c4', target: 'c2', relation: 'implements', active: false },
      { source: 'c6', target: 'c5', relation: 'extends', active: false },
      { source: 'c1', target: 'c5', relation: 'uses', active: false }
    ];

    return [
      {
        lineHighlighted: 1,
        actionType: 'init',
        explanation: 'Initialize ParkingLot Singleton instance. The parking architecture registers FeeStrategy interfaces to invert dependencies.',
        lldState: {
          systemScenario: 'Parking Lot System',
          classes: baseClasses,
          links: baseLinks,
          callStack: ['ParkingLot.getInstance()']
        },
        variables: { singletonId: '0xPARK01', activeVehicles: 0, strategy: 'HourlyFeeStrategy' },
        consoleOutput: '[LLD] ParkingLot singleton initialized. Levels 1-4 loaded into memory.'
      },
      {
        lineHighlighted: 5,
        actionType: 'traverse',
        explanation: 'Client requests parkVehicle() for a newly arrived Car ("KA-01-AB-1234"). Vehicle subtype determines required spot type.',
        lldState: {
          systemScenario: 'Parking Lot System',
          classes: baseClasses.map(c => c.id === 'c1' || c.id === 'c6' ? { ...c, highlighted: true, activeMethod: c.id === 'c1' ? '+ parkVehicle()' : '+ getRequiredSpotType()' } : c),
          links: baseLinks.map(l => l.source === 'c1' && l.target === 'c5' ? { ...l, active: true } : l),
          activeObjectInstance: 'Car("KA-01-AB-1234")',
          activeSequenceMessage: 'parkVehicle(Car) -> verify Level 1 Compact spot available',
          callStack: ['ParkingLot.parkVehicle(v)', 'Car.getRequiredSpotType()']
        },
        variables: { licensePlate: 'KA-01-AB-1234', spotFound: 'L1-C14', allocatedTime: '10:00 AM' },
        consoleOutput: '[LLD] Car allocated to Level 1, Spot C-14. Ticket #T-9921 minted.'
      },
      {
        lineHighlighted: 12,
        actionType: 'pointer_rewire',
        explanation: 'Unparking vehicle: Ticket #T-9921 submitted. ParkingLot delegates fee calculation to FeeCalculationStrategy interface.',
        lldState: {
          systemScenario: 'Parking Lot System',
          classes: baseClasses.map(c => c.id === 'c1' || c.id === 'c2' ? { ...c, highlighted: true, activeMethod: '+ calculateFee()' } : c),
          links: baseLinks.map(l => l.source === 'c1' && l.target === 'c2' ? { ...l, active: true } : l),
          activeObjectInstance: 'Ticket(T-9921, duration=3.5h)',
          activeSequenceMessage: 'calculateFee(ticket) dispatched to Strategy interface',
          callStack: ['ParkingLot.unparkVehicle(T-9921)', 'FeeCalculationStrategy.calculateFee(T-9921)']
        },
        variables: { ticketId: 'T-9921', durationHours: 3.5, strategyInvoked: 'Interface FeeCalculationStrategy' },
        consoleOutput: '[LLD] Delegating pricing logic to registered Strategy implementation.'
      },
      {
        lineHighlighted: 18,
        actionType: 'compare',
        explanation: 'Polymorphic dispatch: HourlyFeeStrategy executes concrete calculation (duration * rate * vehicleMultiplier).',
        lldState: {
          systemScenario: 'Parking Lot System',
          classes: baseClasses.map(c => c.id === 'c3' ? { ...c, highlighted: true, activeMethod: '+ calculateFee()' } : c),
          links: baseLinks.map(l => l.source === 'c3' && l.target === 'c2' ? { ...l, active: true } : l),
          activeObjectInstance: 'HourlyFeeStrategy(rate=20, multiplier=1.5)',
          activeSequenceMessage: 'HourlyFeeStrategy executes: 3.5 hrs * $20 * 1.5 = $105.00',
          callStack: ['HourlyFeeStrategy.calculateFee() -> returns $105.00']
        },
        variables: { hourlyRate: 20, hours: 3.5, multiplier: 1.5, calculatedTotal: 105 },
        consoleOutput: '[LLD] Calculation complete: Total fee $105.00 calculated without mutating ParkingLot core.'
      },
      {
        lineHighlighted: 24,
        actionType: 'done',
        explanation: 'Spot freed. Observer notifies display boards on Level 1. Spot C-14 returned to pool. Open-Closed Principle maintained.',
        lldState: {
          systemScenario: 'Parking Lot System',
          classes: baseClasses,
          links: baseLinks,
          activeSequenceMessage: 'Spot C-14 freed -> DisplayBoard.refreshAvailableSpots()',
          callStack: ['PaymentProcessed', 'Spot.release()', 'DisplayBoard.refresh()']
        },
        variables: { spotStatus: 'VACANT', billPaid: '$105.00', availableCompactSpots: 42 },
        consoleOutput: '[LLD] Transaction finished. Spot C-14 vacant. Strategy pattern allowed fee rules to change without altering core classes.'
      }
    ];
  }

  // Splitwise scenario
  const splitClasses: LLDClassNode[] = [
    {
      id: 's1',
      name: 'ExpenseManager',
      type: 'class',
      pattern: 'Facade',
      attributes: ['- users: Map<Id, User>', '- groups: Map<Id, Group>', '- balanceSheet: Map<U1, Map<U2, double>>'],
      methods: ['+ addExpense(paidBy, amount, splits, strategy)', '+ getBalance(userId): double'],
      x: 60,
      y: 40
    },
    {
      id: 's2',
      name: 'SplitStrategy',
      type: 'interface',
      pattern: 'Strategy',
      attributes: [],
      methods: ['+ validateSplit(amount, splits): boolean', '+ computeOwedAmounts(amount, users): List<Split>'],
      x: 420,
      y: 40
    },
    {
      id: 's3',
      name: 'EqualSplitStrategy',
      type: 'class',
      pattern: 'Strategy',
      attributes: [],
      methods: ['+ computeOwedAmounts(): amount / n'],
      x: 320,
      y: 240
    },
    {
      id: 's4',
      name: 'PercentSplitStrategy',
      type: 'class',
      pattern: 'Strategy',
      attributes: ['- percentages: List<double>'],
      methods: ['+ computeOwedAmounts(): amount * pct%'],
      x: 520,
      y: 240
    },
    {
      id: 's5',
      name: 'UserObserver',
      type: 'interface',
      pattern: 'Observer',
      attributes: [],
      methods: ['+ onExpenseAdded(expense: Expense)'],
      x: 60,
      y: 260
    }
  ];

  const splitLinks: LLDLink[] = [
    { source: 's1', target: 's2', relation: 'uses', active: false },
    { source: 's3', target: 's2', relation: 'implements', active: false },
    { source: 's4', target: 's2', relation: 'implements', active: false },
    { source: 's1', target: 's5', relation: 'uses', active: false }
  ];

  return [
    {
      lineHighlighted: 1,
      actionType: 'init',
      explanation: 'Splitwise engine ready: ExpenseManager acts as a Facade coordinating SplitStrategy and UserObserver listeners.',
      lldState: {
        systemScenario: 'Splitwise Expense Engine',
        classes: splitClasses,
        links: splitLinks,
        callStack: ['ExpenseManager.init()']
      },
      variables: { activeUsers: 4, group: 'Trip to Goa', totalExpenses: '$0' },
      consoleOutput: '[LLD] ExpenseManager initialized. Strategy registry wired with Equal, Exact, and Percent splits.'
    },
    {
      lineHighlighted: 6,
      actionType: 'traverse',
      explanation: 'Alice pays $120 for dinner shared by Alice, Bob, Charlie, and Diana. ExpenseManager invokes EqualSplitStrategy.',
      lldState: {
        systemScenario: 'Splitwise Expense Engine',
        classes: splitClasses.map(c => c.id === 's1' || c.id === 's2' || c.id === 's3' ? { ...c, highlighted: true } : c),
        links: splitLinks.map(l => l.source === 's1' || l.source === 's3' ? { ...l, active: true } : l),
        activeObjectInstance: 'Expense(Dinner, $120, Payer=Alice)',
        activeSequenceMessage: 'EqualSplitStrategy.computeOwedAmounts($120, 4 users)',
        callStack: ['ExpenseManager.addExpense()', 'EqualSplitStrategy.computeOwedAmounts()']
      },
      variables: { totalAmount: 120, numUsers: 4, splitPerPerson: 30, payer: 'Alice' },
      consoleOutput: '[LLD] Strategy computed split: Each participant owes $30.00.'
    },
    {
      lineHighlighted: 14,
      actionType: 'pointer_rewire',
      explanation: 'Updating internal balance sheet ledger: Bob owes Alice $30, Charlie owes Alice $30, Diana owes Alice $30.',
      lldState: {
        systemScenario: 'Splitwise Expense Engine',
        classes: splitClasses.map(c => c.id === 's1' ? { ...c, highlighted: true } : c),
        links: splitLinks,
        activeSequenceMessage: 'balanceSheet.update(Bob -> Alice: +$30, Charlie -> Alice: +$30, Diana -> Alice: +$30)',
        callStack: ['ExpenseManager.updateBalanceSheet()']
      },
      variables: { 'Bob -> Alice': '+$30', 'Charlie -> Alice': '+$30', 'Diana -> Alice': '+$30' },
      consoleOutput: '[LLD] Graph balance ledger updated. Bidirectional offsets simplified.'
    },
    {
      lineHighlighted: 20,
      actionType: 'done',
      explanation: 'Observer pattern event fired: UserObserver notifies Bob, Charlie, and Diana push notification channels.',
      lldState: {
        systemScenario: 'Splitwise Expense Engine',
        classes: splitClasses.map(c => c.id === 's5' ? { ...c, highlighted: true } : c),
        links: splitLinks.map(l => l.target === 's5' ? { ...l, active: true } : l),
        activeSequenceMessage: 'UserObserver.onExpenseAdded() -> PushNotification sent to 3 users',
        callStack: ['UserObserver.notifyAll()', 'NotificationChannel.send()']
      },
      variables: { notificationsSent: 3, pendingSettlements: 3 },
      consoleOutput: '[LLD] Observers notified. Complete separation of debt calculation from notification delivery.'
    }
  ];
}

export default function LLDCanvas({ currentSnapshot, onSnapshotsGenerated }: LLDCanvasProps) {
  const [selectedScenario, setSelectedScenario] = useState<LLDScenarioId>('parking_lot');
  const [activeTab, setActiveTab] = useState<'uml' | 'sequence' | 'code'>('uml');

  useEffect(() => {
    const snaps = generateLLDSnapshots(selectedScenario);
    onSnapshotsGenerated(snaps);
  }, [selectedScenario]);

  const lld = currentSnapshot?.lldState;
  const currentConfig = SCENARIOS.find(s => s.id === selectedScenario) || SCENARIOS[0];

  return (
    <div className="w-full h-full flex flex-col bg-bg-app rounded-xl overflow-hidden border border-border-custom">
      {/* Top Toolbar */}
      <div className="p-3 bg-bg-panel/90 border-b border-border-custom flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            LLD & Object-Oriented Design
          </span>
          <select
            value={selectedScenario}
            onChange={(e) => {
              const next = e.target.value as LLDScenarioId;
              setSelectedScenario(next);
              soundSynth.playNote(60, 0.08, 'triangle');
            }}
            aria-label="Select LLD Architecture Scenario"
            className="bg-bg-card text-xs font-mono text-white border border-border-custom px-2.5 py-1 rounded-lg focus:outline-none focus:border-accent-custom"
          >
            {SCENARIOS.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.pattern})
              </option>
            ))}
          </select>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${currentConfig.badgeColor}`}>
            {currentConfig.pattern}
          </span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-bg-card/60 p-0.5 rounded-lg border border-border-custom">
          <button
            onClick={() => setActiveTab('uml')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'uml' ? 'bg-accent-custom text-white font-bold' : 'text-text-muted hover:text-white'
            }`}
          >
            UML Class Diagram
          </button>
          <button
            onClick={() => setActiveTab('sequence')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'sequence' ? 'bg-accent-custom text-white font-bold' : 'text-text-muted hover:text-white'
            }`}
          >
            Sequence Flow
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 relative overflow-auto p-4 flex flex-col justify-between">
        {activeTab === 'uml' ? (
          <div className="relative min-w-[700px] min-h-[440px] flex-1">
            {/* SVG Link lines between UML classes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#5de6ff" />
                </marker>
                <marker id="inherits" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <polygon points="0,0 10,5 0,10" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
                </marker>
              </defs>

              {lld?.links.map((link, idx) => {
                const sNode = lld.classes.find(c => c.id === link.source);
                const tNode = lld.classes.find(c => c.id === link.target);
                if (!sNode || !tNode) return null;

                const x1 = sNode.x + 110;
                const y1 = sNode.y + 70;
                const x2 = tNode.x + 110;
                const y2 = tNode.y + 70;

                return (
                  <g key={`link-${idx}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={link.active ? '#5de6ff' : '#334155'}
                      strokeWidth={link.active ? 2.5 : 1.5}
                      strokeDasharray={link.relation === 'implements' || link.relation === 'uses' ? '4 3' : 'none'}
                      className={link.active ? 'animate-pulse' : ''}
                      markerEnd={link.relation === 'extends' ? 'url(#inherits)' : 'url(#arrow)'}
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 8}
                      fill={link.active ? '#5de6ff' : '#64748b'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      «{link.relation}»
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* UML Class Cards */}
            {lld?.classes.map((cls) => (
              <motion.div
                key={cls.id}
                layout
                style={{ left: `${cls.x}px`, top: `${cls.y}px` }}
                className={`absolute w-[220px] bg-bg-panel border rounded-xl overflow-hidden shadow-xl z-10 transition-all ${
                  cls.highlighted
                    ? 'border-accent-custom ring-2 ring-accent-custom/40 shadow-[0_0_25px_rgba(93,230,255,0.25)]'
                    : 'border-border-custom hover:border-slate-700'
                }`}
              >
                {/* Class Header */}
                <div className={`p-2.5 border-b border-border-custom ${
                  cls.type === 'interface' 
                    ? 'bg-purple-500/10 text-purple-300' 
                    : cls.type === 'abstract'
                      ? 'bg-amber-500/10 text-amber-300'
                      : 'bg-bg-card text-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-wider uppercase text-text-muted">
                      «{cls.type}»
                    </span>
                    {cls.pattern && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bg-panel border border-border-custom text-text-accent">
                        {cls.pattern}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-mono font-bold mt-0.5 truncate">{cls.name}</h4>
                </div>

                {/* Attributes compartment */}
                {cls.attributes.length > 0 && (
                  <div className="p-2 border-b border-border-custom/50 bg-bg-app/40 space-y-0.5">
                    {cls.attributes.map((attr, i) => (
                      <div key={i} className="text-[10px] font-mono text-slate-300 truncate">
                        {attr}
                      </div>
                    ))}
                  </div>
                )}

                {/* Methods compartment */}
                <div className="p-2 bg-bg-panel space-y-1">
                  {cls.methods.map((method, i) => {
                    const isMethodActive = cls.activeMethod && method.includes(cls.activeMethod.replace('+', '').trim());
                    return (
                      <div
                        key={i}
                        className={`text-[10px] font-mono rounded px-1 py-0.5 transition-colors truncate ${
                          isMethodActive 
                            ? 'bg-accent-custom/20 text-[#5de6ff] font-bold border border-accent-custom/40' 
                            : 'text-slate-400'
                        }`}
                      >
                        {method}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Sequence Flow View */
          <div className="p-4 space-y-4 max-w-2xl mx-auto w-full font-mono">
            <div className="bg-bg-panel border border-border-custom rounded-xl p-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#5de6ff]" />
                Active Sequence Message Bus
              </h4>
              <div className="p-3 bg-bg-card rounded-lg border border-border-custom/60 text-xs text-[#5de6ff] font-mono flex items-center gap-2">
                <ArrowRight className="w-4 h-4 shrink-0 text-yellow-400 animate-pulse" />
                <span>{lld?.activeSequenceMessage || 'Awaiting method invocation step...'}</span>
              </div>
            </div>

            {/* Active Call Stack */}
            <div className="bg-bg-panel border border-border-custom rounded-xl p-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Active Call Stack Frames
              </h4>
              <div className="space-y-1.5">
                {(lld?.callStack || ['main()']).map((frame, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-bg-card border border-border-custom flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300 font-mono">#{idx + 1} {frame}</span>
                    <span className="text-[10px] text-text-muted font-mono">stack-frame</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Object Instances Watcher */}
            {lld?.activeObjectInstance && (
              <div className="bg-bg-panel border border-border-custom rounded-xl p-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Box className="w-4 h-4 text-amber-400" />
                  Allocated Heap Object Instance
                </h4>
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 font-mono">
                  {lld.activeObjectInstance}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Explanation Banner */}
        <div className="mt-3 p-3 rounded-xl bg-bg-panel border border-border-custom flex items-start gap-3">
          <Terminal className="w-4 h-4 text-[#5de6ff] shrink-0 mt-0.5" />
          <div className="text-xs font-mono">
            <span className="text-white font-bold">{currentSnapshot?.actionType.toUpperCase()}: </span>
            <span className="text-slate-300">{currentSnapshot?.explanation || 'Ready.'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
