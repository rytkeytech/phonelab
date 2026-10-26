# Open research questions

Read this file at the start of every session. An open question never blocks other work. The content it affects shows its claim as Unverified or Hypothesis until the question is resolved.

Claim ids (`C-xxxx`) are in `src/data/research/claims.ts`. Source ids (`S-xxxx`) are in [SOURCES.md](SOURCES.md).

Statuses: `Open`, `Researching`, `Source unavailable`, `Conflicting evidence`, `Awaiting device verification`, `Resolved`.

---

## Q-0001: What sleep / RTC clock frequency do phone PMICs use?
- **Why it matters:** The Clocks lessons and the Chipset Explorer say "typically 32.768 kHz" (claim C-0002).
- **Concerns:** PMICs across all platforms.
- **Sources checked:** none yet.
- **Evidence so far:** none. C-0001 (2¹⁵ = 32,768) is arithmetic and doesn't say what phones use.
- **Conflicts:** none known.
- **Missing:** a publicly available datasheet for any phone PMIC, or a legitimately published schematic, showing the sleep-clock crystal or frequency.
- **Next action:** look for public PMIC datasheets (some vendors publish product briefs) and for openly licensed phone hardware (e.g. open-hardware phone projects).
- **Status:** Open
- **Last reviewed:** 2026-10-26

## Q-0002: How does probing affect a crystal oscillator, and how should a technician measure it?
- **Why it matters:** Lesson "Diagnosing clock and reset faults" says probe capacitance can shift or stop a crystal, and recommends a 10× probe or a buffered output (C-0003). Lesson "Crystals and oscillators" says load capacitance affects frequency (C-0004).
- **Concerns:** Pierce crystal oscillators in general.
- **Sources checked:** S-0001 (ST AN2867), S-0002 (Analog Devices / Maxim APP 58), S-0003 (Microchip AN2648). All unavailable on 2026-10-26 (timeouts, refused connection, HTTP 403).
- **Evidence so far:** none read. A search snippet and an ST community thread suggest AN2867 covers this, but snippets and forums are not evidence.
- **Conflicts:** none known.
- **Missing:** the text of AN2867 sections 3.1 and 3.3 and any measurement section, or equivalent vendor notes.
- **Next action:** retry the downloads from a different network, or ask the project owner to download the PDFs into `docs/research/inbox/` (not committed if their licence forbids redistribution).
- **Status:** Source unavailable
- **Last reviewed:** 2026-10-26

## Q-0003: What soldering heat limits apply to crystals?
- **Why it matters:** The lesson says crystals can be damaged by too much heat (C-0005).
- **Concerns:** crystal parts generally. Limits are per part.
- **Sources checked:** none yet.
- **Evidence so far:** none.
- **Conflicts:** none known.
- **Missing:** a crystal manufacturer datasheet with a reflow / hand-soldering profile (e.g. an Epson, Abracon, NDK or KDS 32.768 kHz part).
- **Next action:** fetch one or two public crystal datasheets and record the profile section.
- **Status:** Open
- **Last reviewed:** 2026-10-26

## Q-0004: Which platforms derive the sleep clock without a crystal, and which PMICs need it to finish power-on?
- **Why it matters:** The RTC lesson says both happen "on some designs" (C-0006).
- **Concerns:** specific PMICs; not identified.
- **Sources checked:** none yet.
- **Evidence so far:** none.
- **Conflicts:** none known.
- **Missing:** PMIC documentation naming parts and their sleep-clock options.
- **Next action:** as Q-0001.
- **Status:** Open
- **Last reviewed:** 2026-10-26

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
