import { Bot, BrainCircuit, Check, Clock3, Code2, Folder, GitBranch, MessageSquare, Search } from 'lucide-react';

const systems = ['Agent fabric', 'Memory layer', 'Signal loops', 'Civic systems', 'Research notes'];

const sessions = [
  { title: 'JanSetu callback routing', agent: 'Voice agent', state: 'live', time: '09:14' },
  { title: 'Policy monitor digest', agent: 'Research agent', state: 'review', time: '08:52' },
  { title: 'Coding context handoff', agent: 'Code agent', state: 'memory', time: 'Yesterday' },
];

const contextItems = [
  ['Use case', 'multi-agent operations'],
  ['Signals', '14 live'],
  ['Agents', 'voice / code / research'],
  ['Handoffs', '3 open'],
];

export function SankhyaConsolePreview() {
  return (
    <div className="relative z-20 mx-auto mt-28 w-full max-w-[1260px] overflow-hidden rounded-lg border border-[#d9a47c]/35 bg-[#f7efe4] text-left shadow-[0_34px_90px_rgba(72,31,11,0.24)] md:mt-32">
      <div className="grid h-[560px] grid-cols-[52px_minmax(0,1fr)] bg-[#f6efe5] md:grid-cols-[58px_280px_minmax(0,1fr)] lg:grid-cols-[58px_280px_minmax(0,1fr)_280px]">
        <aside className="flex flex-col items-center border-r border-[#d9a47c]/24 bg-[#120d0a] py-4 text-[#fff4e8]">
          <div className="mb-7 h-6 w-6 rounded-sm bg-[#d04c23]" />
          <div className="space-y-5 text-[#fff4e8]/62">
            <BrainCircuit size={18} />
            <Folder size={18} />
            <GitBranch size={18} />
            <Code2 size={18} />
          </div>
          <div className="mt-auto grid h-7 w-7 place-items-center rounded-full bg-[#d04c23] font-mono text-[10px] font-bold">
            SA
          </div>
        </aside>

        <aside className="hidden border-r border-[#d9a47c]/32 bg-[#fbf2e7] md:block">
          <div className="border-b border-[#d9a47c]/32 p-4">
            <div className="font-mono text-[10px] uppercase tracking-normal text-[#8f6b56]">Workspace</div>
            <div className="mt-1 font-mono text-sm font-bold text-[#2a1208]">Sankhya AI Labs</div>
            <div className="mt-4 flex items-center gap-2 rounded-md border border-[#d9a47c]/35 bg-white/58 px-3 py-2 font-mono text-xs text-[#8f6b56]">
              <Search size={14} />
              Search systems...
            </div>
          </div>

          <div className="p-4">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-normal text-[#8f6b56]">Systems</div>
            <div className="space-y-1.5">
              {systems.map((system, index) => (
                <div
                  key={system}
                  className={`flex items-center justify-between rounded-md px-3 py-2 font-mono text-xs ${
                    index === 0 ? 'bg-[#f2d7c2] text-[#2a1208]' : 'text-[#6b4a38]'
                  }`}
                >
                  <span>{system}</span>
                  <span className="text-[10px] text-[#8f6b56]">{index === 0 ? 3 : index + 4}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 mb-3 font-mono text-[10px] uppercase tracking-normal text-[#8f6b56]">Live work</div>
            <div className="space-y-2">
              {sessions.map((session, index) => (
                <div
                  key={session.title}
                  className={`rounded-lg border p-3 ${
                    index === 0
                      ? 'border-[#d04c23]/35 bg-[#fff8ef]'
                      : 'border-[#d9a47c]/28 bg-white/38'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate font-mono text-xs font-bold text-[#2a1208]">{session.title}</div>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d04c23]" />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[#8f6b56]">
                    <span>{session.agent}</span>
                    <span>{session.time}</span>
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-normal text-[#d04c23]">
                    {session.state}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 bg-[#f8f2e9]">
          <div className="flex items-center justify-between border-b border-[#d9a47c]/32 px-4 py-3 md:px-6">
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-normal text-[#8f6b56]">Lab console</div>
              <div className="mt-1 truncate font-mono text-sm font-bold text-[#2a1208]">
                Agents, humans, and systems on one shared surface
              </div>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <span className="rounded-full bg-[#d04c23]/12 px-2.5 py-1 font-mono text-[10px] font-bold text-[#d04c23]">
                LIVE
              </span>
              <span className="rounded-full border border-[#d9a47c]/35 px-2.5 py-1 font-mono text-[10px] text-[#6b4a38]">
                SANKHYA-014
              </span>
            </div>
          </div>

          <div className="h-[500px] overflow-hidden p-4 md:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#d04c23] text-white">
                <Bot size={18} />
              </div>
              <div className="min-w-0 flex-1 rounded-lg border border-[#d9a47c]/32 bg-white/72 p-4 shadow-sm">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2a1208]">
                  Sankhya router
                  <span className="rounded bg-[#2a1208] px-1.5 py-0.5 text-[9px] text-[#fff4e8]">LAB</span>
                  <span className="ml-auto text-[10px] text-[#8f6b56]">09:14</span>
                </div>
                <p className="mt-3 font-mono text-xs leading-relaxed text-[#4b3328]">
                  Matched a live voice-agent call to prior policy notes, routed the context to a research agent, and opened an approval path for the operator.
                </p>
              </div>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-3">
              {[
                ['Context packets', '18', 'shared'],
                ['Signals routed', '7', 'today'],
                ['Actions waiting', '3', 'approval'],
              ].map(([label, value, detail]) => (
                <div key={label} className="rounded-lg border border-[#d9a47c]/32 bg-white/60 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-normal text-[#8f6b56]">{label}</div>
                  <div className="mt-2 font-pixel text-3xl text-[#2a1208]">{value}</div>
                  <div className="font-mono text-[10px] text-[#d04c23]">{detail}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-[#d9a47c]/32 bg-white/72 p-4">
              <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-normal text-[#8f6b56]">
                <Clock3 size={13} />
                Work trail
              </div>
              <div className="space-y-3">
                {[
                  ['Voice agent', 'Captured citizen intent and location from the live call.'],
                  ['Research agent', 'Pulled matching policy guidance and flagged missing context.'],
                  ['Human operator', 'Approved the next step and saved the decision as reusable learning.'],
                ].map(([agent, text]) => (
                  <div key={agent} className="grid grid-cols-[116px_1fr] gap-3 font-mono text-xs">
                    <span className="text-[#d04c23]">{agent}</span>
                    <span className="text-[#4b3328]">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <aside className="hidden border-l border-[#d9a47c]/32 bg-[#fbf2e7] lg:block">
          <div className="border-b border-[#d9a47c]/32 p-4">
            <div className="font-mono text-[10px] uppercase tracking-normal text-[#8f6b56]">Shared context</div>
            <div className="mt-3 rounded-lg border border-[#d9a47c]/32 bg-white/60 p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-[#ffe1cc] font-mono text-xs font-bold text-[#d04c23]">
                  SA
                </div>
                <div>
                  <div className="font-mono text-sm font-bold text-[#2a1208]">Sankhya fabric</div>
                  <div className="font-mono text-[10px] text-[#8f6b56]">shared state for agents</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-normal text-[#8f6b56]">Context packet</div>
              <div className="space-y-2">
                {contextItems.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-[#d9a47c]/28 bg-white/48 px-3 py-2 font-mono text-[10px]">
                    <span className="text-[#8f6b56]">{label}</span>
                    <span className="max-w-[150px] truncate text-[#2a1208]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-normal text-[#8f6b56]">System events</div>
              <div className="space-y-2">
                {['context loaded', 'signal routed', 'approval opened'].map((tool) => (
                  <div key={tool} className="flex items-center gap-2 rounded-md border border-[#d9a47c]/28 bg-white/48 px-3 py-2 font-mono text-[10px] text-[#2a1208]">
                    <Check size={12} className="text-[#d04c23]" />
                    {tool}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#d04c23]/30 bg-[#fff4e8] p-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#2a1208]">
                <MessageSquare size={14} />
                Saved learning
              </div>
              <p className="mt-3 font-mono text-[11px] leading-relaxed text-[#5f4031]">
                When this policy class appears again, ask for location proof before escalating to a field operator.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
