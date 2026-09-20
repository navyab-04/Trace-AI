# TraceID AI
## Public Profile & Digital Footprint Intelligence

> **Discover → Correlate → Verify → Explain**

TraceID AI is an AI-powered public digital identity intelligence system designed to discover, correlate, and verify **authorized public information** associated with an organizer-approved or consented image and limited context.

The system focuses on a problem that simple search and scraping tools do not solve well:

> **Finding information is not enough. TraceID AI focuses on determining whether independently discovered public records may belong to the same person, what evidence supports that relationship, and how confident the system should be.**

---

# 1. Problem Statement

A person's public digital presence is often distributed across multiple independent sources:

- Social-media profiles
- Professional profiles
- GitHub and technical platforms
- Company websites
- Conferences and events
- Hackathons and workshops
- Interviews and articles
- Projects and products
- Publications
- Patents and documented innovations

Manually connecting this information is difficult when:

- Names are common
- Usernames differ between platforms
- Aliases are used
- Profiles are incomplete
- Multiple people have similar identities
- Information conflicts between sources

## The challenge

A conventional search workflow may return hundreds of results.

TraceID AI instead aims to answer:

```text
Who could this information belong to?
        ↓
Which public records are related?
        ↓
What evidence connects them?
        ↓
Do multiple sources agree?
        ↓
What information conflicts?
        ↓
How confident should the system be?
```

---

# 2. Proposed Solution

TraceID AI transforms authorized public information into a structured, evidence-backed identity profile.

The system combines:

- Candidate discovery
- Public-source discovery
- Information extraction
- Entity resolution
- Semantic similarity
- Cross-source correlation
- Evidence verification
- Confidence analysis
- Conflict detection
- Timeline construction
- Relationship graph generation

Instead of making an unexplained identity claim, the system presents **candidates, supporting evidence, confidence, and uncertainty**.

---

# 3. What Makes TraceID AI Different?

TraceID AI is **not intended to be a generic web scraper or unrestricted reverse-image search tool**.

Its core focus is:

```text
              INFORMATION
                   ↓
             CORRELATION
                   ↓
            ENTITY RESOLUTION
                   ↓
                EVIDENCE
                   ↓
              CONFIDENCE
                   ↓
             EXPLAINABLE
              INTELLIGENCE
```

### Key differentiators

| Conventional Search Workflow | TraceID AI |
|---|---|
| Finds information | Correlates information |
| Returns isolated results | Builds connected profiles |
| May rely heavily on names | Combines multiple identity signals |
| Limited explanation | Evidence-backed findings |
| May ignore conflicts | Explicit conflict handling |
| Binary identification mindset | Confidence-aware candidates |
| Search-result focused | Investigation workflow focused |

### Core principle

> **Do not force a match when the evidence is insufficient.**

---

# 4. Core Product Workflow

```text
Authorized Image + Limited Context
                |
                v
       Investigation Creation
                |
                v
       Candidate Identification
                |
                v
       Public Source Discovery
                |
                v
       Information Extraction
                |
                v
        Entity Resolution
                |
                v
       Cross-Source Correlation
                |
                v
        Evidence Verification
                |
                v
      Confidence / Risk Analysis
                |
          +-----+------+
          |            |
          v            v
       Timeline     Relationship
                     Graph
          |            |
          +-----+------+
                |
                v
       Intelligence Dashboard
                |
                v
        Explainable Report
```

The architecture separates **discovery** from **resolution** and **resolution** from **evidence verification**.

---

# 5. Core MVP

## 5.1 Investigation & Authorization

An investigation begins with:

- Organizer-approved or consented image
- Optional known name
- Optional username
- Optional organization
- Limited context
- Consent/authorization confirmation

The system records the investigation and its authorization state before analysis begins.

## 5.2 Candidate Generation

TraceID AI does not immediately declare a person as identified.

Instead, it generates candidate identities and ranks them using multiple signals.

```text
Input
  ↓
Candidate Discovery
  ↓
Candidate A
Candidate B
Candidate C
  ↓
Multi-Signal Comparison
  ↓
Ranked Candidates
```

