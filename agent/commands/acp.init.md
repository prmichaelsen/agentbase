# Command: init

> **🤖 Agent Directive**: If you are reading this file, the command `@acp.init` has been invoked. Follow the steps below to execute this command.

**Namespace**: acp
**Version**: 1.1.0
**Created**: 2026-02-16
**Last Updated**: 2026-02-17
**Status**: Active

---

**Purpose**: Initialize agent context by loading all documentation, reviewing source code, and preparing for work
**Category**: Workflow
**Frequency**: Once Per Session

---

## What This Command Does

This command performs a comprehensive initialization of the agent's context for working on an ACP-structured project. It checks for ACP updates, validates project structure, reads all documentation in the `agent/` directory, reviews key source files to understand the current implementation, assesses project health, updates any stale documentation, and refreshes progress tracking.

Use this command at the start of each work session to ensure you have complete project context. It's the most thorough way to get up to speed on a project, understanding both what's documented and what's actually implemented in the code.

Unlike `@acp.status` which only reads progress.yaml, or `@acp.proceed` which focuses on a single task, `@acp.init` provides comprehensive context loading across all project documentation and source code. It's designed to answer: "What is this project? Where does it stand? What needs to be done?"

---

## Prerequisites

- [ ] ACP installed in project (AGENT.md and agent/ directory exist)
- [ ] Project has source code to review
- [ ] Git repository initialized (optional, for update checking)

---

## Options

This command supports optional flags to customize initialization behavior:

- `--skip-updates` - Skip ACP update check (faster initialization)
- `--skip-source` - Skip source code review (documentation only)
- `--quick` - Quick mode: skip updates and minimize source review
- `--deep` - Deep mode: review all source files, not just key files
- `--report` - Generate detailed initialization report saved to `agent/reports/`
- `--fix` - Automatically fix common issues (missing files, broken links)

**Default behavior**: Standard initialization with update check and key source file review

---

## Steps

### 1. Check for ACP Updates

Check if newer version of ACP is available.

