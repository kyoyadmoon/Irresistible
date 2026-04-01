/**
 * Stage registry — maps type strings to components.
 * No ordering here; order is controlled by config/game.js
 */
import Runaway from './Runaway'
import ShrinkGrow from './ShrinkGrow'
import HoldToConfirm from './HoldToConfirm'
import Decoys from './Decoys'
import MathGate from './MathGate'
import SpeedRound from './SpeedRound'
import FinalBoss from './FinalBoss'

export const stageRegistry = {
  runaway: Runaway,
  shrinkGrow: ShrinkGrow,
  holdToConfirm: HoldToConfirm,
  decoys: Decoys,
  mathGate: MathGate,
  speedRound: SpeedRound,
  finalBoss: FinalBoss,
}