Each candidate can contain:

```text
Candidate
Confidence
Classification
Supporting Signals
Conflicting Signals
Sources
```

## 5.3 Public Profile Discovery

Relevant profiles are discovered from approved public sources.

Each profile is normalized into a common structure:

```text
Platform
Username
Display Name
Profile URL
Bio / Description
Source
Confidence
```

## 5.4 Entity Resolution

Entity resolution is the core intelligence layer.

The system determines whether different names, usernames, aliases, profiles, organizations, projects, events, and public records may refer to the same person.

Instead of relying on a single identifier:

```text
Name Match
+
Username Match
+
Organization Match
+
Context Match
+
Project Overlap
+
Source Agreement
```

the system combines multiple signals before producing a confidence-aware result.

---

# 6. Entity Resolution Methodology

The planned entity-resolution pipeline is:

```text
Candidate Pair
      |
      v
Text Normalization
      |
      v
Feature Extraction
      |
      +-------------------+
      |                   |
      v                   v
Name Similarity     Username Similarity
      |                   |
      +---------+---------+
                |
                v
       Context Comparison
                |
      +---------+---------+
      |         |         |
      v         v         v
Organization  Projects   Events
   Match       Match      Match
      |         |         |
      +---------+---------+
                |
                v
        Source Agreement
                |
                v
       Evidence Aggregation
                |
                v
       Confidence Estimation
                |
       +--------+--------+
       |        |        |
       v        v        v
     Match   Uncertain  Non-Match
```

Candidate comparison signals include:

- Name similarity
- Username similarity
- Organization similarity
- Biography similarity
- Professional role
- Project overlap
- Event participation
- Public links
- Cross-source agreement
- Authorized image signal

The exact scoring weights are **not treated as ground truth**. They will be calibrated and evaluated during implementation.

---

# 7. AI/ML Architecture

```text
Raw Public Information
          |
          v
      Normalization
          |
          v
    Embedding Generation
          |
          v
   Candidate Retrieval
          |
          v
    Feature Extraction
          |
          v
 Similarity Calculation
          |
          v
 Evidence Aggregation
          |
          v
 Confidence Estimation
          |
          v
 Explainable Result
```

## 7.1 Candidate Ranking

Conceptually:

```text
Identity Confidence =
    Name Similarity
  + Username Similarity
  + Organization Match
  + Context/Bio Similarity
  + Cross-Source Agreement
  + Authorized Image Signal
```

The final weights will be evaluated against authorized or synthetic test cases.

## 7.2 Text Embeddings

Text embeddings can represent:

- Names
- Bios
- Descriptions
- Projects
- Publications
- Organization information

Semantic similarity can then be used to retrieve and compare related records.

## 7.3 Vector Search

`pgvector` is planned for storing and searching vector representations alongside investigation data.

```text
Profile / Document
       |
       v
Text Representation
       |
       v
Embedding
       |
       v
PostgreSQL + pgvector
       |
       v
Semantic Candidate Retrieval
```

## 7.4 Information Extraction

The system extracts structured entities:

```text
PERSON
ORGANIZATION
PROJECT
EVENT
PUBLICATION
PRODUCT
PATENT
ROLE
```

---

# 8. Evidence-First Intelligence

Every material finding should be traceable to its supporting source.

The evidence model contains:

```text
Claim
Source URL
Source Type
Supporting Evidence
Retrieval Time
Confidence
Associated Person / Entity
```

Example:

```text
CLAIM
Person A participated in Event B.

EVIDENCE
- Official event page
- Public participant profile
- Related public project

CONFIDENCE
High

STATUS
Supported
```

The system should not silently discard conflicting information.

```text
Multiple Sources Agree
        ↓
Confidence Increases

Sources Conflict
        ↓
Conflict Is Surfaced

Evidence Is Insufficient
        ↓
Result Remains Uncertain
```

---

# 9. False-Match Handling

False matches are a primary design concern.

A common failure mode is:

