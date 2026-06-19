# OES 101: Office of Engineering Strategy Overview

## 1. Mission and Mandate

**Mission:** The Office of Engineering Strategy (OES) defines and drives Northwind's technical roadmap. OES helps Northwind Engineering move faster, operate more reliably, and stay ready for the future, ensuring our systems are fit for purpose.

**Context and Origin:** OES was founded to address well-known coordination challenges across a large, fast-growing engineering organization. It oversees cross-company engineering investments, makes sound organization-wide technical decisions, and drives execution on high-priority technical initiatives. This supports Platform Engineering's broader goal: make Northwind's engineering faster, more reliable, and ready to scale.

**Approach:** OES operates with a philosophy of being "broad and selectively deep."

- **Broad:** Focused on coordinating and aligning horizontal technologies across teams.
- **Selectively deep:** Partnering closely with teams in areas of high importance and high coordination overhead.

**Authority:** OES is granted specific authority to deliver on its mission:

- **Decision making:** OES Domain Leads can make binding decisions and set policy on the availability, expectations, and suitability of technologies used across Northwind teams.
- **Strategic nomination:** Platform Engineering leadership and OES nominate technical areas of special interest where the office acts as a partner and stakeholder.
- **Resource governance:** OES governs the redirection of resources toward strategic, high-priority technical work.

**Core goals:**

- **Systems fit for purpose:** Ensuring technology empowers product teams to build safe, performant, innovative products.
- **Systems health:** Ensuring infrastructure products and services are supported, reliable, non-duplicative, and form clear "well-lit paths."
- **Engineer effectiveness:** Improving the efficiency of engineers working on products and infrastructure.

## 2. Vision and Operating Model

OES delivers through six pillars of engagement:

- **Partner to define and/or drive change:** Using organizational leverage to unblock change and produce strategy alignment that results in action, including special initiatives for company leadership that are organizationally stuck.
- **Partner to define the technical roadmap:** Working through OES Domains to produce Technical Roadmap Reports (TRRs) and related outputs.
- **Leverage and influence:** Using authority to resolve blocked initiatives and ensure alignment.
- **Guide engineers:** Managing investments in senior technical ICs and publishing the technical roadmap. Key assets include the internal roadmap portal, the Product and Solution Catalog (PSC), and Technical Decision Papers (TDPs).
- **Provide objective analysis:** Delivering transparent, reproducible ROI analysis to optimize for Northwind as a whole, analyzing the ROI of proposed mandates and critical policies and driving convergence (for example, dependency analysis).
- **Drive adoption:** Enforcing the roadmap through org-wide mandates and execution programs like Greenlight, managed by the Change Management (CM) team.

## 3. Partnership with Product Areas (PAs)

A majority of supportive PAs is generally required to pursue a binding cross-company initiative. OES partners with PAs by:

- **Soliciting input:** Engaging product-area tech leads on all key programs.
- **Aligning metrics:** Validating that OES metrics (service performance, reliability, feature completeness) match the measures PAs use to define success.
- **Fostering community:** Building robust, interconnected senior-engineer communities across product areas.
- **Embedding partnership:** Integrating strong PA partnership into the team's way of working.

## 4. Governance and Enforcement ("How We Drive")

OES uses a "trust but verify" approach to governance:

- **Certify alignment:** Ensuring company-wide alignment via broadly reviewed, published content (for example, TRRs).
- **Escalations:** Escalating to VPs and SVPs to enforce technical contracts such as Infrastructure Support Agreements.
- **Policy enforcement:** Certifying and enforcing select critical policies, for example the Change-Load Policy, which validates required work for company-wide mandates.
- **Adoption and deprecation:** Enforcing technology adoption and deprecation as outlined in the roadmap.

## 5. Progress and Achievements

**Cross-company partnership:**

- Built and revitalized roughly 15 OES Domains comprising about 150 domain stewards from across the organization.
- Established a Senior Technical IC Forum and organization-wide tech-lead groups to promote cross-PA connections.

**Defining the roadmap:**

