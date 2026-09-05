import React, { useState, useEffect } from 'react';
import { Wifi, Globe, Shield, Terminal, ArrowRight, ArrowLeft, RefreshCw, Cpu, Layers, Server, Laptop, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';
import { Snapshot, NetworkingState, NetworkPacketHeader, NetworkHostNode } from '../types';
import { soundSynth } from '../utils/soundSynthesizer';

interface NetworkingCanvasProps {
  currentSnapshot?: Snapshot;
  onSnapshotsGenerated: (snapshots: Snapshot[]) => void;
}

export type NetworkScenarioId = 'tcp_handshake' | 'http_lifecycle' | 'dns_lookup' | 'tls_handshake';

interface ScenarioMeta {
  id: NetworkScenarioId;
  title: string;
  protocol: string;
  badge: string;
  description: string;
}

const SCENARIOS: ScenarioMeta[] = [
  {
    id: 'tcp_handshake',
    title: 'TCP 3-Way Handshake',
    protocol: 'TCP / Transport',
    badge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    description: 'Connection establishment via SYN, SYN-ACK, and ACK sequence synchronization'
  },
  {
    id: 'http_lifecycle',
    title: 'HTTP Layer Encapsulation',
    protocol: 'OSI 7-Layer Stack',
    badge: 'border-[#5de6ff]/30 text-[#5de6ff] bg-[#5de6ff]/10',
    description: 'Payload encapsulation through HTTP -> TCP -> IP -> Ethernet -> Physical Bits'
  },
  {
    id: 'dns_lookup',
    title: 'DNS Recursive Resolution',
    protocol: 'DNS / UDP 53',
    badge: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    description: 'Hierarchical query routing across Root, TLD (.com), and Authoritative Name Servers'
  },
  {
    id: 'tls_handshake',
    title: 'TLS 1.3 Encrypted Handshake',
    protocol: 'TLS 1.3 / Crypto',
    badge: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    description: '1-RTT Diffie-Hellman ephemeral key exchange and symmetric session derivation'
  }
];

export function generateNetworkingSnapshots(scenarioId: NetworkScenarioId): Snapshot[] {
  const hosts: NetworkHostNode[] = [
    { id: 'client', name: 'Client Browser', role: 'client', ip: '192.168.1.104', mac: '00:1A:2B:3C:4D:5E', port: 51820 },
    { id: 'router', name: 'Gateway Router', role: 'router', ip: '192.168.1.1', mac: 'AA:BB:CC:DD:EE:01' },
    { id: 'server', name: 'Web Server', role: 'server', ip: '142.250.190.46', mac: '12:34:56:78:9A:BC', port: 443 },
    { id: 'dns', name: 'DNS 1.1.1.1', role: 'dns', ip: '1.1.1.1', mac: 'FE:DC:BA:98:76:54', port: 53 }
  ];

  if (scenarioId === 'tcp_handshake') {
    return [
      {
        lineHighlighted: 1,
        actionType: 'init',
        explanation: 'Client initiates TCP socket connection to Web Server at 142.250.190.46:443. State: CLOSED -> SYN_SENT.',
        networkingState: {
          scenario: 'TCP 3-Way Handshake',
          stage: 'Step 1: Client SYN Transmission',
          headers: [
            { layer: 'Transport', protocol: 'TCP', details: { Flags: 'SYN (0x02)', SeqNum: 1000, AckNum: 0, WindowSize: 65535 } },
            { layer: 'Network', protocol: 'IP', details: { SrcIP: '192.168.1.104', DstIP: '142.250.190.46', TTL: 64 } }
          ],
          hosts,
          activePacketPosition: { fromHost: 'client', toHost: 'server', progress: 0.25, label: 'TCP [SYN] Seq=1000' },
          windowBuffer: { seq: 1000, ack: 0, windowSize: 65535, sentBytes: [1000] },
          rawBits: '01000101 00000000 00111100 10101010'
        },
        variables: { clientState: 'SYN_SENT', serverState: 'LISTEN', clientISN: 1000 },
        consoleOutput: '[NET] Socket connect(): Sent TCP SYN (Seq=1000, Win=65535) to 142.250.190.46:443'
      },
      {
        lineHighlighted: 5,
        actionType: 'traverse',
        explanation: 'Server receives SYN packet. It allocates TCB buffer, picks server ISN=5000, and replies with SYN-ACK. State: LISTEN -> SYN_RCVD.',
        networkingState: {
          scenario: 'TCP 3-Way Handshake',
          stage: 'Step 2: Server SYN-ACK Response',
          headers: [
            { layer: 'Transport', protocol: 'TCP', details: { Flags: 'SYN + ACK (0x12)', SeqNum: 5000, AckNum: 1001, WindowSize: 28960 } },
            { layer: 'Network', protocol: 'IP', details: { SrcIP: '142.250.190.46', DstIP: '192.168.1.104', TTL: 56 } }
          ],
          hosts,
          activePacketPosition: { fromHost: 'server', toHost: 'client', progress: 0.75, label: 'TCP [SYN, ACK] Seq=5000 Ack=1001' },
          windowBuffer: { seq: 5000, ack: 1001, windowSize: 28960, sentBytes: [5000] },
          rawBits: '01010000 00010010 01110001 00100000'
        },
        variables: { clientState: 'SYN_SENT', serverState: 'SYN_RCVD', serverISN: 5000, expectedAck: 1001 },
        consoleOutput: '[NET] Server accepted connection. Transmitted SYN-ACK with Ack=1001 (Client Seq + 1).'
      },
      {
        lineHighlighted: 10,
        actionType: 'done',
        explanation: 'Client receives SYN-ACK and sends final ACK (AckNum=5001). TCP 3-way handshake established! Full-duplex byte stream opened.',
        networkingState: {
          scenario: 'TCP 3-Way Handshake',
          stage: 'Step 3: Connection Established',
          headers: [
            { layer: 'Transport', protocol: 'TCP', details: { Flags: 'ACK (0x10)', SeqNum: 1001, AckNum: 5001, WindowSize: 65535 } },
            { layer: 'Network', protocol: 'IP', details: { SrcIP: '192.168.1.104', DstIP: '142.250.190.46', TTL: 64 } }
          ],
          hosts,
          activePacketPosition: { fromHost: 'client', toHost: 'server', progress: 1.0, label: 'TCP [ACK] Seq=1001 Ack=5001' },
          windowBuffer: { seq: 1001, ack: 5001, windowSize: 65535, sentBytes: [1001] },
          rawBits: '01010000 00010000 11111111 00000000'
        },
        variables: { clientState: 'ESTABLISHED', serverState: 'ESTABLISHED', rttEstimateMs: 24 },
        consoleOutput: '[NET] Handshake SUCCESS. State ESTABLISHED. Ready for Application-layer data stream.'
      }
    ];
  }

  // HTTP Encapsulation Scenario
  return [
    {
      lineHighlighted: 1,
      actionType: 'init',
      explanation: 'Application Layer: User triggers fetch("/api/users"). HTTP/1.1 request formatted with headers and method payload.',
      networkingState: {
        scenario: 'HTTP Layer Encapsulation',
        stage: 'L7 Application Layer (HTTP)',
        headers: [
          { layer: 'Application', protocol: 'HTTP/1.1', details: { Method: 'GET', URI: '/api/v1/users', Host: 'dsa.chaicode.com', UserAgent: 'AlgoFlow/2.0' } }
        ],
        hosts,
        activePacketPosition: { fromHost: 'client', toHost: 'client', progress: 0.1, label: 'HTTP Payload: GET /api/v1/users' },
        rawBits: '01000111 01000101 01010100 00100000'
      },
      variables: { layer: 'L7 Application', mtuRemaining: 1460, bytesPayload: 184 },
      consoleOutput: '[L7 HTTP] Generated GET request buffer: "GET /api/v1/users HTTP/1.1\\r\\nHost: dsa.chaicode.com"'
    },
    {
      lineHighlighted: 6,
      actionType: 'traverse',
      explanation: 'Transport Layer (L4): OS TCP stack wraps HTTP payload with a 20-byte TCP header (Source Port 51820, Dest Port 443).',
      networkingState: {
        scenario: 'HTTP Layer Encapsulation',
        stage: 'L4 Transport Layer (TCP Encapsulation)',
        headers: [
          { layer: 'Application', protocol: 'HTTP/1.1', details: { Method: 'GET', URI: '/api/v1/users' } },
          { layer: 'Transport', protocol: 'TCP', details: { SrcPort: 51820, DstPort: 443, SeqNum: 3001, Checksum: '0x8F3A' } }
        ],
        hosts,
        activePacketPosition: { fromHost: 'client', toHost: 'router', progress: 0.35, label: 'TCP Segment (Src: 51820 -> Dst: 443)' },
        rawBits: '11001010 01101100 00000001 10111011'
      },
      variables: { layer: 'L4 Transport', tcpHeaderSize: '20 bytes', totalSegmentSize: 204 },
      consoleOutput: '[L4 TCP] Appended 20-byte TCP header with checksum 0x8F3A and sequence tracking.'
    },
    {
      lineHighlighted: 12,
      actionType: 'pointer_rewire',
      explanation: 'Network Layer (L3): IP packet wraps TCP segment. Appends 20-byte IPv4 header with routing addresses and TTL=64.',
      networkingState: {
        scenario: 'HTTP Layer Encapsulation',
        stage: 'L3 Network Layer (IP Encapsulation)',
        headers: [
          { layer: 'Application', protocol: 'HTTP/1.1', details: { Method: 'GET' } },
          { layer: 'Transport', protocol: 'TCP', details: { SrcPort: 51820, DstPort: 443 } },
          { layer: 'Network', protocol: 'IP', details: { Version: 'IPv4', SrcIP: '192.168.1.104', DstIP: '142.250.190.46', TTL: 64, Protocol: 6 } }
        ],
        hosts,
        activePacketPosition: { fromHost: 'client', toHost: 'router', progress: 0.6, label: 'IPv4 Packet (192.168.1.104 -> 142.250.190.46)' },
        rawBits: '01000101 00000000 00000000 11100000'
      },
      variables: { layer: 'L3 Network', ipHeaderSize: '20 bytes', ttlRemaining: 64 },
      consoleOutput: '[L3 IP] Routed to default gateway 192.168.1.1 via local ARP resolution table.'
    },
    {
      lineHighlighted: 18,
      actionType: 'done',
      explanation: 'Data Link & Physical (L2/L1): Ethernet II frame prepends Source/Dest MAC addresses and computes CRC32. Physical NIC encodes bits over wire.',
      networkingState: {
        scenario: 'HTTP Layer Encapsulation',
        stage: 'L2 Ethernet Frame & L1 Physical Bits',
        headers: [
          { layer: 'Application', protocol: 'HTTP/1.1', details: { Method: 'GET' } },
          { layer: 'Transport', protocol: 'TCP', details: { SrcPort: 51820, DstPort: 443 } },
          { layer: 'Network', protocol: 'IP', details: { SrcIP: '192.168.1.104', DstIP: '142.250.190.46' } },
          { layer: 'DataLink', protocol: 'Ethernet', details: { DstMAC: 'AA:BB:CC:DD:EE:01', SrcMAC: '00:1A:2B:3C:4D:5E', EtherType: '0x0800 (IPv4)', FCS: '0xD482A1' } }
        ],
        hosts,
        activePacketPosition: { fromHost: 'router', toHost: 'server', progress: 1.0, label: 'Physical Wire Stream: 1842 bits transmitted' },
        rawBits: '10101010 10101010 10101010 10101011 00000000 00011010 00101011 00111100'
      },
      variables: { layer: 'L2/L1 Physical', ethernetPreamble: '7 bytes', crcValid: 'VALID (0x00)', bytesOverWire: 238 },
      consoleOutput: '[L2/L1] Frame transmitted over copper/fiber interface. CRC32 validated without packet drops.'
    }
  ];
}

export default function NetworkingCanvas({ currentSnapshot, onSnapshotsGenerated }: NetworkingCanvasProps) {
  const [selectedScenario, setSelectedScenario] = useState<NetworkScenarioId>('tcp_handshake');
  const [activeView, setActiveView] = useState<'stack' | 'wire'>('wire');

  useEffect(() => {
    const snaps = generateNetworkingSnapshots(selectedScenario);
    onSnapshotsGenerated(snaps);
  }, [selectedScenario]);

  const net = currentSnapshot?.networkingState;
  const currentMeta = SCENARIOS.find(s => s.id === selectedScenario) || SCENARIOS[0];

  return (
    <div className="w-full h-full flex flex-col bg-bg-app rounded-xl overflow-hidden border border-border-custom">
      {/* Header Bar */}
      <div className="p-3 bg-bg-panel/90 border-b border-border-custom flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            Computer Networking Visual
          </span>
          <select
            value={selectedScenario}
            onChange={(e) => {
              const next = e.target.value as NetworkScenarioId;
              setSelectedScenario(next);
              soundSynth.playNote(55, 0.08, 'sine');
            }}
            aria-label="Select Network Simulation Scenario"
            className="bg-bg-card text-xs font-mono text-white border border-border-custom px-2.5 py-1 rounded-lg focus:outline-none focus:border-accent-custom"
          >
            {SCENARIOS.map(s => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.protocol})
              </option>
            ))}
          </select>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${currentMeta.badge}`}>
            {currentMeta.protocol}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-bg-card/60 p-0.5 rounded-lg border border-border-custom">
          <button
            onClick={() => setActiveView('wire')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              activeView === 'wire' ? 'bg-accent-custom text-white font-bold' : 'text-text-muted hover:text-white'
            }`}
          >
            Wire Simulation
          </button>
          <button
            onClick={() => setActiveView('stack')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              activeView === 'stack' ? 'bg-accent-custom text-white font-bold' : 'text-text-muted hover:text-white'
            }`}
          >
            Packet Header Stack
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="flex-1 p-4 overflow-auto flex flex-col justify-between">
        {activeView === 'wire' ? (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {/* Stage title */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#5de6ff] font-bold">
                {net?.stage || 'Simulation Ready'}
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                MTU 1500 • Full Duplex
              </span>
            </div>

            {/* Network Hosts Topology */}
            <div className="relative p-6 bg-bg-panel border border-border-custom rounded-2xl">
              {/* Connecting Wire Line */}
              <div className="absolute top-1/2 left-16 right-16 h-1 bg-slate-800 -translate-y-1/2 z-0">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-[#5de6ff] to-blue-500 transition-all duration-500"
                  style={{ width: `${(net?.activePacketPosition.progress || 0.5) * 100}%` }}
                />
              </div>

              {/* Glowing Packet Traveling */}
              {net?.activePacketPosition && (
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 bg-bg-app border-2 border-[#5de6ff] shadow-[0_0_20px_#5de6ff] rounded-xl px-3 py-1.5 flex items-center gap-2"
                  style={{
                    left: `${Math.min(90, Math.max(10, (net.activePacketPosition.progress * 80) + 10))}%`
                  }}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-white whitespace-nowrap">
                    {net.activePacketPosition.label}
                  </span>
                </motion.div>
              )}

              {/* Host Nodes Grid */}
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {net?.hosts.map((host) => {
                  const isSender = net.activePacketPosition.fromHost === host.id;
                  const isReceiver = net.activePacketPosition.toHost === host.id;

                  return (
                    <div
                      key={host.id}
                      className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                        isSender || isReceiver
                          ? 'border-accent-custom bg-accent-custom/5 shadow-lg'
                          : 'border-border-custom bg-bg-card/70'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-bg-panel border border-border-custom">
                        {host.role === 'client' && <Laptop className="w-5 h-5 text-emerald-400" />}
                        {host.role === 'server' && <Server className="w-5 h-5 text-[#5de6ff]" />}
                        {host.role === 'router' && <Globe className="w-5 h-5 text-amber-400" />}
                        {host.role === 'dns' && <HardDrive className="w-5 h-5 text-purple-400" />}
                      </div>

                      <h4 className="text-xs font-mono font-bold text-white">{host.name}</h4>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">{host.ip}</div>
                      <div className="text-[9px] font-mono text-text-muted mt-0.5 truncate max-w-full">
                        {host.mac}
                      </div>

                      <div className="mt-2 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-bg-panel border border-border-custom/80 text-text-accent">
                        {isSender ? 'Transmitting' : isReceiver ? 'Receiving' : 'Idle'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Raw Bitstream & Hex pulse */}
            <div className="p-3 bg-bg-panel border border-border-custom rounded-xl font-mono">
              <div className="flex items-center justify-between text-[10px] text-text-muted mb-1">
                <span className="text-[#5de6ff] font-bold">Physical Wire Bit Stream</span>
                <span>Framing: 8b/10b Encoding</span>
              </div>
              <div className="p-2.5 bg-bg-card rounded-lg border border-border-custom/60 text-xs text-emerald-400 font-mono tracking-widest overflow-x-auto whitespace-nowrap">
                {net?.rawBits || '01001000 01100101 01101100 01101100 01101111'}
              </div>
            </div>
          </div>
        ) : (
          /* Nested OSI Packet Header Stack */
          <div className="space-y-3 max-w-2xl mx-auto w-full font-mono">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5de6ff]" />
              Packet Encapsulation Stack (Inside-Out)
            </h4>

            {net?.headers.map((hdr, idx) => (
              <motion.div
                key={hdr.layer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-3 bg-bg-panel border border-border-custom rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#5de6ff]">
                    {hdr.layer} Layer ({hdr.protocol})
                  </span>
                  <span className="text-[10px] bg-bg-card px-2 py-0.5 rounded border border-border-custom text-text-muted">
                    Encapsulated Segment #{idx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries(hdr.details).map(([k, v]) => (
                    <div key={k} className="p-2 bg-bg-card/70 rounded-lg border border-border-custom/50">
                      <div className="text-[10px] text-text-muted uppercase font-semibold">{k}</div>
                      <div className="text-slate-200 font-bold truncate">{String(v)}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
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
