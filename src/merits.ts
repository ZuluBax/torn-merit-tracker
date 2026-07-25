import { fetchFromApi } from './api';

export const HONOR_REQUIREMENTS: Record<number, [string, number]> = {
  39: ['personalstats.attacking.attacks.won', 5],
  40: ['personalstats.attacking.attacks.won', 20],
  41: ['personalstats.attacking.attacks.won', 50],
  42: ['personalstats.attacking.attacks.won', 100],
  43: ['personalstats.attacking.attacks.won', 250],
  228: ['personalstats.attacking.attacks.won', 1000],
  20: ['personalstats.attacking.hits.critical', 25],
  270: ['personalstats.attacking.attacks.stalemate', 100],
  490: ['personalstats.attacking.attacks.assist', 250],
  639: ['personalstats.attacking.attacks.assist', 1],
  254: ['personalstats.attacking.hits.one_hit_kills', 1],
  517: ['personalstats.attacking.hits.one_hit_kills', 100],
  601: ['personalstats.attacking.hits.success', 10000],
  1004: ['personalstats.attacking.damage.total', 100000],
  1002: ['personalstats.attacking.damage.total', 1000000],
  1001: ['personalstats.attacking.damage.total', 10000000],
  1003: ['personalstats.attacking.damage.total', 100000000],
  740: ['personalstats.attacking.damage.best', 5000],
  741: ['personalstats.attacking.damage.best', 10000],
  786: ['personalstats.attacking.damage.best', 15000],
  15: ['personalstats.attacking.killstreak.best', 10],
  16: ['personalstats.attacking.killstreak.best', 100],
  22: ['personalstats.attacking.defends.won', 50],
  763: ['personalstats.attacking.unarmored_wins', 250],
  141: ['personalstats.finishing_hits.heavy_artillery', 100],
  144: ['personalstats.finishing_hits.machine_guns', 100],
  146: ['personalstats.finishing_hits.rifles', 100],
  148: ['personalstats.finishing_hits.sub_machine_guns', 100],
  147: ['personalstats.finishing_hits.shotguns', 100],
  145: ['personalstats.finishing_hits.pistols', 100],
  143: ['personalstats.finishing_hits.temporary', 100],
  149: ['personalstats.finishing_hits.piercing', 100],
  150: ['personalstats.finishing_hits.slashing', 100],
  142: ['personalstats.finishing_hits.clubbing', 100],
  515: ['personalstats.finishing_hits.hand_to_hand', 100],
  251: ['personalstats.crimes.offenses.total', 10000],
  903: ['personalstats.hospital.times_hospitalized', 250],
  7: ['personalstats.hospital.medical_items_used', 5000],
  23: ['personalstats.hospital.reviving.revives', 500],
  267: ['personalstats.hospital.reviving.revives', 1000],
  418: ['personalstats.hospital.blood_withdrawn', 250],
  398: ['personalstats.hospital.blood_withdrawn', 1000],
  906: ['personalstats.jail.times_jailed', 250],
  248: ['personalstats.jail.busts.success', 1000],
  249: ['personalstats.jail.busts.success', 2500],
  250: ['personalstats.jail.busts.success', 10000],
  252: ['personalstats.jail.bails.amount', 500],
  29: ['personalstats.drugs.cannabis', 50],
  30: ['personalstats.drugs.ecstasy', 50],
  31: ['personalstats.drugs.ketamine', 50],
  32: ['personalstats.drugs.lsd', 50],
  33: ['personalstats.drugs.opium', 50],
  34: ['personalstats.drugs.shrooms', 50],
  35: ['personalstats.drugs.speed', 50],
  36: ['personalstats.drugs.pcp', 50],
  37: ['personalstats.drugs.xanax', 50],
  38: ['personalstats.drugs.vicodin', 50],
  11: ['personalstats.travel.total', 100],
  165: ['personalstats.travel.total', 1000],
  130: ['personalstats.travel.argentina', 50],
  131: ['personalstats.travel.mexico', 50],
  132: ['personalstats.travel.united_arab_emirates', 50],
  133: ['personalstats.travel.hawaii', 50],
  134: ['personalstats.travel.japan', 50],
  135: ['personalstats.travel.united_kingdom', 50],
  136: ['personalstats.travel.south_africa', 50],
  137: ['personalstats.travel.switzerland', 50],
  138: ['personalstats.travel.china', 50],
  139: ['personalstats.travel.canada', 50],
  272: ['personalstats.travel.cayman_islands', 50],
  549: ['personalstats.travel.time_spent', 604800],
  567: ['personalstats.travel.time_spent', 2678400],
  557: ['personalstats.travel.time_spent', 31536000],
  541: ['personalstats.travel.items_bought', 100],
  542: ['personalstats.travel.items_bought', 1000],
  543: ['personalstats.travel.items_bought', 10000],
  4: ['personalstats.jobs.job_points_used', 100],
  164: ['personalstats.jobs.job_points_used', 1000],
  742: ['personalstats.jobs.job_points_used', 10000],
  571: ['personalstats.racing.races.won', 100],
  572: ['personalstats.racing.skill', 10],
  245: ['personalstats.other.activity.time', 3600000],
  606: ['personalstats.other.awards', 100],
  229: ['personalstats.other.awards', 250],
  614: ['personalstats.other.awards', 500],
  873: ['personalstats.other.activity.streak.current', 100],
  1: ['personalstats.items.found.city', 50],
  238: ['personalstats.items.found.dump', 1000],
  271: ['personalstats.items.trashed', 5000],
  539: ['personalstats.items.used.books', 10],
  537: ['personalstats.items.used.candy', 500],
  534: ['personalstats.items.used.alcohol', 500],
  538: ['personalstats.items.used.energy_drinks', 500],
  527: ['personalstats.items.used.stat_enhancers', 1],
  268: ['personalstats.trading.points.sold', 1000],
  239: ['personalstats.trading.bazaar.customers', 100],
};

