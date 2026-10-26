import type { ResearchSource } from "@/lib/types";

/*
 * Sources consulted or attempted. Mirrors docs/research/SOURCES.md.
 * A source with access "unavailable" was NOT read and must not be cited as
 * support for a claim; it is listed so the next attempt knows where to look.
 */

export const researchSources: ResearchSource[] = [
  {
    id: "S-0001",
    title: "AN2867: Oscillator design guide for STM8AF/AL/S, STM32 MCUs and MPUs (Rev 12, Jan 2020)",
    publisher: "STMicroelectronics",
    location: "https://www.st.com/resource/en/application_note/an2867-oscillator-design-guide-for-stm32-microcontrollers-stmicroelectronics.pdf",
    tier: 3,
    access: {
      status: "unavailable",
      date: "2026-10-26",
      note: "Download timed out twice. A mirror on stmcu.com.cn showed only the title page and contents: section 3.1 'Introduction to Pierce oscillators', 3.3 'Load capacitance'.",
    },
  },
  {
    id: "S-0002",
    title: "Crystal Considerations with Analog Devices Real-Time Clocks (RTCs) (formerly Maxim APP 58)",
    publisher: "Analog Devices",
    location: "https://www.analog.com/en/resources/design-notes/crystal-considerations-with-analog-devices-realtime-clocks-rtcs.html",
    tier: 3,
    access: { status: "unavailable", date: "2026-10-26", note: "Page and PDF mirror both timed out or refused the connection." },
  },
  {
    id: "S-0003",
    title: "AN2648: Selecting and Testing 32 KHz Crystal Oscillators for AVR Microcontrollers",
    publisher: "Microchip Technology",
    location: "https://www.microchip.com/content/dam/mchp/documents/MCU08/ApplicationNotes/ApplicationNotes/AN2648-Selecting_Testing-32KHz-Crystal-Osc-for-AVR-MCUs-00002648.pdf",
    tier: 3,
    access: { status: "unavailable", date: "2026-10-26", note: "HTTP 403 Forbidden to the fetch tool." },
  },
];

export const getSource = (id: string) => researchSources.find((s) => s.id === id);