- Published Technical Roadmap Reports (TRRs) to align decisions on contested technical matters.
- Curated technical assets via Domains in the Product and Solution Catalog (PSC), covering the majority of GA infrastructure products.
- Began preventing new duplicative products through portfolio management.

**Driving the roadmap:**

- Established Greenlight to drive cross-company execution on top-priority problems.
- Consolidated the Change-Load Policy for required large-scale change, preventing unapproved mandates from saturating engineering bandwidth and preserving significant engineering capacity.

## 6. Core Programs and Definitions

**Technical Roadmap Report (TRR)**

- **Purpose:** Align engineering efforts with key technical priorities and provide strategic direction.
- **Structure:** One to three teams working cross-company, with input from OES Domains, VPs, and senior ICs.
- **Horizon:** Two to five years.

**Org-Wide Mandate (OWM)**

- **Purpose:** Change programs that drive critical engineering changes across the organization with a focused scope.
- **Structure:** Initiated by any team, approved by OES, impacting hundreds to thousands of teams.
- **Horizon:** About one year.

**Greenlight**

- **Purpose:** Landing the organization's top-priority cross-PA technical problems, focused on long-term execution and alignment.
- **Structure:** One to three central teams partnering closely with 10 to 30 teams, approved by Platform Engineering leadership.
- **Horizon:** About two years.

**OES Technical Domains**

- **Purpose:** Technical experts define common reference architecture ("building blocks") and advocate for convergence via technical governance.
- **Status:** About 15 technical domains with roughly 150 stewards.
- **Scope:** Recommended building blocks across domains (for example, Security, ML, Storage).

## 7. Focus Area: Security and Compliance at Scale

OES partners across Platform Engineering to define and drive security and compliance outcomes, moving toward a "compliance at scale" framework.

- **Tipping-point analysis:** Validates a "shift left" strategy, building ROI measurement into control-development plans.
- **Data-protection roadmap:** Aligns control implementation and rollout strategies.
- **Governance and risk lifecycle:** Brings teams together to deliver end-to-end compliance goals.

## 8. Program Status Updates (Illustrative)

Roadmap implementation tracker (selected, sample data):

- **Internal platform migration:** Strong start on a challenging implementation; domain teams defining technical solutions.
- **On-device ML:** Behind schedule; reprioritization toward large models left the effort understaffed; scope reduced.
- **Data-residency handling:** Project Summit subteam executing decisions.
- **Multi-platform flagship apps:** On track with significant risk due to headcount.
- **Config and data-push tooling:** Success criteria defined, but project plans need work.
- **Service solutions for Project Atlas:** On track with early customer wins.
- **ML storage and frameworks:** Program plans in progress at leadership request.

## 9. Investing in the Senior Technical IC Community

- **DE Pathways:** Supports Distinguished Engineers' career development (about 150 DEs).
- **Senior Technical IC Forum:** Builds a community of roughly 800 or more principal-and-above technical leaders.
- **Team Impact Awards:** Recognize teams landing outsized-impact projects (about $5M in annual awards, sample figure).
- **IC Focus:** Ensures senior engineers are working on the highest-leverage problems.
- **Engineering Innovation Fund (EIF):** Encourages long-term strategic bets across Platform Engineering.

## 10. Change Management (CM) and Mandates

The CM team aims to make large changes faster, cheaper, and less painful.

**Mandate management:**

- **Lifecycle:** Typically about 1.5 to 2 years.
- **Process:**
  - **VP sponsor:** Identifies the "what" and "who."
  - **CM team:** Communicates impact and goals a quarter in advance, ensures work is defined and minimized or automated, validates ROI, and provides dashboards.
  - **Impacted teams:** Complete the work and provide cost-feedback data.

## 11. Tooling Portfolio

- **Systems Catalog:** Authoritative source of system information.
- **Dependency Analysis:** Understands relationships between changing systems.
- **Change Analysis Engine:** Clarifies cohorts, costs, and tradeoffs for changes.
- **Change Sequencing Platform:** Drives the sequence of changes across the company.
- **AI integration:** Brings these together with retrieval and AI techniques to make the sum greater than the parts.
