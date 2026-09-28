---
format_version: 0.1.0
id: lesson-ee07be06ae2f
kind: lesson
title: "Gemini DOM haul duplicated every turn: selectors matched both user-query
  and nes"
record_status: active
created_at: 2026-09-09T00:00:00Z
updated_at: 2026-09-09T00:00:00Z
recorded_by:
  id: migration-import
  type: import
visibility: internal
relations: []
claims: []
data:
  context: Imported from workflow tracking gotchas[].
  problem: "Gemini DOM haul duplicated every turn: selectors matched both
    user-query and nested user-query-content (and model-response /
    message-content). Chrome headings 'You said' / truncated previews also
    survived into Markdown."
  resolution: Keep outermost nodes only, read the inner content node, strip
    said-headings, drop truncated preview blocks, dedupe adjacent same-role
    turns. v1.1.3.
  limits: Imported as a historical assertion. Verification was not recorded.
  generalization_status: observed
---