```text
John Doe
   =
Every John Doe
```

TraceID AI is designed to avoid this assumption.

```text
                Name Match
                    |
                    v
             Candidate Pair
                    |
       +------------+------------+
       |            |            |
       v            v            v
 Username     Organization    Context
 Similarity      Match        Similarity
       |            |            |
       +------------+------------+
                    |
                    v
             Evidence Agreement
                    |
                    v
             Confidence Model
                    |
       +------------+------------+
       |            |            |
       v            v            v
    Strong      Uncertain     Weak
    Match        Match        Match
```

Possible classifications:

```text
Very Strong Match
Strong Match
Possible Match
Uncertain
Possible Non-Match
Non-Match
```

The system should explicitly expose uncertainty instead of forcing an identity conclusion.

---

# 10. Conflict Detection

Public information may disagree between sources.

Instead of silently selecting one value, TraceID AI can represent:

```text
Finding
  |
  +-- Supporting Sources
  |
  +-- Conflicting Sources
  |
  +-- Confidence
  |
  +-- Retrieval Times
```

This allows the investigator to understand both the conclusion and the uncertainty around it.

---

# 11. Timeline Intelligence

Public activities can be converted into chronological events.

Possible event types include:

- Education
- Employment
- Projects
- Hackathons
- Conferences
- Publications
- Workshops
- Public technical contributions

```text
2019 ─── Education
   |
2021 ─── Organization / Role
   |
2022 ─── Project
   |
2023 ─── Hackathon
   |
2024 ─── Publication
   |
2025 ─── Conference
```

Each event can retain its source and confidence.

---

# 12. Relationship Graph

TraceID AI represents relationships between people and public entities.

```text
                         Organization
                              |
                              |
Project ----------- Person ----------- Public Profile
   |                   |
   |                   |
Publication          Event
   |
   |
Product / Patent
```

Planned graph entities:

```text
Person
Organization
Project
Event
Publication
Product
Patent
Public Profile
```

Relationships can include:

```text
WORKED_AT
PARTICIPATED_IN
AUTHORED
CREATED
CONTRIBUTED_TO
ASSOCIATED_WITH
PUBLISHED
ATTENDED
```

---

# 13. System Architecture

```text
+------------------------------------------------------+
|                    Next.js Frontend                  |
| Dashboard | Investigation | Evidence | Timeline     |
| Graph     | Profiles      | Reports                 |
+---------------------------+--------------------------+
                            |
                            | REST API
                            v
+------------------------------------------------------+
|                     FastAPI Backend                  |
+------------------------------------------------------+
| API Layer                                            |
| Investigations | Profiles | Evidence | Reports      |
+------------------------------------------------------+
| Application Services                                 |
| Identity | Discovery | Entity Resolution | Timeline |
+------------------------------------------------------+
| AI/ML Layer                                          |
| Embeddings | Similarity | Ranking | Information      |
| Extraction                                           |
+------------------------------------------------------+
| Source Connector Layer                               |
| Approved Public Sources / APIs / Search Providers   |
+------------------------------------------------------+
                            |
                            v
+------------------------------------------------------+
| PostgreSQL + pgvector                                |
| Investigations | Persons | Profiles | Evidence      |
| Entities | Relationships | Events                    |
+------------------------------------------------------+
```

## Architectural principles

- Modular components
- Replaceable source connectors
- Evidence-first data model
- Confidence-aware decisions
- Clear separation of API, business logic and AI/ML
- Privacy and authorization boundaries
- Extensibility for additional approved sources

---

# 14. Privacy & Responsible Design

TraceID AI is designed around the hackathon's stated authorization requirements.

## Allowed

- Organizer-approved information
- Consented information
- Publicly available information
- Synthetic information
- Otherwise authorized information

## Not Allowed

- Private-account access
- Leaked information
- Credential-based access
- Bypassing access controls
- Unauthorized collection

The system should clearly distinguish:

```text
Observed Evidence
        ↓
Derived Relationship
        ↓
Confidence
```

