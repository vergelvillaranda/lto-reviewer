import type { QuizQuestion } from '@/types/quiz';
import { assertValidQuestionData } from '@/utils/validate-question-data';
import { assertValidRandomization } from '@/utils/validate-randomization';

// Extracted from the user-provided “LTO Exam Reviewer 2026” PDF.
// Content remains local so every quiz works fully offline.
export const questions: readonly QuizQuestion[] = [
  {
    "id": "q1",
    "category": "Road Signs",
    "prompt": "A red octagonal sign with the word 'STOP' in white letters requires drivers to:",
    "choices": [
      "Slow down and proceed if no other vehicles are visible",
      "Come to a complete stop at the marked line, then proceed when safe",
      "Yield to traffic from the right only",
      "Stop only if pedestrians are crossing"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A STOP sign requires a complete stop at the marked line — both wheels stationary — regardless of whether other vehicles or pedestrians are present.",
    "source": "PH Road Signs Manual R1-1; RA 4136 Sec. 35"
  },
  {
    "id": "q2",
    "category": "Road Signs",
    "prompt": "A red and white inverted triangle sign with the word 'YIELD' (or 'GIVE WAY') instructs the driver to:",
    "choices": [
      "Stop immediately and wait for a signal",
      "Slow down or stop if necessary, and give way to traffic on the main road",
      "Take right of way over all other vehicles",
      "Watch for a sharp curve ahead"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A YIELD sign means slow down, stop if necessary, and give way to vehicles on the main road. A complete stop is required only if other vehicles or pedestrians make it necessary.",
    "source": "PH Road Signs Manual R1-2"
  },
  {
    "id": "q3",
    "category": "Road Signs",
    "prompt": "A white circular sign with a red border showing a U-shaped arrow crossed by a red diagonal slash means:",
    "choices": [
      "U-turns allowed only on weekends",
      "No U-turn permitted at this location",
      "Slow down for U-turn ahead",
      "Yield to vehicles making U-turns"
    ],
    "correctAnswerIndex": 1,
    "explanation": "This regulatory sign prohibits U-turns at the indicated location. Making a U-turn here is a traffic violation under LTO rules.",
    "source": "PH Road Signs Manual, Prohibitive Signs"
  },
  {
    "id": "q4",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign showing a person walking across striped lines indicates:",
    "choices": [
      "Construction zone ahead",
      "Pedestrian crossing — exercise caution and reduce speed",
      "Public market nearby",
      "Parking area for pedestrians"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Yellow diamond signs are warnings. A pedestrian crossing sign alerts drivers to slow down and prepare to stop, especially in busy pedestrian areas or near schools.",
    "source": "PH Road Signs Manual W11-2"
  },
  {
    "id": "q5",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign showing a car silhouette above two wavy skid marks warns drivers of:",
    "choices": [
      "Vehicle service station ahead",
      "Road that may become slippery, especially when wet",
      "Sharp curve ahead",
      "Mandatory tire check zone"
    ],
    "correctAnswerIndex": 1,
    "explanation": "This warning sign indicates the road surface may become slippery, particularly after rain. Reduce speed, avoid sudden braking, and increase following distance.",
    "source": "PH Road Signs Manual W8-5"
  },
  {
    "id": "q6",
    "category": "Road Signs",
    "prompt": "A white circular sign with a red border showing the number '60' means:",
    "choices": [
      "Distance to next town in kilometers",
      "Minimum speed required is 60 km/h",
      "Maximum speed permitted is 60 km/h",
      "Highway route number"
    ],
    "correctAnswerIndex": 2,
    "explanation": "A speed limit sign (red-bordered white circle) shows the maximum allowed speed in km/h. Exceeding it is a violation. Minimum speed signs use a blue circular background — no red border.",
    "source": "PH Road Signs Manual R2-1"
  },
  {
    "id": "q7",
    "category": "Road Signs",
    "prompt": "A black rectangular sign with the words 'ONE WAY' and a white directional arrow indicates:",
    "choices": [
      "No entry from this direction",
      "Traffic flows only in the direction of the arrow on this road",
      "Detour ahead",
      "Mandatory turn allowed at this point"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A ONE WAY sign indicates that traffic on the indicated road moves only in the direction of the arrow. Driving against the arrow is a violation.",
    "source": "PH Road Signs Manual R3-7"
  },
  {
    "id": "q8",
    "category": "Road Signs",
    "prompt": "A solid red circular sign with a horizontal white bar means:",
    "choices": [
      "Road closed for maintenance",
      "No entry — entry into this road is prohibited for all vehicles",
      "Yield to oncoming traffic",
      "Stop and give way"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The No Entry sign — a red circle with a horizontal white bar — prohibits entry of vehicles into a road or area. Typically used at the exit end of one-way streets.",
    "source": "PH Road Signs Manual R3-3"
  },
  {
    "id": "q9",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign showing three curved arrows forming a circular pattern warns drivers of:",
    "choices": [
      "Pedestrian-only zone",
      "Roundabout or rotunda ahead",
      "Vehicle inspection point",
      "Tight U-turn permitted"
    ],
    "correctAnswerIndex": 1,
    "explanation": "This warning sign alerts drivers that a roundabout (rotunda) is ahead. Reduce speed and prepare to yield to traffic already in the roundabout.",
    "source": "PH Road Signs Manual W2-5"
  },
  {
    "id": "q10",
    "category": "Road Signs",
    "prompt": "A white circular sign with a red border showing two cars side-by-side and a red diagonal slash means:",
    "choices": [
      "No overtaking allowed at this section",
      "Two-way traffic ahead",
      "Lane reduction",
      "Parking for two vehicles only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The No Overtaking sign prohibits passing another vehicle in the indicated section. Typically posted on curves, hills, and sections with limited visibility.",
    "source": "PH Road Signs Manual R4-1"
  },
  {
    "id": "q11",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign showing an arrow curving to the right warns drivers of:",
    "choices": [
      "Right turn only ahead",
      "A road curve to the right ahead — reduce speed",
      "Exit ramp ahead",
      "Mandatory right turn"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Yellow diamond signs are warnings. An arrow curving right warns of an approaching right-hand curve. Reduce speed BEFORE entering the curve, not during.",
    "source": "PH Road Signs Manual W1-2"
  },
  {
    "id": "q12",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign showing two children figures walking indicates:",
    "choices": [
      "Pedestrian-only zone",
      "School zone — reduce speed and be alert for children",
      "Playground ahead",
      "Children's hospital nearby"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A school zone warning sign features children figures and alerts drivers to reduce speed and watch for children crossing. Maximum speed in school zones is 20 km/h under RA 4136.",
    "source": "PH Road Signs Manual W11-1; RA 4136 Sec. 35"
  },
  {
    "id": "q13",
    "category": "Road Signs",
    "prompt": "A solid white line on a road dividing traffic moving in the same direction means:",
    "choices": [
      "You may change lanes freely",
      "Lane changing is discouraged but not prohibited",
      "Crossing the line is allowed only when overtaking",
      "Mandatory single-file driving"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A solid white line separates lanes of traffic moving in the same direction and discourages lane changes. A broken white line indicates lane changes are permitted.",
    "source": "PH Road Signs and Pavement Markings Manual Sec. 4"
  },
  {
    "id": "q14",
    "category": "Road Signs",
    "prompt": "A solid yellow line on a two-way road means:",
    "choices": [
      "Overtaking permitted with caution",
      "Overtaking is prohibited — do not cross the line",
      "Right of way for yellow vehicles",
      "Buses only"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A solid yellow line separates opposing traffic and prohibits overtaking. A broken yellow line allows overtaking when safe.",
    "source": "PH Road Signs and Pavement Markings Manual Sec. 4.2"
  },
  {
    "id": "q15",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign showing a truck silhouette on a downward slope means:",
    "choices": [
      "Truck route only",
      "Steep downgrade ahead — reduce speed and use lower gears",
      "Truck stop ahead",
      "Loading zone for trucks"
    ],
    "correctAnswerIndex": 1,
    "explanation": "This warning sign indicates a steep descending grade. Drivers — especially of heavy vehicles — should reduce speed, downshift, and avoid riding the brakes.",
    "source": "PH Road Signs Manual W7-1"
  },
  {
    "id": "q16",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign with two arrows pointing in opposite vertical directions indicates:",
    "choices": [
      "Reversible lane",
      "Two-way traffic ahead — be alert for oncoming vehicles",
      "Heavy traffic area",
      "Steep upgrade and downgrade"
    ],
    "correctAnswerIndex": 1,
    "explanation": "This warning sign alerts drivers that a road ahead changes from one-way to two-way traffic. Be prepared for oncoming vehicles and stay in your lane.",
    "source": "PH Road Signs Manual W6-3"
  },
  {
    "id": "q17",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign with a wavy line warns drivers of:",
    "choices": [
      "Road repairs ahead",
      "Bumps, dips, or uneven road surface — reduce speed",
      "Slippery road surface",
      "Lane shift ahead"
    ],
    "correctAnswerIndex": 1,
    "explanation": "This sign warns of uneven pavement, bumps, or dips. Reduce speed to maintain control and avoid vehicle damage.",
    "source": "PH Road Signs Manual W8-1"
  },
  {
    "id": "q18",
    "category": "Road Signs",
    "prompt": "A round yellow sign with a black X and the letters 'RR' warns of:",
    "choices": [
      "Roundabout ahead",
      "Railroad crossing ahead — be prepared to stop",
      "Restricted road",
      "Right-of-way to railway vehicles only"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The round yellow railroad crossing warning sign tells drivers a railway intersection is ahead. Slow down, look both ways, and stop if a train is approaching.",
    "source": "PH Road Signs Manual W10-1"
  },
  {
    "id": "q19",
    "category": "Road Signs",
    "prompt": "A circular blue sign with a single red diagonal line through it (containing a white 'P') means:",
    "choices": [
      "No entry",
      "No parking permitted",
      "End of restriction",
      "Caution"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The No Parking sign (blue circle with one red diagonal line) prohibits parking but permits brief stops for loading/unloading. The No Stopping sign uses two crossed red diagonal lines.",
    "source": "PH Road Signs Manual R5-1"
  },
  {
    "id": "q20",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign with the word 'SLOW' instructs drivers to:",
    "choices": [
      "Stop completely",
      "Reduce speed in preparation for a hazard or slower zone ahead",
      "Drive in the slow lane",
      "Move to the shoulder"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A SLOW warning sign instructs drivers to reduce speed in anticipation of a hazard, intersection, or speed-restricted area ahead.",
    "source": "PH Road Signs Manual W12-1"
  },
  {
    "id": "q21",
    "category": "Road Signs",
    "prompt": "A regulatory sign with the image of a bus and the words 'BUS ONLY' indicates:",
    "choices": [
      "Buses must stop at this lane",
      "This lane is reserved for buses only — private vehicles prohibited",
      "Bus stop ahead",
      "Buses use the right lane only"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A bus-only lane sign reserves the lane for public buses. Private vehicles using a bus-only lane during posted hours commit a traffic violation.",
    "source": "PH Road Signs Manual R6-1"
  },
  {
    "id": "q22",
    "category": "Road Signs",
    "prompt": "A circular blue sign showing a white arrow curving right (with no other arrows) means:",
    "choices": [
      "Caution: right turn ahead",
      "Right turn only — drivers must turn right at the intersection",
      "Yield to vehicles turning right",
      "No right turn"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A mandatory turn sign (blue circle with white arrow) requires drivers to follow the indicated direction.",
    "source": "PH Road Signs Manual R8-1"
  },
  {
    "id": "q23",
    "category": "Road Signs",
    "prompt": "A circular white sign with a red border showing a left-curving arrow crossed by a red diagonal slash means:",
    "choices": [
      "Left turn only on weekends",
      "No left turn permitted at this intersection",
      "Sharp curve to the left ahead",
      "Yield to vehicles turning left"
    ],
    "correctAnswerIndex": 1,
    "explanation": "This regulatory sign prohibits left turns at the indicated intersection. Drivers must continue straight or turn right where the sign is posted.",
    "source": "PH Road Signs Manual R3-1"
  },
  {
    "id": "q24",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign showing a tunnel entrance warns drivers of:",
    "choices": [
      "Tunnel ahead — turn on headlights and reduce speed",
      "Bridge ahead",
      "Lane reduction",
      "Underground parking"
    ],
    "correctAnswerIndex": 0,
    "explanation": "This warning sign alerts drivers to an approaching tunnel. Turn on headlights, remove sunglasses, and reduce speed before entering.",
    "source": "PH Road Signs Manual W9-1"
  },
  {
    "id": "q25",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign showing rocks tumbling down warns drivers of:",
    "choices": [
      "Construction zone",
      "Falling rocks or rockfall area — exercise caution",
      "Quarry ahead",
      "Mountain road ending"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A falling rocks warning sign indicates a section of road where loose rocks may fall from adjacent slopes. Stay alert, avoid stopping under rocky overhangs.",
    "source": "PH Road Signs Manual W8-3"
  },
  {
    "id": "q26",
    "category": "Road Signs",
    "prompt": "A blue square sign with a white 'H' indicates:",
    "choices": [
      "Highway exit",
      "Hospital nearby — reduce noise and watch for emergency vehicles",
      "Heliport",
      "Hotel"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A blue square with a white H indicates a hospital is nearby. Drivers should reduce noise (avoid horn use) and be alert for emergency vehicles.",
    "source": "PH Road Signs Manual, Service Signs"
  },
  {
    "id": "q27",
    "category": "Road Signs",
    "prompt": "A blue square sign showing a pedestrian on white horizontal stripes indicates:",
    "choices": [
      "Pedestrian crossing — vehicles must give way",
      "Pedestrian-only zone",
      "Bus stop",
      "Sidewalk only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "This is a regulatory sign indicating a marked pedestrian crossing. Drivers must yield to pedestrians using the crosswalk.",
    "source": "PH Road Signs Manual R7-1; RA 4136 Sec. 42(d)"
  },
  {
    "id": "q28",
    "category": "Road Signs",
    "prompt": "A circular white sign showing a number with diagonal black lines crossing it means:",
    "choices": [
      "Maximum speed at exactly that number",
      "Minimum speed",
      "End of the speed restriction shown",
      "Reduce to half that speed"
    ],
    "correctAnswerIndex": 2,
    "explanation": "A speed limit sign with diagonal lines crossing it means the previously posted speed restriction ends. Drivers may resume the default speed limit.",
    "source": "PH Road Signs Manual R2-5"
  },
  {
    "id": "q29",
    "category": "Road Signs",
    "prompt": "A regulatory sign showing a vehicle being loaded with the text 'LOADING ZONE' indicates:",
    "choices": [
      "Parking is permitted for loading/unloading only, usually time-limited",
      "Heavy vehicles only",
      "Cargo inspection zone",
      "Bus loading area"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A loading zone sign designates an area where parking is permitted only for the purpose of loading or unloading, usually with a time limit posted.",
    "source": "LTO Traffic Management Guidelines"
  },
  {
    "id": "q30",
    "category": "Road Signs",
    "prompt": "A yellow diamond sign showing the silhouette of a deer or cattle warns drivers of:",
    "choices": [
      "Petting zoo ahead",
      "Wildlife or livestock crossing — be alert for animals on the road",
      "Veterinary clinic nearby",
      "Farm vehicles only"
    ],
    "correctAnswerIndex": 1,
    "explanation": "This warning sign alerts drivers to areas where animals may cross the road. Reduce speed and be prepared to stop, especially at dawn and dusk.",
    "source": "PH Road Signs Manual W11-3"
  },
  {
    "id": "q31",
    "category": "Traffic Rules",
    "prompt": "At an intersection without traffic signs or signals where two vehicles arrive at the same time, who has the right of way?",
    "choices": [
      "The larger vehicle",
      "The vehicle on the right",
      "The vehicle on the left",
      "Whichever vehicle accelerates first"
    ],
    "correctAnswerIndex": 1,
    "explanation": "At an uncontrolled intersection, the driver on the LEFT must yield to the vehicle on the RIGHT when both arrive at approximately the same time.",
    "source": "RA 4136 Sec. 42"
  },
  {
    "id": "q32",
    "category": "Traffic Rules",
    "prompt": "Under RA 4136, what is the maximum speed for passenger cars on through streets or boulevards (clear, no blind corners) within populated areas?",
    "choices": [
      "20 km/h",
      "30 km/h",
      "40 km/h",
      "60 km/h"
    ],
    "correctAnswerIndex": 2,
    "explanation": "RA 4136 Section 35 sets the maximum speed at 40 km/h for passenger cars and motorcycles on through streets or boulevards within populated areas. Trucks and buses are limited to 30 km/h.",
    "source": "RA 4136 Sec. 35"
  },
  {
    "id": "q33",
    "category": "Traffic Rules",
    "prompt": "How far before a turn must a driver signal his or her intention to turn?",
    "choices": [
      "Just before turning the steering wheel",
      "At least 30 meters before the turning point",
      "Only if other vehicles are visible behind",
      "Only when turning left"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A driver must signal at least 30 meters before the turning point and continue signaling until the turn is completed.",
    "source": "RA 4136 Sec. 44"
  },
  {
    "id": "q34",
    "category": "Traffic Rules",
    "prompt": "Overtaking another vehicle is PROHIBITED in which situation?",
    "choices": [
      "On a straight, empty road during daylight",
      "When approaching the crest of a hill or a curve where the view is obstructed",
      "When the vehicle ahead is signaling a right turn",
      "When passing on a designated overtaking lane"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Overtaking is prohibited when approaching the crest of a grade or curve with obstructed view, within 30m of intersections and pedestrian crossings, and at railway crossings.",
    "source": "RA 4136 Sec. 41"
  },
  {
    "id": "q35",
    "category": "Traffic Rules",
    "prompt": "When approaching a school zone during school hours, the maximum speed for any vehicle is:",
    "choices": [
      "10 km/h",
      "20 km/h",
      "30 km/h",
      "40 km/h"
    ],
    "correctAnswerIndex": 1,
    "explanation": "RA 4136 sets a maximum speed of 20 km/h when passing a school, hospital, or church zone during school hours or while children are present.",
    "source": "RA 4136 Sec. 35(b)"
  },
  {
    "id": "q36",
    "category": "Traffic Rules",
    "prompt": "A driver should use headlights:",
    "choices": [
      "Only on highways",
      "From half an hour after sunset until half an hour before sunrise, and during low visibility",
      "Only when other vehicles approach",
      "Only during rain"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Headlights must be used from one-half hour after sunset until one-half hour before sunrise, and at any time when there is insufficient light to see clearly (fog, rain, dust).",
    "source": "RA 4136 Sec. 34"
  },
  {
    "id": "q37",
    "category": "Traffic Rules",
    "prompt": "When backing up a vehicle on a road, the driver must:",
    "choices": [
      "Honk continuously while backing",
      "Ensure the movement can be made safely without interfering with other traffic",
      "Have a passenger guide them",
      "Use only the right side mirror"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A driver may not back a vehicle unless the movement can be made with reasonable safety and without interfering with other traffic.",
    "source": "RA 4136 Sec. 47"
  },
  {
    "id": "q38",
    "category": "Traffic Rules",
    "prompt": "Under what circumstance is overtaking on the RIGHT permitted on a Philippine road?",
    "choices": [
      "Whenever the road is wide enough",
      "Only when the vehicle ahead is signaling a left turn, or on a one-way road with multiple lanes",
      "Anytime on highways",
      "Never under any circumstance"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Under RA 4136, overtaking on the right is generally prohibited but permitted when the vehicle ahead is making a left turn, or on a one-way road with sufficient lanes.",
    "source": "RA 4136 Sec. 41"
  },
  {
    "id": "q39",
    "category": "Traffic Rules",
    "prompt": "A yellow (amber) traffic light at an intersection means:",
    "choices": [
      "Speed up to cross before red",
      "Caution — prepare to stop unless already too close to the intersection to stop safely",
      "Drive normally",
      "Equivalent to a green light"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A yellow light signals that the signal is about to turn red. Drivers should stop before entering the intersection if it is safe to do so.",
    "source": "RA 4136 Sec. 38; LTO Traffic Signal Regulations"
  },
  {
    "id": "q40",
    "category": "Traffic Rules",
    "prompt": "At an intersection in the Philippines, can a driver turn right when the traffic light is red?",
    "choices": [
      "Yes, always, without stopping",
      "Only if a 'Right Turn on Red' sign is explicitly posted",
      "Yes, but must stop completely first",
      "No, right turns are never allowed on red"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Right turn on red is NOT a default rule in the Philippines. It is permitted only at intersections where a 'Right Turn on Red' sign is explicitly posted, and only after a complete stop.",
    "source": "LTO Traffic Signal Regulations"
  },
  {
    "id": "q41",
    "category": "Traffic Rules",
    "prompt": "When an emergency vehicle (ambulance, fire truck, police) approaches with siren and flashing lights, drivers must:",
    "choices": [
      "Maintain speed and lane",
      "Yield the right of way — pull to the right edge of the road and stop until it passes",
      "Move to the left lane",
      "Sound the horn in response"
    ],
    "correctAnswerIndex": 1,
    "explanation": "RA 4136 requires drivers to yield to emergency vehicles using sirens and flashing lights. Pull to the right edge of the road, stop, and remain stationary until it passes.",
    "source": "RA 4136 Sec. 49"
  },
  {
    "id": "q42",
    "category": "Traffic Rules",
    "prompt": "When a pedestrian is using a marked crosswalk without a traffic signal, drivers approaching must:",
    "choices": [
      "Sound the horn to warn the pedestrian",
      "Yield the right of way and stop if necessary to let the pedestrian cross",
      "Maintain speed and pass behind the pedestrian",
      "Only stop if the pedestrian signals"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Pedestrians using a marked crosswalk where no signal directs traffic have the right of way. Drivers must yield, slowing or stopping as needed.",
    "source": "RA 4136 Sec. 42(d)"
  },
  {
    "id": "q43",
    "category": "Traffic Rules",
    "prompt": "When changing lanes, a driver must:",
    "choices": [
      "Change lanes immediately if a gap is available",
      "Signal the intended lane change continuously until the change is completed",
      "Use hand signals only on highways",
      "Signal only when other vehicles are visible"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Lane changes require continuous signaling from before the move until the change is completed, regardless of whether other vehicles are visible.",
    "source": "RA 4136 Sec. 44"
  },
  {
    "id": "q44",
    "category": "Traffic Rules",
    "prompt": "When the vehicle's turn signal device is broken, the hand signal for a LEFT turn is:",
    "choices": [
      "Arm extended straight out the driver's window",
      "Arm bent upward at the elbow, hand pointing up",
      "Arm bent downward at the elbow, hand pointing down",
      "Arm waving in a circle"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The hand signal for a left turn is the left arm extended horizontally straight out the driver's window.",
    "source": "RA 4136 Sec. 44"
  },
  {
    "id": "q45",
    "category": "Traffic Rules",
    "prompt": "When the vehicle's turn signal device is broken, the hand signal for a RIGHT turn is:",
    "choices": [
      "Arm extended straight out the driver's window",
      "Left arm bent upward at the elbow, hand pointing up",
      "Left arm bent downward at the elbow, hand pointing down",
      "Right hand pointing through the windshield"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The hand signal for a right turn is the left arm bent upward at the elbow with the hand pointing upward.",
    "source": "RA 4136 Sec. 44"
  },
  {
    "id": "q46",
    "category": "Traffic Rules",
    "prompt": "When the vehicle's brake light is broken, the hand signal for STOP is:",
    "choices": [
      "Left arm extended horizontally",
      "Left arm bent downward at the elbow, hand pointing down",
      "Hand waving up and down out the window",
      "Right hand on the steering wheel"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The hand signal for stopping or slowing is the left arm bent downward at the elbow with the hand pointing down.",
    "source": "RA 4136 Sec. 44"
  },
  {
    "id": "q47",
    "category": "Traffic Rules",
    "prompt": "Under RA 11229 (Child Safety in Motor Vehicles Act), what is required for children below 12 years old in private vehicles?",
    "choices": [
      "Children are allowed in the front passenger seat",
      "Children below 12 must use appropriate child restraint systems and must not be in the front seat",
      "Only seatbelt use is required",
      "No restrictions apply"
    ],
    "correctAnswerIndex": 1,
    "explanation": "RA 11229 prohibits children below 12 from sitting in the front passenger seat of private vehicles and requires appropriate child restraint systems for younger children.",
    "source": "RA 11229 (Child Safety in Motor Vehicles Act)"
  },
  {
    "id": "q48",
    "category": "Traffic Rules",
    "prompt": "Under RA 10913 (Anti-Distracted Driving Act), using a mobile phone while driving is:",
    "choices": [
      "Permitted only at low speeds",
      "Permitted with hands-free devices when the vehicle is moving",
      "Prohibited for handheld use; hands-free is allowed",
      "Always permitted"
    ],
    "correctAnswerIndex": 2,
    "explanation": "RA 10913 prohibits the use of handheld mobile phones, tablets, and other communication devices while driving. Hands-free devices are permitted as long as they do not impair driving.",
    "source": "RA 10913 (Anti-Distracted Driving Act)"
  },
  {
    "id": "q49",
    "category": "Traffic Rules",
    "prompt": "Under Philippine motorcycle laws, how many passengers can a standard motorcycle legally carry in addition to the driver?",
    "choices": [
      "Two passengers maximum",
      "One back-rider only",
      "Up to three with helmet requirements",
      "Unlimited if all wear helmets"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A standard motorcycle is limited to the driver plus one back-rider. Both must wear standard protective helmets per RA 10054.",
    "source": "RA 10054; LTO Memorandum Circulars"
  },
  {
    "id": "q50",
    "category": "Traffic Rules",
    "prompt": "When may a driver use the vehicle's horn?",
    "choices": [
      "Anytime to express frustration",
      "Only to warn other road users of imminent danger or to alert pedestrians who may not see the vehicle",
      "Continuously in heavy traffic",
      "Only between sunrise and sunset"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Horns are intended as warning devices. RA 4136 restricts horn use to legitimate safety warnings. Excessive use is prohibited, especially near hospitals and schools.",
    "source": "RA 4136 Sec. 51"
  },
  {
    "id": "q51",
    "category": "Traffic Rules",
    "prompt": "Following another vehicle more closely than is reasonable and prudent (tailgating) is:",
    "choices": [
      "Permitted at low speeds",
      "A traffic violation under RA 4136",
      "Allowed only on highways",
      "Acceptable when the vehicle ahead is slow"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Tailgating is a violation under RA 4136. The 3-second rule is the standard defensive measure for safe following distance.",
    "source": "RA 4136 Sec. 48"
  },
  {
    "id": "q52",
    "category": "Traffic Rules",
    "prompt": "Driving with a revoked driver's license carries:",
    "choices": [
      "Same penalty as driving without a license",
      "Lesser penalty since they once had a license",
      "Heavier penalty than driving without a license, plus potential criminal charges",
      "Verbal warning"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Driving with a revoked or suspended license carries heavier consequences than driving without one — substantial fines, additional demerit points, and potentially criminal charges.",
    "source": "RA 4136 Sec. 19; LTO Memorandum Circulars"
  },
  {
    "id": "q53",
    "category": "Penalties",
    "prompt": "Under RA 10054 (Motorcycle Helmet Act), who is required to wear a standard protective motorcycle helmet?",
    "choices": [
      "Only the driver",
      "Only the back-rider",
      "Both the driver and the back-rider, at all times on a public road",
      "Both, but only on highways"
    ],
    "correctAnswerIndex": 2,
    "explanation": "RA 10054 requires both the motorcycle driver and any back-rider to wear a standard protective helmet compliant with the Philippine National Standard (PNS), at all times on public roads.",
    "source": "RA 10054 Sec. 3"
  },
  {
    "id": "q54",
    "category": "Penalties",
    "prompt": "The consequence for driving without a valid license under current LTO rules includes:",
    "choices": [
      "Verbal warning only",
      "Immediate confiscation of the vehicle, no fine",
      "A fine, demerit points recorded against the registered owner, and possible additional penalties",
      "No penalty if the person is over 18 years old"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Driving without a valid license results in a fine and is recorded against the registered owner. The 2026 demerit point system adds demerit points affecting future license validity.",
    "source": "RA 4136 Sec. 19; LTO JMC"
  },
  {
    "id": "q55",
    "category": "Penalties",
    "prompt": "Under RA 10586 (Anti-Drunk and Drugged Driving Act), what is the legal BAC limit for a non-professional driver of a private vehicle?",
    "choices": [
      "0.00% BAC — zero tolerance",
      "0.05% blood alcohol concentration",
      "0.08% blood alcohol concentration",
      "No specific limit"
    ],
    "correctAnswerIndex": 1,
    "explanation": "RA 10586 sets a 0.05% BAC limit for non-professional drivers of private vehicles. Professional drivers and public utility/truck/bus operators are held to a zero-tolerance standard (0.00% BAC).",
    "source": "RA 10586 Sec. 5; IRR"
  },
  {
    "id": "q56",
    "category": "Penalties",
    "prompt": "Under the Single Ticketing System, how many days does a driver have to settle a fine before additional consequences apply?",
    "choices": [
      "3 days",
      "7 days",
      "15 working days",
      "30 days"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Under the Single Ticketing System, a driver has 15 working days from the date of citation to settle the fine. Failure to settle triggers additional demerit points.",
    "source": "LTO JMC on Single Ticketing System"
  },
  {
    "id": "q57",
    "category": "Penalties",
    "prompt": "Under RA 8750 (Seat Belts Use Act), who must wear a seatbelt while a private vehicle is in motion?",
    "choices": [
      "Only the driver",
      "The driver and the front-seat passenger",
      "The driver and all front-seat passengers",
      "Only on highways"
    ],
    "correctAnswerIndex": 2,
    "explanation": "RA 8750 requires the driver and all front-seat passengers to wear seatbelts while a private vehicle is in motion.",
    "source": "RA 8750 (Seat Belts Use Act of 1999)"
  },
  {
    "id": "q58",
    "category": "Penalties",
    "prompt": "Under RA 4136, 'reckless driving' is best described as:",
    "choices": [
      "Driving slightly over the speed limit",
      "Driving without due regard for the safety of persons or property considering road, weather, and traffic conditions",
      "Any driving without a license",
      "Driving at night without headlights"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Reckless driving under RA 4136 means operating a vehicle without due regard for safety, considering road type, weather, traffic density, and time of day. Significant penalties apply including license suspension.",
    "source": "RA 4136 Sec. 48"
  },
  {
    "id": "q59",
    "category": "Penalties",
    "prompt": "Beating a red traffic light typically results in:",
    "choices": [
      "Verbal warning",
      "Fine and demerit points; the violation is captured by traffic cameras in many areas",
      "Free pass if no other vehicle is present",
      "Optional payment"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Running a red light is a serious traffic violation. Many intersections in Metro Manila use traffic cameras under the No-Contact Apprehension Policy (NCAP). The violation carries a fine plus demerit points.",
    "source": "LTO JMC; MMDA NCAP regulations"
  },
  {
    "id": "q60",
    "category": "Penalties",
    "prompt": "Speeding fines under the current LTO penalty matrix:",
    "choices": [
      "Are a single flat amount regardless of how much the speed limit was exceeded",
      "Scale with how much the posted speed limit was exceeded",
      "Only apply to drivers under 25 years old",
      "Depend on the vehicle color"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Speeding fines under the current LTO matrix scale with how much the posted limit was exceeded — minor overage carries a smaller fine, while extreme overage carries substantially higher fines and additional demerit points.",
    "source": "LTO Penalty Matrix"
  },
  {
    "id": "q61",
    "category": "Penalties",
    "prompt": "Under RA 10913, repeated violations of the Anti-Distracted Driving Act result in:",
    "choices": [
      "No fine, only a warning",
      "Increasing fine amounts and license suspension for repeat offenders",
      "Fine on the first offense, then immediate revocation",
      "The same fine each time, no other consequences"
    ],
    "correctAnswerIndex": 1,
    "explanation": "RA 10913 establishes escalating penalties for repeat offenders, with fines increasing for second and third offenses. Repeated violations can trigger license suspension or revocation.",
    "source": "RA 10913"
  },
  {
    "id": "q62",
    "category": "Penalties",
    "prompt": "A driver involved in a traffic accident who leaves the scene without rendering assistance or reporting commits:",
    "choices": [
      "A minor traffic violation",
      "A criminal offense ('hit and run') under RA 4136 and the Revised Penal Code",
      "An administrative offense only",
      "No offense if no one was injured"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Leaving the scene of an accident is a criminal offense in the Philippines. Penalties include heavy fines, license revocation, and possible imprisonment depending on severity.",
    "source": "RA 4136 Sec. 55; Revised Penal Code"
  },
  {
    "id": "q63",
    "category": "Penalties",
    "prompt": "Under the No-Contact Apprehension Policy (NCAP), traffic violations are:",
    "choices": [
      "Always cited only with the driver physically present",
      "Captured by traffic cameras and the citation is sent to the vehicle's registered owner",
      "Only applicable to commercial vehicles",
      "Only for parking violations"
    ],
    "correctAnswerIndex": 1,
    "explanation": "NCAP uses traffic cameras to capture violations. The citation and fine are issued to the registered owner of the vehicle, even if a different person was driving.",
    "source": "LTO and LGU NCAP Implementing Regulations"
  },
  {
    "id": "q64",
    "category": "Penalties",
    "prompt": "License suspension under the demerit point system is typically triggered by:",
    "choices": [
      "One minor traffic violation",
      "Accumulating a defined number of demerit points within a specified period",
      "Any traffic ticket",
      "Failing to renew the license card"
    ],
    "correctAnswerIndex": 1,
    "explanation": "License suspension under the demerit system is triggered by accumulating demerit points beyond a defined threshold within a specified period.",
    "source": "LTO JMC Single Ticketing System"
  },
  {
    "id": "q65",
    "category": "Defensive Driving",
    "prompt": "What is the minimum recommended following distance behind another vehicle on a dry road at normal speeds?",
    "choices": [
      "1 second",
      "3 seconds",
      "10 seconds",
      "Half a car length"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The 3-second rule: when the vehicle ahead passes a fixed point, at least 3 seconds should pass before your vehicle reaches the same point. Increase to 4-6 seconds in rain, fog, or at night.",
    "source": "LTO Defensive Driving Curriculum; DO 2017-011"
  },
  {
    "id": "q66",
    "category": "Defensive Driving",
    "prompt": "If your vehicle begins to hydroplane on a wet road, what is the correct response?",
    "choices": [
      "Brake hard immediately to regain traction",
      "Ease off the accelerator, do not brake suddenly, keep the steering wheel straight",
      "Accelerate to push through the water",
      "Turn the wheel sharply to find dry pavement"
    ],
    "correctAnswerIndex": 1,
    "explanation": "When hydroplaning, tires lose contact with the road. Hard braking or sharp steering causes loss of control. Gently lift off the accelerator, hold the wheel firmly straight, and let the vehicle slow naturally.",
    "source": "LTO Defensive Driving Curriculum"
  },
  {
    "id": "q67",
    "category": "Defensive Driving",
    "prompt": "When approaching an intersection, a defensive driver should:",
    "choices": [
      "Maintain speed and trust the traffic signal",
      "Slow down, scan left-right-left, and be prepared to stop even with a green light",
      "Accelerate to clear the intersection quickly",
      "Sound the horn to warn other vehicles"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Defensive driving requires scanning the intersection, reducing speed, and being prepared to stop even with right of way. Other drivers may run red lights or fail to yield.",
    "source": "LTO Defensive Driving Curriculum"
  },
  {
    "id": "q68",
    "category": "Defensive Driving",
    "prompt": "The defensive driving process known as SIPDE stands for:",
    "choices": [
      "Stop, Inspect, Plan, Drive, Exit",
      "Scan, Identify, Predict, Decide, Execute",
      "Slow, Inform, Park, Drive, Engage",
      "Stop, Inform, Pause, Detect, Engage"
    ],
    "correctAnswerIndex": 1,
    "explanation": "SIPDE: Scan the environment, Identify potential hazards, Predict how they might develop, Decide on a response, Execute the action.",
    "source": "LTO Defensive Driving Curriculum"
  },
  {
    "id": "q69",
    "category": "Defensive Driving",
    "prompt": "A vehicle's 'blind spot' is:",
    "choices": [
      "The area in front of the vehicle blocked by the hood",
      "Areas around the vehicle that the driver cannot see in mirrors — typically just behind and to the side",
      "The area illuminated by the headlights at night",
      "The area covered by windshield wipers"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Blind spots are areas not visible in the rear-view or side mirrors — typically just behind the driver and passenger doors. Drivers must check by turning their head before lane changes.",
    "source": "LTO Defensive Driving Curriculum"
  },
  {
    "id": "q70",
    "category": "Defensive Driving",
    "prompt": "One core principle of the Smith System for defensive driving is:",
    "choices": [
      "Drive as fast as legally allowed",
      "Aim high in steering — look far ahead, not just at the vehicle in front of you",
      "Use only the right lane on highways",
      "Never use mirrors"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The Smith System teaches drivers to 'aim high in steering' — look far ahead (at least 15 seconds down the road) to anticipate hazards early.",
    "source": "LTO Defensive Driving Curriculum (Smith System)"
  },
  {
    "id": "q71",
    "category": "Defensive Driving",
    "prompt": "When driving at night, a safer practice is to:",
    "choices": [
      "Use high beams continuously",
      "Increase following distance and avoid looking directly at oncoming headlights",
      "Drive faster to clear roads sooner",
      "Turn off the radio"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Night driving safety includes increasing following distance (4-6 seconds), avoiding direct gaze at oncoming headlights (look to the right edge), and using high beams only when no other traffic is present.",
    "source": "LTO Defensive Driving Curriculum"
  },
  {
    "id": "q72",
    "category": "Defensive Driving",
    "prompt": "If the rear wheels of your vehicle begin to skid sideways, the correct response is:",
    "choices": [
      "Brake hard immediately",
      "Steer in the direction the rear of the vehicle is sliding (steer into the skid) and ease off the accelerator",
      "Accelerate to straighten the vehicle",
      "Turn the steering wheel away from the skid"
    ],
    "correctAnswerIndex": 1,
    "explanation": "When the rear skids, steer into the skid (in the direction the rear is sliding) and gently release the accelerator. Hard braking or counter-steering typically worsens the skid.",
    "source": "LTO Defensive Driving Curriculum"
  },
  {
    "id": "q73",
    "category": "General & Republic Acts",
    "prompt": "Before applying for a Non-Professional Driver's License, a Student Permit holder must:",
    "choices": [
      "Pay a registration fee only",
      "Hold a Student Permit for at least one month and complete both the Theoretical Driving Course (TDC) and Practical Driving Course (PDC)",
      "Pass only the written exam",
      "Own a vehicle registered in their name"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Under DO 2017-011, a Student Permit must be held for at least one month before applying for a Non-Pro License. The applicant must also complete the 15-hour TDC (online via LTMS) and the 7-hour PDC at an accredited driving school.",
    "source": "LTO Department Order 2017-011"
  },
  {
    "id": "q74",
    "category": "General & Republic Acts",
    "prompt": "The 'Restriction Code' on a Philippine driver's license indicates:",
    "choices": [
      "The number of traffic violations",
      "The types and categories of vehicles the holder is authorized to drive",
      "The expiration date",
      "The license fee paid"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Restriction Codes indicate which vehicle classifications the holder is authorized to drive — e.g., Code 1 for motorcycles, Code 2 for vehicles up to 4,500 kg, Code 3 for vehicles over 4,500 kg.",
    "source": "LTO Department Order 2017-011"
  },
  {
    "id": "q75",
    "category": "General & Republic Acts",
    "prompt": "A Filipino driver's license issued today with a clean driving record has a maximum validity of:",
    "choices": [
      "1 year",
      "5 years",
      "10 years",
      "20 years"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Under current LTO rules, first-time holders and renewing drivers with clean records qualify for a 10-year license validity. Drivers with demerit accumulation receive 5-year validity instead.",
    "source": "LTO Memorandum Circular on 10-Year Driver's License"
  }
];

if (__DEV__) {
  assertValidQuestionData(questions);
  assertValidRandomization(questions);
}