const HONOR_NAMES: Record<number, string> = {
  39: 'Win 5 Attacks', 40: 'Win 20 Attacks', 41: 'Win 50 Attacks', 42: 'Win 100 Attacks', 43: 'Win 250 Attacks', 228: 'Win 1000 Attacks',
  20: 'Land 25 Critical Hits', 270: 'Stalemate 100 Attacks', 490: 'Assist 250 Attacks', 639: 'First Assist',
  254: 'First One-Hit Kill', 517: '100 One-Hit Kills', 601: 'Land 10000 Hits',
  1004: 'Deal 100K Damage', 1002: 'Deal 1M Damage', 1001: 'Deal 10M Damage', 1003: 'Deal 100M Damage',
  740: '5K Best Damage', 741: '10K Best Damage', 786: '15K Best Damage',
  15: '10 Killstreak', 16: '100 Killstreak', 22: 'Win 50 Defends', 763: 'Win 250 Unarmored',
  141: '100 Heavy Artillery FH', 144: '100 Machine Gun FH', 146: '100 Rifle FH', 148: '100 SMG FH', 147: '100 Shotgun FH',
  145: '100 Pistol FH', 143: '100 Temporary FH', 149: '100 Piercing FH', 150: '100 Slashing FH',
  142: '100 Clubbing FH', 515: '100 Hand-to-Hand FH',
  251: '10K Criminal Offences',
  903: '250 Hospitalizations', 7: 'Use 5000 Medical Items', 23: 'Revive 500 Players', 267: 'Revive 1000 Players',
  418: '250 Blood Drawn', 398: '1000 Blood Drawn',
  906: '250 Times Jailed', 248: '1000 Busts', 249: '2500 Busts', 250: '10000 Busts', 252: '$500 Bail',
  29: '50 Cannabis', 30: '50 Ecstasy', 31: '50 Ketamine', 32: '50 LSD', 33: '50 Opium', 34: '50 Shrooms', 35: '50 Speed', 36: '50 PCP', 37: '50 Xanax', 38: '50 Vicodin',
  11: '100 Travels', 165: '1000 Travels',
  130: 'Visit Argentina 50x', 131: 'Visit Mexico 50x', 132: 'Visit UAE 50x', 133: 'Visit Hawaii 50x',
  134: 'Visit Japan 50x', 135: 'Visit UK 50x', 136: 'Visit South Africa 50x', 137: 'Visit Switzerland 50x',
  138: 'Visit China 50x', 139: 'Visit Canada 50x', 272: 'Visit Cayman 50x',
  549: 'Travel 1 Week', 567: 'Travel 1 Month', 557: 'Travel 1 Year',
  541: 'Buy 100 Travel Items', 542: 'Buy 1000 Travel Items', 543: 'Buy 10000 Travel Items',
  4: '100 Job Points', 164: '1000 Job Points', 742: '10000 Job Points',
  571: 'Win 100 Races', 572: 'Race Skill 10',
  245: '1 Hour Activity', 606: '100 Awards', 229: '250 Awards', 614: '500 Awards', 873: '100 Activity Streak',
  1: 'Find 50 Items', 238: 'Find 1000 Dump Items', 271: 'Trash 5000 Items',
  539: 'Read 10 Books', 537: 'Use 500 Candy', 534: 'Use 500 Alcohol', 538: 'Use 500 Energy Drinks', 527: 'Use Stat Enhancer',
  268: 'Sell 1000 Points', 239: '100 Bazaar Customers',
};

