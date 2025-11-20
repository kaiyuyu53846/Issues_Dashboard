// Centralized fixtures for issue management views.
// These stay in a single location so components remain focused on UI composition.

export const issueExamples = [
  { id: 'ISSUE-01', description: 'USB-C PD negotiation fails under specific dock configuration.', team: 'EE', failureRate: 10, openDate: '2025-11-01', status: 'Open' },
  { id: 'ISSUE-02', description: 'Touchpad bracket loosening after vibration test.', team: 'ME', failureRate: 8, openDate: '2025-11-02', status: 'Open' },
  { id: 'ISSUE-03', description: 'CPU throttles early under 95°C load due to uneven heat spreader contact.', team: 'Thermal', failureRate: 9, openDate: '2025-11-03', status: 'Closed' },
  { id: 'ISSUE-04', description: 'Battery drains by 3% per hour in sleep mode.', team: 'Power', failureRate: 7, openDate: '2025-10-25', status: 'Open' },
  { id: 'ISSUE-05', description: 'Audio driver initialization delay after resume.', team: 'EC', failureRate: 6, openDate: '2025-10-20', status: 'Closed' },
  { id: 'ISSUE-06', description: 'Fn key mapping mismatch in BIOS version 1.2.3.', team: 'BIOS', failureRate: 5, openDate: '2025-10-12', status: 'Open' },
  { id: 'ISSUE-07', description: 'Speaker crackling at startup sound.', team: 'Driver', failureRate: 4, openDate: '2025-10-10', status: 'Open' },
  { id: 'ISSUE-08', description: 'Fan noise increases after long sleep wake cycles.', team: 'Thermal', failureRate: 3, openDate: '2025-10-28', status: 'Closed' },
  { id: 'ISSUE-09', description: 'System freeze when external monitor is attached.', team: 'EE', failureRate: 6, openDate: '2025-10-30', status: 'Open' },
  { id: 'ISSUE-10', description: 'Keyboard backlight flicker when switching modes.', team: 'ME', failureRate: 5, openDate: '2025-11-04', status: 'Closed' },
  { id: 'ISSUE-11', description: 'Thermal sensor misreporting CPU temperature under idle state.', team: 'Thermal', failureRate: 2, openDate: '2025-10-22', status: 'Open' },
  { id: 'ISSUE-12', description: 'EC firmware occasionally fails to resume fan control after suspend.', team: 'EC', failureRate: 5, openDate: '2025-10-15', status: 'Open' },
  { id: 'ISSUE-13', description: 'HDMI port intermittently disconnects with certain cables.', team: 'EE', failureRate: 7, openDate: '2025-10-09', status: 'Open' },
  { id: 'ISSUE-14', description: 'BIOS update 1.3.2 causes boot delay on cold start.', team: 'BIOS', failureRate: 8, openDate: '2025-11-05', status: 'Open' },
  { id: 'ISSUE-15', description: 'Display color calibration drifts after prolonged high temperature operation.', team: 'ME', failureRate: 4, openDate: '2025-10-29', status: 'Open' },
  { id: 'ISSUE-16', description: 'RTC clock not syncing properly after battery removal.', team: 'EC', failureRate: 3, openDate: '2025-10-17', status: 'Closed' },
  { id: 'ISSUE-17', description: 'Left fan RPM remains constant even in high thermal load.', team: 'Thermal', failureRate: 6, openDate: '2025-10-11', status: 'Open' },
  { id: 'ISSUE-18', description: 'Audio output stutter when switching from speaker to headset.', team: 'Driver', failureRate: 5, openDate: '2025-10-31', status: 'Open' },
  { id: 'ISSUE-19', description: 'System time resets unexpectedly after long power-off duration.', team: 'BIOS', failureRate: 7, openDate: '2025-10-14', status: 'Open' },
  { id: 'ISSUE-20', description: 'SSD detection failure during warm reboot sequence.', team: 'EE', failureRate: 9, openDate: '2025-11-06', status: 'Open' },
  { id: 'ISSUE-21', description: 'USB 3.2 Gen2 port speed drops to 5Gbps after multiple re-plugs.', team: 'EE', failureRate: 6, openDate: '2025-11-07', status: 'Closed' },
  { id: 'ISSUE-22', description: 'Chassis corner panel exhibits slight deformation under torque test.', team: 'ME', failureRate: 3, openDate: '2025-11-05', status: 'Open' },
  { id: 'ISSUE-23', description: 'Thermal throttling triggers too early under sustained 85°C load.', team: 'Thermal', failureRate: 7, openDate: '2025-11-06', status: 'Open' },
  { id: 'ISSUE-24', description: 'Battery gauge misreads remaining capacity after 30% discharge cycle.', team: 'Power', failureRate: 4, openDate: '2025-10-31', status: 'Closed' },
  { id: 'ISSUE-25', description: 'LAN wake-up packet not detected after deep sleep.', team: 'EC', failureRate: 5, openDate: '2025-10-27', status: 'Open' },
  { id: 'ISSUE-26', description: 'BIOS fan curve overly aggressive in silent mode.', team: 'BIOS', failureRate: 2, openDate: '2025-11-01', status: 'Closed' },
  { id: 'ISSUE-27', description: 'Touchpad palm rejection not triggered during fast typing.', team: 'Driver', failureRate: 6, openDate: '2025-11-03', status: 'Closed' },
  { id: 'ISSUE-28', description: 'Display panel shows flicker at brightness below 20%.', team: 'EE', failureRate: 8, openDate: '2025-11-08', status: 'Open' },
  { id: 'ISSUE-29', description: 'Top cover hinge screw loosening detected in repeated open/close cycles.', team: 'ME', failureRate: 5, openDate: '2025-10-30', status: 'Closed' },
  { id: 'ISSUE-30', description: 'NVMe SSD thermal pad misalignment causing inconsistent temperature readings.', team: 'Thermal', failureRate: 4, openDate: '2025-10-29', status: 'Closed' },
];

