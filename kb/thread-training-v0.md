# SmartStack v4 (S4) Thread Training Guide v0

## Introduction

Welcome to SmartStack v4 (S4) thread training. This guide will help you understand the basics of S4 and guide you to the appropriate training resources.

## Quick Start

1. **Review Core Concepts**
   - Branch-first development
   - Context management
   - Minimal viable testing
   - Streamlined deployment

2. **Check Environment**
   ```bash
   # Verify WSL2 setup
   wsl --version
   
   # Check Docker
   docker --version
   
   # Verify Node.js
   node --version
   ```

3. **Project Setup**
   ```bash
   # Clone repository
   git clone <repository-url>
   
   # Install dependencies
   npm install
   
   # Start development
   npm run dev
   ```

## Training Paths

### 1. Basic Training
Location: `s4/kb/training/basics/`
- Git fundamentals
- Environment setup
- Basic testing
- Deployment basics

### 2. Project-Specific Training
Location: `s4/p1/.cursor/`
- GameTime project setup
- Feature development
- Testing patterns
- Deployment workflow

### 3. Advanced Topics
Location: `s4/kb/training/advanced/`
- CI/CD optimization
- Security best practices
- Performance tuning
- Monitoring setup

## Next Steps

1. **Start with Basics**
   - Review `s4/kb/training/basics/README.md`
   - Complete environment setup
   - Run initial tests

2. **Project Setup**
   - Follow `s4/p1/.cursor/README.md`
   - Set up development environment
   - Create first feature branch

3. **Advanced Topics**
   - Explore `s4/kb/training/advanced/`
   - Implement CI/CD
   - Set up monitoring

## Resources

### Documentation
- S4 Specification: `s4/kb/docs/smartstack-v4-spec.md`
- Project Templates: `s4/kb/templates/`
- AI Prompts: `s4/kb/prompts/`

### Training Materials
- Basic Training: `s4/kb/training/basics/`
- Project Training: `s4/p1/.cursor/`
- Advanced Topics: `s4/kb/training/advanced/`

### Tools and Scripts
- Development Scripts: `s4/scripts/`
- AI Rules: `s4/kb/rules/`

## Getting Help

1. **Documentation**
   - Check relevant README files
   - Review S4 specification
   - Consult training materials

2. **AI Assistance**
   - Use Cursor AI with project context
   - Follow prompt templates
   - Review AI rules

3. **Community**
   - Check GitHub issues
   - Review pull requests
   - Consult documentation

## Success Criteria

1. **Environment**
   - Working WSL2 setup
   - Docker running
   - Node.js installed
   - Git configured

2. **Project**
   - Repository cloned
   - Dependencies installed
   - Tests passing
   - Development server running

3. **Knowledge**
   - Understanding of S4 concepts
   - Familiarity with tools
   - Basic workflow competence
   - Problem-solving ability

## Next Thread

After completing this guide:
1. Review the S4 specification
2. Start basic training
3. Set up your first project
4. Begin feature development

## AI Training Addendum

The following section provides an AI's perspective on learning and understanding S4, which can be helpful for new threads:

### AI Learning Summary

1. Core Concepts:
- Branch-first development
- Context management
- Minimal viable testing
- Streamlined deployment

2. Environment Requirements:
- WSL2 setup
- Docker
- Node.js
- Git

3. Project Structure:
- Training materials in `s4/kb/training/`
- Project-specific training in `s4/p1/.cursor/`
- Documentation in `s4/kb/docs/`
- Templates and prompts in `s4/kb/templates/` and `s4/kb/prompts/`

4. Training Paths:
- Basic Training (fundamentals)
- Project-Specific Training (GameTime project)
- Advanced Topics (CI/CD, security, performance)

## Key Documents for New Threads

The following documents are essential for new threads to understand and reference:

### Core Documentation
- `smartstack-v4-spec.md`: Core S4 specification
- `s4-saas-framework-evolution.md`: Framework evolution strategy
- `s4-complexity-metrics.md`: Complexity calculation methodology

### Development Guidelines
- `S4DevSnip/I/1a-cursor-synthesis.md`: Cursor AI integration synthesis
- `S4DevSnip/IV/4a-supabase-branch-first-workflow.md`: Supabase workflow

### Project Structure
- `p1/US-ADR/ADRs/`: Architecture Decision Records
- `p1/US-ADR/MVP-Scope/`: MVP scope documentation

### Training Materials
- `training/basics/prompts/*.md`: Basic prompt templates
- `training/basics/templates/*.{ts,tsx}`: Code templates

Note: While vertical-specific implementations exist (NIL, TX-OG-ROYALTY), new threads should focus on core S4 concepts and development patterns first. 