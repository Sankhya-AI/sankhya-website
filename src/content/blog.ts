export type BlogVisual = 'dheefs-architecture' | 'portable-cognition-sequence';

export type BlogLink = {
  label: string;
  url: string;
};

export type BlogSection = {
  id: string;
  title: string;
  body: string[];
  visual?: BlogVisual;
};

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  xUrl?: string;
  links?: BlogLink[];
  heroLabel: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'thin-harness-fat-skills-context-hell',
    category: 'Agent Infrastructure',
    title: 'Thin Harness, Fat Skills, and the Coming Context Hell',
    excerpt:
      'Fat skills compound, but unmanaged context becomes baggage. Dhee turns repo memory into a portable cognition layer that routes, compresses, forgets, and learns from use.',
    date: 'April 20, 2026',
    readTime: '14 min read',
    author: 'Ashish Dwivedi',
    tags: ['Dhee', 'DheeFS', 'context routing', 'agent memory'],
    xUrl: 'https://x.com/ashish_dwi/status/2046213227898687678',
    heroLabel: 'DHEEFS',
    sections: [
      {
        id: 'thin-harness-fat-skills-and-the-hidden-tax',
        title: 'Thin harness, fat skills, and the hidden tax',
        body: [
          'I agree with Gary Tan\'s thin harness, fat skills framing. He is right about something very important: the biggest gains are not coming from a magically smarter model. They are coming from architecture. A thin harness. Rich markdown skills. Better context loading. Less noise.',
          'But I think there is one more layer missing.',
          'Fat skills are right. Fat skills are powerful. Fat skills compound. And over time, fat skills can also become context hell.',
          'That is the hidden tax nobody talks about enough.',
          'A repo starts clean. Then the team adds CLAUDE.md. Then skill files. Then frontend conventions. Then backend conventions. Then testing rules. Then deployment notes. Then edge cases. Then old lessons. Then imports. Then more imports. Then more markdown because "the agent should know this too."',
          'Six months later, the repo is smarter. Twelve months later, the agent is slower. Two years later, the team has encoded a lot of wisdom, but nobody really knows what should be live in the context window for this task, right now.',
          'That is how you get a coding agent carrying Tailwind rules while you are debugging token refresh logic. That is how frontend guidance leaks into backend auth work. That is how you get a huge markdown brain and still feel like every session starts cold.',
          'The problem is not fat skills. The problem is unmanaged context.',
        ],
      },
      {
        id: 'fat-skills-context-should-stay-thin',
        title: 'Fat skills should stay in the repo. Context should stay thin at runtime.',
        body: [
          'I think this is where the next real layer of agent infrastructure gets built. Not at the model layer. Not with one more orchestrator agent. Not with another giant tool menu. With cognition.',
          'That is what we are building with Dhee.',
          'Dhee is a portable memory OS for agents. Not a new model. Not a wrapper pretending to be AGI. Not a manager agent coordinating a bunch of smaller interns. A portable cognition layer.',
          'The first job of that layer is context routing.',
          'I do not want the agent to see all available context. I want it to see the right context. That sounds obvious, but it is still where most systems break.',
          'A backend debugging turn should not look like a frontend styling turn. A database migration task should not carry the same working set as a code review task. A performance regression investigation should not begin by dragging in random design-system doctrine just because it exists somewhere in markdown memory.',
          'Skills should stay fat in the repo. Context should stay thin at runtime. That is the distinction that matters.',
        ],
      },
      {
        id: 'the-routing-layer-should-learn',
        title: 'The routing layer should learn',
        visual: 'dheefs-architecture',
        body: [
          'The way I think about it is simple.',
          'Gary talks about resolvers as the routing table for context. When task X appears, load document Y. I think that idea is exactly right. But static resolvers are only the beginning.',
          'I want the routing layer itself to learn.',
          'If the agent keeps expanding auth-related traces during backend debugging, the system should learn that. If it never touches Tailwind guidance during backend work, the system should learn that too.',
          'If certain context packets keep helping, they should rise in priority. If certain packets keep wasting attention, they should decay.',
          'That is what self-evolving means to me. Not magical autonomy. Not vague AGI marketing. Not "the model woke up." I mean something much more practical and much more useful.',
          'The cognition layer watches what the agent actually needed, what it ignored, what it kept expanding, what led to success, and what kept wasting tokens and attention. Then it changes how context gets served the next time.',
        ],
      },
      {
        id: 'memory-layer-vs-cognition-layer',
        title: 'A memory layer stores. A cognition layer adapts.',
        body: [
          'That is the difference between a memory layer and a cognition layer.',
          'A memory layer stores. A cognition layer adapts.',
          'This is the part I care about most. I do not think the biggest gap in agents anymore is raw intelligence. Claude, GPT, Gemini, Codex, they are already strong. They can reason. They can code. They can synthesize. They can use tools.',
          'The bottleneck now is continuity.',
          'Can the system carry forward what worked? Can it stop repeating the same mistake twice? Can it turn usage into better behavior without waiting for a new foundation model release?',
          'That is where self-evolving memory becomes important.',
          'A lot of agent systems still behave like they have amnesia with good manners. They can search the past, but they do not really become more experienced.',
          'Dhee is our attempt to fix that. The more an agent uses it, the more the routing layer learns what matters for that workflow, that repo, that team, and that user.',
        ],
      },
      {
        id: 'portability-is-the-thesis',
        title: 'Portability is the thesis',
        visual: 'portable-cognition-sequence',
        body: [
          'I do not want that learning trapped inside one runtime.',
          'This is where I think our bet differs from systems like Hermes. I actually like what Hermes is doing. Hermes is building a self-improving agent. That is a serious and important direction. But it is still an agent-centric design. The memory, the loop, the improvement logic live inside that agent experience.',
          'Our bet is different.',
          'Hermes is an agent with memory. Dhee is a portable memory OS.',
          'That difference matters.',
          'I do not want cognition locked inside one agent runtime. I do not want your learned behavior to disappear because you moved from Claude Code to Codex. I do not want teams to rebuild continuity from scratch every time they change tools.',
          'I want memory, routing behavior, task state, artifacts, and learned patterns to move with you.',
          'Switch from Claude Code to Codex. Bring in another coding agent. Hand a task from one model to another. Resume work later. Let multiple agents touch the same repo from different strengths. The cognition layer should survive all of that.',
          'That is why I keep calling Dhee a memory OS. The real winner in this space is not the agent that tries to own everything. It is the layer underneath the agents that makes all of them better.',
        ],
      },
      {
        id: 'collaboration-without-an-orchestrator',
        title: 'Collaboration without an orchestrator',
        body: [
          'That leads to the third piece of the puzzle: collaboration without an orchestrator.',
          'I think the current agent world overuses the orchestrator pattern. Whenever people want multiple agents to work together, the first instinct is to create one more agent whose job is to manage all the others.',
          'Now you have a planner agent, a coding agent, a research agent, a reviewer agent, and then a manager agent to babysit the whole thing.',
          'I think that is the wrong abstraction.',
          'Coordination should not depend on one special agent being the boss. Coordination should emerge from shared memory, shared artifacts, and shared task state.',
          'If the cognition layer is portable, any agent can pick up the work. Any agent can inherit the relevant context. Any agent can continue from real task state instead of from a fragile manually written summary.',
          'That means you do not need an orchestrator agent to make the system coherent. You need a better substrate.',
        ],
      },
      {
        id: 'where-the-real-leverage-is',
        title: 'Where the real leverage is',
        body: [
          'That is a big part of what Dhee is trying to become.',
          'Not another full agent stack. Not another locked-in runtime. A cognition substrate that makes any coding agent more personalized, more experienced, and more collaborative.',
          'This is why I think the thin harness, fat skills conversation is directionally right but incomplete.',
          'Yes, keep the harness thin. Yes, keep the skills fat. Yes, write judgment into markdown. Yes, keep deterministic tooling where trust matters and latent reasoning where judgment matters.',
          'But once those skills accumulate over years, once the markdown brain gets bigger and richer and messier, you need one more layer.',
          'A layer that routes. A layer that compresses. A layer that forgets. A layer that promotes what works. A layer that evolves from use. A layer that stays portable across tools.',
          'Otherwise fat skills slowly become fat baggage. And baggage compounds. That is the trap I want to solve.',
          'When I say Dhee is a portable memory OS for AGI cognition, I do not mean we are building a god model. I mean the opposite. I do not believe AGI will arrive as one perfect model dropped from the sky. I think it will emerge from models combined with cognitive infrastructure around them.',
          'Memory. Reflection. Continuity. Collaboration. Experience.',
          'The model is the brain. But brains without memory, without continuity, without learned context, without portable experience, do not become good collaborators. They become smart strangers.',
          'Dhee is our first product because memory is the first layer that has to be right. Context routing is the first practical win. Self-evolution is how the system compounds. Portability is how cognition survives tool switches. Collaboration without an orchestrator is how agents stop acting like isolated interns and start acting like parts of one working mind.',
          'That is what we are building. Not thinner prompts. Not another agent wrapper. Not more context stuffed into the window. A portable cognition layer that makes fat skills usable, makes agents self-evolving, and makes intelligence cumulative across tools.',
          'That, to me, is where the real leverage is.',
        ],
      },
    ],
  },
  {
    slug: 'cognition-layer-turns-any-ai-agent-into-hyperagent',
    category: 'Agent Cognition',
    title: 'I Built a Cognition Layer That Turns Any AI Agent Into a HyperAgent. Here\'s How',
    excerpt:
      'Memory is not enough if every session still feels new. Dhee adds Buddhi: insights, intentions, performance trends, warnings, and four simple API calls for continuity.',
    date: 'March 27, 2026',
    readTime: '12 min read',
    author: 'Ashish Dwivedi',
    tags: ['Buddhi', 'HyperAgent', 'Dhee', 'agent cognition'],
    xUrl: 'https://x.com/ashish_dwi/status/2037460448405336147',
    heroLabel: 'BUDDHI',
    sections: [
      {
        id: 'the-agent-had-memory-but-no-experience',
        title: 'The agent had memory, but no experience',
        body: [
          'I have been building Dhee, an open-source memory layer for AI agents.',
          'The previous version, called Engram, solved the hard memory problems: persistence, forgetting, consolidation, cross-agent handoff. But after shipping it and watching agents use it in production, something kept bothering me.',
          'The agents could remember things. They could forget the right things. They could even hand off context when switching tools. And still, every session felt like a first date.',
          'The agent had memory. But it had no experience. It could tell you what happened. It could not tell you what it learned from what happened.',
        ],
      },
      {
        id: 'raw-facts-are-not-transferable-lessons',
        title: 'Raw facts are not transferable lessons',
        body: [
          'This happened to me three times in one week. I was using Claude Code to debug an auth issue. I spent 40 minutes going down the wrong path, checking middleware when the real problem was in token refresh logic. Eventually I figured it out. Session ended.',
          'Next day, similar auth issue. Different service. Same agent. Same memory layer underneath.',
          'The agent searched memory and retrieved: "debugged auth issue, fixed token refresh in auth.py." That is a fact. It is correct. It is also almost useless.',
          'What would have actually helped is this: "When debugging auth, check token refresh logic before middleware. We wasted 40 minutes on the wrong path last time."',
          'That is not just memory. That is an insight. A transferable lesson extracted from experience. My memory layer was giving the agent raw ingredients when it really needed the recipe.',
        ],
      },
      {
        id: 'what-meta-figured-out',
        title: 'What Meta figured out',
        body: [
          'Earlier this month, Meta published work on DGM-Hyperagents. What they studied was simple but important: what happens when an agent has persistent memory, performance tracking, and insight synthesis at the same time?',
          'The result was striking. Agents with all three did not just perform better. They showed self-accelerating improvement. Gains in one domain started transferring to other domains. The agent got better at getting better.',
          'Not because the underlying model suddenly became smarter. Because the infrastructure around the model was tracking what worked, what failed, and why, then feeding that back at the start of the next session.',
          'That is what they called a HyperAgent: an agent that does not just use tools, but learns from using tools.',
          'When I read that, the gap in Dhee became obvious to me. The memory was there. The learning was not.',
        ],
      },
      {
        id: 'four-api-calls',
        title: 'Four API calls. That is it.',
        body: [
          'I spent weeks figuring out how to add cognition without adding complexity. Agent developers already have enough to deal with. Nobody wants to wire up 24 MCP tools just to get memory working.',
          'So I made Dhee expose just four operations.',
          'remember(content): store a fact. No LLM call. One embedding. Done.',
          'recall(query): search memory. No LLM call. One embedding. Returns relevant results.',
          'context(task_description): the HyperAgent call. You call it once at the start of a session. Dhee returns the full working context: what happened last time, performance trends, synthesized insights, proactive warnings, pending intentions, and relevant skills.',
          'checkpoint(summary, outcome, what_worked, what_failed): the end-of-session call. Dhee stores the digest, enriches memory in batch, records the outcome, synthesizes insights, and saves intentions for next time.',
          'That is it. Four calls. Total cost per session is roughly $0.004. The hot path, remember and recall, is about $0.0002 each. No LLM. Just embeddings. The only LLM work happens at checkpoint, batched and deferred.',
        ],
      },
      {
        id: 'buddhi-teaches-agents-to-learn',
        title: 'Buddhi teaches agents to learn from experience',
        body: [
          'The core of this HyperAgent upgrade is a layer I call Buddhi.',
          'Buddhi sits between the agent and the memory store. It watches every memory stored, every search performed, every outcome recorded. But it does not just watch. It interprets.',
          'Say the agent calls checkpoint() with outcome: success and what worked: checked git blame before reading the full file.',
          'Buddhi does not just store that text. It turns it into an insight: type strategy, content "Check git blame before full file reads. Faster path to understanding", confidence 0.5, source task debugging.',
          'Now imagine the next session is a different problem. Different repo. Different issue. Maybe a performance regression. You call context("fixing a performance regression"), and Buddhi can still surface that strategy because the lesson transfers.',
          'That insight carries a confidence score. Every time the agent uses it and gets a good result, confidence goes up. Every time it fails, the score drops faster than it rises. Bad advice should decay faster than good advice compounds.',
          'Over time, useful insights rise. Bad ones fade. The system starts curating itself.',
        ],
      },
      {
        id: 'prospective-memory',
        title: 'Prospective memory: agents that anticipate',
        body: [
          'There is a part of human memory that almost nobody talks about in AI. You are leaving the house, pass by the kitchen, and suddenly remember: "I need to buy milk." Nobody asked you about milk. The context triggered the memory.',
          'That is called prospective memory: memory that fires forward, not backward. Dhee now does this too.',
          'Suppose you store something like: "remember to run the migration after deploying to staging." Buddhi recognizes the intention pattern automatically and extracts a trigger and an action.',
          'Later, the agent starts a new session and calls context("deploying auth service to staging"). Buddhi matches the trigger and surfaces: "Pending: run the migration after deploying to staging."',
          'The agent did not ask. Dhee volunteered. That is the difference between a memory system and a cognition system. Memory answers questions. Cognition anticipates them.',
        ],
      },
      {
        id: 'performance-tracking-that-produces-insights',
        title: 'Performance tracking that actually produces insights',
        body: [
          'Every time an agent completes a task and sends a checkpoint with an outcome score, Buddhi tracks it by task type. Not just the score. The trend.',
          'After a few sessions, useful patterns start to emerge. If debugging scores drop two sessions in a row, Buddhi raises a warning: "Regression detected in debugging tasks."',
          'If a score jumps far above the previous best, Buddhi flags a breakthrough and asks what changed. The "what worked" from that checkpoint becomes a high-confidence insight.',
          'If a task type stays below 0.3 across five attempts, Buddhi warns: "Persistent low performance in X. Consider a different approach."',
          'This part is intentionally cheap. Mostly pattern matching and statistics. No LLM-heavy metacognition loop. No constant reasoning tax. The cognition layer stays practical because it lets outcome patterns speak for themselves.',
        ],
      },
      {
        id: 'why-this-matters-for-india',
        title: 'Why this matters for India',
        body: [
          'India is moving toward AI in education at scale. But the biggest problem is not model quality. It is continuity.',
          'Every AI teaching tool today treats each student session as isolated. A student asks about quadratic equations on Monday and gets a great explanation. They come back on Wednesday for something related, and the system has no idea what happened on Monday.',
          'It does not know the student struggled with factoring but understood graphing quickly. It does not know visual explanations worked better than symbolic ones. It does not know what actually clicked.',
          'The model may be smart. But it has no continuity.',
          'A teaching agent that remembers the student, adapts to them, tracks what worked, and improves every session becomes dramatically more useful, not because the model changed, but because the system learned.',
          'That is why we are building SensAI on top of Dhee. Not just a chatbot wrapped in curriculum. A teaching agent with cognition.',
          'India has around 250 million school students. The constraint is not raw AI capability. The real bottleneck is whether the AI serves each student like a stranger every time, or like a teacher who has actually taught them before.',
        ],
      },
      {
        id: 'the-architecture-in-one-picture',
        title: 'The architecture in one picture',
        body: [
          'At the top is the agent: Claude, GPT, Gemini, Ollama, or your own stack.',
          'remember("user prefers visual explanations") runs with no LLM and one embedding. recall("how does this student learn best?") runs with no LLM and one embedding. context("teaching calculus to student-42") returns the full HyperContext. checkpoint(outcome, what_worked, what_failed) runs batched enrichment.',
          'Underneath that is Buddhi: insights, intentions, performance trends, warnings. No LLM on the hot path. Mostly patterning and synthesis.',
          'Below Buddhi is Engram, the memory store: echo, decay, scenes, profiles, consolidation. Storage and retrieval, with batch enrichment at checkpoint.',
          'Two layers. Buddhi observes and synthesizes. Engram stores and retrieves. Neither burns LLM calls on the hot path. The only real LLM spend is at checkpoint, deferred, batched, cheap.',
        ],
      },
      {
        id: 'what-makes-a-hyperagent',
        title: 'What makes a HyperAgent',
        body: [
          'A regular agent has intelligence.',
          'A HyperAgent has intelligence plus persistent memory, performance tracking, insight synthesis, prospective memory, and self-improvement.',
          'That is what Dhee adds. Not a new orchestration framework. Not vendor lock-in. Not model dependency.',
          'Just four API calls that give any agent the missing layer: continuity, learning, and experience.',
          'It works with Claude, GPT, Gemini, Ollama, or your own stack. MCP, Python SDK, CLI, Docker, whatever integration path you want.',
        ],
      },
      {
        id: 'where-this-is-going',
        title: 'Where this is going',
        body: [
          'The gap between AI agents and human cognition is still huge. But I do not think the biggest gap is intelligence anymore.',
          'The models are already strong. GPT, Claude, Gemini, they can reason, code, plan, and use tools.',
          'The real bottleneck is continuity. The ability to carry forward what worked. To avoid repeating the same mistake twice. To get better over months because you have experience, not because someone retrained your weights.',
          'That is what Dhee adds. Not more intelligence. More experience.',
          'And experience, I think, is what separates an agent from a HyperAgent.',
          'Dhee is open source and available on PyPI: pip install dhee. GitHub: github.com/Sankhya-AI/Dhee. Built by Sankhya AI Labs. From India.',
        ],
      },
    ],
  },
  {
    slug: 'every-ai-agent-has-amnesia-i-fixed-it',
    category: 'Memory Systems',
    title: 'Every AI Agent You Use Has Amnesia. I Have Fixed It.',
    excerpt:
      'The origin story of Engram: shared handoffs, decay, staged memory writes, episodic scenes, EchoMem, and local-first memory for agents that stop starting from zero.',
    date: 'February 10, 2026',
    readTime: '13 min read',
    author: 'Ashish Dwivedi',
    tags: ['Engram', 'agent memory', 'handoffs', 'episodic memory'],
    heroLabel: 'ENGRAM',
    links: [
      { label: 'Engram GitHub', url: 'https://github.com/Ashish-dwi99/Engram' },
      { label: 'Engram website', url: 'https://engram.sensai.co.in/' },
    ],
    sections: [
      {
        id: 'the-cold-start-that-broke-the-workflow',
        title: 'The cold start that broke the workflow',
        body: [
          'Forty minutes deep in Claude Code exploiting Opus 4.6. I had mapped out the migration strategy, touched six files, decided to deprecate the old endpoint. Real momentum.',
          'Then the usage cap hit. Again.',
          'Thanks to Codex\'s generous rate limits, I had gotten into the habit of switching over and continuing there. Except Codex had no idea what I was doing.',
          'Every time I switched, I was staring at an agent with the full power of a frontier model and zero context about the task I was literally just working on five minutes ago.',
          'So I would start over. Paste the file paths and plans. Re-explain the strategy. Re-describe the decisions. Half the time I would forget something, and Codex would make a choice that contradicted what I had already decided in Claude Code.',
          'Every single switch was a cold start. Cap out on Claude Code, move to Codex, lose everything in between. Sometimes Cursor joined the mix too. Three agents, one project, zero shared understanding.',
          'That was the moment I stopped being annoyed and started being obsessed.',
        ],
      },
      {
        id: 'standard-memory-was-not-enough',
        title: 'Standard memory was not enough',
        body: [
          'I started digging. Surely someone had solved this. People had tried. The standard approach was simple: store everything the user says, embed it into vectors, retrieve with similarity search.',
          'I tried a few. They worked, sort of.',
          'The first thing: nobody forgets. It worked great at first. My AI remembered my preferences, my stack, my decisions. Then it started getting weird.',
          'I would ask about my current auth approach and it would pull up a decision I made in week one, before I had changed my mind. That old decision was sitting right next to the current one. Same priority. Same weight.',
          'My context window was filling up with ghosts. Stale facts haunting my retrieval results.',
          'That is not how my brain works. I do not remember what I had for lunch three Tuesdays ago. That memory decayed because it was not important enough to keep.',
        ],
      },
      {
        id: 'forgetting-is-a-feature',
        title: 'Forgetting is a feature',
        body: [
          'I found FadeMem: bio-inspired forgetting for AI agents. The core idea is that the Ebbinghaus forgetting curve is not a flaw in human cognition. It is a feature.',
          'Important stuff gets reinforced through repeated access. Unimportant stuff fades. The result is a memory system that is always current, always relevant, and about 45% smaller than one that hoards everything.',
          'I read that paper, worked through the math, and started building.',
          'New memories start weak. When your AI stores something, it goes into short-term storage. Strength of 1.0. A proposal, not a permanent record.',
          'Repeated access makes them stronger. Ask about your TypeScript preference three times across different sessions? That memory gets promoted to long-term storage. It earned its place.',
          'Unused memories fade. That random note from two months ago that nobody has referenced since decays naturally. No manual cleanup. No memory management. It just happens.',
          'The result surprised me: 45% less storage, and retrieval got better because search was no longer wading through ghosts.',
        ],
      },
      {
        id: 'reference-aware-decay',
        title: 'Reference-aware decay',
        body: [
          'There is a catch. What if Agent A stopped using a memory but Agent B still relies on it? Should it decay?',
          'No.',
          'So I built reference-aware decay. The system tracks who is using what. A memory stays alive as long as any agent references it, even if the original writer forgot about it.',
        ],
      },
      {
        id: 'writes-need-trust',
        title: 'Writes need trust',
        body: [
          'The second problem: agents write whatever they want. I was testing a setup where my coding agent could save notes to memory. Useful in theory. In practice, it was writing garbage.',
          'Half-formed thoughts. Duplicate facts phrased slightly differently. One time it contradicted something I had explicitly told it a week earlier. The writes just went straight in. No review. No staging.',
          'Would you give a new intern root access to your production database on day one? Then why does every memory system give every AI agent full write permissions from the start?',
          'In Engram, every write is a proposal. It lands in staging, not in canonical memory.',
          'The system runs checks. Does this contradict something already stored? Is it a duplicate? Is it from a trusted agent or a new one?',
          'Contradictions go to a conflict stash. You decide which version wins. New agents start with low trust. Everything they write waits for approval. As you approve good writes, their trust score climbs. Eventually they earn auto-merge.',
          'Your memory. Your rules. Always.',
        ],
      },
      {
        id: 'episodic-memory-scenes',
        title: 'Episodic memory as scenes',
        body: [
          'I found CAST, Contextual Associative Scene Theory. It explains that humans organize memory into episodes defined by shifts in time, place, and topic. When you recall something, you pull an entire scene, not a text search result.',
          'Nobody was building AI memory this way either. So I built it.',
          'Engram watches the conversation flow and detects scene boundaries. Long pause? New scene. Topic shifted from frontend to deployment? New scene. Different repo? New scene.',
          'Each scene captures when it happened, where it happened, who was involved, what was discussed, and what decisions came out of it. Plus links to the semantic facts extracted from it.',
          'So when you ask "what did we decide in that auth session?", Engram pulls the scene: timeline, participants, synopsis, decisions. The whole episode.',
          'It is the difference between searching your email for "auth" and actually remembering the meeting where you made the call.',
        ],
      },
      {
        id: 'handoff-bus',
        title: 'The handoff bus',
        body: [
          'Back to the problem that started all of this: cold starts.',
          'Engram has a handoff bus baked in. When an agent pauses work, whether you capped out, closed the terminal, or switched tools, it saves a session digest.',
          'What was the task? What decisions were made? What files were touched? What is left to do? What blockers remain?',
          'The next agent picks up, calls get_last_session, gets the full context, and continues from where the last agent stopped.',
          'No re-explanation. No copying context between tools. No "let me re-read these six files." The new agent already knows what is going on. It knows what you tried, what failed, and what the plan was.',
          'Your agents work like a relay team. The baton actually gets passed.',
        ],
      },
      {
        id: 'echomem-and-dual-path-retrieval',
        title: 'EchoMem and dual-path retrieval',
        body: [
          'Then I thought: why does each memory get one shot at being found?',
          'Standard approach: embed the text, store the vector, pray the query matches.',
          'I built EchoMem. Every memory gets encoded five ways: raw text, paraphrase, keywords, implications, and a question form.',
          'Five retrieval paths instead of one. Five chances to match.',
          'The question encoding turned out to be weirdly powerful. When an agent asks "what stack should I recommend?", it can directly match memories stored as "What language does the user prefer?"',
          'Retrieval itself is dual-path. Semantic search and episodic search run in parallel. If a fact shows up in both, its confidence gets boosted. Intersection promotion.',
          'This kills the annoying failure mode in AI memory: semantically similar but contextually wrong results.',
        ],
      },
      {
        id: 'all-but-mask',
        title: 'All but mask',
        body: [
          'There is one more thing that matters.',
          'When an agent queries outside its scope, it does not get nothing. It gets structure without details.',
          'Your scheduling agent knows you are busy. It does not need to know why. Your coding agent knows a decision was made. It does not need to see the financial discussion behind it.',
          'I call it "all but mask." Need-to-know, enforced at the memory layer.',
        ],
      },
      {
        id: 'local-first-memory-kernel',
        title: 'A local-first memory kernel',
        body: [
          'All of this runs locally on 127.0.0.1:8100. Your data never leaves your machine unless you want it to.',
          'At the time, setup was three commands: pip install engram-memory, export GEMINI_API_KEY, engram install.',
          'engram install auto-configured Claude Code, Cursor, and Codex. One command. All your agents. Same memory kernel underneath.',
          'Want fully offline? Use Ollama. No API keys. No cloud. Nothing leaves your laptop. Open source. MIT licensed.',
        ],
      },
      {
        id: 'why-it-matters',
        title: 'Why it matters',
        body: [
          'I built this because I needed it. The difference is hard to overstate.',
          'Last week I hit Claude Code\'s cap mid-refactor. Opened Codex. It loaded the session digest, saw the six files I had touched, the migration strategy, and the two remaining TODOs. First message: "Looks like you were deprecating the v1 endpoint. I will pick up with the middleware changes."',
          'No preamble. No re-explanation. Just continuation.',
          'Monday I make a decision in Claude Code. Tuesday, Cursor knows about it. Not because I told it. Because the memory is shared.',
          'The compound effect of never re-explaining yourself, never losing state when you switch tools, changes how you work with AI.',
          'Models will keep getting better. Faster, cheaper, smarter. But without memory, every session still starts from zero. The smartest model in the world is useless if it cannot remember what you told it yesterday.',
          'Memory is the missing infrastructure layer. Not a feature. Infrastructure.',
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string | undefined) {
  return blogPosts.find((post) => post.slug === slug);
}
