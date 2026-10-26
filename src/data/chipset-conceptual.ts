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
  power: { label: "Power", description: "Conceptual supply paths from the PMIC or charging circuit" },
  data: { label: "Data", description: "Conceptual high-speed data interfaces" },
  control: { label: "Control", description: "Conceptual low-speed configuration buses" },
  clock: { label: "Clock & reset", description: "Conceptual timing and reset relationships" },
};

/** Shown wherever connections are listed, so they are never read as a real board's wiring. */
export const connectionsDisclaimer =
  "Connections are conceptual. Actual power rails, signal paths and IC arrangements differ between phone models and board revisions.";

export const chipsetBlocks: ChipsetBlock[] = [
  {
    id: "soc",
    name: "SoC / Application Processor",
    label: "SoC",
    category: "core",
    summary:
      "The main processor package. It handles processing and coordinates many subsystems, but it does not directly control every component. Some circuits, such as charging, protection and parts of power sequencing, can work on their own or under the PMIC's control.",
    functions: [
      "CPU and GPU cores that run Android or iOS and apps",
      "Memory controller that talks to RAM",
      "Storage controller that loads the bootloader and OS",
      "Display, camera and audio interfaces",
      "Coordinates other ICs over control buses; many peripherals also have their own controllers and firmware",
      "On many platforms, the cellular modem (baseband) is integrated in the same package",
      "A boot ROM that runs first at power-on and can expose an emergency download mode over USB",
    ],
    dependsOn: ["pmic", "clock", "ram", "storage"],
    claims: ["C-0009"],
    symptoms: [
      "Dead phone with abnormal current draw on a DC power supply",
      "Stuck in boot loop or stops at a fixed point during boot",
      "Overheating near the SoC area",
      "A short circuit on one of the SoC's supply rails",
    ],
    diagnosis: [
      "Treat the SoC as the last suspect. Missing power, clock or reset, or a shorted component nearby, can look exactly like an SoC failure.",
      "Watch the current draw on a DC power supply while pressing power, and compare the pattern with a known-good board of the same model.",
      "Check whether the boot ROM enumerates on USB (for example Qualcomm EDL or MediaTek BROM modes). This helps separate SoC faults from storage or firmware faults.",
      "For a shorted rail, find the shorted component with thermal imaging or rosin before suspecting the SoC itself.",
    ],
    caution:
      "SoC reballing or replacement is high-risk and often impossible on modern devices because of security pairing.",
    box: { x: 320, y: 190, w: 360, h: 260 },
  },
  {
    id: "pmic",
    name: "PMIC (Power Management IC)",
    label: "PMIC",
    category: "power",
    summary:
      "Turns battery power into the many regulated supply rails the phone needs. On most designs it also takes part in power sequencing and reset control, but exactly how varies by platform.",
    functions: [
      "Generates multiple supply rails using buck converters and LDO regulators",
      "Takes part in the power-on sequence when the power key is pressed. The order of rails, and which chip controls each step, varies by platform.",
      "Often takes part in reset control, for example holding the SoC in reset until rails are stable. How reset is generated varies by platform.",
      "Often contains the real-time clock (RTC) and power-key detection",
      "Some platforms use a main PMIC plus one or more secondary PMICs or separate regulators",
    ],
    dependsOn: ["charging", "clock"],
    symptoms: [
      "Completely dead: no current draw when pressing power",
      "Current rises to a fixed value and stays there",
      "Phone heats up while switched off",
      "Random shutdowns or restarts",
    ],
    diagnosis: [
      "Rule out the simple causes first: battery, charging port, power key and its flex.",
      "Confirm battery supply reaches the PMIC (follow the battery line from the connector using the schematic), and check that line for a short.",
      "Check the power-key line and confirm it changes state when pressed.",
      "Measure each output rail and compare against the schematic or a known-good board of the same model. Never assume a value from another phone.",
      "In diode mode, compare readings on the rail capacitors with a known-good board to find shorts. Rule out shorted capacitors and loads on a rail before suspecting the PMIC itself.",
    ],
    claims: ["C-0007"],
    caution:
      "A dead phone does not automatically mean the PMIC is faulty. A flat or failed battery, a faulty power key, a shorted rail, or a fault elsewhere can produce the same symptom.",
    box: { x: 40, y: 275, w: 200, h: 90 },
  },
  {
    id: "charging",
    name: "Battery & Charging",
    label: "Battery / Charging",
    category: "power",
    summary:
      "The battery, the charging IC, the USB input path and the protection circuits around them. Actual designs vary: some phones use separate chips for each job, others combine them, and many add fast-charge or wireless-charging ICs.",
    functions: [
      "Battery: the cell plus its own protection circuit inside the pack",
      "USB input path: the charging port, its flex or sub-board, and filtering on the way to the charger",
      "Charging IC: controls charging current and voltage",
      "Protection circuits: over-voltage protection (OVP) on many designs, plus other current or temperature protection that varies by design",
      "Battery connector, often with a temperature or ID line",
      "Fast-charge negotiation with the charger (protocol varies by brand)",
      "Configured by the SoC when the phone is on; many charging ICs can also charge with the phone switched off",
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
      "Try a known-good charging port flex or sub-board if the phone has one.",
      "Use a USB ammeter to watch charging current behaviour.",
      "Check the protection (OVP) and charging IC areas for liquid damage or shorts.",
      "Check the battery connector lines against the schematic, including the temperature/ID line.",
    ],
    box: { x: 40, y: 175, w: 200, h: 70 },
  },
  {
    id: "clock",
    name: "Clocks & Reset",
    label: "Clocks & Reset",
    category: "timing",
    summary:
      "Clocks provide timing. Reset signals hold chips in a known startup state until conditions are right. These are separate signals, grouped together here only as a learning concept. On a real board they may involve several ICs: crystals, oscillators, the PMIC and the SoC itself.",
    functions: [
      "Clock: sleep / RTC crystal, typically 32.768 kHz, often connected to the PMIC",
      "Clock: main reference clock for the SoC. The frequency depends on the platform, so check the schematic.",
      "Clock: RF, Wi-Fi and other ICs may use the main reference or their own clock sources",
      "Reset: power-on reset holds chips in a startup state until supplies are ready, then releases them",
      "Reset: watchdog resets restart the system if software hangs; many peripherals also have their own reset lines",
    ],
    dependsOn: ["pmic"],
    symptoms: [
      "Dead phone that briefly draws current and then drops back",
      "Boots but has no network (RF reference clock problem)",
      "Clock or date resets after power loss",
    ],
    claims: ["C-0002"],
    diagnosis: [
      "A missing clock and a stuck reset can look the same, because in both cases the board doesn't start. Check each one separately.",
      "Inspect crystals and oscillators for cracks, corrosion or liquid damage.",
      "A multimeter cannot confirm a clock is oscillating correctly. Use an oscilloscope where possible.",
      "Check the reset line's state against the schematic during power-on.",
    ],
    box: { x: 40, y: 395, w: 200, h: 70 },
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
      "Make sure the flashing tool, loader and firmware match the exact model before trusting a memory error.",
      "Confirm the RAM supply rails are present (values from the model's schematic).",
      "Ask about drop and liquid history.",
      "Read flashing-tool logs carefully and compare with known-good behaviour for that model.",
      "Rework of PoP memory is an advanced, high-risk repair. Only consider it once the other causes are ruled out.",
    ],
    caution:
      "A memory initialisation error does not prove the RAM is faulty. It can also come from a wrong loader or firmware, a missing or unstable supply, a solder or connection problem between the SoC and RAM, or an SoC fault.",
    box: { x: 340, y: 530, w: 150, h: 70 },
  },
  {
    id: "storage",
    name: "Storage (eMMC / UFS)",
    label: "Storage",
    category: "memory",
    summary:
      "Permanent storage for the bootloader, operating system and user data. Flashing failures and boot loops can come from firmware, power, communication or storage faults, so storage is not automatically to blame.",
    functions: [
      "eMMC or UFS, depending on the model. Budget phones are often said to use eMMC and pricier ones UFS, but check the storage part on the board",
      "Stores boot partitions, OS, and user data",
      "Sometimes combined with RAM in one package (eMCP / uMCP)",
    ],
    claims: ["C-0008"],
    dependsOn: ["pmic", "soc"],
    symptoms: [
      "Stuck on logo, boot loop, or boots straight into fastboot / download mode",
      "Flashing tool cannot detect or read the storage",
      "Data loss, corrupted apps, or read/write errors",
    ],
    diagnosis: [
      "Firmware: rule out software first. Try a correct firmware for the exact model before replacing parts.",
      "Power: check the storage supply rails against the schematic.",
      "Communication: in boot ROM mode, check whether the flashing tool can identify the storage chip. If not, consider solder or interface problems as well as the chip itself.",
      "Storage: suspect the chip only after firmware, power and communication are ruled out.",
    ],
    caution:
      "On many modern devices storage is cryptographically paired with the SoC. Replacement may need device-specific programming or may not be possible, and user data is usually unrecoverable.",
    box: { x: 510, y: 530, w: 150, h: 70 },
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
      "Confirm the phone is actually on: it vibrates, rings, or a computer detects it.",
      "Test with a known-good screen of the correct part.",
      "Reseat the connector and inspect it, the flex and nearby filters for damage, corrosion or liquid.",
      "Only then check the display / backlight supply circuits against the schematic.",
      "Suspect a board-side display IC last, after the screen, connector and supplies are ruled out.",
    ],
    box: { x: 300, y: 30, w: 130, h: 80 },
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
      "Start simple: restart, remove the screen protector and case, and try safe mode to rule out apps.",
      "Touch that fails only on a charger often points to a noisy charger or cable. Try a known-good one.",
      "Test with a known-good screen assembly. On many phones the touch controller is part of the screen.",
      "Inspect and reseat the connector, then check interface lines for continuity using the schematic.",
      "Suspect a board-side touch IC last.",
    ],
    box: { x: 435, y: 30, w: 130, h: 80 },
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
      "Start simple: restart, clear the camera app's cache, try safe mode or another camera app.",
      "Check for a dirty or cracked lens and signs of impact or liquid.",
      "Swap in a known-good module of the same part number.",
      "Inspect and reseat the connector, then check module supplies against the schematic.",
      "Suspect board-side ICs last.",
    ],
    caution:
      "On some devices camera modules are paired to the board, so a swapped module may show warnings or lose features.",
    box: { x: 570, y: 30, w: 130, h: 80 },
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
      "Start simple: airplane mode on and off, reset network settings, update the software, and test the SIM in another phone.",
      "Check that the IMEI and baseband version show in settings. If they are missing, investigate software or baseband issues before hardware.",
      "Inspect antenna cables, antenna contacts and the SIM reader.",
      "Only then check the RF or Wi-Fi IC's supplies and clock against the schematic.",
      "Suspect the RF or Wi-Fi IC itself last.",
    ],
    caution:
      "Never alter a device's IMEI. It is illegal in many countries.",
    box: { x: 760, y: 205, w: 200, h: 80 },
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
      "Start simple: check volume, silent / Do Not Disturb, disconnect Bluetooth, and try safe mode.",
      "Clean the speaker mesh and microphone holes. Record a voice memo to test each microphone.",
      "Test with Bluetooth or headphones to see if the problem is in one audio path only.",
      "Try a known-good speaker or flex, and check speaker / earpiece continuity with a multimeter.",
      "Only then check the amplifier or codec area and its supply against the schematic.",
    ],
    box: { x: 760, y: 355, w: 200, h: 80 },
  },
];