// Medal requirements
export const MEDAL_REQUIREMENTS: Record<number, [string, number]> = {
  // Jail Busting
  30: ['personalstats.jail.busts.success', 250],
  31: ['personalstats.jail.busts.success', 500],
  32: ['personalstats.jail.busts.success', 1000],
  33: ['personalstats.jail.busts.success', 2000],
  105: ['personalstats.jail.busts.success', 4000],
  106: ['personalstats.jail.busts.success', 6000],
  107: ['personalstats.jail.busts.success', 8000],
  // Attacks Won
  174: ['personalstats.attacking.attacks.won', 50],
  175: ['personalstats.attacking.attacks.won', 250],
  176: ['personalstats.attacking.attacks.won', 500],
  177: ['personalstats.attacking.attacks.won', 2500],
  178: ['personalstats.attacking.attacks.won', 10000],
  // Defends Won
  179: ['personalstats.attacking.defends.won', 50],
  180: ['personalstats.attacking.defends.won', 250],
  181: ['personalstats.attacking.defends.won', 500],
  182: ['personalstats.attacking.defends.won', 2500],
  183: ['personalstats.attacking.defends.won', 10000],
  // Escapes
  184: ['personalstats.attacking.escapes.player', 50],
  185: ['personalstats.attacking.escapes.player', 250],
  186: ['personalstats.attacking.escapes.player', 1000],
  187: ['personalstats.attacking.escapes.foes', 50],
  188: ['personalstats.attacking.escapes.foes', 250],
  189: ['personalstats.attacking.escapes.foes', 1000],
  // Killstreak Best
  190: ['personalstats.attacking.killstreak.best', 25],
  191: ['personalstats.attacking.killstreak.best', 50],
  192: ['personalstats.attacking.killstreak.best', 100],
  193: ['personalstats.attacking.killstreak.best', 250],
  194: ['personalstats.attacking.killstreak.best', 500],
  // Critical Hits
  195: ['personalstats.attacking.hits.critical', 500],
  196: ['personalstats.attacking.hits.critical', 2500],
  197: ['personalstats.attacking.hits.critical', 10000],
  // Medical Items Used
  198: ['personalstats.hospital.medical_items_used', 500],
  199: ['personalstats.hospital.medical_items_used', 5000],
  200: ['personalstats.hospital.medical_items_used', 25000],
  // Bounties
  201: ['personalstats.bounties.collected.amount', 25],
  202: ['personalstats.bounties.collected.amount', 100],
  203: ['personalstats.bounties.collected.amount', 500],
  // Items Found
  204: ['personalstats.items.found.city', 10],
  205: ['personalstats.items.found.city', 50],
  206: ['personalstats.items.found.city', 100],
  // Travel
  207: ['personalstats.travel.total', 25],
  208: ['personalstats.travel.total', 100],
  209: ['personalstats.travel.total', 500],
  // Donator Days (Note: stat path may vary - using other.donator_days)
  210: ['personalstats.other.donator_days', 30],
  211: ['personalstats.other.donator_days', 100],
  212: ['personalstats.other.donator_days', 250],
  213: ['personalstats.other.donator_days', 500],
  214: ['personalstats.other.donator_days', 1000],
  // Faction Respect
  215: ['personalstats.attacking.faction.respect', 100],
  216: ['personalstats.attacking.faction.respect', 500],
  217: ['personalstats.attacking.faction.respect', 1000],
  218: ['personalstats.attacking.faction.respect', 2500],
  219: ['personalstats.attacking.faction.respect', 5000],
  220: ['personalstats.attacking.faction.respect', 10000],
  221: ['personalstats.attacking.faction.respect', 25000],
  222: ['personalstats.attacking.faction.respect', 50000],
  223: ['personalstats.attacking.faction.respect', 75000],
  224: ['personalstats.attacking.faction.respect', 100000],
  // Profile Level medals
  34: ['personalstats.profile.level', 5],
  35: ['personalstats.profile.level', 10],
  36: ['personalstats.profile.level', 15],
  37: ['personalstats.profile.level', 20],
  38: ['personalstats.profile.level', 25],
  39: ['personalstats.profile.level', 30],
  40: ['personalstats.profile.level', 35],
  41: ['personalstats.profile.level', 40],
  42: ['personalstats.profile.level', 45],
  43: ['personalstats.profile.level', 50],
  44: ['personalstats.profile.level', 55],
  45: ['personalstats.profile.level', 60],
  46: ['personalstats.profile.level', 65],
  47: ['personalstats.profile.level', 70],
  48: ['personalstats.profile.level', 75],
  49: ['personalstats.profile.level', 80],
  50: ['personalstats.profile.level', 85],
  51: ['personalstats.profile.level', 90],
  52: ['personalstats.profile.level', 95],
  53: ['personalstats.profile.level', 100],
  // Crime Offenses Total
  242: ['personalstats.crimes.offenses.total', 100],
  243: ['personalstats.crimes.offenses.total', 200],
  244: ['personalstats.crimes.offenses.total', 300],
  245: ['personalstats.crimes.offenses.total', 500],
  246: ['personalstats.crimes.offenses.total', 750],
  247: ['personalstats.crimes.offenses.total', 1000],
  248: ['personalstats.crimes.offenses.total', 1500],
  249: ['personalstats.crimes.offenses.total', 2000],
  250: ['personalstats.crimes.offenses.total', 2500],
  251: ['personalstats.crimes.offenses.total', 3000],
  252: ['personalstats.crimes.offenses.total', 4000],
  253: ['personalstats.crimes.offenses.total', 5000],
  254: ['personalstats.crimes.offenses.total', 6000],
  255: ['personalstats.crimes.offenses.total', 7500],
  256: ['personalstats.crimes.offenses.total', 10000],
  // Vandalism
  257: ['personalstats.crimes.offenses.vandalism', 100],
  258: ['personalstats.crimes.offenses.vandalism', 200],
  259: ['personalstats.crimes.offenses.vandalism', 300],
  260: ['personalstats.crimes.offenses.vandalism', 500],
  261: ['personalstats.crimes.offenses.vandalism', 750],
  262: ['personalstats.crimes.offenses.vandalism', 1000],
  263: ['personalstats.crimes.offenses.vandalism', 1500],
  264: ['personalstats.crimes.offenses.vandalism', 2000],
  265: ['personalstats.crimes.offenses.vandalism', 2500],
  266: ['personalstats.crimes.offenses.vandalism', 3000],
  267: ['personalstats.crimes.offenses.vandalism', 4000],
  268: ['personalstats.crimes.offenses.vandalism', 5000],
  269: ['personalstats.crimes.offenses.vandalism', 6000],
  270: ['personalstats.crimes.offenses.vandalism', 7500],
  271: ['personalstats.crimes.offenses.vandalism', 10000],
  // Theft
  272: ['personalstats.crimes.offenses.theft', 100],
  273: ['personalstats.crimes.offenses.theft', 200],
  274: ['personalstats.crimes.offenses.theft', 300],
  275: ['personalstats.crimes.offenses.theft', 500],
  276: ['personalstats.crimes.offenses.theft', 750],
  277: ['personalstats.crimes.offenses.theft', 1000],
  278: ['personalstats.crimes.offenses.theft', 1500],
  279: ['personalstats.crimes.offenses.theft', 2000],
  280: ['personalstats.crimes.offenses.theft', 2500],
  281: ['personalstats.crimes.offenses.theft', 3000],
  282: ['personalstats.crimes.offenses.theft', 4000],
  283: ['personalstats.crimes.offenses.theft', 5000],
  284: ['personalstats.crimes.offenses.theft', 6000],
  285: ['personalstats.crimes.offenses.theft', 7500],
  286: ['personalstats.crimes.offenses.theft', 10000],
  // Counterfeiting
  287: ['personalstats.crimes.offenses.counterfeiting', 100],
  288: ['personalstats.crimes.offenses.counterfeiting', 200],
  289: ['personalstats.crimes.offenses.counterfeiting', 300],
  290: ['personalstats.crimes.offenses.counterfeiting', 500],
  291: ['personalstats.crimes.offenses.counterfeiting', 750],
  292: ['personalstats.crimes.offenses.counterfeiting', 1000],
  293: ['personalstats.crimes.offenses.counterfeiting', 1500],
  294: ['personalstats.crimes.offenses.counterfeiting', 2000],
  295: ['personalstats.crimes.offenses.counterfeiting', 2500],
  296: ['personalstats.crimes.offenses.counterfeiting', 3000],
  297: ['personalstats.crimes.offenses.counterfeiting', 4000],
  298: ['personalstats.crimes.offenses.counterfeiting', 5000],
  299: ['personalstats.crimes.offenses.counterfeiting', 6000],
  300: ['personalstats.crimes.offenses.counterfeiting', 7500],
  301: ['personalstats.crimes.offenses.counterfeiting', 10000],
  // Fraud
  302: ['personalstats.crimes.offenses.fraud', 100],
  303: ['personalstats.crimes.offenses.fraud', 200],
  304: ['personalstats.crimes.offenses.fraud', 300],
  305: ['personalstats.crimes.offenses.fraud', 500],
  306: ['personalstats.crimes.offenses.fraud', 750],
  307: ['personalstats.crimes.offenses.fraud', 1000],
  308: ['personalstats.crimes.offenses.fraud', 1500],
  309: ['personalstats.crimes.offenses.fraud', 2000],
  310: ['personalstats.crimes.offenses.fraud', 2500],
  311: ['personalstats.crimes.offenses.fraud', 3000],
  312: ['personalstats.crimes.offenses.fraud', 4000],
  313: ['personalstats.crimes.offenses.fraud', 5000],
  314: ['personalstats.crimes.offenses.fraud', 6000],
  315: ['personalstats.crimes.offenses.fraud', 7500],
  316: ['personalstats.crimes.offenses.fraud', 10000],
  // Illicit Services
  317: ['personalstats.crimes.offenses.illicit_services', 100],
  318: ['personalstats.crimes.offenses.illicit_services', 200],
  319: ['personalstats.crimes.offenses.illicit_services', 300],
  320: ['personalstats.crimes.offenses.illicit_services', 500],
  321: ['personalstats.crimes.offenses.illicit_services', 750],
  322: ['personalstats.crimes.offenses.illicit_services', 1000],
  323: ['personalstats.crimes.offenses.illicit_services', 1500],
  324: ['personalstats.crimes.offenses.illicit_services', 2000],
  325: ['personalstats.crimes.offenses.illicit_services', 2500],
  326: ['personalstats.crimes.offenses.illicit_services', 3000],
  327: ['personalstats.crimes.offenses.illicit_services', 4000],
  328: ['personalstats.crimes.offenses.illicit_services', 5000],
  329: ['personalstats.crimes.offenses.illicit_services', 6000],
  330: ['personalstats.crimes.offenses.illicit_services', 7500],
  331: ['personalstats.crimes.offenses.illicit_services', 10000],
  // Cybercrime
  332: ['personalstats.crimes.offenses.cybercrime', 100],
  333: ['personalstats.crimes.offenses.cybercrime', 200],
  334: ['personalstats.crimes.offenses.cybercrime', 300],
  335: ['personalstats.crimes.offenses.cybercrime', 500],
  336: ['personalstats.crimes.offenses.cybercrime', 750],
  337: ['personalstats.crimes.offenses.cybercrime', 1000],
  338: ['personalstats.crimes.offenses.cybercrime', 1500],
  339: ['personalstats.crimes.offenses.cybercrime', 2000],
  340: ['personalstats.crimes.offenses.cybercrime', 2500],
  341: ['personalstats.crimes.offenses.cybercrime', 3000],
  342: ['personalstats.crimes.offenses.cybercrime', 4000],
  343: ['personalstats.crimes.offenses.cybercrime', 5000],
  344: ['personalstats.crimes.offenses.cybercrime', 6000],
  345: ['personalstats.crimes.offenses.cybercrime', 7500],
  346: ['personalstats.crimes.offenses.cybercrime', 10000],
};