A model inference should not automatically be presented as an established fact.

---

# 15. Database Design

## investigations

```text
id
created_at
status
consent_status
input_context
```

## persons

```text
id
display_name
identity_confidence
summary
created_at
```

## profiles

```text
id
person_id
platform
username
profile_url
display_name
bio
profile_confidence
created_at
```

## evidence

```text
id
person_id
source_url
source_type
claim
evidence_text
confidence
retrieved_at
```

## entities

```text
id
type
name
description
```

## relationships

```text
id
source_entity_id
target_entity_id
relationship_type
confidence
evidence_id
```

## events

```text
id
person_id
event_type
title
organization
date
source_id
confidence
```

---

# 16. API Design

## Investigation

```text
POST   /api/v1/investigations
GET    /api/v1/investigations/{id}
```

## Input & Analysis

```text
POST   /api/v1/investigations/{id}/image
POST   /api/v1/investigations/{id}/analyze
```

## Investigation Results

```text
GET    /api/v1/investigations/{id}/candidates
GET    /api/v1/investigations/{id}/profiles
GET    /api/v1/investigations/{id}/evidence
GET    /api/v1/investigations/{id}/timeline
GET    /api/v1/investigations/{id}/graph
GET    /api/v1/investigations/{id}/report
```

## Health

```text
GET    /health
```

---

# 17. Technology Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Flow
- Recharts

## Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic

## AI/ML

- scikit-learn
- sentence-transformers
- Hugging Face ecosystem where appropriate
- pgvector for vector similarity

## Database

- PostgreSQL
- pgvector

## Storage

Development:

```text
Local file storage
```

Production direction:

```text
Object storage such as S3
```

## Optional Infrastructure

- Redis
- Background workers
- Docker
- Cloud deployment

---

# 18. Planned Project Structure

```text
traceid-ai/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── connectors/
│   │   ├── ml/
│   │   ├── database/
│   │   └── core/
│   └── tests/
│
├── data/
│   └── uploads/
│
├── docs/
├── .env
├── .env.example
├── .gitignore
├── README.md
└── docker-compose.yml
```

---

# 19. End-to-End Investigation Example

```text
Step 1
Authorized Image + Context
        ↓
Step 2
Create Investigation
        ↓
Step 3
Generate Candidate Identities
        ↓
Step 4
Discover Approved Public Profiles
        ↓
Step 5
Normalize Profile Information
        ↓
Step 6
Generate Embeddings / Features
        ↓
Step 7
Perform Entity Resolution
        ↓
Step 8
Correlate Independent Sources
        ↓
Step 9
Collect Supporting Evidence
        ↓
Step 10
Detect Conflicts
        ↓
Step 11
Calculate Confidence
        ↓
Step 12
Build Timeline + Relationship Graph
        ↓
Step 13
Present Explainable Investigation Report
```

The intended result is not simply:

```text
"This is Person X."
```

Instead:

```text
Candidate: Person X

Confidence: High

Supporting Signals:
✓ Organization match
✓ Username similarity
✓ Project overlap
✓ Independent source agreement

Conflicting Signals:
- None identified

Evidence:
1. Source A
2. Source B
3. Source C

Related Activities:
- Project
- Event
- Publication

Timeline:
- Event 1
- Event 2
- Event 3
```

---

# 20. Evaluation Methodology

The system should be evaluated using **synthetic or organizer-authorized test cases**.

## Entity Resolution

Measure:

- Precision
- Recall
- F1-score

## Candidate Ranking

Measure:

- Top-1 accuracy
- Top-3 accuracy

## False-Match Analysis

Measure:

- False-positive rate
- Incorrect identity associations
- Uncertain cases correctly surfaced

## Evidence Coverage

Check whether important findings contain:

```text
Claim
+
Source
+
Supporting Evidence
+
Retrieval Time
+
Confidence
```

## API / System Performance

Potential measurements:

- API response latency
- Investigation processing time
- Candidate retrieval time
- Database query performance

## End-to-End Workflow

Measure whether an authorized investigation can successfully move through:

