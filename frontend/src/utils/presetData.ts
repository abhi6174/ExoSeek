import type { ExoFeatures } from "../types/ExoTypes";

export interface ExoplanetPreset {
  id: string;
  name: string;
  classLabel: "CONFIRMED" | "FALSE POSITIVE";
  description: string;
  features: ExoFeatures;
  funFact: string;
  chatResponses: {
    atmosphere: string;
    surface: string;
    life: string;
  };
}

export const EXOPLANET_PRESETS: ExoplanetPreset[] = [
  {
    id: "kepler-22b",
    name: "Kepler-22b",
    classLabel: "CONFIRMED",
    description: "The first planet discovered by Kepler in the habitable zone of a Sun-like star. Located 635 light-years away in the Cygnus constellation.",
    funFact: "Often dubbed an 'ocean world', it is likely covered in a global liquid ocean with a volatile water-rich atmosphere.",
    features: {
      koi_period: 289.8623,
      koi_duration_err1: 0.081,
      koi_duration_err2: -0.081,
      koi_prad: 2.38,
      koi_prad_err1: 0.13,
      koi_prad_err2: -0.13,
      koi_insol_err1: 0.12,
      koi_model_snr: 16.7,
      koi_steff_err1: 74.0,
      koi_steff_err2: -74.0,
    },
    chatResponses: {
      atmosphere: "Likely a thick envelope of hydrogen and helium, but possibly with a high concentration of water vapor and steam, creating a runaway greenhouse effect but capped by a deep global ocean.",
      surface: "As a 'Sub-Neptune' or 'Ocean World', it probably lacks a solid rocky surface. Instead, it has a massive global ocean hundreds of kilometers deep, transitioning into a superheated high-pressure ice mantle.",
      life: "While its temperature is mild (around 22°C / 72°F), the lack of a dry rocky surface and the extreme atmospheric pressure make complex terrestrial life unlikely. However, exotic aquatic microscopic life could theoretically thrive in the oceans."
    }
  },
  {
    id: "kepler-10b",
    name: "Kepler-10b",
    classLabel: "CONFIRMED",
    description: "A scorching hot rocky planet that orbits its host star in less than a single Earth day, located 560 light-years away.",
    funFact: "It is tidally locked to its star, meaning one side is a permanent ocean of molten lava with temperatures reaching 1,800 K.",
    features: {
      koi_period: 0.8375,
      koi_duration_err1: 0.002,
      koi_duration_err2: -0.002,
      koi_prad: 1.47,
      koi_prad_err1: 0.05,
      koi_prad_err2: -0.05,
      koi_insol_err1: 350.0,
      koi_model_snr: 125.0,
      koi_steff_err1: 110.0,
      koi_steff_err2: -110.0,
    },
    chatResponses: {
      atmosphere: "Essentially non-existent or composed of vaporized rock and silicate clouds that rain liquid rock back onto the surface due to the intense stellar winds stripping away lighter gases.",
      surface: "A hellish landscape of molten rock and active volcanoes. The dayside is a glowing sea of liquid magma, while the nightside may consist of solid basaltic rock cooled by the vacuum of space.",
      life: "Completely impossible for organic life. The extreme heat, lack of liquid water, and radiation from its extremely close host star would disintegrate any known molecular structures."
    }
  },
  {
    id: "kepler-186f",
    name: "Kepler-186f",
    classLabel: "CONFIRMED",
    description: "The first Earth-sized planet discovered in the habitable zone of another star (a cool M-dwarf), roughly 580 light-years away.",
    funFact: "Its star is a red dwarf, so its midday sky would look like Earth's evening twilight, and the sunset would appear dark orange-red.",
    features: {
      koi_period: 129.9459,
      koi_duration_err1: 0.12,
      koi_duration_err2: -0.12,
      koi_prad: 1.17,
      koi_prad_err1: 0.08,
      koi_prad_err2: -0.08,
      koi_insol_err1: 0.05,
      koi_model_snr: 13.4,
      koi_steff_err1: 98.0,
      koi_steff_err2: -98.0,
    },
    chatResponses: {
      atmosphere: "Possibly similar to Earth but potentially thicker to help retain heat, given that it receives only 32% of the sunlight Earth does. A carbon dioxide-rich greenhouse effect would be necessary to keep it warm.",
      surface: "Very likely rocky and solid, with gravity similar to Earth (about 90%). It may feature liquid water oceans, icy glaciers, and cold tundra-like terrain.",
      life: "A prime candidate for life! Plants or photosynthetic organisms there would have to adapt to red stellar light, potentially evolving dark red, black, or purple foliage instead of green."
    }
  },
  {
    id: "kepler-16b",
    name: "Kepler-16b (Tatooine)",
    classLabel: "CONFIRMED",
    description: "A cold, Saturn-sized gas giant that orbits a binary star system, meaning it has two suns in its sky.",
    funFact: "If you stood on the planet (or one of its moons), you would see two suns set on the horizon, just like Luke Skywalker's home planet Tatooine.",
    features: {
      koi_period: 228.776,
      koi_duration_err1: 0.02,
      koi_duration_err2: -0.02,
      koi_prad: 8.43,
      koi_prad_err1: 0.3,
      koi_prad_err2: -0.3,
      koi_insol_err1: 0.04,
      koi_model_snr: 180.0,
      koi_steff_err1: 65.0,
      koi_steff_err2: -65.0,
    },
    chatResponses: {
      atmosphere: "A thick, freezing gaseous envelope composed primarily of hydrogen, helium, and methane clouds. The double stellar wind creates complex atmospheric currents.",
      surface: "It has no solid surface, being a gas giant. However, if it has rocky moons, they could have solid surfaces, though they would be freezing cold with temperatures around -100°C / -150°F.",
      life: "The planet itself is hostile to life as we know it due to its gaseous nature and sub-zero temperatures. However, its hypothetically large moons might support subsurface water oceans heated by tidal forces, where life could arise."
    }
  },
  {
    id: "koi-256",
    name: "KOI-256 (Binary Star)",
    classLabel: "FALSE POSITIVE",
    description: "Initially flagged as a giant exoplanet candidate, astronomers discovered it is actually an eclipsing binary system consisting of a red dwarf and a white dwarf.",
    funFact: "The white dwarf's gravity is so intense that it bends the light of the red dwarf as they orbit, creating a gravitational lensing effect.",
    features: {
      koi_period: 1.3786,
      koi_duration_err1: 0.001,
      koi_duration_err2: -0.001,
      koi_prad: 25.4,
      koi_prad_err1: 1.2,
      koi_prad_err2: -1.2,
      koi_insol_err1: 1200.0,
      koi_model_snr: 850.0,
      koi_steff_err1: 250.0,
      koi_steff_err2: -250.0,
    },
    chatResponses: {
      atmosphere: "N/A. This is not a planet! It is a stellar system. The high planetary radius (25x Earth) and massive SNR signal are due to the red dwarf being eclipsed by the white dwarf.",
      surface: "A scorching hot star surface. Red dwarfs are composed of convective plasma, while the white dwarf companion is an extremely dense carbon-oxygen core radiating high-energy X-rays.",
      life: "Zero habitability. The system is bathed in intense ultraviolet and X-ray radiation from the white dwarf, plus massive plasma flares from the active red dwarf."
    }
  },
  {
    id: "stellar-noise",
    name: "Stellar Flare / Noise",
    classLabel: "FALSE POSITIVE",
    description: "A simulated candidate showing high instrumental noise and stellar activity which creates a false detection.",
    funFact: "Stellar spots and flares can mimic the periodic dimming of a planet, tricking algorithms into detecting non-existent worlds.",
    features: {
      koi_period: 15.2,
      koi_duration_err1: 0.8,
      koi_duration_err2: -0.8,
      koi_prad: 0.85,
      koi_prad_err1: 0.6,
      koi_prad_err2: -0.6,
      koi_insol_err1: 12.0,
      koi_model_snr: 4.2,
      koi_steff_err1: 180.0,
      koi_steff_err2: -180.0,
    },
    chatResponses: {
      atmosphere: "N/A. No planet exists here. The signal was a statistical anomaly caused by space telescope camera noise or stellar activity.",
      surface: "N/A. There is no solid surface to scan. Any apparent 'transit' was just a dark starspot rotating across the stellar disk.",
      life: "N/A. Without a planet, there is no cradle for biology. The system remains a lonely stellar wilderness."
    }
  }
];
