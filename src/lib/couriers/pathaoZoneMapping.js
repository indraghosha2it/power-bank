// D:\Smart-Gadget\Gadget-backend\src\lib\couriers\pathaoZoneMapping.js

/**
 * Complete Pathao Zone Mapping
 * Maps Bangladesh location data to Pathao zone IDs
 */

// ✅ Complete Pathao zone list for Dhaka (city_id: 1)
const PATHAO_DHAKA_ZONES = {
  'gulshan': 1,
  'banani': 2,
  'baridhara': 3,
  'mohakhali': 4,
  'tejgaon': 5,
  'farmgate': 6,
  'kawran bazar': 7,
  'dhanmondi': 8,
  'lalmatia': 9,
  'mohammadpur': 10,
  'shyamoli': 11,
  'mirpur': 12,
  'pallabi': 13,
  'uttara': 14,
  'tongi': 15,
  'savar': 16,
  'keraniganj': 17,
  'narayanganj': 18,
  'demra': 19,
  'jatrabari': 20,
  'badda': 21,
  'hatirjheel': 22,
  'moghbazar': 23,
  'shahbagh': 24,
  'ramna': 25,
  'paltan': 26,
  'motijheel': 27,
  'sadarghat': 28,
  'kamarpara': 29,
  'kallayanpur': 30,
  'adabar': 31,
  'shyampur': 32,
  'sayedabad': 33,
  'kadamtali': 34,
  'khilgaon': 35,
  'basabo': 36,
  'mugda': 37,
  'khilkhet': 38,
  'vashantek': 39,
  'dakshinkhan': 40,
  'uttarkhan': 41,
  'baishtek': 42,
  'ashkona': 43,
  'bijaynagar': 44,
};

// ✅ Map for other cities (all zones default to 0)
const OTHER_CITY_ZONES = {
  'chittagong': {},
  'khulna': {},
  'rajshahi': {},
  'barisal': {},
  'sylhet': {},
  'rangpur': {},
  'mymensingh': {},
};

// ✅ District to Pathao city ID mapping
const DISTRICT_TO_CITY_ID = {
  'dhaka': 1,
  'chittagong': 2,
  'khulna': 3,
  'rajshahi': 4,
  'barisal': 5,
  'sylhet': 6,
  'rangpur': 7,
  'mymensingh': 8,
};

/**
 * Get Pathao zone ID from upazila name for a given district
 */
function getPathaoZoneId(district, upazila) {
  if (!upazila) return 0;
  
  const normalizedUpazila = upazila.toLowerCase().trim();
  const normalizedDistrict = district.toLowerCase().trim();
  
  // Only Dhaka has specific zone mapping
  if (normalizedDistrict === 'dhaka') {
    // Direct match
    if (PATHAO_DHAKA_ZONES[normalizedUpazila] !== undefined) {
      return PATHAO_DHAKA_ZONES[normalizedUpazila];
    }
    
    // Try partial match
    for (const [key, value] of Object.entries(PATHAO_DHAKA_ZONES)) {
      if (normalizedUpazila.includes(key) || key.includes(normalizedUpazila)) {
        return value;
      }
    }
  }
  
  // For other cities or if not found, return 0
  return 0;
}

/**
 * Get Pathao city ID from district name
 */
function getPathaoCityId(district) {
  if (!district) return 1;
  
  const normalized = district.toLowerCase().trim();
  
  if (DISTRICT_TO_CITY_ID[normalized]) {
    return DISTRICT_TO_CITY_ID[normalized];
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(DISTRICT_TO_CITY_ID)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return 1; // Default to Dhaka
}

/**
 * Check if a zone is supported by Pathao
 */
function isPathaoZone(district, zoneName) {
  if (!zoneName) return false;
  
  const normalizedDistrict = district.toLowerCase().trim();
  const normalizedZone = zoneName.toLowerCase().trim();
  
  if (normalizedDistrict === 'dhaka') {
    return PATHAO_DHAKA_ZONES[normalizedZone] !== undefined ||
           Object.keys(PATHAO_DHAKA_ZONES).some(key => 
             normalizedZone.includes(key) || key.includes(normalizedZone)
           );
  }
  
  // For other cities, all zones are supported (will use zone 0)
  return true;
}

module.exports = {
  PATHAO_DHAKA_ZONES,
  OTHER_CITY_ZONES,
  DISTRICT_TO_CITY_ID,
  getPathaoZoneId,
  getPathaoCityId,
  isPathaoZone,
};