export const teamColors = {
  EE: '#2563eb',
  ME: '#f97316',
  Thermal: '#22c55e',
  Power: '#a855f7',
  Driver: '#ef4444',
  BIOS: '#0ea5e9',
  EC: '#94a3b8',
};

export const teams = ['EE', 'ME', 'Thermal', 'Power', 'Driver', 'BIOS', 'EC'];

export const chartData = [
  { week: '2025-09-14 ~ 2025-09-20', EE: 3, EE_opened: 2, EE_closed: 1, ME: 2, ME_opened: 1, ME_closed: 0, Thermal: 2, Thermal_opened: 1, Thermal_closed: 1, Power: 1, Power_opened: 1, Power_closed: 0, Driver: 2, Driver_opened: 2, Driver_closed: 0, BIOS: 1, BIOS_opened: 1, BIOS_closed: 0, EC: 2, EC_opened: 1, EC_closed: 0 },
  { week: '2025-09-21 ~ 2025-09-27', EE: 4, EE_opened: 2, EE_closed: 1, ME: 3, ME_opened: 2, ME_closed: 1, Thermal: 3, Thermal_opened: 1, Thermal_closed: 0, Power: 2, Power_opened: 1, Power_closed: 1, Driver: 3, Driver_opened: 1, Driver_closed: 1, BIOS: 2, BIOS_opened: 1, BIOS_closed: 0, EC: 3, EC_opened: 2, EC_closed: 1 },
  { week: '2025-09-28 ~ 2025-10-04', EE: 5, EE_opened: 3, EE_closed: 1, ME: 3, ME_opened: 1, ME_closed: 1, Thermal: 4, Thermal_opened: 2, Thermal_closed: 1, Power: 3, Power_opened: 1, Power_closed: 1, Driver: 2, Driver_opened: 1, Driver_closed: 0, BIOS: 2, BIOS_opened: 2, BIOS_closed: 1, EC: 3, EC_opened: 1, EC_closed: 0 },
  { week: '2025-10-05 ~ 2025-10-11', EE: 6, EE_opened: 2, EE_closed: 1, ME: 4, ME_opened: 2, ME_closed: 1, Thermal: 3, Thermal_opened: 2, Thermal_closed: 1, Power: 2, Power_opened: 1, Power_closed: 0, Driver: 3, Driver_opened: 2, Driver_closed: 1, BIOS: 3, BIOS_opened: 1, BIOS_closed: 1, EC: 3, EC_opened: 2, EC_closed: 1 },
  { week: '2025-10-12 ~ 2025-10-18', EE: 5, EE_opened: 3, EE_closed: 1, ME: 2, ME_opened: 2, ME_closed: 0, Thermal: 2, Thermal_opened: 1, Thermal_closed: 1, Power: 1, Power_opened: 1, Power_closed: 0, Driver: 2, Driver_opened: 2, Driver_closed: 0, BIOS: 1, BIOS_opened: 1, BIOS_closed: 0, EC: 2, EC_opened: 2, EC_closed: 0 },
  { week: '2025-10-19 ~ 2025-10-25', EE: 5, EE_opened: 3, EE_closed: 1, ME: 3, ME_opened: 2, ME_closed: 1, Thermal: 2, Thermal_opened: 1, Thermal_closed: 0, Power: 2, Power_opened: 2, Power_closed: 1, Driver: 3, Driver_opened: 1, Driver_closed: 0, BIOS: 2, BIOS_opened: 2, BIOS_closed: 1, EC: 3, EC_opened: 1, EC_closed: 0 },
  { week: '2025-10-26 ~ 2025-11-01', EE: 4, EE_opened: 1, EE_closed: 2, ME: 4, ME_opened: 3, ME_closed: 2, Thermal: 3, Thermal_opened: 2, Thermal_closed: 1, Power: 3, Power_opened: 2, Power_closed: 1, Driver: 2, Driver_opened: 0, Driver_closed: 1, BIOS: 3, BIOS_opened: 2, BIOS_closed: 1, EC: 2, EC_opened: 0, EC_closed: 1 },
  { week: '2025-11-02 ~ 2025-11-08', EE: 6, EE_opened: 4, EE_closed: 2, ME: 2, ME_opened: 1, ME_closed: 3, Thermal: 4, Thermal_opened: 2, Thermal_closed: 1, Power: 1, Power_opened: 0, Power_closed: 2, Driver: 4, Driver_opened: 3, Driver_closed: 1, BIOS: 2, BIOS_opened: 0, BIOS_closed: 2, EC: 3, EC_opened: 2, EC_closed: 1 },
];
