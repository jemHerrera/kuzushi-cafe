import { Category } from "./data-model";

export const seeder: {
  key: string;
  label: string;
  category: Category;
}[] = [
  // MARK: SUMBISSIONS
  // Armbars
  { key: "armbar", label: "Armbar", category: "submission" },
  {
    key: "straight-arm-lock",
    label: "Straight Arm Lock",
    category: "submission",
  },
  { key: "choi-bar", label: "Choi Bar", category: "submission" },
  { key: "juji-gatame", label: "Juji Gatame", category: "submission" },

  // Chokes
  {
    key: "rear-naked-choke",
    label: "Rear Naked Choke",
    category: "submission",
  },
  {
    key: "cross-collar-choke",
    label: "Cross Collar Choke",
    category: "submission",
  },
  {
    key: "bow-and-arrow-choke",
    label: "Bow and Arrow Choke",
    category: "submission",
  },
  {
    key: "baseball-bat-choke",
    label: "Baseball Bat Choke",
    category: "submission",
  },
  {
    key: "clock-choke",
    label: "Clock Choke",
    category: "submission",
  },
  {
    key: "ezekiel-choke",
    label: "Ezekiel Choke",
    category: "submission",
  },
  {
    key: "paper-cutter-choke",
    label: "Paper Cutter Choke",
    category: "submission",
  },
  {
    key: "guillotine",
    label: "Guillotine",
    category: "submission",
  },
  {
    key: "high-elbow-guillotine",
    label: "High Elbow Guillotine",
    category: "submission",
  },
  {
    key: "arm-in-guillotine",
    label: "Arm-In Guillotine",
    category: "submission",
  },
  {
    key: "anaconda-choke",
    label: "Anaconda Choke",
    category: "submission",
  },
  {
    key: "darce-choke",
    label: "D'Arce Choke",
    category: "submission",
  },
  {
    key: "peruvian-necktie",
    label: "Peruvian Necktie",
    category: "submission",
  },
  {
    key: "north-south-choke",
    label: "North South Choke",
    category: "submission",
  },
  {
    key: "triangle-choke",
    label: "Triangle Choke",
    category: "submission",
  },
  {
    key: "arm-triangle",
    label: "Arm Triangle",
    category: "submission",
  },
  {
    key: "kata-gatame",
    label: "Kata Gatame",
    category: "submission",
  },
  {
    key: "loop-choke",
    label: "Loop Choke",
    category: "submission",
  },
  {
    key: "short-choke",
    label: "Short Choke",
    category: "submission",
  },

  // Shoulder locks
  {
    key: "kimura",
    label: "Kimura",
    category: "submission",
  },
  {
    key: "americana",
    label: "Americana",
    category: "submission",
  },
  {
    key: "omoplata",
    label: "Omoplata",
    category: "submission",
  },
  {
    key: "monoplata",
    label: "Monoplata",
    category: "submission",
  },
  {
    key: "tarikoplata",
    label: "Tarikoplata",
    category: "submission",
  },

  // Wrist locks
  {
    key: "wrist-lock",
    label: "Wrist Lock",
    category: "submission",
  },

  // Leg locks
  {
    key: "straight-ankle-lock",
    label: "Straight Ankle Lock",
    category: "submission",
  },
  {
    key: "toe-hold",
    label: "Toe Hold",
    category: "submission",
  },
  {
    key: "kneebar",
    label: "Kneebar",
    category: "submission",
  },
  {
    key: "inside-heel-hook",
    label: "Inside Heel Hook",
    category: "submission",
  },
  {
    key: "outside-heel-hook",
    label: "Outside Heel Hook",
    category: "submission",
  },
  {
    key: "calf-slicer",
    label: "Calf Slicer",
    category: "submission",
  },
  {
    key: "bicep-slicer",
    label: "Bicep Slicer",
    category: "submission",
  },
  {
    key: "estima-lock",
    label: "Estima Lock",
    category: "submission",
  },
  {
    key: "aoki-lock",
    label: "Aoki Lock",
    category: "submission",
  },

  // Compression / specialty
  {
    key: "banana-split",
    label: "Banana Split",
    category: "submission",
  },
  {
    key: "electric-chair",
    label: "Electric Chair",
    category: "submission",
  },
  {
    key: "mothers-milk",
    label: "Mother's Milk",
    category: "submission",
  },
  {
    key: "buggy-choke",
    label: "Buggy Choke",
    category: "submission",
  },
  {
    key: "just-pressure",
    label: "Just Pressure",
    category: "submission",
  },

  // MARK: TAKEDOWNS
  // Wrestling

  { key: "single-leg", label: "Single Leg", category: "takedown" },
  { key: "high-crotch", label: "High Crotch", category: "takedown" },
  { key: "double-leg", label: "Double Leg", category: "takedown" },
  { key: "blast-double", label: "Blast Double", category: "takedown" },
  { key: "low-single", label: "Low Single", category: "takedown" },
  { key: "ankle-pick", label: "Ankle Pick", category: "takedown" },
  { key: "knee-pick", label: "Knee Pick", category: "takedown" },
  { key: "duck-under", label: "Duck Under", category: "takedown" },
  { key: "arm-drag", label: "Arm Drag", category: "takedown" },
  { key: "snap-down", label: "Snap Down", category: "takedown" },
  {
    key: "front-headlock-go-behind",
    label: "Front Headlock Go Behind",
    category: "takedown",
  },
  { key: "go-behind", label: "Go Behind", category: "takedown" },
  {
    key: "body-lock-takedown",
    label: "Body Lock Takedown",
    category: "takedown",
  },
  { key: "rear-body-lock", label: "Rear Body Lock", category: "takedown" },
  { key: "inside-trip", label: "Inside Trip", category: "takedown" },
  { key: "outside-trip", label: "Outside Trip", category: "takedown" },
  { key: "knee-tap", label: "Knee Tap", category: "takedown" },
  {
    key: "head-inside-single",
    label: "Head Inside Single",
    category: "takedown",
  },
  {
    key: "head-outside-single",
    label: "Head Outside Single",
    category: "takedown",
  },

  // Judo

  { key: "osoto-gari", label: "Osoto Gari", category: "takedown" },
  { key: "osoto-otoshi", label: "Osoto Otoshi", category: "takedown" },
  { key: "ouchi-gari", label: "Ouchi Gari", category: "takedown" },
  { key: "kouchi-gari", label: "Kouchi Gari", category: "takedown" },
  { key: "harai-goshi", label: "Harai Goshi", category: "takedown" },
  { key: "uchi-mata", label: "Uchi Mata", category: "takedown" },
  { key: "tai-otoshi", label: "Tai Otoshi", category: "takedown" },
  { key: "seoi-nage", label: "Seoi Nage", category: "takedown" },
  { key: "ippon-seoi-nage", label: "Ippon Seoi Nage", category: "takedown" },
  { key: "morote-seoi-nage", label: "Morote Seoi Nage", category: "takedown" },
  {
    key: "sasae-tsurikomi-ashi",
    label: "Sasae Tsurikomi Ashi",
    category: "takedown",
  },
  { key: "de-ashi-barai", label: "De Ashi Barai", category: "takedown" },
  { key: "okuri-ashi-barai", label: "Okuri Ashi Barai", category: "takedown" },
  { key: "hiza-guruma", label: "Hiza Guruma", category: "takedown" },
  { key: "tomoe-nage", label: "Tomoe Nage", category: "takedown" },
  { key: "sumi-gaeshi", label: "Sumi Gaeshi", category: "takedown" },
  { key: "yoko-tomoe-nage", label: "Yoko Tomoe Nage", category: "takedown" },
  { key: "tani-otoshi", label: "Tani Otoshi", category: "takedown" },
  { key: "yoko-wakare", label: "Yoko Wakare", category: "takedown" },
  { key: "koshi-guruma", label: "Koshi Guruma", category: "takedown" },

  // Common BJJ / No-Gi

  { key: "collar-drag", label: "Collar Drag", category: "takedown" },
  { key: "arm-drag-to-back", label: "Arm Drag to Back", category: "takedown" },
  { key: "russian-tie", label: "Russian Tie", category: "takedown" },
  { key: "slide-by", label: "Slide By", category: "takedown" },
  { key: "2-on-1-takedown", label: "2-on-1 Takedown", category: "takedown" },
  {
    key: "underhook-to-knee-tap",
    label: "Underhook to Knee Tap",
    category: "takedown",
  },
  { key: "seatbelt-drag", label: "Seatbelt Drag", category: "takedown" },
  {
    key: "standing-body-lock",
    label: "Standing Body Lock",
    category: "takedown",
  },
  {
    key: "standing-back-take",
    label: "Standing Back Take",
    category: "takedown",
  },

  // Sacrifice / Front Headlock

  { key: "flying-triangle", label: "Flying Triangle", category: "takedown" },
  { key: "flying-armbar", label: "Flying Armbar", category: "takedown" },
  { key: "rolling-kimura", label: "Rolling Kimura", category: "takedown" },
  {
    key: "front-headlock-roll",
    label: "Front Headlock Roll",
    category: "takedown",
  },

  // Clinch / Greco

  { key: "bear-hug", label: "Bear Hug", category: "takedown" },
  { key: "lateral-drop", label: "Lateral Drop", category: "takedown" },
  { key: "suplex", label: "Suplex", category: "takedown" },
  { key: "arm-spin", label: "Arm Spin", category: "takedown" },
  {
    key: "head-and-arm-throw",
    label: "Head and Arm Throw",
    category: "takedown",
  },

  // MARK: SWEEPS

  // Closed Guard
  { key: "scissor-sweep", label: "Scissor Sweep", category: "sweep" },
  { key: "flower-sweep", label: "Flower Sweep", category: "sweep" },
  { key: "pendulum-sweep", label: "Pendulum Sweep", category: "sweep" },
  { key: "hip-bump-sweep", label: "Hip Bump Sweep", category: "sweep" },
  { key: "lumberjack-sweep", label: "Lumberjack Sweep", category: "sweep" },
  { key: "waiter-sweep", label: "Waiter Sweep", category: "sweep" },

  // Butterfly Guard

  { key: "butterfly-sweep", label: "Butterfly Sweep", category: "sweep" },
  { key: "elevator-sweep", label: "Elevator Sweep", category: "sweep" },
  {
    key: "shoulder-crunch-sweep",
    label: "Shoulder Crunch Sweep",
    category: "sweep",
  },
  { key: "arm-drag-sweep", label: "Arm Drag Sweep", category: "sweep" },

  // Half Guard

  { key: "old-school-sweep", label: "Old School Sweep", category: "sweep" },
  { key: "plan-b-sweep", label: "Plan B Sweep", category: "sweep" },
  { key: "deep-half-sweep", label: "Deep Half Sweep", category: "sweep" },
  { key: "dogfight-sweep", label: "Dogfight Sweep", category: "sweep" },
  { key: "coyote-sweep", label: "Coyote Sweep", category: "sweep" },
  { key: "john-wayne-sweep", label: "John Wayne Sweep", category: "sweep" },

  // De La Riva / Open Guard

  { key: "de-la-riva-sweep", label: "De La Riva Sweep", category: "sweep" },
  { key: "tripod-sweep", label: "Tripod Sweep", category: "sweep" },
  { key: "sickle-sweep", label: "Sickle Sweep", category: "sweep" },
  { key: "balloon-sweep", label: "Balloon Sweep", category: "sweep" },
  {
    key: "technical-standup-sweep",
    label: "Technical Standup Sweep",
    category: "sweep",
  },

  // X / Single Leg X

  { key: "x-guard-sweep", label: "X Guard Sweep", category: "sweep" },
  { key: "single-leg-x-sweep", label: "Single Leg X Sweep", category: "sweep" },

  // Spider / Lasso

  { key: "spider-sweep", label: "Spider Sweep", category: "sweep" },
  { key: "lasso-sweep", label: "Lasso Sweep", category: "sweep" },
  {
    key: "pendulum-lasso-sweep",
    label: "Pendulum Lasso Sweep",
    category: "sweep",
  },

  // General

  { key: "hook-sweep", label: "Hook Sweep", category: "sweep" },
  { key: "overhead-sweep", label: "Overhead Sweep", category: "sweep" },
  { key: "dummy-sweep", label: "Dummy Sweep", category: "sweep" },

  // MARK: ESCAPES
  // Mount

  { key: "elbow-knee-escape", label: "Elbow Knee Escape", category: "escape" },
  { key: "knee-elbow-escape", label: "Knee Elbow Escape", category: "escape" },
  { key: "kipping-escape", label: "Kipping Escape", category: "escape" },
  { key: "heel-drag-escape", label: "Heel Drag Escape", category: "escape" },

  // Side Control

  { key: "underhook-escape", label: "Underhook Escape", category: "escape" },
  { key: "ghost-escape", label: "Ghost Escape", category: "escape" },
  {
    key: "running-man-escape",
    label: "Running Man Escape",
    category: "escape",
  },
  {
    key: "side-control-escape",
    label: "Side Control Escape",
    category: "escape",
  },

  // North South

  {
    key: "north-south-escape",
    label: "North South Escape",
    category: "escape",
  },
  {
    key: "north-south-hip-escape",
    label: "North South Hip Escape",
    category: "escape",
  },

  // Back Control

  {
    key: "back-escape-two-on-one",
    label: "Back Escape Two on One",
    category: "escape",
  },
  {
    key: "back-escape-shoulder-slide",
    label: "Back Escape Shoulder Slide",
    category: "escape",
  },
  {
    key: "back-escape-to-half-guard",
    label: "Back Escape to Half Guard",
    category: "escape",
  },
  {
    key: "back-escape-to-closed-guard",
    label: "Back Escape to Closed Guard",
    category: "escape",
  },

  // Turtle

  { key: "sit-out-escape", label: "Sit Out Escape", category: "escape" },
  { key: "granby-escape", label: "Granby Escape", category: "escape" },
  { key: "peek-out-escape", label: "Peek Out Escape", category: "escape" },
  { key: "turtle-reguard", label: "Turtle Reguard", category: "escape" },

  // Knee on Belly

  {
    key: "knee-on-belly-shrimp-escape",
    label: "Knee on Belly Shrimp Escape",
    category: "escape",
  },
  {
    key: "knee-on-belly-leg-pummel",
    label: "Knee on Belly Leg Pummel",
    category: "escape",
  },

  // Crucifix

  { key: "crucifix-escape", label: "Crucifix Escape", category: "escape" },

  // Leg Entanglements

  {
    key: "straight-ashi-escape",
    label: "Straight Ashi Escape",
    category: "escape",
  },
  { key: "cross-ashi-escape", label: "Cross Ashi Escape", category: "escape" },
  {
    key: "outside-ashi-escape",
    label: "Outside Ashi Escape",
    category: "escape",
  },
  { key: "saddle-escape", label: "Saddle Escape", category: "escape" },
  { key: "50-50-escape", label: "50/50 Escape", category: "escape" },

  // General

  { key: "shrimp-escape", label: "Shrimp Escape", category: "escape" },
  { key: "bridge-and-shrimp", label: "Bridge and Shrimp", category: "escape" },
  { key: "frame-and-reguard", label: "Frame and Reguard", category: "escape" },
  {
    key: "leg-pummel-reguard",
    label: "Leg Pummel Reguard",
    category: "escape",
  },

  // MARK: REVERSALS

  // Mount Escapes to Top

  { key: "upa", label: "Upa", category: "reversal" },
  { key: "trap-and-roll", label: "Trap and Roll", category: "reversal" },

  // Side Control

  {
    key: "underhook-reversal",
    label: "Underhook Reversal",
    category: "reversal",
  },
  {
    key: "ghost-escape-reversal",
    label: "Ghost Escape Reversal",
    category: "reversal",
  },
  {
    key: "running-man-reversal",
    label: "Running Man Reversal",
    category: "reversal",
  },

  // North South

  {
    key: "north-south-rollover",
    label: "North South Rollover",
    category: "reversal",
  },

  // Back Control

  {
    key: "backdoor-reversal",
    label: "Backdoor Reversal",
    category: "reversal",
  },

  // General

  { key: "bridge-and-roll", label: "Bridge and Roll", category: "reversal" },
  {
    key: "wrestle-up-reversal",
    label: "Wrestle Up Reversal",
    category: "reversal",
  },
  {
    key: "hip-heist-reversal",
    label: "Hip Heist Reversal",
    category: "reversal",
  },

  // MARK: BACKTAKES
  // Classic

  {
    key: "arm-drag-back-take",
    label: "Arm Drag Back Take",
    category: "back-take",
  },
  {
    key: "duck-under-back-take",
    label: "Duck Under Back Take",
    category: "back-take",
  },

  // Open Guard / Modern

  { key: "berimbolo", label: "Berimbolo", category: "back-take" },
  { key: "baby-bolo", label: "Baby Bolo", category: "back-take" },
  {
    key: "kiss-of-the-dragon",
    label: "Kiss of the Dragon",
    category: "back-take",
  },
  { key: "matrix", label: "Matrix", category: "back-take" },
  {
    key: "crab-ride-back-take",
    label: "Crab Ride Back Take",
    category: "back-take",
  },
  {
    key: "twister-hook-back-take",
    label: "Twister Hook Back Take",
    category: "back-take",
  },
  { key: "truck-to-back", label: "Truck to Back", category: "back-take" },

  // Half Guard

  {
    key: "dogfight-back-take",
    label: "Dogfight Back Take",
    category: "back-take",
  },
  {
    key: "underhook-back-take",
    label: "Underhook Back Take",
    category: "back-take",
  },
  { key: "waiter-back-take", label: "Waiter Back Take", category: "back-take" },

  // Leg Entanglement

  { key: "saddle-back-take", label: "Saddle Back Take", category: "back-take" },
  {
    key: "cross-ashi-back-take",
    label: "Cross Ashi Back Take",
    category: "back-take",
  },

  // MARK: GUARD PASSES
  // Standing Passes

  { key: "torreando-pass", label: "Torreando Pass", category: "guard-pass" },
  { key: "leg-drag-pass", label: "Leg Drag Pass", category: "guard-pass" },
  { key: "x-pass", label: "X Pass", category: "guard-pass" },
  { key: "long-step-pass", label: "Long Step Pass", category: "guard-pass" },
  { key: "side-smash-pass", label: "Side Smash Pass", category: "guard-pass" },
  { key: "throw-by-pass", label: "Throw By Pass", category: "guard-pass" },

  // Pressure Passes

  { key: "knee-slice-pass", label: "Knee Slice Pass", category: "guard-pass" },
  { key: "knee-cut-pass", label: "Knee Cut Pass", category: "guard-pass" },
  { key: "smash-pass", label: "Smash Pass", category: "guard-pass" },
  { key: "over-under-pass", label: "Over Under Pass", category: "guard-pass" },
  {
    key: "double-under-pass",
    label: "Double Under Pass",
    category: "guard-pass",
  },
  { key: "stack-pass", label: "Stack Pass", category: "guard-pass" },
  { key: "body-lock-pass", label: "Body Lock Pass", category: "guard-pass" },
  {
    key: "half-guard-smash-pass",
    label: "Half Guard Smash Pass",
    category: "guard-pass",
  },

  // Loose / Mobility Passes

  { key: "float-pass", label: "Float Pass", category: "guard-pass" },
  { key: "backstep-pass", label: "Backstep Pass", category: "guard-pass" },
  { key: "leg-pummel-pass", label: "Leg Pummel Pass", category: "guard-pass" },
  { key: "cartwheel-pass", label: "Cartwheel Pass", category: "guard-pass" },
  {
    key: "rolling-backtake-pass",
    label: "Rolling Back Take Pass",
    category: "guard-pass",
  },

  // Half Guard Specific

  { key: "weave-pass", label: "Weave Pass", category: "guard-pass" },
  {
    key: "crossface-underhook-pass",
    label: "Crossface Underhook Pass",
    category: "guard-pass",
  },
  {
    key: "flatten-and-pass",
    label: "Flatten and Pass",
    category: "guard-pass",
  },

  // Open Guard Specific

  {
    key: "headquarters-pass",
    label: "Headquarters Pass",
    category: "guard-pass",
  },
  {
    key: "split-squat-pass",
    label: "Split Squat Pass",
    category: "guard-pass",
  },
  {
    key: "shin-staple-pass",
    label: "Shin Staple Pass",
    category: "guard-pass",
  },
  { key: "leg-weave-pass", label: "Leg Weave Pass", category: "guard-pass" },

  // Butterfly / Seated Guard

  {
    key: "shoulder-pin-pass",
    label: "Shoulder Pin Pass",
    category: "guard-pass",
  },

  // Modern No-Gi

  { key: "rugby-pass", label: "Rugby Pass", category: "guard-pass" },
  { key: "camping", label: "Camping", category: "guard-pass" },
  { key: "leg-pin-pass", label: "Leg Pin Pass", category: "guard-pass" },

  // MARK: LEG ENTRIES
  // Single Leg X / Straight Ashi

  {
    key: "single-leg-x-entry",
    label: "Single Leg X Entry",
    category: "leg-entry",
  },
  {
    key: "straight-ashi-entry",
    label: "Straight Ashi Entry",
    category: "leg-entry",
  },
  {
    key: "shin-to-shin-entry",
    label: "Shin to Shin Entry",
    category: "leg-entry",
  },
  {
    key: "shin-to-single-leg-x",
    label: "Shin to Single Leg X",
    category: "leg-entry",
  },

  // X Guard

  { key: "x-guard-entry", label: "X Guard Entry", category: "leg-entry" },
  { key: "reverse-x-entry", label: "Reverse X Entry", category: "leg-entry" },

  // Saddle / Honey Hole / Inside Sankaku

  { key: "saddle-entry", label: "Saddle Entry", category: "leg-entry" },
  { key: "cross-ashi-entry", label: "Cross Ashi Entry", category: "leg-entry" },
  {
    key: "inside-sankaku-entry",
    label: "Inside Sankaku Entry",
    category: "leg-entry",
  },
  { key: "honey-hole-entry", label: "Honey Hole Entry", category: "leg-entry" },

  // Outside Ashi

  {
    key: "outside-ashi-entry",
    label: "Outside Ashi Entry",
    category: "leg-entry",
  },

  // 50/50

  { key: "50-50-entry", label: "50/50 Entry", category: "leg-entry" },
  {
    key: "outside-50-50-entry",
    label: "Outside 50/50 Entry",
    category: "leg-entry",
  },
  {
    key: "backside-50-50-entry",
    label: "Backside 50/50 Entry",
    category: "leg-entry",
  },

  // Butterfly / Seated

  {
    key: "butterfly-leg-entry",
    label: "Butterfly Leg Entry",
    category: "leg-entry",
  },
  {
    key: "elevation-leg-entry",
    label: "Elevation Leg Entry",
    category: "leg-entry",
  },

  // Wrestling-Up Entries

  {
    key: "single-leg-to-ashi",
    label: "Single Leg to Ashi",
    category: "leg-entry",
  },
  {
    key: "standing-leg-entry",
    label: "Standing Leg Entry",
    category: "leg-entry",
  },

  // Modern No-Gi

  { key: "false-reap-entry", label: "False Reap Entry", category: "leg-entry" },
  {
    key: "cross-grip-leg-entry",
    label: "Cross Grip Leg Entry",
    category: "leg-entry",
  },
  {
    key: "kani-basami-entry",
    label: "Kani Basami Entry",
    category: "leg-entry",
  },

  // Defensive Counters

  {
    key: "leg-drag-leg-entry",
    label: "Leg Drag Leg Entry",
    category: "leg-entry",
  },
  {
    key: "backstep-leg-entry",
    label: "Backstep Leg Entry",
    category: "leg-entry",
  },

  // MARK: OFF BALANCES

  {
    key: "off-balance",
    label: "Off Balance",
    category: "off-balance",
  },
  {
    key: "kuzushi",
    label: "Kuzushi",
    category: "off-balance",
  },

  // MARK: POSITIONS

  // Dominant / Control Positions

  { key: "mount", label: "Mount", category: "position" },
  { key: "high-mount", label: "High Mount", category: "position" },
  { key: "technical-mount", label: "Technical Mount", category: "position" },
  { key: "s-mount", label: "S-Mount", category: "position" },
  { key: "back-control", label: "Back Control", category: "position" },
  { key: "body-triangle", label: "Body Triangle", category: "position" },
  { key: "seatbelt-control", label: "Seatbelt Control", category: "position" },
  { key: "side-control", label: "Side Control", category: "position" },
  { key: "north-south", label: "North South", category: "position" },
  { key: "knee-on-belly", label: "Knee on Belly", category: "position" },
  { key: "scarf-hold", label: "Scarf Hold", category: "position" },
  { key: "kesa-gatame", label: "Kesa Gatame", category: "position" },
  {
    key: "reverse-kesa-gatame",
    label: "Reverse Kesa Gatame",
    category: "position",
  },
  { key: "crucifix", label: "Crucifix", category: "position" },
  { key: "turtle", label: "Turtle", category: "position" },

  // Guard Positions

  { key: "closed-guard", label: "Closed Guard", category: "position" },
  { key: "open-guard", label: "Open Guard", category: "position" },
  { key: "half-guard", label: "Half Guard", category: "position" },
  { key: "deep-half-guard", label: "Deep Half Guard", category: "position" },
  { key: "z-guard", label: "Z Guard", category: "position" },
  { key: "knee-shield", label: "Knee Shield", category: "position" },
  { key: "butterfly-guard", label: "Butterfly Guard", category: "position" },
  { key: "seated-guard", label: "Seated Guard", category: "position" },
  { key: "de-la-riva", label: "De La Riva", category: "position" },
  {
    key: "reverse-de-la-riva",
    label: "Reverse De La Riva",
    category: "position",
  },
  { key: "spider-guard", label: "Spider Guard", category: "position" },
  { key: "lasso-guard", label: "Lasso Guard", category: "position" },
  {
    key: "collar-sleeve-guard",
    label: "Collar Sleeve Guard",
    category: "position",
  },
  { key: "single-leg-x", label: "Single Leg X", category: "position" },
  { key: "x-guard", label: "X Guard", category: "position" },
  { key: "reverse-x-guard", label: "Reverse X Guard", category: "position" },
  { key: "k-guard", label: "K Guard", category: "position" },
  { key: "50-50", label: "50/50", category: "position" },
  { key: "worm-guard", label: "Worm Guard", category: "position" },
  { key: "lapel-guard", label: "Lapel Guard", category: "position" },

  // Passing / Transitional Positions

  { key: "headquarters", label: "Headquarters", category: "position" },
  { key: "combat-base", label: "Combat Base", category: "position" },
  {
    key: "leg-drag-position",
    label: "Leg Drag Position",
    category: "position",
  },
  { key: "smash-position", label: "Smash Position", category: "position" },
  {
    key: "body-lock-position",
    label: "Body Lock Position",
    category: "position",
  },
  { key: "top-half-guard", label: "Top Half Guard", category: "position" },

  // Leg Entanglements

  { key: "ashi-garami", label: "Ashi Garami", category: "position" },
  { key: "straight-ashi", label: "Straight Ashi", category: "position" },
  { key: "outside-ashi", label: "Outside Ashi", category: "position" },
  { key: "cross-ashi", label: "Cross Ashi", category: "position" },
  { key: "saddle", label: "Saddle", category: "position" },
  { key: "inside-sankaku", label: "Inside Sankaku", category: "position" },
  { key: "honey-hole", label: "Honey Hole", category: "position" },

  // Scramble / Ride Positions

  { key: "dogfight", label: "Dogfight", category: "position" },
  { key: "front-headlock", label: "Front Headlock", category: "position" },
  { key: "truck", label: "Truck", category: "position" },
  { key: "crab-ride", label: "Crab Ride", category: "position" },
  {
    key: "single-leg-position",
    label: "Single Leg Position",
    category: "position",
  },

  // MARK: GUARD RETENTION
  { key: "granby-roll", label: "Granby Roll", category: "guard-retention" },
  { key: "invertion", label: "Invertion", category: "guard-retention" },
  { key: "leg-pummel", label: "Leg Pummel", category: "guard-retention" },
  { key: "shoulder-post", label: "Shoulder Post", category: "guard-retention" },
  { key: "hip-heist", label: "Hip Heist", category: "guard-retention" },
];
