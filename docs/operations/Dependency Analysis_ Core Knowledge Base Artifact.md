Dependency Analysis: Core Knowledge Base Artifact
1. Mission & Scope
Mission: "Map the Road"
The primary mission of the Dependency Analysis (DA) team is to enable data-driven decisions regarding the organization’s technical stack (source). The initiative addresses the problem that while the organization has built "too many routes" to planetary-scale outcomes, there is no "measurable map" to guide teams optimally (Dependency Analysis - ...).
Core Objectives (OKRs)
	•	Benchmarking & ROI: Deliver technical reports to PA/VP leadership that benchmark system footprints against proposed changes (e.g., migrations to [TEAM_NAME] Stacks), tied to tangible metrics like machine cost or engineering headcount (Dependency Analysis).
	•	Dependency Graph: Build an auto-discovering graph of infrastructure dependencies (Build, RPC, Data, Artifacts) (Dependency Analysis).
	•	Fit for Purpose: Support the [TEAM_NAME] charter to ensuring the organization's technical stack is "fit for purpose" by identifying what needs to be reduced, combined, or converged (source).
Scope
	•	In Scope:
	•	[TEAM_NAME] Domains: Tracking adoption of recommended technologies.
	•	TPC (Trusted Partner Cloud): Analyzing dependencies for TPC scoping.
	•	Entities: [ORCHESTRATOR] jobs, MDB groups, RPCs, Data dependencies, and associated artifacts.
	•	Out of Scope:
	•	Regional dependencies (e.g., regional vs. global Sawmill).
	•	General-purpose dependency analytics for non-prioritized use cases (source).


2. Architecture: Data Landscape
The Dependency Analysis architecture centers on ground truth accuracy with minimal inference (Dependency Analysis).
Graph Structure
The graph consists of Assets (Nodes) and Relationships (Edges).

	•	Nodes (Asset Types): BORG_JOB, TG_PRODUCT (TeamGraph Product), TG_TEAM, RESOURCE_PRODUCT_AREA.
	•	Edges: Represent relationships like RPC calls, Build dependencies, or Data flows.
Key Data Sources
The graph ingests data from multiple authoritative internal sources:

Data Source
Type
Usage / Coverage
[BUILD_SYSTEM]
Build
Authoritative source for the Build graph ([BUILD_SYSTEM].Targets).
Certified Infra Deps
RPC
Significant RPCs ([RPC_FRAMEWORK]); maps [PACKAGE_MANAGER] to [ORCHESTRATOR_JOB].
Ganpati
Identity
Complete coverage of MDB groups and ownership.
Rumbo (Infrastore)
Infrastructure
[ORCHESTRATOR] jobs, packages, and allocs; resource usage stats.
TeamGraph
Metadata
Teams and Products structure; links to Stacks metadata.
F1 / Herodotus
Logs/Events
F1 request logs and production events (e.g., CDPush).
MetaRepo
Data Lineage
Relationships between datasets (datahub.full_relationships).
Properties
	•	[ORCHESTRATOR] jobs: [COMPUTE_UNIT], RAM, SSD, Disk usage, and Num Instances (Dependency Analysis - ...).
	•	Product: Recommended status, Domain, ISA status, and Product Phase (e.g., Deprecated, GA) (Dependency Analysis - ...).
	•	RPC Edge: Service Names and QPS.


3. Operational Model
Internal Perspective (Engineering & Production)
	•	Development:
	•	Languages: Primarily C++ (Flume, Boq) and Python (Colab notebooks, CLIF wrappers) (New Team Member Onboar...).
	•	Codebase: Located at //depot/[INTERNAL_CODEBASE]/productivity/dependency.
	•	Testing: Heavily relies on TAP for unit tests and Guitar for integration tests (depanalysis-guitar).
	•	Production:
	•	Pipeline: A daily Dreampipe workflow ("Reader", "Joiner", "Writer") that generates the graph and writes to Spanner.
	•	Release Cadence: Daily releases (N). Constraints include a "wet run" of staging Dreampipe and a 4-day data offset (N-4) for input stability (Dependency Analysis Pr...).
	•	Storage:
	•	Spanner: Pod-managed DBs for Prod and Test (depanalysis-dep-graph-db).
	•	CNS/Placer: Used for large file storage and data drops.
External Perspective (Customer Engagement)
	•	Engagement Model:
	•	Work is tracked in TaskFlow ([INTERNAL_LINK]) using two-week iterations.
	•	External requests must be filed via [INTERNAL_LINK] or the [BUG_TRACKER] component Core > [TEAM_NAME] > Dependency Analysis (Developing in Dependen...).
	•	Value Proposition:
	•	Benchmarking: Providing PAs with "technical stack health scores" and alternatives.
	•	Simulations: Running "what-if" scenarios (e.g., "What if we migrated to Stacks recommendations?") to calculate ROI in terms of machine cost, headcount, or risk reduction (Dependency Analysis).
	•	Chargebacks: Partnering with SharpN to correlate technical choices with Core chargebacks (Dependency Analysis - ...).


4. Team & Communications Audit
Leadership
	•	Dependency Analysis Lead: Asad Ullah Naweed (source).
	•	[TEAM_NAME] PM Lead: [EXEC_NAME_1] (About - [TEAM_NAME] Org).
	•	Principal SWE: [PERSON_NAME] (About - [TEAM_NAME] Org).
Communication Channels
	•	Team Email: [TEAM_NAME]-da@[ORG_DOMAIN] (External contact) (Developing in Dependen...).
	•	Internal Group: [INTERNAL_GROUP] (Engineering discussions, calendar invites) (New Team Member Onboar...).
	•	MDB Group: [INTERNAL_GROUP].
	•	TaskFlow: [INTERNAL_LINK] (Project tracking).
Onboarding
New members must join specific groups ([INTERNAL_GROUP], [INTERNAL_GROUP]) to access resources like the Team Chat and TaskFlow workspace (New Team Member Onboar...). Proficiency in C++ (for pipelines) and [ORG_SQL] is required, with Python recommended for Colab analysis.

