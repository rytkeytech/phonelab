# Research log

Newest first. One entry per session: what was attempted, what was found, and what changed in the content.

## 2026-10-30: Resistors, logic levels, LDOs and crystals

**Read**
- S-0004 to S-0027, as actual PDF text or pages, not search snippets. Schematic connections on S-0010 were checked on rendered page images, because PDF text from a schematic comes out jumbled. That check corrected two first readings: the touch I²C pull-ups are 2 kΩ, and R702 is on the eMMC clock line.

**Still unavailable**
- S-0001, S-0002 and S-0003 failed again. S-0028 and S-0029 failed too (HTTP 403). None of them is cited.

**Found**
- The PinePhone v1.2b schematic (S-0010) and its PMIC datasheet (S-0011) give the project its first real phone design to cite. Values from them are labelled as applying to that phone only.
- Conflict resolved against our content: the old advice to use a 10× probe on a crystal was wrong. S-0023 says an ×10 probe can stop oscillation, and S-0024 rules out passive probes on the crystal pins.
- S-0023 and S-0024 disagree about 100× passive probes. The lessons recommend neither.

**Content changed**
- New lessons: resistors, series and parallel, voltage dividers, logic levels, pull resistors, LDO regulators, crystals on the board. New claims C-0010 to C-0037.
- Passive-probe advice corrected in lesson "Diagnosing clock and reset faults", its quiz and flow diagram, and the no-Wi-Fi guided case.
- C-0003 and C-0004 raised to Verified, C-0002 and C-0005 to Hypothesis, each from sources read.

**Questions:** Q-0002 resolved. Q-0001, Q-0003 and Q-0004 updated. Q-0009 opened.

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
