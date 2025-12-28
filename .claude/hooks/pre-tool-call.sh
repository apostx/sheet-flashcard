#!/bin/bash
#
# Pre-Tool-Call Hook - Enforces package validation, commit format, build verification
#

# Package Validation: Block unknown packages
if [[ "$COMMAND" =~ npm[[:space:]]+(install|add|i)[[:space:]]+([^-@][^[:space:]]+) ]]; then
    PACKAGE="${BASH_REMATCH[2]}"
    if ! grep -q "\"$PACKAGE\"" package.json 2>/dev/null; then
        echo "❌ BLOCKED: Package '$PACKAGE' not approved. Ask user first (popular? maintained? compatible? small?)"
        exit 1
    fi
fi

# Commit Format: Enforce conventional commits
if [[ "$COMMAND" =~ git[[:space:]]commit.*-m[[:space:]]+[\"']([^\"']+)[\"'] ]]; then
    MESSAGE="${BASH_REMATCH[1]}"
    if ! [[ "$MESSAGE" =~ ^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?:[[:space:]].+ ]]; then
        echo "❌ BLOCKED: Use format 'type: message' (feat/fix/docs/style/refactor/test/chore)"
        exit 1
    fi
fi

# Build Verification: Require build to pass before commit/push
if [[ "$COMMAND" =~ git[[:space:]]+(commit|push) ]]; then
    npm run build > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "❌ BLOCKED: Build failed. Fix errors first."
        exit 1
    fi
    echo "✅ Build passed"
fi

exit 0