// Medal names - fetched from API when available, fallback to these
export const MEDAL_NAMES: Record<number, string> = {
  // Jail Busting
  30: 'Bust 250 Jail',
  31: 'Bust 500 Jail',
  32: 'Bust 1K Jail',
  33: 'Bust 2K Jail',
  105: 'Bust 4K Jail',
  106: 'Bust 6K Jail',
  107: 'Bust 8K Jail',
  // Profile Level
  34: 'Level 5',
  35: 'Level 10',
  36: 'Level 15',
  37: 'Level 20',
  38: 'Level 25',
  39: 'Level 30',
  40: 'Level 35',
  41: 'Level 40',
  42: 'Level 45',
  43: 'Level 50',
  44: 'Level 55',
  45: 'Level 60',
  46: 'Level 65',
  47: 'Level 70',
  48: 'Level 75',
  49: 'Level 80',
  50: 'Level 85',
  51: 'Level 90',
  52: 'Level 95',
  53: 'Level 100',
  // Attacks
  174: 'Win 50 Attacks',
  175: 'Win 250 Attacks',
  176: 'Win 500 Attacks',
  177: 'Win 2,500 Attacks',
  178: 'Win 10K Attacks',
  // Defends
  179: 'Defend 50',
  180: 'Defend 250 Defends',
  181: 'Defend 500 Defends',
  182: 'Defend 2,500 Defends',
  183: 'Defend 10K Defends',
  // Escapes
  184: 'Escape 50 Player',
  185: 'Escape 250 Player',
  186: 'Escape 1K Player',
  187: 'Escape 50 Foes',
  188: 'Escape 250 Foes',
  189: 'Escape 1K Foes',
  // Killstreak
  190: 'Killstreak 25',
  191: 'Killstreak 50',
  192: 'Killstreak 100',
  193: 'Killstreak 250',
  194: 'Killstreak 500',
  // Critical Hits
  195: 'Critical 500 Hits',
  196: 'Critical 2,500 Hits',
  197: 'Critical 10K Hits',
  // Medical Items
  198: 'Medical 500 Items',
  199: 'Medical 5K Items',
  200: 'Medical 25K Items',
  // Bounties
  201: 'Collect 25 Bounties',
  202: 'Collect 100 Bounties',
  203: 'Collect 500 Bounties',
  // Items Found
  204: 'Find 10 Items',
  205: 'Find 50 Items',
  206: 'Find 100 Items',
  // Travel
  207: 'Travel 25x',
  208: 'Travel 100x',
  209: 'Travel 500x',
  // Donator Days
  210: 'Donator 30 Days',
  211: 'Donator 100 Days',
  212: 'Donator 250 Days',
  213: 'Donator 500 Days',
  214: 'Donator 1,000 Days',
  // Faction Respect
  215: 'Respect 100 Faction',
  216: 'Respect 500 Faction',
  217: 'Respect 1K Faction',
  218: 'Respect 2.5K Faction',
  219: 'Respect 5K Faction',
  220: 'Respect 10K Faction',
  221: 'Respect 25K Faction',
  222: 'Respect 50K Faction',
  223: 'Respect 75K Faction',
  224: 'Respect 100K Faction',
  // Crime Offenses Total
  242: 'Crimes 100',
  243: 'Crimes 200',
  244: 'Crimes 300',
  245: 'Crimes 500',
  246: 'Crimes 750',
  247: 'Crimes 1K',
  248: 'Crimes 1.5K',
  249: 'Crimes 2K',
  250: 'Crimes 2.5K',
  251: 'Crimes 3K',
  252: 'Crimes 4K',
  253: 'Crimes 5K',
  254: 'Crimes 6K',
  255: 'Crimes 7.5K',
  256: 'Crimes 10K',
  // Vandalism
  257: 'Vandalism 100',
  258: 'Vandalism 200',
  259: 'Vandalism 300',
  260: 'Vandalism 500',
  261: 'Vandalism 750',
  262: 'Vandalism 1K',
  263: 'Vandalism 1.5K',
  264: 'Vandalism 2K',
  265: 'Vandalism 2.5K',
  266: 'Vandalism 3K',
  267: 'Vandalism 4K',
  268: 'Vandalism 5K',
  269: 'Vandalism 6K',
  270: 'Vandalism 7.5K',
  271: 'Vandalism 10K',
  // Theft
  272: 'Theft 100',
  273: 'Theft 200',
  274: 'Theft 300',
  275: 'Theft 500',
  276: 'Theft 750',
  277: 'Theft 1K',
  278: 'Theft 1.5K',
  279: 'Theft 2K',
  280: 'Theft 2.5K',
  281: 'Theft 3K',
  282: 'Theft 4K',
  283: 'Theft 5K',
  284: 'Theft 6K',
  285: 'Theft 7.5K',
  286: 'Theft 10K',
  // Counterfeiting
  287: 'Counterfeit 100',
  288: 'Counterfeit 200',
  289: 'Counterfeit 300',
  290: 'Counterfeit 500',
  291: 'Counterfeit 750',
  292: 'Counterfeit 1K',
  293: 'Counterfeit 1.5K',
  294: 'Counterfeit 2K',
  295: 'Counterfeit 2.5K',
  296: 'Counterfeit 3K',
  297: 'Counterfeit 4K',
  298: 'Counterfeit 5K',
  299: 'Counterfeit 6K',
  300: 'Counterfeit 7.5K',
  301: 'Counterfeit 10K',
  // Fraud
  302: 'Fraud 100',
  303: 'Fraud 200',
  304: 'Fraud 300',
  305: 'Fraud 500',
  306: 'Fraud 750',
  307: 'Fraud 1K',
  308: 'Fraud 1.5K',
  309: 'Fraud 2K',
  310: 'Fraud 2.5K',
  311: 'Fraud 3K',
  312: 'Fraud 4K',
  313: 'Fraud 5K',
  314: 'Fraud 6K',
  315: 'Fraud 7.5K',
  316: 'Fraud 10K',
  // Illicit Services
  317: 'Illicit 100',
  318: 'Illicit 200',
  319: 'Illicit 300',
  320: 'Illicit 500',
  321: 'Illicit 750',
  322: 'Illicit 1K',
  323: 'Illicit 1.5K',
  324: 'Illicit 2K',
  325: 'Illicit 2.5K',
  326: 'Illicit 3K',
  327: 'Illicit 4K',
  328: 'Illicit 5K',
  329: 'Illicit 6K',
  330: 'Illicit 7.5K',
  331: 'Illicit 10K',
  // Cybercrime
  332: 'Cyber 100',
  333: 'Cyber 200',
  334: 'Cyber 300',
  335: 'Cyber 500',
  336: 'Cyber 750',
  337: 'Cyber 1K',
  338: 'Cyber 1.5K',
  339: 'Cyber 2K',
  340: 'Cyber 2.5K',
  341: 'Cyber 3K',
  342: 'Cyber 4K',
  343: 'Cyber 5K',
  344: 'Cyber 6K',
  345: 'Cyber 7.5K',
  346: 'Cyber 10K',
};

