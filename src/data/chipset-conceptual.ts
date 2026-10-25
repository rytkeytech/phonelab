import type { ChipsetBlock, ChipsetConnection, SignalType } from "@/lib/types";

/*
 * CONCEPTUAL smartphone architecture.
 *
 * This describes how the major blocks of a typical smartphone relate to each
 * other. It is NOT the circuit of any particular phone: real boards differ in
 * which ICs exist, which buses are used, and how power rails are arranged.
 * Device-specific values (voltages, test points, pinouts) must come from that
 * model's documentation and belong in verified repair cases, not here.
 */

export const signalTypes: Record<SignalType, { label: string; description: string }> = {
  power: { label: "Power", description: "Supply rails from the PMIC or charger" },
  data: { label: "Data", description: "High-speed data interfaces" },
  control: { label: "Control", description: "Low-speed configuration buses" },
  clock: { label: "Clock & reset", description: "Timing references and reset signals" },
};

export const chipsetBlocks: ChipsetBlock[] = [
  {
    id: "soc",
    name: "SoC / Application Processor",
    label: "SoC",
    category: "core",
    summary:
      "The main processor package. It runs the operating system and controls almost every other block on the board.",
    functions: [
      "CPU and GPU cores that run Android or iOS and apps",
      "Memory controller that talks to RAM",
      "Storage controller that loads the bootloader and OS",
      "Display, camera and audio interfaces",
      "On many platforms, the cellular modem (baseband) is integrated in the same package",
      "A boot ROM that runs first at power-on and can expose an emergency download mode over USB",
    ],
    dependsOn: ["pmic", "clock", "ram", "storage"],
    symptoms: [
      "Dead phone with abnormal current draw on a DC power supply",
      "Stuck in boot loop or stops at a fixed point during boot",
      "Overheating near the SoC area",
      "A short circuit on one of the SoC's supply rails",
    ],
    diagnosis: [
      "Treat the SoC as the last suspect. First confirm the PMIC rails, clocks and reset are present.",
      "Watch the current draw on a DC power supply while pressing power, and compare the pattern with a known-good board of the same model.",
      "Check whether the boot ROM enumerates on USB (for example Qualcomm EDL or MediaTek BROM modes). This helps separate SoC faults from storage or firmware faults.",
      "For a shorted rail, find the shorted component with thermal imaging or rosin before suspecting the SoC itself.",
    ],
    caution:
      "SoC reballing or replacement is high-risk and often impossible on modern devices because of security pairing.",
    box: { x: 380, y: 200, w: 240, h: 220 },
  },
  {
    id: "pmic",
    name: "PMIC (Power Management IC)",
    label: "PMIC",
    category: "power",
    summary:
      "Turns battery power into the many regulated supply rails the phone needs and switches them on in the correct order.",
    functions: [
      "Generates multiple supply rails using buck converters and LDO regulators",
      "Runs the power-on sequence when the power key is pressed",
      "Holds the SoC in reset until rails are stable, then releases it",
      "Often contains the real-time clock (RTC) and power-key detection",
      "Some platforms use a main PMIC plus one or more secondary PMICs",
    ],
    dependsOn: ["charging", "clock"],
    symptoms: [
      "Completely dead: no current draw when pressing power",
      "Current rises to a fixed value and stays there",
      "Phone heats up while switched off",
      "Random shutdowns or restarts",
    ],
    diagnosis: [
      "Confirm battery supply reaches the PMIC (follow the battery line from the connector using the schematic).",
      "Check the power-key line and confirm it changes state when pressed.",
      "Measure each output rail and compare against the schematic or a known-good board of the same model. Never assume a value from another phone.",
      "In diode mode, compare readings on the rail capacitors with a known-good board to find shorts.",
    ],
    box: { x: 40, y: 260, w: 180, h: 110 },
  },
  {
    id: "charging",
    name: "Battery & Charging",
    label: "Battery / Charging",
    category: "power",
    summary:
      "Brings power in from the USB port, charges the battery, and protects the board against over-voltage.",
    functions: [
      "Charger IC that controls charging current and voltage",
      "Over-voltage protection (OVP) between the USB port and the charger, on many designs",
      "Battery connector, including a temperature or ID line on many batteries",
      "Fast-charge negotiation with the charger (protocol varies by brand)",
      "Configured by the SoC when the phone is on; many charger ICs can also charge with the phone switched off",
    ],
    dependsOn: [],
    symptoms: [
      "Not charging, or shows charging but percentage doesn't rise",
      "Phone only works while connected to a charger",
      "Battery not detected or shows a wrong temperature",
      "Charging port heats up",
    ],
    diagnosis: [
      "Start with the cheapest checks: cable, charger, port debris, and a known-good battery.",
      "Use a USB ammeter to watch charging current behaviour.",
      "Check the OVP and charger IC areas for liquid damage or shorts.",
      "Check the battery connector lines against the schematic, including the temperature/ID line.",
    ],
    box: { x: 40, y: 150, w: 180, h: 64 },
  },
  {
    id: "clock",
    name: "Clocks & Reset",
    label: "Clocks & Reset",
    category: "timing",
    summary:
      "Crystals and oscillators give the board its timing. Reset signals hold chips still until power is stable. They are grouped here as one concept, but they are separate parts on a real board.",
    functions: [
      "Sleep / RTC crystal, typically 32.768 kHz, often connected to the PMIC",
      "Main reference clock for the SoC and RF. The frequency depends on the platform, so check the schematic.",
      "Power-on reset: released by the PMIC when rails are ready",
      "Watchdog resets that restart the system if software hangs",
    ],
    dependsOn: ["pmic"],
    symptoms: [
      "Dead phone that briefly draws current and then drops back",
      "Boots but has no network (RF reference clock problem)",
      "Clock or date resets after power loss",
    ],
    diagnosis: [
      "Inspect crystals for cracks, corrosion or liquid damage.",
      "A multimeter cannot confirm a clock is oscillating correctly. Use an oscilloscope where possible.",
      "Check the reset line's state against the schematic during power-on.",
    ],
    box: { x: 40, y: 430, w: 180, h: 64 },
  },
  {
    id: "ram",
    name: "RAM (LPDDR)",
    label: "RAM",
    category: "memory",
    summary:
      "Fast working memory. On many phones it is stacked directly on top of the SoC (package-on-package) or combined with storage in one chip.",
    functions: [
      "Holds the running OS and apps",
      "Trained and initialised early in boot by the bootloader",
      "May be package-on-package (PoP) on the SoC, separate, or combined with storage (eMCP / uMCP)",
    ],
    dependsOn: ["pmic", "soc"],
    symptoms: [
      "Boot loop or stuck on the logo",
      "Random freezes or restarts, especially when warm",
      "Dead after a drop (cracked solder joints under PoP packages)",
      "Flashing tool reports a DRAM/memory initialisation error",
    ],
    diagnosis: [
      "Confirm the RAM supply rails are present (values from the model's schematic).",
      "Ask about drop and liquid history.",
      "Read flashing-tool logs; some tools report memory initialisation failures.",
      "Rework of PoP memory is an advanced, high-risk repair.",
    ],
    box: { x: 330, y: 520, w: 150, h: 64 },
  },
  {
    id: "storage",
    name: "Storage (eMMC / UFS)",
    label: "Storage",
    category: "memory",
    summary:
      "Permanent storage for the bootloader, operating system and user data.",
    functions: [
      "eMMC on many budget phones, UFS on most mid- and high-end phones",
      "Stores boot partitions, OS, and user data",
      "Sometimes combined with RAM in one package (eMCP / uMCP)",
    ],
    dependsOn: ["pmic", "soc"],
    symptoms: [
      "Stuck on logo or boots straight into fastboot / download mode",
      "Flashing tool cannot detect or read the storage",
      "Data loss, corrupted apps, or read/write errors",
    ],
    diagnosis: [
      "Separate software from hardware first. Try a correct firmware flash before replacing parts.",
      "Check the storage supply rails against the schematic.",
      "In boot ROM mode, check whether the flashing tool can identify the storage chip.",
    ],
    caution:
      "On many modern devices storage is cryptographically paired with the SoC. Replacement may need device-specific programming or may not be possible, and user data is usually unrecoverable.",
    box: { x: 520, y: 520, w: 150, h: 64 },
  },
  {
    id: "display",
    name: "Display & Backlight",
    label: "Display",
    category: "peripheral",
    summary:
      "The screen panel, its connector, and the circuits that power it (backlight driver for LCD, dedicated supplies for OLED).",
    functions: [
      "Receives image data from the SoC, typically over MIPI DSI",
      "LCD panels need a backlight driver; OLED panels need their own supply rails",
      "Connector usually has ESD protection and filters nearby",
    ],
    dependsOn: ["soc", "pmic"],
    symptoms: [
      "Phone rings or vibrates but the screen stays black",
      "Very faint image visible under a torch (backlight fault on LCD)",
      "Lines, flicker, or colour faults",
    ],
    diagnosis: [
      "Always test with a known-good screen first.",
      "Inspect the connector and nearby filters for corrosion or damage.",
      "Check the display / backlight supply circuits against the schematic.",
    ],
    box: { x: 300, y: 40, w: 160, h: 64 },
  },
  {
    id: "touch",
    name: "Touch Controller",
    label: "Touch",
    category: "peripheral",
    summary:
      "Reads finger positions. The controller may sit on the screen's flex cable or on the main board, depending on the design.",
    functions: [
      "Scans the touch sensor and reports positions to the SoC",
      "Usually a low-speed bus (commonly I²C or SPI) plus an interrupt line",
    ],
    dependsOn: ["soc", "pmic"],
    symptoms: [
      "Touch not responding at all",
      "Ghost touches or only part of the screen responds",
      "Touch fails only while charging",
    ],
    diagnosis: [
      "Test with a known-good screen assembly first.",
      "Touch that fails only on a charger often points to a noisy charger or cable.",
      "Check connector pins and interface lines for continuity using the schematic.",
    ],
    box: { x: 500, y: 40, w: 160, h: 64 },
  },
  {
    id: "cameras",
    name: "Cameras & Flash",
    label: "Cameras",
    category: "peripheral",
    summary:
      "Camera modules send image data to the SoC's image processor. Each module needs several supply rails.",
    functions: [
      "Image data to the SoC, typically over MIPI CSI",
      "Multiple supplies per module (analog, digital, I/O)",
      "Flash / torch LED driver",
    ],
    dependsOn: ["soc", "pmic"],
    symptoms: [
      "Camera app fails to open or shows a black image",
      "One lens missing (e.g., wide works, ultra-wide doesn't)",
      "Flashlight not working",
    ],
    diagnosis: [
      "Swap in a known-good module of the same part number.",
      "Inspect the connector and nearby filters for damage.",
      "Check module supplies against the schematic.",
    ],
    caution:
      "On some devices camera modules are paired to the board, so a swapped module may show warnings or lose features.",
    box: { x: 760, y: 40, w: 180, h: 64 },
  },
  {
    id: "connectivity",
    name: "Connectivity (RF, Wi-Fi, BT, GNSS)",
    label: "Connectivity",
    category: "peripheral",
    summary:
      "Cellular RF transceiver and power amplifiers, Wi-Fi/Bluetooth, GNSS, NFC and SIM. Exactly how these split across chips varies a lot by platform.",
    functions: [
      "RF transceiver, power amplifiers and antenna switches for cellular",
      "Wi-Fi / Bluetooth chip (separate or integrated depending on platform)",
      "GNSS, NFC and the SIM reader",
      "Needs an accurate reference clock",
    ],
    dependsOn: ["soc", "pmic", "clock"],
    symptoms: [
      "No service or very weak signal",
      "Wi-Fi switch greyed out / won't turn on",
      "SIM not detected",
    ],
    diagnosis: [
      "Rule out software, network settings and the SIM card itself first.",
      "Inspect antenna cables, contacts and the SIM reader.",
      "A Wi-Fi option that won't turn on often relates to the Wi-Fi IC, its supplies, or its clock. Confirm using the schematic.",
    ],
    caution:
      "Never alter a device's IMEI. It is illegal in many countries.",
    box: { x: 760, y: 200, w: 180, h: 64 },
  },
  {
    id: "audio",
    name: "Audio (Codec & Amplifiers)",
    label: "Audio",
    category: "peripheral",
    summary:
      "Converts between digital audio and the speaker, earpiece and microphones.",
    functions: [
      "Audio codec (sometimes integrated in the PMIC on some platforms)",
      "Speaker amplifier(s)",
      "Microphones, earpiece, and headphone path where present",
    ],
    dependsOn: ["soc", "pmic"],
    symptoms: [
      "No sound from the loudspeaker",
      "Other people can't hear you on calls (microphone)",
      "Distorted or crackling sound",
    ],
    diagnosis: [
      "Test with Bluetooth or headphones to see if the problem is in one audio path only.",
      "Check speaker / earpiece continuity with a multimeter.",
      "Check the amplifier area and its supply against the schematic.",
    ],
    box: { x: 760, y: 330, w: 180, h: 64 },
  },
];

