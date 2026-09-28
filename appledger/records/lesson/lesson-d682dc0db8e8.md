---
format_version: 0.1.0
id: lesson-d682dc0db8e8
kind: lesson
title: "Haul out missing on x.com/i/grok?conversation= until a hard refresh.
  @match was "
record_status: active
created_at: 2026-09-17T00:00:00Z
updated_at: 2026-09-17T00:00:00Z
recorded_by:
  id: migration-import
  type: import
visibility: internal
relations: []
claims: []
data:
  context: Imported from workflow tracking gotchas[].
  problem: Haul out missing on x.com/i/grok?conversation= until a hard refresh.
    @match was /i/grok* so Tampermonkey never injected after X SPA navigation
    from the timeline.
  resolution: Match x.com/* and twitter.com/*; keep shouldShow() gated to Grok
    routes. v1.1.4.
  limits: Imported as a historical assertion. Verification was not recorded.
  generalization_status: observed
---


