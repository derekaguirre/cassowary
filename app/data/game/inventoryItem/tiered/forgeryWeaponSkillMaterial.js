export const forgery_proper_data = [
  {
    general_name: "metallic_drip",
    name: "inert_metallic_drip",
    tier: 1,
    from: undefined,
    to: "reactive_metallic_drip",
    count: 3,
  },
  {
    general_name: "metallic_drip",
    name: "reactive_metallic_drip",
    tier: 2,
    from: "inert_metallic_drip",
    to: "polarized_metallic_drip",
    count: 3,
  },
  {
    general_name: "metallic_drip",
    name: "polarized_metallic_drip",
    tier: 3,
    from: "reactive_metallic_drip",
    to: "heterized_metallic_drip",
    count: 3,
  },
  {
    general_name: "metallic_drip",
    name: "heterized_metallic_drip",
    tier: 4,
    from: "polarized_metallic_drip",
    to: undefined,
    count: undefined,
  },

  {
    general_name: "phlogiston",
    name: "impure_phlogiston",
    tier: 1,
    from: undefined,
    to: "extracted_phlogiston",
    count: 3,
  },
  {
    general_name: "phlogiston",
    name: "extracted_phlogiston",
    tier: 2,
    from: "impure_phlogiston",
    to: "refined_phlogiston",
    count: 3,
  },
  {
    general_name: "phlogiston",
    name: "refined_phlogiston",
    tier: 3,
    from: "extracted_phlogiston",
    to: "flawless_phlogiston",
    count: 3,
  },
  {
    general_name: "phlogiston",
    name: "flawless_phlogiston",
    tier: 4,
    from: "refined_phlogiston",
    to: undefined,
    count: undefined,
  },

  {
    general_name: "helix",
    name: "lento_helix",
    tier: 1,
    from: undefined,
    to: "adagio_helix",
    count: 3,
  },
  {
    general_name: "helix",
    name: "adagio_helix",
    tier: 2,
    from: "lento_helix",
    to: "andante_helix",
    count: 3,
  },
  {
    general_name: "helix",
    name: "andante_helix",
    tier: 3,
    from: "adagio_helix",
    to: "presto_helix",
    count: 3,
  },
  {
    general_name: "helix",
    name: "presto_helix",
    tier: 4,
    from: "andante_helix",
    to: undefined,
    count: undefined,
  },

  {
    general_name: "waveworn_residue",
    name: "waveworn_residue_210",
    tier: 1,
    from: undefined,
    to: "waveworn_residue_226",
    count: 3,
  },
  {
    general_name: "waveworn_residue",
    name: "waveworn_residue_226",
    tier: 2,
    from: "waveworn_residue_210",
    to: "waveworn_residue_235",
    count: 3,
  },
  {
    general_name: "waveworn_residue",
    name: "waveworn_residue_235",
    tier: 3,
    from: "waveworn_residue_226",
    to: "waveworn_residue_239",
    count: 3,
  },
  {
    general_name: "waveworn_residue",
    name: "waveworn_residue_239",
    tier: 4,
    from: "waveworn_residue_235",
    to: undefined,
    count: undefined,
  },

  {
    general_name: "cadence",
    name: "cadence_seed",
    tier: 1,
    from: undefined,
    to: "cadence_bud",
    count: 3,
  },
  {
    general_name: "cadence",
    name: "cadence_bud",
    tier: 2,
    from: "cadence_seed",
    to: "cadence_leaf",
    count: 3,
  },
  {
    general_name: "cadence",
    name: "cadence_leaf",
    tier: 3,
    from: "cadence_bud",
    to: "cadence_blossom",
    count: 3,
  },
  {
    general_name: "cadence",
    name: "cadence_blossom",
    tier: 4,
    from: "cadence_leaf",
    to: undefined,
    count: undefined,
  },

  {
    general_name: "polarizer",
    name: "broken_wing_polarizer",
    tier: 1,
    from: undefined,
    to: "monowing_polarizer",
    count: 3,
  },
  {
    general_name: "polarizer",
    name: "monowing_polarizer",
    tier: 2,
    from: "broken_wing_polarizer",
    to: "polywing_polarizer",
    count: 3,
  },
  {
    general_name: "polarizer",
    name: "polywing_polarizer",
    tier: 3,
    from: "monowing_polarizer",
    to: "layered_wing_polarizer",
    count: 3,
  },
  {
    general_name: "polarizer",
    name: "layered_wing_polarizer",
    tier: 4,
    from: "polywing_polarizer",
    to: undefined,
    count: undefined,
  },
  {
    general_name: "combustor",
    name: "incomplete_combustor",
    tier: 1,
    from: undefined,
    to: "aftertune_combustor",
    count: 3,
  },
  {
    general_name: "combustor",
    name: "aftertune_combustor",
    tier: 2,
    from: "incomplete_combustor",
    to: "remnant_combustor",
    count: 3,
  },
  {
    general_name: "combustor",
    name: "remnant_combustor",
    tier: 3,
    from: "incomplete_combustor",
    to: "reverb_combustor",
    count: 3,
  },
  {
    general_name: "combustor",
    name: "reverb_combustor",
    tier: 4,
    from: "remnant_combustor",
    to: undefined,
    count: undefined,
  },
  {
    general_name: "string",
    name: "spliced_string",
    tier: 1,
    from: undefined,
    to: "broken_string",
    count: 3,
  },
  {
    general_name: "string",
    name: "broken_string",
    tier: 2,
    from: "spliced_string",
    to: "solidified_string",
    count: 3,
  },
  {
    general_name: "string",
    name: "solidified_string",
    tier: 3,
    from: "spliced_string",
    to: "melodic_string",
    count: 3,
  },
  {
    general_name: "string",
    name: "melodic_string",
    tier: 4,
    from: "solidified_string",
    to: undefined,
    count: undefined,
  },
  {
    general_name: "carved_crystal",
    name: "lf_carved_crystal",
    tier: 1,
    from: undefined,
    to: "mf_carved_crystal",
    count: 3,
  },
  {
    general_name: "carved_crystal",
    name: "mf_carved_crystal",
    tier: 2,
    from: "lf_carved_crystal",
    to: "hf_carved_crystal",
    count: 3,
  },
  {
    general_name: "carved_crystal",
    name: "hf_carved_crystal",
    tier: 3,
    from: "lf_carved_crystal",
    to: "ff_carved_crystal",
    count: 3,
  },
  {
    general_name: "carved_crystal",
    name: "ff_carved_crystal",
    tier: 4,
    from: "hf_carved_crystal",
    to: undefined,
    count: undefined,
  },
  {
    general_name: "waveworn_shard",
    name: "lf_waveworn_shard",
    tier: 1,
    from: undefined,
    to: "mf_waveworn_shard",
    count: 3,
  },
  {
    general_name: "waveworn_shard",
    name: "mf_waveworn_shard",
    tier: 2,
    from: "lf_waveworn_shard",
    to: "hf_waveworn_shard",
    count: 3,
  },
  {
    general_name: "waveworn_shard",
    name: "hf_waveworn_shard",
    tier: 3,
    from: "mf_waveworn_shard",
    to: "ff_waveworn_shard",
    count: 3,
  },
  {
    general_name: "waveworn_shard",
    name: "ff_waveworn_shard",
    tier: 4,
    from: "hf_waveworn_shard",
    to: undefined,
    count: undefined,
  },
];

export const tiered_forgery_weapon_skill_material_index_category = Object.keys(
  forgery_proper_data,
).reduce((acc, key) => {
  const { general_name, name, tier, from, to, count } =
    forgery_proper_data[key];
  acc[general_name] = acc[general_name] || {};
  if (to) {
    acc[general_name][tier] = {
      name,
      synthesizable: {
        to: tier,
        count,
      },
    };
  } else {
    acc[general_name][tier] = {
      name,
    };
  }
  return acc;
}, {});

export const tiered_forgery_weapon_skill_material_index_name = Object.keys(
  forgery_proper_data,
).reduce((acc, key) => {
  const { general_name, name, from, to, count } = forgery_proper_data[key];
  acc[name] = {
    to: to,
    cost: count,
  };
  if (from) acc[name].from = from;
  return acc;
}, {});