// Interfaces
export interface HonorProgress {
  id: number;
  name: string;
  current: number;
  target: number;
  progress: number;
  remaining: number;
  isNear: boolean;
}

export interface HonorStatus {
  awarded: number[];
  totalAwarded: number;
  totalAvailable: number;
  progress: HonorProgress[];
  closest: HonorProgress[];
}

export interface MedalProgress {
  id: number;
  name: string;
  current: number;
  target: number;
  progress: number;
  remaining: number;
  isNear: boolean;
}

export interface MedalStatus {
  awarded: number[];
  totalAwarded: number;
  totalAvailable: number;
  progress: MedalProgress[];
  closest: MedalProgress[];
}

export interface HonorsMedalsStatus {
  honorStatus: HonorStatus;
  medalStatus: MedalStatus;
}

// Helper function to get nested stat value
function getStatValue(stats: Record<string, unknown>, path: string): number {
  const parts = path.split('.');
  let val: unknown = stats;
  for (const p of parts) {
    if (val && typeof val === 'object' && p in val) {
      val = (val as Record<string, unknown>)[p];
    } else return 0;
  }
  return typeof val === 'number' ? val : 0;
}

// Check honors progress
export async function checkHonors(apiKey: string): Promise<HonorStatus> {
  const honorsResp = await fetchFromApi<{ honors_awarded?: number[] }>('/user', apiKey, ['honors']);
  const awarded = honorsResp.data?.honors_awarded || [];
  const awardedSet = new Set(awarded);

  const statsResp = await fetchFromApi<Record<string, unknown>>('/v2/user/personalstats?cat=all', apiKey);
  const stats = statsResp.data || {};

  const progress: HonorProgress[] = [];

  for (const [idStr, [path, target]] of Object.entries(HONOR_REQUIREMENTS)) {
    const id = parseInt(idStr);
    if (awardedSet.has(id)) continue;

    const current = getStatValue(stats, path);
    if (current <= 0) continue;

    const remaining = Math.max(0, target - current);
    if (remaining <= 0) {
      console.log('[Torn Honors] Skipping', HONOR_NAMES[id] || id, 'current', current, 'target', target);
      continue;
    }

    const pct = Math.min(100, Math.round((current / target) * 100));

    progress.push({
      id, name: HONOR_NAMES[id] || `Honor #${id}`,
      current, target, progress: pct, remaining,
      isNear: remaining > 0 && remaining <= 10,
    });
  }

  progress.sort((a, b) => {
    if (a.isNear !== b.isNear) return a.isNear ? -1 : 1;
    if (b.progress !== a.progress) return b.progress - a.progress;
    return a.remaining - b.remaining;
  });

  const closest = progress.filter(h => h.remaining > 0).slice(0, 5);

  return {
    awarded, totalAwarded: awarded.length,
    totalAvailable: Object.keys(HONOR_REQUIREMENTS).length,
    progress, closest,
  };
}

