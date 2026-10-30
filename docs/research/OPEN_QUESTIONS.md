# Open research questions

Read this file at the start of every session. An open question never blocks other work. The content it affects shows its claim as Unverified or Hypothesis until the question is resolved.

Claim ids (`C-xxxx`) are in `src/data/research/claims.ts`. Source ids (`S-xxxx`) are in [SOURCES.md](SOURCES.md).

Statuses: `Open`, `Researching`, `Source unavailable`, `Conflicting evidence`, `Awaiting device verification`, `Resolved`.

---

## Q-0001: What sleep / RTC clock frequency do phone PMICs use?
- **Why it matters:** The Clocks lessons and the Chipset Explorer say "typically 32.768 kHz" (claim C-0002).
- **Concerns:** PMICs across all platforms.
- **Sources checked:** S-0010 (PinePhone v1.2b schematic), S-0011 (AXP803 datasheet).
- **Evidence so far:** one phone. The PinePhone has a 32.768 kHz crystal, X500, on the A64 SoC. C-0001 (2¹⁵ = 32,768) is arithmetic and doesn't say what phones use.
- **Conflicts:** none known.
- **Missing:** more published designs, ideally from mainstream platforms. One open-hardware phone can't support "typically".
- **Next action:** check other published schematics, such as the Librem 5.
- **Status:** Open
- **Last reviewed:** 2026-10-30

## Q-0002: How does probing affect a crystal oscillator, and how should a technician measure it?
- **Why it matters:** Lesson "Diagnosing clock and reset faults" says probe capacitance can shift or stop a crystal, and recommends a 10× probe or a buffered output (C-0003). Lesson "Crystals and oscillators" says load capacitance affects frequency (C-0004).
- **Concerns:** Pierce crystal oscillators in general.
- **Sources checked:** S-0021, S-0022, S-0023 and S-0024 (all read). S-0001, S-0002 and S-0003 are still unavailable, but no longer needed for this question.
- **Evidence so far:** passive probes add about 10 to 15 pF and can stop a crystal. Use a buffered output, or an active probe under 1 pF on the crystal pins. Load capacitance sets the exact frequency.
- **Conflicts:** S-0023 allows a 100× probe with AC coupling, while S-0024 rules out all passive probes on the crystal pins. The lessons recommend neither. These sources also corrected the old 10× probe advice.
- **Missing:** nothing needed for the lessons.
- **Next action:** none.
- **Status:** Resolved
- **Last reviewed:** 2026-10-30

## Q-0003: What soldering heat limits apply to crystals?
- **Why it matters:** The lesson says crystals can be damaged by too much heat (C-0005).
- **Concerns:** crystal parts generally. Limits are per part.
- **Sources checked:** S-0025 (Abracon ABS07) and S-0026 (Epson FC-135, which has no soldering section).
- **Evidence so far:** ABS07 follows JEDEC J-STD-020: lead-free peak 260 °C for thin packages, up to 30 s near peak, 2 reflow cycles.
- **Conflicts:** none known.
- **Missing:** limits for hand rework with hot air, and what damage excess heat actually causes.
- **Next action:** look for a crystal maker's handling or assembly notes.
- **Status:** Open
- **Last reviewed:** 2026-10-30

## Q-0004: Which platforms derive the sleep clock without a crystal, and which PMICs need it to finish power-on?
- **Why it matters:** The RTC lesson says both happen "on some designs" (C-0006).
- **Concerns:** specific PMICs; not identified.
- **Sources checked:** S-0010, S-0011.
- **Evidence so far:** indirect only. On the PinePhone the crystal is on the SoC, and a search of the AXP803 datasheet found no crystal or 32 kHz pin, so that PMIC isn't the sleep-clock source there.
- **Conflicts:** the RTC lesson says the sleep clock is part of the PMIC "on many designs". That remains unproven, and the PinePhone is a counter-example.
- **Missing:** PMIC documentation naming parts and their sleep-clock options.
- **Next action:** as Q-0001.
- **Status:** Open
- **Last reviewed:** 2026-10-30

## Q-0005: Is a shorted capacitor or load really more likely than a failed PMIC on a shorted rail?
- **Why it matters:** The Chipset Explorer PMIC block used to state this as fact. It now gives it as test-order advice (C-0007, Hypothesis).
- **Concerns:** general repair practice.
- **Sources checked:** none yet.
- **Evidence so far:** widely repeated by technicians. Repetition is not evidence.
- **Conflicts:** none known.
- **Missing:** repair statistics, or a documented repair dataset.
- **Next action:** once PhoneLab has real published repair cases, count outcomes. Until then the advice wording stands.
- **Status:** Open
- **Last reviewed:** 2026-10-26

## Q-0006: Which phones use eMMC and which use UFS?
- **Why it matters:** The Storage block says budget phones are "often said" to use eMMC (C-0008).
- **Concerns:** the smartphone market; changes over time.
- **Sources checked:** none yet.
- **Evidence so far:** JEDEC publishes both standards (not yet read for this question). Nothing on market split.
- **Conflicts:** none known.
- **Missing:** a reliable market source, or device teardown data across price tiers.
- **Next action:** low priority. The content already tells technicians to check the part on the board.
- **Status:** Open
- **Last reviewed:** 2026-10-26

## Q-0008: Platform-specific architecture for the Chipset Explorer
- **Why it matters:** The explorer lets you pick a platform family (MediaTek, Snapdragon, UNISOC, Exynos, Apple, Kirin, Tensor), but every family currently shows the generic conceptual diagram with a "no verified architecture" notice.
- **Concerns:** each platform family, then specific chipsets.
- **Sources checked:** none yet.
- **Evidence so far:** none.
- **Conflicts:** none known.
- **Missing:** for each family, vendor product briefs or datasheets (tier 2) showing what is integrated in the SoC (e.g. modem, PMIC pairing, Wi-Fi), and for a chipset → model → board revision, a legitimately published schematic or boardview (tier 4).
- **Next action:** start with vendor product pages for one current chipset per family; record each as a source with the integration facts it states. Add platform blocks only for facts read in those sources.
- **Status:** Open
- **Last reviewed:** 2026-10-26

## Q-0009: How does contamination affect high-value nodes and crystal circuits?
- **Why it matters:** The voltage divider lesson warns that residue can act like a resistor on high-value lines (C-0017, Hypothesis).
- **Concerns:** liquid-damaged boards generally: divider nodes, pull-ups and crystal pins.
- **Sources checked:** S-0021, S-0022, S-0023, S-0024 and S-0025 were searched. None covers contamination.
- **Evidence so far:** none directly. S-0008 covers metal migration, which needs voltage, water and halogen contamination, but that is about the resistor itself.
- **Conflicts:** none known.
- **Missing:** a vendor note on board leakage, or measurements from real liquid-damaged boards.
- **Next action:** look for 32 kHz crystal layout notes on flux and leakage. PhoneLab's own repair cases could also supply measurements.
- **Status:** Open
- **Last reviewed:** 2026-10-30

## Q-0007: Vendor documentation for Qualcomm EDL and MediaTek BROM download modes
- **Why it matters:** The SoC block names both modes as a way to separate SoC from storage faults (C-0009).
- **Concerns:** Qualcomm and MediaTek SoCs; which ones not established.
- **Sources checked:** none yet.
- **Evidence so far:** none read.
- **Conflicts:** none known.
- **Missing:** vendor documentation. It's likely not public, in which case reputable independent technical writing (tier 6) is the best available.
- **Next action:** search Qualcomm and MediaTek developer portals; then reputable security research that documents these modes reproducibly.
- **Status:** Open
- **Last reviewed:** 2026-10-26
