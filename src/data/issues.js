export const groupedIssues = [
  {
    group: 'Thermal throttling / fan behavior',
    summary: 'Thermal issues related to throttling and fan curve abnormality',
    issues: [
      { project: 'ZKB', id: 'ISSUE-102', description: 'Thermal throttling on Meteor Lake under sustained load', failureRate: 8, team: 'Thermal', status: 'Open', openDate: '2025-09-18' },
      { project: 'ZKD', id: 'ISSUE-104', description: 'CPU temperature exceeds 95°C during stress test', failureRate: 9, team: 'Thermal', status: 'Open', openDate: '2025-09-20' },
      { project: 'ZKF', id: 'ISSUE-106', description: 'Thermal pad gap on GPU causing high temps', failureRate: 7, team: 'Thermal', status: 'Open', openDate: '2025-09-25' },
      { project: 'ZKK', id: 'ISSUE-111', description: 'Thermal throttling triggers too early', failureRate: 7, team: 'Thermal', status: 'Open', openDate: '2025-10-05' },
      { project: 'ZKP', id: 'ISSUE-116', description: 'Fan speed anomaly after sleep wake', failureRate: 6, team: 'Thermal', status: 'Open', openDate: '2025-10-02' },
      { project: 'ZKU', id: 'ISSUE-121', description: 'Thermal pad misalignment on VRM', failureRate: 9, team: 'Thermal', status: 'Open', openDate: '2025-10-15' },
      { project: 'ZLB', id: 'ISSUE-128', description: 'Vapor chamber manufacturing defect detected', failureRate: 9, team: 'Thermal', status: 'Open', openDate: '2025-10-28' }
    ]
  },
  {
    group: 'USB / Dock connectivity',
    summary: 'Connectivity instability issues related to USB-C and docks',
    issues: [
      { project: 'ZKA', id: 'ISSUE-201', description: 'USB-C port fails to detect Thunderbolt 4 devices', failureRate: 7, team: 'EE', status: 'Open', openDate: '2025-09-16' },
      { project: 'ZKD', id: 'ISSUE-204', description: 'Type-C PD negotiation stuck at 5V', failureRate: 8, team: 'EE', status: 'Open', openDate: '2025-09-22' },
      { project: 'ZKL', id: 'ISSUE-212', description: 'USB-C PD negotiation fails under dock', failureRate: 8, team: 'EE', status: 'Open', openDate: '2025-09-28' },
      { project: 'ZKM', id: 'ISSUE-213', description: 'Type-C port 2 completely non-functional', failureRate: 9, team: 'EE', status: 'Open', openDate: '2025-10-08' },
      { project: 'ZKP', id: 'ISSUE-216', description: 'Type-C port intermittently not recognized', failureRate: 6, team: 'EE', status: 'Open', openDate: '2025-10-08' },
      { project: 'ZKX', id: 'ISSUE-224', description: 'Multiple monitors via dock cause system hang', failureRate: 8, team: 'EE', status: 'Open', openDate: '2025-10-22' },
      { project: 'ZKZ', id: 'ISSUE-226', description: 'Type-C CC pin detection failure', failureRate: 9, team: 'EE', status: 'Open', openDate: '2025-10-24' }
    ]
  },
  {
    group: 'BIOS / EC interaction',
    summary: 'BIOS and EC synchronization or mapping inconsistencies',
    issues: [
      { project: 'ZKD', id: 'ISSUE-304', description: 'EC battery charge threshold not honored', failureRate: 7, team: 'BIOS', status: 'Open', openDate: '2025-09-23' },
      { project: 'ZKH', id: 'ISSUE-308', description: 'EC embedded controller hang during BIOS update', failureRate: 8, team: 'BIOS', status: 'Open', openDate: '2025-10-03' },
      { project: 'ZKL', id: 'ISSUE-312', description: 'BIOS update causes boot delay', failureRate: 6, team: 'BIOS', status: 'Open', openDate: '2025-09-27' },
      { project: 'ZKM', id: 'ISSUE-313', description: 'EC firmware rollback causes keyboard freeze', failureRate: 7, team: 'BIOS', status: 'Open', openDate: '2025-10-03' },
      { project: 'ZKR', id: 'ISSUE-318', description: 'EC power button event not propagated to BIOS', failureRate: 8, team: 'BIOS', status: 'Open', openDate: '2025-10-11' },
      { project: 'ZKU', id: 'ISSUE-321', description: 'BIOS password hash algorithm vulnerability', failureRate: 9, team: 'BIOS', status: 'Open', openDate: '2025-10-19' }
    ]
  },
  {
    group: 'Display / Panel behavior',
    summary: 'Display flickering, color accuracy, and panel detection issues',
    issues: [
      { project: 'ZKC', id: 'ISSUE-403', description: 'eDP link training failure on resume', failureRate: 7, team: 'EE', status: 'Open', openDate: '2025-09-15' },
      { project: 'ZKH', id: 'ISSUE-408', description: 'Panel EDID data corrupted causing detection fail', failureRate: 8, team: 'EE', status: 'Open', openDate: '2025-10-04' },
      { project: 'ZKO', id: 'ISSUE-415', description: 'Panel not detected after lid open', failureRate: 7, team: 'EE', status: 'Open', openDate: '2025-10-05' },
      { project: 'ZKP', id: 'ISSUE-416', description: 'Display backlight flicker on battery power', failureRate: 8, team: 'ME', status: 'Open', openDate: '2025-10-09' },
      { project: 'ZKR', id: 'ISSUE-418', description: 'eDP cable strain causes intermittent signal loss', failureRate: 9, team: 'ME', status: 'Open', openDate: '2025-10-13' },
      { project: 'ZKW', id: 'ISSUE-423', description: 'Panel black screen after extended use', failureRate: 8, team: 'ME', status: 'Open', openDate: '2025-10-22' },
      { project: 'ZLD', id: 'ISSUE-430', description: 'Display sudden brightness drop intermittently', failureRate: 8, team: 'EE', status: 'Open', openDate: '2025-11-04' }
    ]
  },
  {
    group: 'Battery / Power management',
    summary: 'Battery charging, power delivery, and power management issues',
    issues: [
      { project: 'ZKC', id: 'ISSUE-503', description: 'Battery drain during sleep mode excessive', failureRate: 8, team: 'BIOS', status: 'Open', openDate: '2025-09-16' },
      { project: 'ZKE', id: 'ISSUE-505', description: 'Power management IC overheating during charge', failureRate: 9, team: 'EE', status: 'Open', openDate: '2025-09-13' },
      { project: 'ZKJ', id: 'ISSUE-510', description: 'Battery swelling detected in early units', failureRate: 8, team: 'EE', status: 'Open', openDate: '2025-10-07' },
      { project: 'ZKR', id: 'ISSUE-518', description: 'Power delivery negotiation fails with 100W charger', failureRate: 8, team: 'EE', status: 'Open', openDate: '2025-10-14' },
      { project: 'ZKT', id: 'ISSUE-520', description: 'System crash when switching power sources', failureRate: 9, team: 'BIOS', status: 'Open', openDate: '2025-10-19' },
      { project: 'ZLB', id: 'ISSUE-528', description: 'Battery cells imbalance causing early shutdown', failureRate: 8, team: 'EE', status: 'Open', openDate: '2025-10-31' },
      { project: 'ZLD', id: 'ISSUE-530', description: 'Battery fuel gauge chip firmware corruption', failureRate: 9, team: 'EE', status: 'Open', openDate: '2025-11-05' }
    ]
  },
  {
    group: 'Audio / Speakers',
    summary: 'Audio output quality, speaker distortion, and sound issues',
    issues: [
      { project: 'ZKC', id: 'ISSUE-603', description: 'Audio codec driver causes system stutter', failureRate: 7, team: 'EE', status: 'Open', openDate: '2025-09-17' },
      { project: 'ZKH', id: 'ISSUE-608', description: 'Headphone amplifier insufficient power output', failureRate: 7, team: 'EE', status: 'Open', openDate: '2025-10-06' },
      { project: 'ZKK', id: 'ISSUE-611', description: 'Speaker distortion at 80%+ volume level', failureRate: 7, team: 'ME', status: 'Open', openDate: '2025-10-09' },
      { project: 'ZKR', id: 'ISSUE-618', description: 'Audio DAC noise floor higher than spec', failureRate: 7, team: 'EE', status: 'Open', openDate: '2025-10-15' },
      { project: 'ZKS', id: 'ISSUE-619', description: 'Speaker membrane damage from overdriving', failureRate: 8, team: 'ME', status: 'Open', openDate: '2025-10-17' },
      { project: 'ZKW', id: 'ISSUE-623', description: 'Speaker channel reversal on certain units', failureRate: 9, team: 'EE', status: 'Open', openDate: '2025-10-24' }
    ]
  },
  {
    group: 'Wireless connectivity',
    summary: 'WiFi, Bluetooth, and wireless connection stability issues',
    issues: [
      { project: 'ZKA', id: 'ISSUE-701', description: 'WiFi 6E connection drops on 6GHz band', failureRate: 7, team: 'EE', status: 'Open', openDate: '2025-09-14' },
      { project: 'ZKE', id: 'ISSUE-705', description: 'Bluetooth audio stuttering during WiFi activity', failureRate: 6, team: 'EE', status: 'Open', openDate: '2025-09-21' },
      { project: 'ZKI', id: 'ISSUE-709', description: 'WiFi antenna signal strength asymmetric', failureRate: 5, team: 'EE', status: 'Open', openDate: '2025-10-01' },
      { project: 'ZKN', id: 'ISSUE-714', description: 'Bluetooth device pairing intermittently fails', failureRate: 6, team: 'EE', status: 'Open', openDate: '2025-10-11' },
      { project: 'ZKV', id: 'ISSUE-722', description: 'WiFi firmware crash under heavy load', failureRate: 8, team: 'EE', status: 'Open', openDate: '2025-10-19' },
      { project: 'ZKY', id: 'ISSUE-725', description: 'Bluetooth LE audio codec not supported', failureRate: 4, team: 'EE', status: 'Closed', openDate: '2025-10-23' },
      { project: 'ZLC', id: 'ISSUE-729', description: 'WiFi power save mode causes latency spikes', failureRate: 7, team: 'EE', status: 'Open', openDate: '2025-10-30' }
    ]
  },
  {
    group: 'Keyboard / Touchpad',
    summary: 'Input device responsiveness and accuracy issues',
    issues: [
      { project: 'ZKB', id: 'ISSUE-802', description: 'Touchpad palm rejection too aggressive', failureRate: 5, team: 'ME', status: 'Open', openDate: '2025-09-19' },
      { project: 'ZKF', id: 'ISSUE-806', description: 'Keyboard key travel distance inconsistent', failureRate: 6, team: 'ME', status: 'Open', openDate: '2025-09-26' },
      { project: 'ZKJ', id: 'ISSUE-810', description: 'Touchpad click mechanism loose on left side', failureRate: 7, team: 'ME', status: 'Open', openDate: '2025-10-04' },
      { project: 'ZKO', id: 'ISSUE-815', description: 'Keyboard backlight uneven brightness distribution', failureRate: 4, team: 'EE', status: 'Closed', openDate: '2025-10-09' },
      { project: 'ZKS', id: 'ISSUE-819', description: 'Touchpad multi-finger gesture recognition poor', failureRate: 6, team: 'EE', status: 'Open', openDate: '2025-10-14' },
      { project: 'ZKX', id: 'ISSUE-824', description: 'Keyboard spacebar rattle noise excessive', failureRate: 5, team: 'ME', status: 'Open', openDate: '2025-10-21' }
    ]
  }
];
