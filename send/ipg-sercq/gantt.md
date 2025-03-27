```mermaid
gantt
    title SERCQ Integration
    dateFormat YYYY:MM
    axisFormat %Y-%m
    tickInterval 1month
    section Fase 1
        A1.SDK        :a1, 2025-04, 2w
        A2.Progettazione Pilota    :2025-04, 20d
        A3.UX Design : after a1, 1M
        A4.Realizzazione : a2,after a1, 4M
        A5.Onboarding: after a2, 1M
        A6.Running :a3, after m2, 3M
        A7.FollowUp: a4,after a3, 1M
        UAT Ready : milestone,m1, 2025-07, 1M
        PROD Ready : milestone,m2, after m1, 1M
```