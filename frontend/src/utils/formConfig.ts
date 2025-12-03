import type { FeatureMetadata } from "../types/ExoTypes";

export const FEATURE_CONFIG: FeatureMetadata[] = [
  {
    key: "koi_period",
    label: "Orbital Period (days)",
    description: "How long the planet takes to orbit its star.",
    step: "0.0001",
    defaultValue: 10.5,
  },
  {
    key: "koi_prad",
    label: "Planetary Radius (Earth radii)",
    description: "The size of the planet compared to Earth.",
    step: "0.01",
    defaultValue: 2.1,
  },
  {
    key: "koi_model_snr",
    label: "Signal-to-Noise Ratio",
    description: "Strength of the transit signal relative to noise.",
    step: "0.1",
    defaultValue: 35.0,
  },
  {
    key: "koi_duration_err1",
    label: "Duration Error (+)",
    description: "Uncertainty in transit duration (upper bound).",
    step: "0.0001",
    defaultValue: 0.05,
  },
  {
    key: "koi_duration_err2",
    label: "Duration Error (-)",
    description: "Uncertainty in transit duration (lower bound).",
    step: "0.0001",
    defaultValue: -0.05,
  },
  {
    key: "koi_prad_err1",
    label: "Radius Error (+)",
    description: "Uncertainty in planetary radius (upper bound).",
    step: "0.01",
    defaultValue: 0.3,
  },
  {
    key: "koi_prad_err2",
    label: "Radius Error (-)",
    description: "Uncertainty in planetary radius (lower bound).",
    step: "0.01",
    defaultValue: -0.3,
  },
  {
    key: "koi_insol_err1",
    label: "Insolation Flux Error (+)",
    description: "Uncertainty in sunlight received.",
    step: "0.1",
    defaultValue: 5.0,
  },
  {
    key: "koi_steff_err1",
    label: "Stellar Temp Error (+)",
    description: "Uncertainty in star temperature (upper).",
    step: "1.0",
    defaultValue: 80.0,
  },
  {
    key: "koi_steff_err2",
    label: "Stellar Temp Error (-)",
    description: "Uncertainty in star temperature (lower).",
    step: "1.0",
    defaultValue: -80.0,
  },
];