**Actions**:
- Run `./agent/scripts/check-for-updates.sh` if it exists
- Report if updates are available
- Show what changed via CHANGELOG
- Ask if user wants to update (don't auto-update)
- Skip if `--skip-updates` or `--quick` flag provided

**Expected Outcome**: User informed of ACP version status

### 1.5. Validate ACP Structure

Verify ACP directory structure is complete and valid.

**Actions**:
- Check for required directories (design/, milestones/, tasks/, patterns/, commands/)
- Verify AGENT.md exists and is readable
- Check for progress.yaml (create from template if missing)
- Validate progress.yaml structure
- Check for broken links between documents
- Identify missing .gitkeep files
- Report any structural issues
- If `--fix` flag provided, automatically fix common issues

**Expected Outcome**: ACP structure validated, issues identified or fixed

### 2. Read All Agent Documentation

Load complete context from the agent/ directory.

**Actions**:
- Read `agent/progress.yaml` for current status
- Read `agent/design/requirements.md` for project goals
- Read all design documents in `agent/design/`
- Read current milestone document
- Read all task documents (focus on current/upcoming)
- Read relevant pattern documents in `agent/patterns/`
- Note any missing or incomplete documentation

**Expected Outcome**: Complete documentation context loaded

### 3. Identify Key Source Files

Determine which source files are most important to review.

**Actions**:
- Check project type (package.json, requirements.txt, go.mod, etc.)
- Identify main entry points (src/index.ts, main.py, cmd/main.go, etc.)
- Note key configuration files (tsconfig.json, .env.example, etc.)
- Identify core business logic files
- List test files

**Expected Outcome**: Key source files identified for review

### 4. Review Key Source Files

Read important source files to understand current implementation.

**Actions**:
- Read main entry point files
- Review core business logic
- Check configuration files
- Note any TODOs or FIXMEs
- Understand current architecture
- Compare implementation with design documents
- If `--deep` flag: review all source files, not just key files
- If `--skip-source` or `--quick` flag: skip this step

**Expected Outcome**: Current implementation understood

### 4.5. Analyze Project Health

Assess overall project health and identify issues.

**Actions**:
- Check for uncommitted changes (git status)
- Identify stale branches
- Count TODO/FIXME comments in code
- Check for outdated dependencies (package.json, requirements.txt, etc.)
- Verify build configuration is valid
- Check for missing test coverage
- Identify potential security issues (.env files committed, etc.)
- Report health metrics

**Expected Outcome**: Project health assessed, issues identified

### 5. Identify Documentation Drift

Compare documentation with actual implementation.

**Actions**:
- Check if design documents match implementation
- Note any undocumented features in code
- Identify outdated documentation
- Flag missing documentation
- List discrepancies

**Expected Outcome**: Documentation gaps identified

### 6. Update Stale Documentation

Refresh outdated documentation to match current state.

**Actions**:
- Update design documents if implementation differs
- Update task documents if steps have changed
- Add notes about discovered issues
- Update progress.yaml with current understanding
- Document any new patterns found in code

**Expected Outcome**: Documentation synchronized with code

### 7. Update Progress Tracking

Refresh progress.yaml with latest status.

**Actions**:
- Verify current milestone is correct
- Confirm current task is accurate
- Update progress percentages if needed
- Add recent work entry for initialization
- Update next steps based on current state
- Note any new blockers discovered

**Expected Outcome**: Progress tracking is current and accurate

### 8. Generate Initialization Report

Provide comprehensive status report.

**Actions**:
- Summarize project status
- Show current milestone and progress
- Identify current task
- List recent accomplishments
- Highlight next steps
- Note any blockers or concerns
- Provide recommendations
- Show project health metrics
- List documentation gaps
- Highlight TODOs and FIXMEs
- Suggest priority actions
- If `--report` flag: save detailed report to `agent/reports/init-{date}.md`

**Expected Outcome**: User has complete context and knows what to do next

### 9. Suggest Quick Wins

Identify easy improvements that can be made immediately.

**Actions**:
- Identify quick documentation fixes
- Suggest simple code improvements
- Highlight low-hanging fruit tasks
- Recommend immediate actions
- Prioritize by impact and effort

**Expected Outcome**: User has actionable quick wins to consider

---

## Verification

- [ ] ACP update check completed
- [ ] ACP structure validated
- [ ] All agent/ files read successfully
- [ ] Key source files identified and reviewed
- [ ] Project health assessed
- [ ] Documentation drift identified (if any)
- [ ] Stale documentation updated
- [ ] progress.yaml updated with current status
- [ ] Comprehensive status report provided
- [ ] Next steps clearly identified
- [ ] Quick wins identified
- [ ] No errors encountered during initialization
- [ ] Initialization report generated (if --report flag used)

---

## Expected Output

### Files Modified
- `agent/progress.yaml` - Updated with current status, recent work entry added
- Design/task documents - Updated if stale (as needed)
- `agent/reports/init-{date}.md` - Detailed report (if --report flag used)

### Console Output
```
🚀 Initializing Agent Context

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Checking for ACP updates...
  Current version: 1.0.3
  Status: Up to date

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Validating ACP Structure...
  ✓ AGENT.md exists
  ✓ agent/ directory structure valid
  ✓ progress.yaml exists and valid
  ✓ All required directories present
  ✓ No broken links detected
  ℹ️  Structure is healthy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Reading Agent Documentation...
  ✓ Read agent/progress.yaml
  ✓ Read agent/design/requirements.md
  ✓ Read agent/design/acp-commands-design.md
  ✓ Read agent/milestones/milestone-1-acp-commands.md
  ✓ Read agent/milestones/milestone-2-acp-commands-advanced.md
  ✓ Read agent/tasks/task-1-commands-infrastructure.md
  ✓ Read agent/tasks/task-2-workflow-commands.md
  ✓ Read agent/tasks/task-3-version-commands.md
  ✓ Read agent/tasks/task-4-update-documentation.md
  
  Total: 9 agent files read

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Reviewing Source Files...
  ✓ Read AGENT.md (1,055 lines)
  ✓ Read README.md (200 lines)
  ✓ Read CHANGELOG.md (50 lines)
  ✓ Read scripts/install.sh
  ✓ Read scripts/update.sh
  ✓ Read agent/commands/command.template.md
  ✓ Read agent/commands/acp.status.md
  ✓ Read agent/commands/acp.proceed.md
  
  Total: 8 source files reviewed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏥 Project Health Check...
  ✓ Git repository clean (no uncommitted changes)
  ✓ Build configuration valid
  ⚠️  Found 12 TODO comments in source code
  ⚠️  Found 3 FIXME comments in source code
  ✓ No .env files in git
  ✓ Dependencies up to date
  
  Health Score: 85/100 (Good)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Documentation Analysis...
  ✓ Design documents match implementation
  ✓ Task documents are current
  ⚠️  Task-2 document references old nested structure (acp/init.md)
  ✓ Progress tracking is accurate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Updating Documentation...
  ✓ Updated progress.yaml with initialization entry
  ℹ️  No other updates needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Project Status

Project: agent-context-protocol (v1.0.3)
Status: in_progress
Started: 2026-02-16

Current Milestone: M1 - ACP Commands Infrastructure
Progress: 33% (1/4 tasks completed)
Status: in_progress

Current Task: task-2 - Implement Core Workflow Commands
Status: in_progress (2/3 commands complete)
File: agent/tasks/task-2-workflow-commands.md

Recent Work (2026-02-16):
  - ✅ Created comprehensive design document
  - ✅ Implemented @acp.status command
  - ✅ Implemented @acp.proceed command
  - 📋 Next: Complete workflow commands (init)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Next Steps:
  1. Complete task-2: Implement acp.init.md command
  2. Start task-3: Implement version commands
  3. Complete milestone-1: All 6 core commands

⚠️  Current Blockers: None

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Quick Wins Available:
  1. Fix task-2 reference to old structure (2 min)
  2. Address 3 FIXME comments in auth module (15 min)
  3. Add missing test for error handling (20 min)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Initialization Complete!
Ready to proceed with task-2 completion.

💾 Detailed report saved to: agent/reports/init-2026-02-16.md
```

### Status Update
- Recent work entry added to progress.yaml
- Context fully loaded
- Ready to work

---

## Examples

### Example 1: Starting Fresh Session

**Context**: Beginning work on a project for the first time today

**Invocation**: `@acp.init`

**Result**: Checks for updates, validates structure, reads all 15 agent files, reviews 10 source files, checks project health, updates progress tracking, reports you're on milestone 2 task 5, identifies 3 quick wins, ready to continue

### Example 2: Quick Initialization

**Context**: Need to quickly check status without full review

**Invocation**: `@acp.init --quick`

**Result**: Skips update check and source review, loads documentation only, shows current status in 5 seconds

### Example 3: Deep Analysis

**Context**: Returning after long break, need complete understanding

**Invocation**: `@acp.init --deep --report`

**Result**: Full context reload with all source files reviewed, discovers 3 new commits since last session, generates detailed 10-page report saved to agent/reports/, shows current status (milestone 3, 80% complete), identifies next task and 5 quick wins

### Example 4: Fix Mode

**Context**: ACP structure has issues (missing files, broken links)

**Invocation**: `@acp.init --fix`

**Result**: Validates structure, automatically fixes 3 broken links, creates missing .gitkeep files, updates progress.yaml from template, reports structure is now healthy

### Example 5: New Agent Session

**Context**: Different AI agent picking up the project

**Invocation**: `@acp.init`

**Result**: Complete onboarding - validates structure, reads all documentation, understands architecture from source code, assesses project health, gets current status, identifies quick wins, ready to contribute immediately

---

## Related Commands

- [`@acp.proceed`](acp.proceed.md) - Use after init to start working on current task
- [`@acp.status`](acp.status.md) - Use for quick status check without full initialization
- [`@acp.sync`](acp.sync.md) - Use to sync documentation after code changes
- [`@acp.version-check-for-updates`](acp.version-check-for-updates.md) - Part of init process

---

## Troubleshooting

### Issue 1: No agent/ directory found

**Symptom**: Error message "agent/ directory not found"

**Cause**: ACP not installed in this project

**Solution**: Install ACP first using the installation script from the ACP repository

### Issue 2: Update check script not found

**Symptom**: Warning "check-for-updates.sh not found"

**Cause**: Older ACP installation without update scripts

**Solution**: This is non-critical, continue with initialization. Consider updating ACP to latest version.

### Issue 3: No source files found

**Symptom**: Warning "No source files to review"

**Cause**: Project is new or source code is in unexpected location

**Solution**: This is fine for new projects. Specify source file locations if they're in non-standard directories.

### Issue 4: progress.yaml doesn't exist

**Symptom**: Error "Cannot read progress.yaml"

**Cause**: Progress tracking not initialized yet

**Solution**: Run `@acp.init --fix` to automatically create from template, or manually: `cp agent/progress.template.yaml agent/progress.yaml`, then run `@acp.init` again

### Issue 5: Broken links in documentation

**Symptom**: Warning "Found broken links in documentation"

**Cause**: Documents reference files that don't exist or moved

**Solution**: Run `@acp.init --fix` to automatically fix common link issues, or manually update links in affected documents

### Issue 6: Initialization too slow

**Symptom**: Takes 60+ seconds to initialize

**Cause**: Large project with many files

**Solution**: Use `@acp.init --quick` for fast initialization, or `@acp.init --skip-source` to skip source code review

---

## Security Considerations

### File Access
- **Reads**: All files in `agent/` directory, key source files throughout project, AGENT.md, README.md, CHANGELOG.md
- **Writes**: `agent/progress.yaml` (updates status), design/task documents (if stale), `agent/reports/` (if --report flag)
- **Executes**: `./agent/scripts/check-for-updates.sh` (if exists)

### Network Access
- **APIs**: None directly (update check script may access GitHub)
- **Repositories**: Update check script accesses GitHub repository

### Sensitive Data
- **Secrets**: Never reads .env files or credential files
- **Credentials**: Does not access any credentials

---

## Notes

- This is the most comprehensive ACP command - expect 30-60 seconds for large projects (5-10 seconds with --quick)
- Reads many files to build complete context
- Updates documentation if drift is detected
- Safe to run multiple times (idempotent)
- Replaces the old "AGENT.md: Initialize" prompt
- Consider running at start of each session for best results
- Can be run mid-session if you need to refresh context
- Use `--quick` for fast status check
- Use `--deep` for thorough analysis after long breaks
- Use `--fix` to automatically repair common issues
- Use `--report` to generate detailed initialization report for stakeholders
- Project health check helps identify technical debt and issues
- Quick wins feature helps prioritize immediate improvements

---

**Namespace**: acp
**Command**: init
**Version**: 1.1.0
**Created**: 2026-02-16
**Last Updated**: 2026-02-17
**Status**: Active
**Compatibility**: ACP 1.0.3+
**Author**: ACP Project
