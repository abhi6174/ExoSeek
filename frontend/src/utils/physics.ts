/**
 * Scientific physics engine for exoplanet calculations.
 * Estimates planetary properties from orbital period, radius, and star properties.
 */

export interface PhysicalProperties {
  semiMajorAxis: number;      // AU
  estimatedInsolation: number; // Earth Solar Flux units
  equilibriumTemp: number;     // Kelvin
  equilibriumTempC: number;    // Celsius
  earthSimilarityIndex: number;// 0.0 to 1.0
  planetClass: string;         // e.g. "Super-Earth"
  surfaceGravity: number;      // g (Earth gravity relative)
  habitableZoneStatus: "Conservative" | "Optimistic" | "Too Hot" | "Too Cold";
  habitableZoneColor: string;
}

export const getPlanetClass = (radius: number): string => {
  if (radius < 0.5) return "Sub-Earth / Mercurian";
  if (radius < 1.25) return "Earth-sized / Terran";
  if (radius < 2.0) return "Super-Earth / Super-Terran";
  if (radius < 4.0) return "Sub-Neptune / Mini-Neptune";
  if (radius < 8.0) return "Neptune-like / Jovian Class I";
  return "Gas Giant / Jovian Class II";
};

export const calculatePhysicalProperties = (
  period: number, 
  radius: number, 
  stellarLuminosity: number = 1.0
): PhysicalProperties => {
  // 1. Semi-Major Axis (a) in AU using Kepler's Third Law (assuming stellar mass ~ 1 M_sun as baseline)
  // a = (period / 365.25) ^ (2/3)
  const semiMajorAxis = Math.pow(period / 365.25, 2 / 3);

  // 2. Estimated Insolation Flux (relative to Earth solar flux = 1.0)
  // I = L_star / a^2
  const estimatedInsolation = stellarLuminosity / Math.pow(semiMajorAxis, 2);

  // 3. Equilibrium Temperature (T_eq) in Kelvin
  // T_eq = 278 * (L_star ^ 0.25) / sqrt(a)
  // This assumes an Earth-like albedo of 0.3
  const equilibriumTemp = 278 * Math.pow(stellarLuminosity, 0.25) / Math.sqrt(semiMajorAxis);
  const equilibriumTempC = equilibriumTemp - 273.15;

  // 4. Earth Similarity Index (ESI)
  // ESI = 1 - sqrt( 0.5 * ( ((Rp - 1)/(Rp + 1))^2 + ((Teq - 288)/(Teq + 288))^2 ) )
  const radiusTerm = Math.pow((radius - 1) / (radius + 1), 2);
  const tempTerm = Math.pow((equilibriumTemp - 288) / (equilibriumTemp + 288), 2);
  const earthSimilarityIndex = Math.max(0, 1 - Math.sqrt(0.5 * (radiusTerm + tempTerm)));

  // 5. Estimated Surface Gravity (g)
  // Mass scales differently for rocky vs gaseous.
  // Rocky: Mass ~ R^3.7 (constant density, compressed) -> g ~ Mass/R^2 -> g ~ R^1.7
  // Gas/Ice: Mass ~ R^2 -> g ~ Mass/R^2 -> g ~ 1 (roughly constant g due to hydrogen envelope)
  let surfaceGravity = 1.0;
  if (radius < 2.0) {
    surfaceGravity = Math.pow(radius, 1.3); // Rocky scaling
  } else if (radius < 6.0) {
    surfaceGravity = 1.2 + 0.1 * (radius - 2.0); // Neptune-like transition
  } else {
    surfaceGravity = 1.5 + 0.05 * (radius - 6.0); // Jovian gravity scales up slowly
  }

  // 6. Habitable Zone Status
  // Conservative HZ: 240K to 290K
  // Optimistic HZ: 200K to 320K
  let habitableZoneStatus: PhysicalProperties["habitableZoneStatus"] = "Too Hot";
  let habitableZoneColor = "text-red-500 bg-red-500/10 border-red-500/20";

  if (equilibriumTemp >= 240 && equilibriumTemp <= 290) {
    habitableZoneStatus = "Conservative";
    habitableZoneColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  } else if (equilibriumTemp >= 200 && equilibriumTemp <= 320) {
    habitableZoneStatus = "Optimistic";
    habitableZoneColor = "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
  } else if (equilibriumTemp < 200) {
    habitableZoneStatus = "Too Cold";
    habitableZoneColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
  }

  return {
    semiMajorAxis,
    estimatedInsolation,
    equilibriumTemp,
    equilibriumTempC,
    earthSimilarityIndex,
    planetClass: getPlanetClass(radius),
    surfaceGravity,
    habitableZoneStatus,
    habitableZoneColor
  };
};