// Check medals progress
export async function checkMedals(apiKey: string): Promise<MedalStatus> {
  const resp = await fetchFromApi<{ medals_awarded?: number[] }>('/user', apiKey, ['medals']);
  const awarded = resp.data?.medals_awarded || [];
  const awardedSet = new Set(awarded);

  const statsResp = await fetchFromApi<Record<string, unknown>>('/v2/user/personalstats?cat=all', apiKey);
  const stats = statsResp.data || {};

  // Fetch medal names from API
  const apiMedalNames = await fetchMedalNamesFromApi(apiKey);

  const progress: MedalProgress[] = [];
  let totalAvailable = 0;

  for (const [idStr, [path, target]] of Object.entries(MEDAL_REQUIREMENTS)) {
    const id = parseInt(idStr);
    totalAvailable++;
    if (awardedSet.has(id)) continue;

    const current = getStatValue(stats, path);
    if (current <= 0) continue;

    const remaining = Math.max(0, target - current);
    if (remaining <= 0) continue;

    const pct = Math.min(100, Math.round((current / target) * 100));

    // Prefer API name, fall back to local name
    const name = apiMedalNames[id] || MEDAL_NAMES[id] || `Medal #${id}`;

    progress.push({
      id,
      name,
      current,
      target,
      progress: pct,
      remaining,
      isNear: remaining > 0 && remaining <= 10,
    });
  }

  progress.sort((a, b) => {
    if (a.isNear !== b.isNear) return a.isNear ? -1 : 1;
    if (b.progress !== a.progress) return b.progress - a.progress;
    return a.remaining - b.remaining;
  });

  const closest = progress.filter(h => h.remaining > 0).slice(0, 5);

  return {
    awarded,
    totalAwarded: awarded.length,
    totalAvailable,
    progress,
    closest,
  };
}

// Fetch medal names from Torn API
let medalNamesCache: Record<number, string> | null = null;

async function fetchMedalNamesFromApi(apiKey: string): Promise<Record<number, string>> {
  if (medalNamesCache) return medalNamesCache;

  try {
    const resp = await fetchFromApi<Record<string, { name?: string }>>('/torn/medals', apiKey);
    const data = resp.data || {};

    medalNamesCache = {};
    for (const [idStr, medal] of Object.entries(data)) {
      const id = parseInt(idStr);
      if (!isNaN(id) && medal.name) {
        medalNamesCache[id] = medal.name;
      }
    }
  } catch (e) {
    console.error('[Torn Medals] Failed to fetch medal names:', e);
    medalNamesCache = {};
  }

  return medalNamesCache || {};
}

// Combined check
export async function checkHonorsAndMedals(apiKey: string): Promise<HonorsMedalsStatus> {
  const [honorStatus, medalStatus] = await Promise.all([checkHonors(apiKey), checkMedals(apiKey)]);
  return { honorStatus, medalStatus };
}
