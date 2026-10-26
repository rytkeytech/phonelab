import type { GameScenario } from "@/lib/types";
import { deadAfterCharge } from "./case-dead-after-charge";
import { logoLoop } from "./case-logo-loop";
import { noWifi } from "./case-no-wifi";

/*
 * SIMULATED diagnostic scenarios, one guided case per file.
 *
 * The devices are imaginary and every reading is simulated for training.
 * Readings are described in words rather than invented values, so nothing
 * here can be mistaken for a measurement from a real phone.
 */

export const scenarios: GameScenario[] = [deadAfterCharge, logoLoop, noWifi];