```text
Investigation
→ Discovery
→ Resolution
→ Evidence
→ Timeline
→ Graph
→ Report
```

---

# 21. Implementation Roadmap

## Phase 1 — Foundation

- FastAPI setup
- PostgreSQL setup
- SQLAlchemy models
- Alembic migrations
- Investigation model
- Authorization state
- API foundation
- Next.js setup
- Investigation interface
- Basic dashboard
- Authorized image upload
- Context validation

## Phase 2 — Intelligence

- Approved source connectors
- Candidate generation
- Profile normalization
- Embedding generation
- Vector search
- Entity resolution
- Similarity scoring
- Initial confidence model

Target workflow:

```text
Input
 ↓
Candidate Discovery
 ↓
Semantic Retrieval
 ↓
Entity Resolution
 ↓
Ranked Candidates
```

## Phase 3 — Evidence & Correlation

- Evidence storage
- Source verification
- Information extraction
- Cross-platform correlation
- Conflict detection
- Timeline generation
- Relationship graph

## Phase 4 — Evaluation & Refinement

- Synthetic/authorized benchmark cases
- Entity-resolution evaluation
- False-match testing
- Candidate-ranking evaluation
- API performance measurements
- End-to-end tests
- Error analysis
- Confidence calibration

---

# 22. MVP Definition

The first complete MVP targets:

```text
Authorized Input
      ↓
Investigation Creation
      ↓
Candidate Generation
      ↓
Approved Public Source Discovery
      ↓
Profile Normalization
      ↓
Entity Resolution
      ↓
Evidence Collection
      ↓
Confidence Analysis
      ↓
Timeline + Graph
      ↓
Dashboard / Report
```

### MVP success criteria

A successful MVP should demonstrate:

- A complete investigation lifecycle
- Modular backend architecture
- Candidate-based identity resolution
- Multiple matching signals
- Evidence attached to findings
- Confidence-aware results
- False-match handling
- Timeline generation
- Relationship visualization
- Authorization boundaries

---

# 23. Future Scope

After the MVP is validated, the system can be extended with:

- Additional organizer-approved public sources
- Improved entity-resolution models
- Better evidence ranking
- Advanced graph analytics
- Automated report generation
- Background processing for larger investigations
- Cloud object storage
- Larger evaluation datasets
- Benchmark metrics
- More sophisticated conflict-resolution strategies

Future additions should remain within the authorization and public-information boundaries of the problem statement.

---

# 24. Current Project Status

## Checkpoint 01 — Architecture & Documentation

The current project stage focuses on establishing a technically credible foundation before full implementation.

### Current architecture direction

```text
FastAPI + PostgreSQL
        ↓
Investigation API
        ↓
Next.js Investigation UI
        ↓
End-to-End MVP Workflow
```

### Next implementation priorities

```text
1. Backend foundation
        ↓
2. Database models
        ↓
3. Investigation API
        ↓
4. Authorized input workflow
        ↓
5. Frontend investigation UI
        ↓
6. Candidate discovery
        ↓
7. Entity resolution
        ↓
8. Evidence & correlation
        ↓
9. Timeline + graph
        ↓
10. Evaluation
```

---

# 25. Core Design Principles

```text
DISCOVER
Find relevant authorized public information.

CORRELATE
Connect information across independent sources.

VERIFY
Preserve evidence, conflicts and confidence.

EXPLAIN
Show why a relationship or conclusion was produced.
```

> **TraceID AI is not just designed to find digital information. It is designed to organize fragmented public information into an explainable, evidence-backed identity intelligence workflow.**

---

# 26. Project Summary

```text
                 TRACEID AI

        Authorized Public Information
                    ↓
             Candidate Discovery
                    ↓
            Entity Resolution
                    ↓
           Cross-Source Correlation
                    ↓
             Evidence Verification
                    ↓
             Confidence Analysis
                    ↓
          Timeline + Relationship Graph
                    ↓
            Explainable Intelligence
```

**Discover → Correlate → Verify → Explain**
