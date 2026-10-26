# Research log

Newest first. One entry per session: what was attempted, what was found, and what changed in the content.

## 2026-10-26: Register created; crystal-oscillator sources attempted

**Attempted**
- ST AN2867 (S-0001): official PDF timed out twice. A mirror showed the title page and table of contents only, which confirms the document exists and its section titles, nothing more.
- Analog Devices APP 58 (S-0002): timed out; the PDF mirror refused the connection.
- Microchip AN2648 (S-0003): HTTP 403.
- Web search results pointed to an ST community thread about probe loading stopping a 32 kHz oscillator. Forum posts are not evidence; not recorded as a source.

**Found**
- Nothing that can be cited. Every crystal / RTC claim stays Unverified (C-0002 to C-0006). C-0001 (2¹⁵ = 32,768) is arithmetic and is the only claim rated Verified.

**Content changed** (from the Stage 1 audit, docs/audit/2026-10-26-stage-0-1.md)
- Explorer PMIC block: "a shorted capacitor or load is more common than a failed PMIC" became test-order advice (C-0007, Hypothesis).
- Explorer Storage block: eMMC/UFS market claim softened (C-0008).
- Explorer SoC block: EDL / BROM mention now cites C-0009 (Unverified).
- Lesson "Diode mode": two unsourced superlatives softened.
- Clocks lessons: citations added to every crystal, RTC and probing claim.
- Scenarios: over-confident feedback corrected (audit items A-01 to A-07); "died on the charger" gains a confirmation step.

**Questions opened:** Q-0001 to Q-0007.