// Shared bus routes keep power lines in the gaps between blocks.
const pmicTopBus: [number, number][] = [
  [220, 280],
  [250, 280],
  [250, 130],
];
const pmicBottomBus: [number, number][] = [
  [220, 355],
  [250, 355],
  [250, 480],
];

export const chipsetConnections: ChipsetConnection[] = [
  // Power
  { id: "p-charging-pmic", from: "charging", to: "pmic", type: "power", label: "Battery supply into the PMIC", points: [[130, 214], [130, 260]] },
  { id: "p-pmic-soc", from: "pmic", to: "soc", type: "power", label: "Several SoC core and I/O rails", points: [[220, 340], [380, 340]] },
  { id: "p-pmic-display", from: "pmic", to: "display", type: "power", label: "Display supplies", points: [...pmicTopBus, [340, 130], [340, 104]] },
  { id: "p-pmic-touch", from: "pmic", to: "touch", type: "power", label: "Touch controller supply", points: [...pmicTopBus, [620, 130], [620, 104]] },
  { id: "p-pmic-cameras", from: "pmic", to: "cameras", type: "power", label: "Camera module supplies", points: [...pmicTopBus, [900, 130], [900, 104]] },
  { id: "p-pmic-connectivity", from: "pmic", to: "connectivity", type: "power", label: "RF and Wi-Fi supplies", points: [...pmicTopBus, [720, 130], [720, 250], [760, 250]] },
  { id: "p-pmic-audio", from: "pmic", to: "audio", type: "power", label: "Audio codec / amplifier supplies", points: [...pmicTopBus, [720, 130], [720, 380], [760, 380]] },
  { id: "p-pmic-ram", from: "pmic", to: "ram", type: "power", label: "Memory supply rails", points: [...pmicBottomBus, [360, 480], [360, 520]] },
  { id: "p-pmic-storage", from: "pmic", to: "storage", type: "power", label: "Storage supply rails", points: [...pmicBottomBus, [640, 480], [640, 520]] },

  // Data
  { id: "d-soc-display", from: "soc", to: "display", type: "data", label: "Display interface (typically MIPI DSI)", points: [[440, 200], [440, 104]] },
  { id: "d-soc-touch", from: "soc", to: "touch", type: "data", label: "Touch data (commonly I²C or SPI + interrupt)", points: [[560, 200], [560, 104]] },
  { id: "d-soc-cameras", from: "soc", to: "cameras", type: "data", label: "Camera interface (typically MIPI CSI)", points: [[600, 200], [600, 165], [840, 165], [840, 104]] },
  { id: "d-soc-connectivity", from: "soc", to: "connectivity", type: "data", label: "Baseband, RF and Wi-Fi links (vary by platform)", points: [[620, 225], [760, 225]] },
  { id: "d-soc-audio", from: "soc", to: "audio", type: "data", label: "Digital audio (e.g., I²S/TDM or vendor-specific)", points: [[620, 360], [760, 360]] },
  { id: "d-soc-ram", from: "soc", to: "ram", type: "data", label: "LPDDR memory bus", points: [[420, 420], [420, 520]] },
  { id: "d-soc-storage", from: "soc", to: "storage", type: "data", label: "eMMC or UFS interface", points: [[580, 420], [580, 520]] },

  // Control
  { id: "c-soc-pmic", from: "soc", to: "pmic", type: "control", label: "PMIC control bus (platform-dependent, e.g., SPMI or I²C)", points: [[380, 300], [220, 300]] },
  { id: "c-soc-charging", from: "soc", to: "charging", type: "control", label: "Charger control (commonly I²C)", points: [[380, 230], [300, 230], [300, 182], [220, 182]] },

  // Clock & reset
  { id: "k-clock-pmic", from: "clock", to: "pmic", type: "clock", label: "Sleep / RTC clock and power-on reset", points: [[130, 430], [130, 370]] },
  { id: "k-clock-soc", from: "clock", to: "soc", type: "clock", label: "Reference clock and reset release", points: [[220, 462], [300, 462], [300, 400], [380, 400]] },
];
