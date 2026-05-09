export interface Profile {
  id: string
  employee_code: string
  full_name: string | null
  phone_number: string | null
  department: string | null
  profile_image_pathname: string | null
  created_at: string
  updated_at: string
}

export interface Study {
  id: string
  user_id: string
  operation_type: OperationType
  machine_details: MachineDetails | null
  job_details: JobDetails | null
  cutting_parameters: CuttingParameters | null
  tool_details: ToolDetails | null
  created_at: string
}

export type OperationType = 
  | 'hobbing'
  | 'shaping'
  | 'shaving'
  | 'hard-turning'
  | 'od-grinding'
  | 'id-grinding'
  | 'gear-grinding'

export interface MachineDetails {
  machine_name?: string
  machine_number?: string
  machine_type?: string
  coolant_type?: string
  rpm_range?: string
  power_rating?: string
}

export interface JobDetails {
  part_name?: string
  part_number?: string
  material?: string
  hardness?: string
  module?: string
  no_of_teeth?: string
  helix_angle?: string
  pressure_angle?: string
  face_width?: string
  tip_diameter?: string
  root_diameter?: string
  bore_diameter?: string
  grinding_allowance?: string
}

export interface CuttingParameters {
  cutting_speed?: string
  feed_rate?: string
  depth_of_cut?: string
  rpm?: string
  infeed?: string
  dressing_frequency?: string
  spark_out_passes?: string
  wheel_speed?: string
  work_speed?: string
  traverse_rate?: string
  plunge_rate?: string
}

export interface ToolDetails {
  tool_type?: string
  tool_material?: string
  tool_diameter?: string
  tool_length?: string
  no_of_flutes?: string
  hob_type?: string
  hob_diameter?: string
  hob_length?: string
  no_of_starts?: string
  wheel_type?: string
  wheel_diameter?: string
  wheel_width?: string
  grit_size?: string
  bond_type?: string
  abrasive_type?: string
  cutter_type?: string
  cutter_diameter?: string
  no_of_teeth_cutter?: string
}

export interface OperationConfig {
  type: OperationType
  label: string
  icon: string
  color: string
  machineFields: (keyof MachineDetails)[]
  jobFields: (keyof JobDetails)[]
  cuttingFields: (keyof CuttingParameters)[]
  toolFields: (keyof ToolDetails)[]
}
