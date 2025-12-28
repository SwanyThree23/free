# SwanyThree Ultimate - Full-Stack AI MVP Guide

## Table of Contents
1. [Overview](#overview)
2. [AI MVP Architecture](#ai-mvp-architecture)
3. [Technology Stack](#technology-stack)
4. [Core Components](#core-components)
5. [Human-in-the-Loop (HITL) System](#human-in-the-loop-hitl-system)
6. [Development Workflow](#development-workflow)
7. [Data Strategy](#data-strategy)
8. [Frontend Application](#frontend-application)
9. [Backend API](#backend-api)
10. [AI Agent System](#ai-agent-system)
11. [Vector Database Integration](#vector-database-integration)
12. [Deployment](#deployment)
13. [Performance Metrics](#performance-metrics)
14. [Cost Analysis](#cost-analysis)

---

## Overview

SwanyThree Ultimate is a production-ready, full-stack AI MVP that demonstrates enterprise-grade automation and orchestration capabilities. This guide combines industry best practices for AI MVP development with our platform's unique architecture.

### What Makes This an AI MVP?

Unlike traditional MVPs, this AI-powered platform:

- **Validates AI Performance**: Tests model accuracy, precision, and reliability in production
- **Data-Driven Iteration**: Improves through continuous model retraining and user feedback
- **Scalable Architecture**: Built to handle growing datasets and user loads from day one
- **HITL Integration**: Combines AI automation with human oversight for critical decisions
- **Production-Ready**: Includes monitoring, security, and compliance from the start

### Key Differentiators

| Aspect | Traditional MVP | SwanyThree AI MVP |
|--------|----------------|-------------------|
| **Core Focus** | Feature validation | AI model performance + feature validation |
| **Data Role** | Secondary | Foundational - drives all AI outcomes |
| **Iteration** | User feedback | User feedback + model retraining + data quality |
| **Complexity** | Low-medium | High - requires ML infrastructure |
| **Validation** | Usability metrics | Accuracy, precision, recall + usability |
| **Scalability** | Add features/users | Handle larger datasets + model versioning |

---

## AI MVP Architecture

### Five-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND LAYER (Next.js)                    │
│          React Components, Real-time UI, Dashboards          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  BACKEND LAYER (FastAPI)                     │
│         API Routes, Business Logic, Authentication           │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  AI/ML LAYER (Claude, GPT-4)                 │
│      Agent Orchestration, NLP, Content Generation, RAG       │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              DATA & STORAGE LAYER                            │
│  PostgreSQL (structured), Pinecone (vectors), Redis (cache)  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                        │
│        Docker, NGINX, Prometheus, Grafana, AWS/GCP           │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Request
    │
    ▼
Frontend (Next.js) ──HTTP/WebSocket──► Backend (FastAPI)
                                            │
                                            ├──► Auth Service
                                            │
                                            ├──► Rate Limiter
                                            │
                                            ▼
                                    AI Agent Orchestrator
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
                    ▼                       ▼                       ▼
            Frontend Agent          Content Agent           SEO Agent
                    │                       │                       │
                    └───────────────────────┼───────────────────────┘
                                            │
                                            ▼
                                    HITL Review Queue
                                            │
                                            ├──► High Confidence (>85%) → Auto-approve
                                            └──► Low Confidence (<85%) → Human Review
                                            │
                                            ▼
                                    Result Aggregation
                                            │
                                            ▼
                                    Database Storage
                                            │
                                            ▼
                                    WebSocket Push to Frontend
```

---

## Technology Stack

### Frontend Stack

**Framework**: Next.js 14 (React 18)
- **Why**: Server-side rendering, API routes, and optimized performance
- **Alternatives Considered**: Vue.js, Svelte (chose Next.js for SSR and ecosystem)

**State Management**: Zustand + React Query
- **Why**: Lightweight, performant, server-state handling
- **Alternatives**: Redux (too complex for MVP), Context API (limited)

**UI Library**: Tailwind CSS + Headless UI
- **Why**: Rapid prototyping, consistent design system, accessibility
- **Alternatives**: Material-UI (heavier), Chakra UI (less flexible)

**Real-time Communication**: Socket.IO Client
- **Why**: Bi-directional communication for live agent updates
- **Alternatives**: Server-Sent Events (unidirectional)

### Backend Stack

**Framework**: FastAPI (Python 3.11)
- **Why**: High performance, automatic API docs, async support, type safety
- **Alternatives**: Node.js/Express (chose Python for ML ecosystem)

**Database**: PostgreSQL 15
- **Why**: ACID compliance, JSON support, mature ecosystem
- **Alternatives**: MongoDB (less structured), MySQL (limited JSON)

**Cache Layer**: Redis 7
- **Why**: In-memory performance, pub/sub for real-time, session storage
- **Alternatives**: Memcached (limited features)

**Vector Database**: Pinecone
- **Why**: Managed service, fast similarity search, easy integration
- **Alternatives**: Weaviate (self-hosted complexity), FAISS (local only)

### AI/ML Stack

**Primary LLM**: Anthropic Claude (Claude 3 Opus)
- **Why**: Superior reasoning, large context (200K tokens), ethical AI
- **Cost**: $15/$75 per 1M tokens (input/output)
- **Alternatives**: GPT-4 (fallback), Llama 2 (cost-sensitive)

**Framework**: LangChain
- **Why**: Agent orchestration, chain composition, memory management
- **Alternatives**: Custom implementation (more control, more time)

**Embeddings**: OpenAI text-embedding-3-large
- **Why**: High-quality embeddings, 3072 dimensions
- **Cost**: $0.13 per 1M tokens
- **Alternatives**: Sentence Transformers (free, lower quality)

### Infrastructure Stack

**Containerization**: Docker + Docker Compose
- **Why**: Consistent environments, easy local development
- **Alternatives**: Kubernetes (overkill for MVP)

**Load Balancer**: NGINX
- **Why**: SSL termination, rate limiting, mature
- **Alternatives**: Traefik (more complex), HAProxy

**Monitoring**: Prometheus + Grafana
- **Why**: Industry standard, powerful querying, beautiful dashboards
- **Alternatives**: Datadog (expensive), New Relic (vendor lock-in)

**CI/CD**: GitHub Actions
- **Why**: Integrated with GitHub, free for public repos
- **Alternatives**: GitLab CI, Jenkins

---

## Core Components

### 1. Frontend Application (Next.js)

#### Key Pages

```
frontend/src/pages/
├── index.tsx               # Landing page
├── login.tsx               # Authentication
├── register.tsx            # User registration
├── dashboard.tsx           # Main dashboard
├── agents/
│   ├── index.tsx           # Agent list
│   ├── [id].tsx            # Agent detail
│   └── new.tsx             # Create agent task
├── content/
│   ├── index.tsx           # Content library
│   ├── upload.tsx          # Content waterfall
│   └── [id].tsx            # Content detail
├── workflows/
│   ├── index.tsx           # Workflow list
│   └── [id].tsx            # Workflow editor
├── analytics.tsx           # Analytics dashboard
└── settings.tsx            # User settings
```

#### Core Components

**Agent Swarm Panel** (`components/dashboard/AgentSwarmPanel.tsx`):
```typescript
// Real-time agent task monitoring with WebSocket updates
interface AgentTask {
  id: string;
  status: 'queued' | 'processing' | 'hitl_review' | 'completed' | 'failed';
  agent: 'frontend' | 'content' | 'seo' | 'mcp-builder' | 'code-review';
  confidence: number;
  progress: number;
  needsReview: boolean; // HITL flag
}
```

**HITL Review Interface** (`components/hitl/ReviewQueue.tsx`):
```typescript
// Human-in-the-Loop review interface
interface HITLTask {
  id: string;
  agentOutput: any;
  confidence: number;
  flagReason: string;
  reviewerNotes?: string;
  decision: 'approve' | 'reject' | 'edit';
}
```

**Content Waterfall Uploader** (`components/content/WaterfallUploader.tsx`):
```typescript
// Multi-file upload with progress tracking
interface ContentUpload {
  file: File;
  targetPlatforms: string[];
  industry?: string;
  processingStage: 'uploading' | 'analyzing' | 'generating' | 'complete';
  generatedAssets: Asset[];
}
```

### 2. Backend API (FastAPI)

#### API Structure

```
backend/api/
├── routes/
│   ├── auth.py             # JWT authentication, registration
│   ├── users.py            # User CRUD, profile management
│   ├── agents.py           # Agent orchestration, task creation
│   ├── content.py          # Content waterfall, asset generation
│   ├── workflows.py        # Workflow management
│   ├── teams.py            # Team collaboration
│   ├── hitl.py             # Human-in-the-Loop review queue
│   └── analytics.py        # Metrics, dashboards
├── middleware/
│   ├── auth.py             # JWT validation
│   ├── rate_limit.py       # Redis-based rate limiting
│   └── logging.py          # Request/response logging
├── models/
│   ├── user.py             # SQLAlchemy models
│   ├── agent_task.py
│   ├── content.py
│   └── workflow.py
└── schemas/
    ├── user.py             # Pydantic schemas
    ├── agent.py
    └── content.py
```

#### Example: Agent Orchestration Endpoint

```python
# backend/api/routes/agents.py

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from services.agent_orchestrator import AgentOrchestrator
from services.hitl import HITLService
from models.agent_task import AgentTask
from schemas.agent import AgentTaskCreate, AgentTaskResponse
from dependencies.auth import get_current_user
from dependencies.database import get_db

router = APIRouter()

@router.post("/tasks", response_model=AgentTaskResponse)
async def create_agent_task(
    task: AgentTaskCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new agent swarm task.

    Workflow:
    1. Validate user permissions
    2. Create task record
    3. Queue for agent processing (background)
    4. Return task ID immediately
    """
    # Check user quota
    if not await check_user_quota(current_user, db):
        raise HTTPException(status_code=403, detail="Quota exceeded")

    # Create task record
    agent_task = AgentTask(
        user_id=current_user.id,
        request=task.request,
        industry=task.industry,
        priority=task.priority,
        status="queued",
    )
    db.add(agent_task)
    await db.commit()

    # Queue for background processing
    background_tasks.add_task(
        process_agent_task,
        task_id=agent_task.id,
    )

    return AgentTaskResponse(
        id=agent_task.id,
        status="queued",
        estimatedCompletion=calculate_eta(task.priority),
    )

async def process_agent_task(task_id: str):
    """Background task to process agent swarm request"""
    orchestrator = AgentOrchestrator()
    hitl_service = HITLService()

    # Execute agents
    results = await orchestrator.execute(task_id)

    # HITL check: Route low-confidence results to human review
    for agent_result in results:
        if agent_result.confidence < 0.85:  # 85% threshold
            await hitl_service.queue_for_review(
                task_id=task_id,
                agent=agent_result.agent,
                output=agent_result.output,
                confidence=agent_result.confidence,
                reason=f"Low confidence: {agent_result.confidence:.2f}",
            )
        else:
            # Auto-approve high-confidence results
            await hitl_service.auto_approve(agent_result)

    # Aggregate and save
    await orchestrator.aggregate_results(task_id, results)
```

### 3. AI Agent System

#### Agent Architecture

Each agent is a specialized AI worker focused on one domain:

**Frontend Agent** (`services/agents/frontend_agent.py`):
```python
class FrontendAgent(BaseAgent):
    """
    Specializes in UI/UX design and frontend code generation.

    Capabilities:
    - React/Vue/Angular component generation
    - Tailwind CSS styling
    - Accessibility (WCAG 2.1)
    - Responsive design
    """

    async def execute(self, task: AgentTask) -> AgentResult:
        prompt = f"""You are a Frontend Development Expert.

Task: {task.request}
Industry: {task.industry}

Provide:
1. Component architecture
2. React code (TypeScript)
3. Tailwind CSS styling
4. Accessibility features (ARIA labels, keyboard nav)
5. Responsive breakpoints

Output Format: JSON
"""

        response = await self.llm.ainvoke(prompt)
        confidence = self.calculate_confidence(response)

        return AgentResult(
            agent="frontend",
            output=response.content,
            confidence=confidence,
            tokens_used=response.usage.total_tokens,
        )

    def calculate_confidence(self, response) -> float:
        """Calculate confidence based on response quality indicators"""
        # Check for code completeness
        has_typescript = "interface" in response.content or "type" in response.content
        has_styling = "className" in response.content
        has_a11y = "aria-" in response.content

        # Weighted scoring
        score = 0.0
        if has_typescript: score += 0.4
        if has_styling: score += 0.3
        if has_a11y: score += 0.3

        return min(score, 1.0)
```

**Content Agent** (`services/agents/content_agent.py`):
```python
class ContentAgent(BaseAgent):
    """
    Specializes in content creation and copywriting.

    Capabilities:
    - Blog posts, social media captions
    - Email campaigns
    - Product descriptions
    - Video scripts
    """

    async def execute(self, task: AgentTask) -> AgentResult:
        # Similar structure to FrontendAgent
        # Uses Claude for creative writing tasks
        pass
```

#### Agent Orchestrator

**Orchestration Logic** (`services/agent_orchestrator.py`):
```python
class AgentOrchestrator:
    """
    Coordinates multiple agents to handle complex tasks.

    Workflow:
    1. Parse user request
    2. Select relevant agents
    3. Execute agents in parallel/sequence
    4. Aggregate results
    5. Apply HITL checks
    """

    def __init__(self):
        self.agents = {
            "frontend": FrontendAgent(),
            "content": ContentAgent(),
            "seo": SEOAgent(),
            "mcp-builder": MCPBuilderAgent(),
            "code-review": CodeReviewAgent(),
        }

    async def execute(self, task_id: str) -> List[AgentResult]:
        task = await self.get_task(task_id)

        # Determine which agents to use based on request
        selected_agents = self.select_agents(task.request)

        # Execute agents concurrently
        results = await asyncio.gather(*[
            agent.execute(task)
            for agent_name, agent in self.agents.items()
            if agent_name in selected_agents
        ])

        return results

    def select_agents(self, request: str) -> List[str]:
        """AI-powered agent selection based on request content"""
        keywords = {
            "frontend": ["design", "ui", "ux", "component", "react"],
            "content": ["write", "copy", "blog", "social", "email"],
            "seo": ["seo", "keywords", "meta", "search", "optimize"],
            "mcp-builder": ["mcp", "data", "integration", "api"],
            "code-review": ["review", "security", "audit", "quality"],
        }

        request_lower = request.lower()
        selected = []

        for agent, kws in keywords.items():
            if any(kw in request_lower for kw in kws):
                selected.append(agent)

        # Default to content if no match
        return selected or ["content"]
```

---

## Human-in-the-Loop (HITL) System

### HITL Architecture

**Purpose**: Ensure AI quality by routing uncertain outputs to human reviewers.

**Key Principles**:
1. **Confidence Threshold**: Auto-approve >85%, review <85%
2. **Active Learning**: Human corrections train future models
3. **Fail-Safe**: Critical tasks always require human approval
4. **Feedback Loop**: Reviews improve agent confidence over time

### Implementation

**HITL Service** (`services/hitl.py`):
```python
class HITLService:
    """
    Human-in-the-Loop review system.

    Workflow:
    1. Receive agent output with confidence score
    2. Apply confidence threshold (85%)
    3. Route to review queue if low confidence
    4. Store human decisions as training data
    5. Improve agent models over time
    """

    def __init__(self):
        self.confidence_threshold = 0.85
        self.review_queue = []

    async def queue_for_review(
        self,
        task_id: str,
        agent: str,
        output: dict,
        confidence: float,
        reason: str,
    ):
        """Add task to human review queue"""
        review_item = HITLReview(
            task_id=task_id,
            agent=agent,
            output=output,
            confidence=confidence,
            flag_reason=reason,
            status="pending",
            created_at=datetime.utcnow(),
        )

        # Save to database
        async with get_db() as db:
            db.add(review_item)
            await db.commit()

        # Notify reviewers via WebSocket
        await self.notify_reviewers(review_item)

    async def process_review(
        self,
        review_id: str,
        decision: str,  # "approve", "reject", "edit"
        notes: str,
        edited_output: Optional[dict] = None,
    ):
        """Process human review decision"""
        async with get_db() as db:
            review = await db.get(HITLReview, review_id)

            review.decision = decision
            review.notes = notes
            review.reviewed_at = datetime.utcnow()

            if decision == "approve":
                # Use original AI output
                final_output = review.output
            elif decision == "edit":
                # Use human-edited version
                final_output = edited_output
            else:  # reject
                # Flag for reprocessing
                return await self.reprocess_task(review.task_id)

            # Store as training data
            await self.store_training_data(
                agent=review.agent,
                input=review.task.request,
                ai_output=review.output,
                human_output=final_output,
                confidence=review.confidence,
            )

            await db.commit()

    async def store_training_data(self, **kwargs):
        """Store human corrections for future model improvement"""
        training_example = TrainingData(**kwargs)
        async with get_db() as db:
            db.add(training_example)
            await db.commit()

        # Trigger model retraining if threshold met (e.g., 1000 examples)
        count = await self.count_training_examples(kwargs["agent"])
        if count >= 1000:
            await self.trigger_retraining(kwargs["agent"])
```

### HITL UI Components

**Review Queue Dashboard** (`components/hitl/ReviewQueue.tsx`):
```typescript
export default function ReviewQueue() {
  const { data: reviews, refetch } = useQuery({
    queryKey: ['hitl-reviews'],
    queryFn: fetchPendingReviews,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const handleReview = async (
    reviewId: string,
    decision: 'approve' | 'reject' | 'edit',
    editedOutput?: any
  ) => {
    await submitReview(reviewId, decision, editedOutput);
    refetch();
    toast.success('Review submitted successfully');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Human Review Queue</h2>

      {reviews?.map((review) => (
        <HITLReviewCard
          key={review.id}
          review={review}
          onReview={handleReview}
        />
      ))}
    </div>
  );
}
```

**Review Card** (`components/hitl/HITLReviewCard.tsx`):
```typescript
interface HITLReviewCardProps {
  review: HITLReview;
  onReview: (id: string, decision: string, output?: any) => void;
}

export default function HITLReviewCard({ review, onReview }: HITLReviewCardProps) {
  const [editing, setEditing] = useState(false);
  const [editedOutput, setEditedOutput] = useState(review.output);

  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{review.agent} Agent</h3>
          <p className="text-sm text-gray-500">Task ID: {review.task_id}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Confidence</div>
          <div className={`text-2xl font-bold ${
            review.confidence > 0.7 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {(review.confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Flag Reason */}
      <div className="mb-4 p-3 bg-yellow-50 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Flagged:</strong> {review.flag_reason}
        </p>
      </div>

      {/* AI Output */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">AI Output</h4>
        {editing ? (
          <textarea
            className="w-full h-48 p-3 border rounded-md font-mono text-sm"
            value={JSON.stringify(editedOutput, null, 2)}
            onChange={(e) => setEditedOutput(JSON.parse(e.target.value))}
          />
        ) : (
          <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto text-sm">
            {JSON.stringify(review.output, null, 2)}
          </pre>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onReview(review.id, 'approve')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Approve
        </button>
        <button
          onClick={() => onReview(review.id, 'reject')}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reject
        </button>
        <button
          onClick={() => {
            if (editing) {
              onReview(review.id, 'edit', editedOutput);
            }
            setEditing(!editing);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {editing ? 'Submit Edit' : 'Edit Output'}
        </button>
      </div>
    </div>
  );
}
```

### HITL Metrics

**Key Performance Indicators**:
```typescript
interface HITLMetrics {
  // Volume
  totalReviews: number;
  pendingReviews: number;
  avgReviewTime: number; // seconds

  // Quality
  approvalRate: number; // % of AI outputs approved
  rejectionRate: number; // % rejected (need reprocessing)
  editRate: number; // % requiring human edits

  // Learning
  confidenceImprovement: number; // % increase in avg confidence
  trainingExamplesGenerated: number;

  // By Agent
  agentMetrics: {
    [agent: string]: {
      avgConfidence: number;
      approvalRate: number;
      reviewVolume: number;
    };
  };
}
```

---

## Data Strategy

### Minimum Viable Data (MVD)

**Philosophy**: Quality over quantity for MVP validation.

**Approach**:
- Start with 1,000-5,000 high-quality labeled examples per use case
- Focus on representative samples covering edge cases
- Use synthetic data augmentation to expand dataset
- Leverage pre-trained models to reduce data requirements

### Data Pipeline

```
Data Collection
    │
    ├──► Open-source datasets (free, public)
    ├──► User-generated data (opt-in, GDPR-compliant)
    ├──► Synthetic data (GPT-4 generated examples)
    └──► HITL feedback (gold standard labels)
    │
    ▼
Data Processing
    │
    ├──► Cleaning (duplicates, noise, outliers)
    ├──► Normalization (consistent formats)
    ├──► Augmentation (paraphrasing, back-translation)
    └──► Validation (schema checks, quality scores)
    │
    ▼
Data Storage
    │
    ├──► PostgreSQL (structured data, metadata)
    ├──► S3/Cloud Storage (raw files, media)
    ├──► Pinecone (embeddings for RAG)
    └──► Redis (cached frequent queries)
    │
    ▼
Model Training/Fine-tuning
    │
    ├──► Use training data for model improvement
    ├──► Continuous retraining (weekly/monthly)
    └──► A/B testing new model versions
```

### Vector Database (Pinecone)

**Purpose**: Enable Retrieval-Augmented Generation (RAG) for context-aware AI responses.

**Setup** (`services/vector_store.py`):
```python
from pinecone import Pinecone, ServerlessSpec
from openai import AsyncOpenAI

class VectorStore:
    """
    Pinecone vector database for semantic search and RAG.

    Use Cases:
    - Document retrieval for agent context
    - Semantic search in knowledge base
    - Similar content recommendations
    """

    def __init__(self):
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index_name = "swanythree-knowledge"
        self.openai = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        # Create index if not exists
        if self.index_name not in self.pc.list_indexes().names():
            self.pc.create_index(
                name=self.index_name,
                dimension=3072,  # text-embedding-3-large
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )

        self.index = self.pc.Index(self.index_name)

    async def upsert_documents(self, documents: List[Document]):
        """Store documents with embeddings"""
        vectors = []

        for doc in documents:
            # Generate embedding
            embedding_response = await self.openai.embeddings.create(
                model="text-embedding-3-large",
                input=doc.content,
            )
            embedding = embedding_response.data[0].embedding

            vectors.append({
                "id": doc.id,
                "values": embedding,
                "metadata": {
                    "content": doc.content,
                    "title": doc.title,
                    "source": doc.source,
                    "created_at": doc.created_at.isoformat(),
                },
            })

        # Batch upsert
        self.index.upsert(vectors=vectors, batch_size=100)

    async def search(self, query: str, top_k: int = 5) -> List[Document]:
        """Semantic search for relevant documents"""
        # Generate query embedding
        embedding_response = await self.openai.embeddings.create(
            model="text-embedding-3-large",
            input=query,
        )
        query_embedding = embedding_response.data[0].embedding

        # Search
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
        )

        # Convert to Document objects
        documents = [
            Document(
                id=match.id,
                content=match.metadata["content"],
                title=match.metadata["title"],
                source=match.metadata["source"],
                similarity=match.score,
            )
            for match in results.matches
        ]

        return documents
```

**RAG Integration** (`services/agents/base_agent.py`):
```python
class BaseAgent:
    """Base class for all AI agents with RAG support"""

    def __init__(self):
        self.llm = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.vector_store = VectorStore()

    async def execute_with_rag(self, task: AgentTask) -> AgentResult:
        """Execute task with RAG-enhanced context"""
        # 1. Retrieve relevant documents
        relevant_docs = await self.vector_store.search(
            query=task.request,
            top_k=5,
        )

        # 2. Build context-enhanced prompt
        context = "\n\n".join([
            f"Document {i+1} (similarity: {doc.similarity:.2f}):\n{doc.content}"
            for i, doc in enumerate(relevant_docs)
        ])

        prompt = f"""You are an expert AI agent.

Context Documents:
{context}

User Request:
{task.request}

Industry: {task.industry}

Use the context documents to inform your response. Provide accurate, relevant information.
"""

        # 3. Generate response
        response = await self.llm.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}],
        )

        return AgentResult(
            agent=self.name,
            output=response.content[0].text,
            confidence=self.calculate_confidence(response),
            context_used=relevant_docs,
        )
```

---

## Frontend Application

### Page Structure

**Landing Page** (`pages/index.tsx`):
- Hero section with value proposition
- Feature showcase
- Stats/social proof
- CTA buttons (Register, Demo)

**Dashboard** (`pages/dashboard.tsx`):
- Overview stats (tasks, content, team, success rate)
- Quick actions (new agent task, upload content)
- Recent activity feed
- Agent swarm panel (live status)

**Agent Swarm** (`pages/agents/index.tsx`):
- Task creation form
- Active tasks with real-time progress
- Task history
- HITL review queue

**Content Waterfall** (`pages/content/upload.tsx`):
- Drag-and-drop file upload
- Platform selector (YouTube, LinkedIn, etc.)
- Processing progress
- Generated assets gallery

**Analytics** (`pages/analytics.tsx`):
- Performance metrics (accuracy, latency, cost)
- User engagement charts
- Agent success rates
- Revenue/ROI dashboard

### Component Library

**Reusable Components** (`components/`):
```
components/
├── common/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   └── Badge.tsx
├── layouts/
│   ├── DashboardLayout.tsx
│   ├── AuthLayout.tsx
│   └── LandingLayout.tsx
├── dashboard/
│   ├── StatsCard.tsx
│   ├── AgentSwarmPanel.tsx
│   ├── QuickActions.tsx
│   └── RecentActivity.tsx
├── agents/
│   ├── TaskForm.tsx
│   ├── TaskCard.tsx
│   ├── AgentStatus.tsx
│   └── ResultsDisplay.tsx
├── hitl/
│   ├── ReviewQueue.tsx
│   ├── ReviewCard.tsx
│   └── ReviewStats.tsx
└── charts/
    ├── LineChart.tsx
    ├── BarChart.tsx
    └── PieChart.tsx
```

### State Management

**Zustand Store** (`utils/stores/auth.ts`):
```typescript
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        set({ user: data.user, token: data.accessToken });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return;

        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          set({ token: data.accessToken });
        } else {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

**React Query Hooks** (`hooks/useAgents.ts`):
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';

export function useAgentTasks() {
  return useQuery({
    queryKey: ['agent-tasks'],
    queryFn: () => api.get('/api/agents/tasks').then(res => res.data),
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

export function useCreateAgentTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: AgentTaskCreate) =>
      api.post('/api/agents/tasks', task).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['agent-tasks']);
      toast.success('Agent task created!');
    },
  });
}
```

### Real-Time Updates (WebSocket)

**WebSocket Client** (`utils/websocket.ts`):
```typescript
import { io, Socket } from 'socket.io-client';

class WebSocketClient {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL, {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  subscribe(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    this.socket?.off(event, callback);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const ws = new WebSocketClient();
```

**Usage in Component**:
```typescript
useEffect(() => {
  if (!token) return;

  // Connect WebSocket
  ws.connect(token);

  // Subscribe to agent task updates
  ws.subscribe('agent-task-update', (data) => {
    console.log('Agent task update:', data);
    queryClient.invalidateQueries(['agent-tasks']);
  });

  // Subscribe to HITL review notifications
  ws.subscribe('hitl-review-needed', (data) => {
    toast.info(`New review needed: ${data.agent} agent`);
    queryClient.invalidateQueries(['hitl-reviews']);
  });

  return () => {
    ws.disconnect();
  };
}, [token]);
```

---

## Backend API

### API Routes

**Authentication** (`api/routes/auth.py`):
```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from schemas.auth import UserRegister, UserLogin, TokenResponse
from services.auth import AuthService
from dependencies.database import get_db

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user"""
    auth_service = AuthService(db)

    # Check if user exists
    if await auth_service.get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Create user
    user = await auth_service.create_user(user_data)

    # Generate tokens
    access_token = auth_service.create_access_token(user.id)
    refresh_token = auth_service.create_refresh_token(user.id)

    return TokenResponse(
        accessToken=access_token,
        refreshToken=refresh_token,
        user=user,
        expiresIn=900,  # 15 minutes
    )

@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    """Login user"""
    auth_service = AuthService(db)

    # Verify credentials
    user = await auth_service.authenticate(
        credentials.email,
        credentials.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Generate tokens
    access_token = auth_service.create_access_token(user.id)
    refresh_token = auth_service.create_refresh_token(user.id)

    return TokenResponse(
        accessToken=access_token,
        refreshToken=refresh_token,
        user=user,
        expiresIn=900,
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db),
):
    """Refresh access token"""
    auth_service = AuthService(db)

    # Verify refresh token
    user_id = auth_service.verify_refresh_token(refresh_token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user = await auth_service.get_user_by_id(user_id)

    # Generate new access token
    access_token = auth_service.create_access_token(user.id)

    return TokenResponse(
        accessToken=access_token,
        refreshToken=refresh_token,  # Same refresh token
        user=user,
        expiresIn=900,
    )
```

**Content Waterfall** (`api/routes/content.py`):
```python
from fastapi import APIRouter, UploadFile, File, Form, Depends, BackgroundTasks
from typing import List

from schemas.content import ContentResponse, AssetResponse
from services.content_waterfall import ContentWaterfallService
from dependencies.auth import get_current_user

router = APIRouter()

@router.post("/upload", response_model=ContentResponse)
async def upload_content(
    file: UploadFile = File(...),
    target_platforms: str = Form(...),  # comma-separated
    industry: str = Form(None),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: User = Depends(get_current_user),
):
    """
    Upload content for waterfall processing.

    Process:
    1. Validate file (type, size)
    2. Store in S3
    3. Queue for processing (background task)
    4. Return content ID
    """
    # Validate file
    if file.size > 500 * 1024 * 1024:  # 500MB
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large (max 500MB)",
        )

    platforms = target_platforms.split(",")

    # Create content record
    waterfall_service = ContentWaterfallService()
    content = await waterfall_service.create_content(
        user_id=current_user.id,
        file=file,
        platforms=platforms,
        industry=industry,
    )

    # Queue background processing
    background_tasks.add_task(
        waterfall_service.process_content,
        content_id=content.id,
    )

    return ContentResponse(
        id=content.id,
        status="processing",
        estimatedCompletion=calculate_eta(file.size),
    )

@router.get("/{content_id}", response_model=ContentResponse)
async def get_content(
    content_id: str,
    current_user: User = Depends(get_current_user),
):
    """Get content processing status and generated assets"""
    waterfall_service = ContentWaterfallService()
    content = await waterfall_service.get_content(content_id)

    # Check ownership
    if content.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized",
        )

    return content
```

### Database Models

**User Model** (`models/user.py`):
```python
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(
        Enum("admin", "pro", "free", name="user_role"),
        nullable=False,
        default="free",
    )
    team_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    agent_tasks = relationship("AgentTask", back_populates="user")
    content = relationship("Content", back_populates="user")
```

**Agent Task Model** (`models/agent_task.py`):
```python
from sqlalchemy import Column, String, DateTime, Float, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from database import Base

class AgentTask(Base):
    __tablename__ = "agent_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    request = Column(String, nullable=False)
    industry = Column(String, nullable=True)
    priority = Column(String, default="medium")  # low, medium, high
    status = Column(String, default="queued")  # queued, processing, hitl_review, completed, failed
    agents = Column(JSON, nullable=True)  # List of selected agents
    results = Column(JSON, nullable=True)  # Aggregated results
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="agent_tasks")
    hitl_reviews = relationship("HITLReview", back_populates="task")
```

**HITL Review Model** (`models/hitl_review.py`):
```python
from sqlalchemy import Column, String, DateTime, Float, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from database import Base

class HITLReview(Base):
    __tablename__ = "hitl_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), ForeignKey("agent_tasks.id"), nullable=False)
    agent = Column(String, nullable=False)
    output = Column(JSON, nullable=False)
    confidence = Column(Float, nullable=False)
    flag_reason = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, reviewed
    decision = Column(String, nullable=True)  # approve, reject, edit
    notes = Column(String, nullable=True)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    # Relationships
    task = relationship("AgentTask", back_populates="hitl_reviews")
    reviewer = relationship("User")
```

---

## Deployment

### Docker Configuration

**Updated docker-compose.yml** (with frontend and backend):
```yaml
version: '3.8'

services:
  # Frontend (Next.js)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: swanythree-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NEXT_PUBLIC_WS_URL=ws://backend:8000
    networks:
      - swanythree-network
    depends_on:
      - backend

  # Backend (FastAPI)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: swanythree-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://n8n_user:${DB_PASSWORD}@postgres:5432/n8n
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend:/app
    networks:
      - swanythree-network
    depends_on:
      - postgres
      - redis

  # ... (keep all existing services: postgres, redis, nginx, etc.)
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations run
- [ ] Redis cache cleared
- [ ] Pinecone index created
- [ ] Monitoring dashboards configured
- [ ] Backup strategy tested
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated

---

## Performance Metrics

### Target KPIs (MVP Phase)

**Technical Metrics**:
- **API Response Time**: <500ms (95th percentile)
- **AI Agent Latency**: <30s per task
- **Uptime**: 99.5%+
- **Error Rate**: <1%

**AI-Specific Metrics**:
- **Model Accuracy**: >85% (based on HITL reviews)
- **Confidence Score**: Avg >0.80
- **HITL Review Rate**: <20% of tasks
- **Auto-Approval Rate**: >80%

**Business Metrics**:
- **User Retention (90-day)**: 25-30%
- **Daily Active Users (DAU)**: 100+ (month 3)
- **Task Completion Rate**: >95%
- **Cost per Task**: <$2.00

---

## Cost Analysis

### MVP Development Cost

**Estimated Budget**: $40,000 - $150,000

**Breakdown**:
1. **Data Collection & Preparation**: $5,000 - $20,000
   - Open-source datasets: Free
   - Manual labeling (1,000 examples): $5,000
   - Synthetic data generation: $5,000
   - Quality assurance: $10,000

2. **AI Model Development**: $20,000 - $60,000
   - Pre-trained model fine-tuning: $20,000
   - Agent development (5 agents): $30,000
   - RAG implementation: $10,000

3. **Frontend Development**: $15,000 - $30,000
   - Next.js app (8 pages): $15,000
   - Component library: $10,000
   - WebSocket integration: $5,000

4. **Backend Development**: $20,000 - $40,000
   - FastAPI (7 API modules): $20,000
   - Database design & migrations: $10,000
   - WebSocket server: $5,000
   - HITL system: $5,000

### Ongoing Operational Cost

**Monthly Recurring**: $3,000 - $8,000

**Breakdown**:
1. **Cloud Infrastructure**: $1,000 - $3,000
   - AWS EC2/ECS (t3.large x2): $150
   - RDS PostgreSQL (db.t3.medium): $100
   - Redis (cache.t3.micro): $20
   - S3 Storage (1TB): $25
   - CloudWatch Logs: $50
   - Load Balancer: $20
   - Total: ~$365/month

2. **AI API Costs**: $1,500 - $4,000
   - Claude API (1M tokens/day): $1,500
   - OpenAI Embeddings (10M tokens): $130
   - Pinecone (100K vectors): $70
   - Total: ~$1,700/month

3. **Third-party Services**: $200 - $500
   - Monitoring (Grafana Cloud): $50
   - Error tracking (Sentry): $30
   - CDN (Cloudflare): $20
   - Email (SendGrid): $20
   - Total: ~$120/month

4. **Team/Support**: $0 - $500
   - Customer support tools: $100
   - Documentation hosting: $20
   - Total: ~$120/month

**Cost Optimization Tips**:
- Use spot instances for non-critical workloads
- Implement aggressive caching (Redis) to reduce AI API calls
- Monitor and optimize expensive AI operations
- Leverage free tiers (Vercel, Netlify, etc.)

---

## Next Steps

### Immediate Actions (Week 1)
1. Complete frontend authentication pages
2. Implement HITL review UI
3. Test agent swarm with real tasks
4. Set up monitoring dashboards

### Short-term Goals (Month 1)
1. Onboard 10 beta users
2. Collect 1,000 HITL training examples
3. Achieve 85% auto-approval rate
4. Deploy to production

### Long-term Vision (Quarter 1)
1. Scale to 100+ active users
2. Add 5 more specialized agents
3. Implement custom model fine-tuning
4. Launch enterprise features (SSO, advanced RBAC)

---

**Version**: 1.0.0
**Last Updated**: 2025-01-15
**Maintained By**: SwanyThree Team