// Power reaches the peripherals through two shared trunks that run in the gaps
// between blocks (left of the SoC, then above or below it), so no line passes behind a box.
const topTrunk: [number, number][] = [
  [240, 290],
  [280, 290],
  [280, 150],
];
const bottomTrunk: [number, number][] = [
  [240, 355],
  [280, 355],
  [280, 490],
];

export const chipsetConnections: ChipsetConnection[] = [
  // Power
  { id: "p-charging-pmic", from: "charging", to: "pmic", type: "power", label: "Battery / charging path to the PMIC (arrangement varies)", points: [[110, 245], [110, 275]] },
  { id: "p-pmic-soc", from: "pmic", to: "soc", type: "power", label: "SoC supply rails (typically several)", points: [[240, 310], [320, 310]] },
  { id: "p-pmic-display", from: "pmic", to: "display", type: "power", label: "Display supplies (may come from dedicated ICs)", points: [...topTrunk, [335, 150], [335, 110]] },
  { id: "p-pmic-touch", from: "pmic", to: "touch", type: "power", label: "Touch controller supply", points: [...topTrunk, [470, 150], [470, 110]] },
  { id: "p-pmic-cameras", from: "pmic", to: "cameras", type: "power", label: "Camera module supplies (may include dedicated regulators)", points: [...topTrunk, [605, 150], [605, 110]] },
  { id: "p-pmic-connectivity", from: "pmic", to: "connectivity", type: "power", label: "RF and Wi-Fi supplies (some taken directly from battery power)", points: [...topTrunk, [720, 150], [720, 225], [760, 225]] },
  { id: "p-pmic-audio", from: "pmic", to: "audio", type: "power", label: "Audio codec / amplifier supplies", points: [...topTrunk, [720, 150], [720, 375], [760, 375]] },
  { id: "p-pmic-ram", from: "pmic", to: "ram", type: "power", label: "Memory supply rails", points: [...bottomTrunk, [385, 490], [385, 530]] },
  { id: "p-pmic-storage", from: "pmic", to: "storage", type: "power", label: "Storage supply rails", points: [...bottomTrunk, [555, 490], [555, 530]] },

  // Data
  { id: "d-soc-display", from: "soc", to: "display", type: "data", label: "Display interface (typically MIPI DSI)", points: [[365, 190], [365, 110]] },
  { id: "d-soc-touch", from: "soc", to: "touch", type: "data", label: "Touch data (commonly I²C or SPI + interrupt)", points: [[500, 190], [500, 110]] },
  { id: "d-soc-cameras", from: "soc", to: "cameras", type: "data", label: "Camera interface (typically MIPI CSI)", points: [[635, 190], [635, 110]] },
  { id: "d-soc-connectivity", from: "soc", to: "connectivity", type: "data", label: "Baseband, RF and Wi-Fi links (vary by platform)", points: [[680, 260], [760, 260]] },
  { id: "d-soc-audio", from: "soc", to: "audio", type: "data", label: "Digital audio (e.g., I²S/TDM or vendor-specific)", points: [[680, 410], [760, 410]] },
  { id: "d-soc-ram", from: "soc", to: "ram", type: "data", label: "LPDDR memory bus", points: [[415, 450], [415, 530]] },
  { id: "d-soc-storage", from: "soc", to: "storage", type: "data", label: "eMMC or UFS interface", points: [[585, 450], [585, 530]] },

  // Control
  { id: "c-soc-pmic", from: "soc", to: "pmic", type: "control", label: "PMIC control bus (platform-dependent, e.g., SPMI or I²C)", points: [[320, 340], [240, 340]] },
  { id: "c-soc-charging", from: "soc", to: "charging", type: "control", label: "Charging IC control (commonly I²C)", points: [[320, 210], [240, 210]] },

  // Clock & reset
  { id: "k-clock-pmic", from: "clock", to: "pmic", type: "clock", label: "Sleep / RTC clock and reset relationship (varies by platform)", points: [[110, 395], [110, 365]] },
  { id: "k-clock-soc", from: "clock", to: "soc", type: "clock", label: "Reference clock and reset release (separate signals)", points: [[240, 430], [320, 430]] },
];
