import type { ResearchClaim } from "@/lib/types";

/*
 * Claims behind PhoneLab's content, each with its evidence and confidence.
 * Lessons and explorer blocks reference these by id and show them as
 * citations. Never raise a claim's confidence without a source that was
 * actually read; open questions live in docs/research/OPEN_QUESTIONS.md.
 */

export const researchClaims: ResearchClaim[] = [
  {
    id: "C-0001",
    statement: "32,768 is 2¹⁵, so halving 32.768 kHz fifteen times gives exactly 1 Hz.",
    sources: [],
    appliesTo: "General principle (arithmetic)",
    establishes: "A mathematical identity: 2¹⁵ = 32,768. Anyone can check it by calculation.",
    evidence: "general-principle",
    confidence: "verified",
    researched: "2026-10-26",
    limitations: "Says nothing about which frequency a particular phone uses.",
  },
  {
    id: "C-0002",
    statement: "Phone sleep / RTC clocks typically run at 32.768 kHz.",
    sources: [],
    appliesTo: "Smartphones in general; not checked for any specific platform",
    establishes: "Nothing yet. No PMIC datasheet or schematic has been read.",
    evidence: "general-principle",
    confidence: "unverified",
    researched: "2026-10-26",
    limitations: "Widely stated, but repetition is not evidence. Needs a publicly available PMIC datasheet or a legitimate schematic.",
    questionId: "Q-0001",
  },
  {
    id: "C-0003",
    statement: "Connecting an oscilloscope probe to a crystal's pins adds capacitance that can shift or stop the oscillation; a low-capacitance probe or a buffered clock output is preferred.",
    sources: [],
    appliesTo: "General principle (Pierce crystal oscillators)",
    establishes: "Nothing yet. The application notes that cover this could not be read.",
    evidence: "general-principle",
    confidence: "unverified",
    researched: "2026-10-26",
    limitations: "Candidate sources S-0001, S-0002 and S-0003 were unavailable on 2026-10-26.",
    questionId: "Q-0002",
  },
  {
    id: "C-0004",
    statement: "The load capacitance a crystal sees affects its exact frequency.",
    sources: [],
    appliesTo: "General principle (parallel-resonant crystals)",
    establishes: "Nothing yet. Same candidate sources as C-0003.",
    evidence: "general-principle",
    confidence: "unverified",
    researched: "2026-10-26",
    limitations: "Candidate sources S-0001 and S-0002 were unavailable on 2026-10-26.",
    questionId: "Q-0002",
  },
  {
    id: "C-0005",
    statement: "Crystals can be damaged by excessive heat during soldering; follow the part's soldering profile.",
    sources: [],
    appliesTo: "General principle; limits vary by crystal part",
    establishes: "Nothing yet. No crystal datasheet soldering profile has been read.",
    evidence: "general-principle",
    confidence: "unverified",
    researched: "2026-10-26",
    limitations: "Each part's datasheet gives its own limits.",
    questionId: "Q-0003",
  },
  {
    id: "C-0006",
    statement: "Some platforms make the sleep clock without a dedicated 32.768 kHz crystal, and on some designs the PMIC needs the sleep clock before completing power-on.",
    sources: [],
    appliesTo: "Some platforms (which ones not established)",
    establishes: "Nothing yet.",
    evidence: "engineering-inference",
    confidence: "unverified",
    researched: "2026-10-26",
    limitations: "Needs PMIC documentation naming specific parts.",
    questionId: "Q-0004",
  },
  {
    id: "C-0007",
    statement: "On a shorted rail, a shorted capacitor or load is a more likely culprit than the PMIC itself.",
    sources: [],
    appliesTo: "General repair practice",
    establishes: "Nothing yet. Widely repeated by technicians; no repair statistics found.",
    evidence: "engineering-inference",
    confidence: "hypothesis",
    researched: "2026-10-26",
    limitations: "Content now gives it as advice on test order, not as a statistic.",
    questionId: "Q-0005",
  },
  {
    id: "C-0008",
    statement: "Budget phones commonly use eMMC storage; many mid- and high-end phones use UFS.",
    sources: [],
    appliesTo: "Smartphone market in general",
    establishes: "Nothing yet. JEDEC publishes both standards, but no source for which phones use which was read.",
    evidence: "engineering-inference",
    confidence: "unverified",
    researched: "2026-10-26",
    limitations: "Market patterns change over time; check the storage part on the specific board.",
    questionId: "Q-0006",
  },
  {
    id: "C-0009",
    statement: "Qualcomm SoCs offer an emergency download mode (EDL) and MediaTek SoCs a boot ROM mode (BROM) over USB.",
    sources: [],
    appliesTo: "Qualcomm and MediaTek platforms (which SoCs not established)",
    establishes: "Nothing yet. No vendor documentation was read.",
    evidence: "engineering-inference",
    confidence: "unverified",
    researched: "2026-10-26",
    limitations: "Vendor documentation for these modes is generally not public.",
    questionId: "Q-0007",
  },
];

const byId = new Map(researchClaims.map((c) => [c.id, c]));

export const getClaim = (id: string) => byId.get(id);
