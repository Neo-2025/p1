# S4 Directory Structure

```
/home/neo/S4/
├── kb/
│   ├── S4DevSnip/
│   │   ├── I/
│   │   │   ├── 1a-cursor-automation-benefits.md
│   │   │   ├── 1a-cursor-branch-workflow.md
│   │   │   ├── 1a-cursor-enterprise-oauth.md
│   │   │   ├── 1a-cursor-github-app-setup.md
│   │   │   ├── 1a-cursor-github-org-analysis.md
│   │   │   ├── 1a-cursor-mvp-workflow.md
│   │   │   ├── 1a-cursor-rules-wsl-features.md
│   │   │   ├── 1a-cursor-rules-wsl.md
│   │   │   ├── 1a-cursor-synthesis.md
│   │   │   ├── 1a-cursor-wsl-gitops.md
│   │   │   ├── 1a-ideal-dev-environment.md
│   │   │   ├── 1a-windows-cursor-dev.md
│   │   │   └── 1a-wsl2-cursor-dev.md
│   │   ├── IV/
│   │   │   ├── 4a-supabase-branch-first-detailed.md
│   │   │   ├── 4a-supabase-branch-first-workflow.md
│   │   │   └── 4a-supabase-environment-isolation.md
│   │   ├── VI/
│   │   │   └── 6a-vercel-supabase-integration.md
│   │   └── README.md
│   │
│   ├── S4EnvSnip/
│   │   └── README.md
│   │
│   ├── archive/
│   │   └── (empty)
│   │
│   ├── docs/
│   │   ├── cursor-ai-adaptation.md
│   │   ├── cursor-ai-integration.md
│   │   ├── p1-nextjs-saas-template-s4-analysis.md
│   │   ├── p1-nextjs-saas-template.md
│   │   ├── s4-cursor-plugin-architecture.md
│   │   ├── s4-directory-structure.md
│   │   ├── s4-saas-framework-evolution.md
│   │   ├── s4-solopreneur-quickstart.md
│   │   ├── s4-story-implementation-strategy.md
│   │   ├── s4-story-refinement-guide.md
│   │   └── smartstack-v4-spec.md
│   │
│   ├── training/
│   │   ├── advanced/
│   │   │   └── README.md
│   │   └── basics/
│   │       ├── prompts/
│   │       │   ├── README.md
│   │       │   ├── api-prompt.md
│   │       │   ├── component-prompt.md
│   │       │   └── test-prompt.md
│   │       ├── templates/
│   │       │   ├── README.md
│   │       │   ├── api-template.ts
│   │       │   ├── component-template.tsx
│   │       │   └── test-template.test.tsx
│   │       └── README.md
│   │
│   ├── verticals/
│   │   ├── NIL/
│   │   │   ├── sports-data-integration-strategy.md
│   │   │   └── user-story-suite.md
│   │   ├── TX-OG-ROYALTY/
│   │   │   ├── mvp-decomposition.md
│   │   │   ├── polygon-2-vertical-evolution.md
│   │   │   └── user-story-suite.md
│   │   ├── complexity-management.md
│   │   └── s4-complexity-metrics.md
│   │
│   └── thread-training-v0.md
│
├── p1/
│   └── US-ADR/
│       ├── ADRs/
│       │   └── template.md
│       ├── MVP-Scope/
│       │   ├── prompt-guide.md
│       │   └── v0-mvp-scope-primer.md
│       └── README.md
│
└── scripts/
    ├── automation/
    │   └── (empty)
    ├── maintenance/
    │   └── (empty)
    ├── setup/
    │   └── (empty)
    ├── validation/
    │   └── (empty)
    └── README.md

```

## Directory Structure Overview

### 1. Knowledge Base (`kb/`)
- **S4DevSnip/**: Development-related documentation snippets
  - **I/**: Cursor AI and development environment setup
  - **IV/**: Supabase integration and workflows
  - **VI/**: Vercel integration
- **S4EnvSnip/**: Environment setup documentation
- **docs/**: Core documentation and specifications
- **training/**: Training materials and templates
- **verticals/**: Vertical-specific implementations
  - **NIL/**: NIL (Name, Image, Likeness) vertical
  - **TX-OG-ROYALTY/**: Texas Oil & Gas Royalty vertical

### 2. Project 1 (`p1/`)
- **US-ADR/**: User Stories and Architecture Decision Records
  - **ADRs/**: Architecture Decision Records
  - **MVP-Scope/**: MVP scope documentation

### 3. Scripts (`scripts/`)
- **automation/**: Automation scripts
- **maintenance/**: Maintenance scripts
- **setup/**: Setup scripts
- **validation/**: Validation scripts

## Key Files

### Documentation
- `smartstack-v4-spec.md`: Core S4 specification
- `s4-saas-framework-evolution.md`: Framework evolution strategy
- `s4-complexity-metrics.md`: Complexity calculation methodology

### Vertical Implementation
- `verticals/NIL/user-story-suite.md`: NIL vertical user stories
- `verticals/TX-OG-ROYALTY/mvp-decomposition.md`: TX O&G MVP breakdown

### Development Guidelines
- `S4DevSnip/I/1a-cursor-synthesis.md`: Cursor AI integration synthesis
- `S4DevSnip/IV/4a-supabase-branch-first-workflow.md`: Supabase workflow

### Training Materials
- `training/basics/prompts/*.md`: Basic prompt templates
- `training/basics/templates/*.{ts,tsx}`: Code templates 