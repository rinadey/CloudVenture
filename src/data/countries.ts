import { CountryInfo } from '../types';

export const COUNTRIES_MAP: Record<string, CountryInfo> = {
  // Saudi Arabia
  '682': {
    id: '682',
    name: 'Saudi Arabia',
    alpha2: 'SA',
    flag: '🇸🇦',
    capital: 'Riyadh',
    coordinates: [45.0792, 23.8859],
    popularCities: [
      { name: 'Riyadh', lat: 24.7136, lon: 46.6753, description: 'Vibrant capital & Kingdom Tower' },
      { name: 'Jeddah', lat: 21.5433, lon: 39.1728, description: 'Bride of the Red Sea & Historic Al-Balad' },
      { name: 'Mecca', lat: 21.3891, lon: 39.8579, description: 'The Holy City & sacred heart of Islamic world' },
      { name: 'Medina', lat: 24.5247, lon: 39.5692, description: 'The Radiant City & serene palm gardens' },
      { name: 'Al Khobar', lat: 26.2172, lon: 50.1971, description: 'Corniche breezes, seaside cafes & marina' },
      { name: 'Dammam', lat: 26.4207, lon: 50.0888, description: 'Eastern Province coastal center & arts' },
      { name: 'AlUla', lat: 26.6186, lon: 37.9255, description: 'Ancient Hegra rock tombs & majestic canyon' },
      { name: 'Taif', lat: 21.2854, lon: 40.4244, description: 'City of roses, cool mountain breezes & orchards' },
      { name: 'Abha', lat: 18.2164, lon: 42.5053, description: 'Misty Asir peaks, jacaranda trees & cool climate' },
      { name: 'Tabuk', lat: 28.3835, lon: 36.5662, description: 'Northern gateway & historic castle' },
      { name: 'Hail', lat: 27.5219, lon: 41.6907, description: 'Desert heritage, Shammar mountains & petroglyphs' },
      { name: 'Jazan', lat: 16.8892, lon: 42.5706, description: 'Tropical Red Sea port & Farasan islands gateway' },
      { name: 'Najran', lat: 17.4924, lon: 44.1277, description: 'Historic mud-brick fortresses & oasis palms' },
      { name: 'Yanbu', lat: 24.0891, lon: 38.0637, description: 'Coral reef diving & historic coastal quays' },
      { name: 'Jubail', lat: 27.0112, lon: 49.6583, description: 'Persian Gulf beaches, lagoons & parks' },
      { name: 'Buraidah', lat: 26.3260, lon: 43.9750, description: 'Heart of Al-Qassim date palm groves' }
    ]
  },
  // France
  '250': {
    id: '250',
    name: 'France',
    alpha2: 'FR',
    flag: '🇫🇷',
    capital: 'Paris',
    coordinates: [2.2137, 46.2276],
    popularCities: [
      { name: 'Paris', lat: 48.8566, lon: 2.3522, description: 'City of light, pastries & romantic bridges' },
      { name: 'Nice', lat: 43.7102, lon: 7.2620, description: 'Côte d’Azur sunshine & sea promenade' },
      { name: 'Lyon', lat: 45.7640, lon: 4.8357, description: 'Gastronomy capital & historic traboules' },
      { name: 'Marseille', lat: 43.2965, lon: 5.3698, description: 'Vibrant Mediterranean port & Calanques' },
      { name: 'Toulouse', lat: 43.6047, lon: 1.4442, description: 'Pink city brick architecture & sunny squares' },
      { name: 'Bordeaux', lat: 44.8378, lon: -0.5792, description: 'Vineyard capital, water mirror & grand quays' },
      { name: 'Strasbourg', lat: 48.5734, lon: 7.7521, description: 'Half-timbered fairy-tale canals & gothic spire' },
      { name: 'Nantes', lat: 47.2184, lon: -1.5536, description: 'Loire river islands & creative arts' },
      { name: 'Montpellier', lat: 43.6108, lon: 3.8767, description: 'Southern sun, student plazas & medieval arches' },
      { name: 'Lille', lat: 50.6292, lon: 3.0573, description: 'Flemish brick charm, Grand Place & waffles' },
      { name: 'Cannes', lat: 43.5528, lon: 7.0174, description: 'Palm-lined Croisette & shimmering bay' },
      { name: 'Rennes', lat: 48.1173, lon: -1.6778, description: 'Breton culture, creperies & cobblestones' },
      { name: 'Grenoble', lat: 45.1885, lon: 5.7245, description: 'Alpine valley fortress & cable cars' }
    ]
  },
  // Japan
  '392': {
    id: '392',
    name: 'Japan',
    alpha2: 'JP',
    flag: '🇯🇵',
    capital: 'Tokyo',
    coordinates: [138.2529, 36.2048],
    popularCities: [
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503, description: 'Neon alleys, tranquil shrines & matcha cafés' },
      { name: 'Kyoto', lat: 35.0116, lon: 135.7681, description: 'Bamboo groves, geisha quarters & temples' },
      { name: 'Osaka', lat: 34.6937, lon: 135.5023, description: 'Street food haven & Dotonbori canals' },
      { name: 'Sapporo', lat: 43.0618, lon: 141.3545, description: 'Cozy snowy wonderland & hot ramen' },
      { name: 'Fukuoka', lat: 33.5904, lon: 130.4017, description: 'Riverside Yatai food stalls & tonkotsu ramen' },
      { name: 'Nagoya', lat: 35.1815, lon: 136.9066, description: 'Historic samurai castle & savory miso katsu' },
      { name: 'Hiroshima', lat: 34.3853, lon: 132.4553, description: 'Peace Memorial Park & Miyajima torii gate' },
      { name: 'Yokohama', lat: 35.4437, lon: 139.6380, description: 'Waterfront bayside park & historic Chinatown' },
      { name: 'Nara', lat: 34.6851, lon: 135.8048, description: 'Friendly roaming deer & ancient giant Buddha' },
      { name: 'Kobe', lat: 34.6901, lon: 135.1955, description: 'Scenic mountain harbor & famous Wagyu beef' },
      { name: 'Sendai', lat: 38.2682, lon: 140.8694, description: 'City of trees & green Tohoku landscapes' },
      { name: 'Okinawa', lat: 26.2124, lon: 127.6809, description: 'Subtropical turquoise reefs & island smiles' }
    ]
  },
  // United States
  '840': {
    id: '840',
    name: 'United States',
    alpha2: 'US',
    flag: '🇺🇸',
    capital: 'Washington, D.C.',
    coordinates: [-95.7129, 37.0902],
    popularCities: [
      { name: 'New York', lat: 40.7128, lon: -74.0060, description: 'Central Park, Broadway & skyline magic' },
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, description: 'Pacific coastline, Hollywood hills & palm trees' },
      { name: 'Chicago', lat: 41.8781, lon: -87.6298, description: 'Lake Michigan breezes, jazz & architectural icons' },
      { name: 'San Francisco', lat: 37.7749, lon: -122.4194, description: 'Golden Gate, breezy hills & sourdough' },
      { name: 'Miami', lat: 25.7617, lon: -80.1918, description: 'Tropical beaches, art deco & vibrant culture' },
      { name: 'Seattle', lat: 47.6062, lon: -122.3321, description: 'Coffee houses, misty sound & evergreen pines' },
      { name: 'Honolulu', lat: 21.3069, lon: -157.8583, description: 'Warm Pacific trade winds & aloha beaches' },
      { name: 'Austin', lat: 30.2672, lon: -97.7431, description: 'Live music, riverside greenbelts & food trucks' },
      { name: 'Boston', lat: 42.3601, lon: -71.0589, description: 'Historic cobblestone trails & harbor breeze' },
      { name: 'Las Vegas', lat: 36.1699, lon: -115.1398, description: 'Neon desert oasis & spectacle shows' },
      { name: 'Denver', lat: 39.7392, lon: -104.9903, description: 'Mile-high city & snowy Rocky Mountain backdrop' },
      { name: 'Washington D.C.', lat: 38.9072, lon: -77.0369, description: 'Cherry blossoms, monuments & Smithsonian museums' }
    ]
  },
  // United Kingdom
  '826': {
    id: '826',
    name: 'United Kingdom',
    alpha2: 'GB',
    flag: '🇬🇧',
    capital: 'London',
    coordinates: [-3.4360, 55.3781],
    popularCities: [
      { name: 'London', lat: 51.5074, lon: -0.1278, description: 'Afternoon tea, cozy bookshops & Big Ben' },
      { name: 'Edinburgh', lat: 55.9533, lon: -3.1883, description: 'Fairytale castle, cobbled closes & fog' },
      { name: 'Manchester', lat: 53.4808, lon: -2.2426, description: 'Industrial heritage, music scenes & red bricks' },
      { name: 'Birmingham', lat: 52.4862, lon: -1.8904, description: 'Canal walks, botanical gardens & jewelry quarter' },
      { name: 'Glasgow', lat: 55.8642, lon: -4.2518, description: 'Victorian architecture & warm Scottish character' },
      { name: 'Liverpool', lat: 53.4084, lon: -2.9916, description: 'Albert Dock, Beatles history & maritime charm' },
      { name: 'Bath', lat: 51.3758, lon: -2.3599, description: 'Honey-stone terraces & thermal baths' },
      { name: 'Oxford', lat: 51.7520, lon: -1.2577, description: 'Dreaming spires, river punting & quiet quadrangles' },
      { name: 'Cambridge', lat: 52.2053, lon: 0.1218, description: 'Historic colleges, weeping willows & bicycles' },
      { name: 'Belfast', lat: 54.5973, lon: -5.9301, description: 'Lagan riverfront, Titanic dock & vibrant pubs' },
      { name: 'Cardiff', lat: 51.4816, lon: -3.1791, description: 'Welsh castle, harbor bay & arcades' }
    ]
  },
  // Italy
  '380': {
    id: '380',
    name: 'Italy',
    alpha2: 'IT',
    flag: '🇮🇹',
    capital: 'Rome',
    coordinates: [12.5674, 41.8719],
    popularCities: [
      { name: 'Rome', lat: 41.9028, lon: 12.4964, description: 'Ancient piazzas, creamy gelato & espresso' },
      { name: 'Florence', lat: 43.7696, lon: 11.2558, description: 'Renaissance art & terracotta rooftops' },
      { name: 'Venice', lat: 45.4408, lon: 12.3155, description: 'Gondolas, winding canals & pastel bridges' },
      { name: 'Milan', lat: 45.4642, lon: 9.1900, description: 'Gothic Duomo, fashion avenues & chic espresso bars' },
      { name: 'Naples', lat: 40.8518, lon: 14.2681, description: 'Authentic wood-fired pizza & Gulf of Naples views' },
      { name: 'Bologna', lat: 44.4949, lon: 11.3426, description: 'Porticoes, fresh pasta & culinary excellence' },
      { name: 'Turin', lat: 45.0703, lon: 7.6869, description: 'Grand baroque palaces & alpine views' },
      { name: 'Palermo', lat: 38.1157, lon: 13.3615, description: 'Sun-drenched Sicilian markets & street food' },
      { name: 'Verona', lat: 45.4384, lon: 10.9916, description: 'Roman arena, romantic courtyards & river Adige' },
      { name: 'Genoa', lat: 44.4056, lon: 8.9463, description: 'Ligurian port, historic caruggi & basil pesto' }
    ]
  },
  // Spain
  '724': {
    id: '724',
    name: 'Spain',
    alpha2: 'ES',
    flag: '🇪🇸',
    capital: 'Madrid',
    coordinates: [-3.7492, 40.4637],
    popularCities: [
      { name: 'Madrid', lat: 40.4168, lon: -3.7038, description: 'Grand boulevards, churros & art museums' },
      { name: 'Barcelona', lat: 41.3851, lon: 2.1734, description: 'Gaudí wonders, beachside tapas & palm trees' },
      { name: 'Seville', lat: 37.3891, lon: -5.9845, description: 'Orange blossoms, flamenco & sunlit courtyards' },
      { name: 'Valencia', lat: 39.4699, lon: -0.3763, description: 'Birthplace of paella, modern arts & sunny beaches' },
      { name: 'Malaga', lat: 36.7213, lon: -4.4214, description: 'Costa del Sol sunshine, Picasso & coastal breeze' },
      { name: 'Granada', lat: 37.1773, lon: -3.5986, description: 'Majestic Alhambra palace & Sierra Nevada backdrop' },
      { name: 'Bilbao', lat: 43.2630, lon: -2.9350, description: 'Titanium Guggenheim & Basque pintxos' },
      { name: 'Palma', lat: 39.5696, lon: 2.6502, description: 'Mallorcan sandstone cathedral & turquoise coves' },
      { name: 'Cordoba', lat: 37.8882, lon: -4.7794, description: 'Mezquita stone arches & flower-filled patios' }
    ]
  },
  // Germany
  '276': {
    id: '276',
    name: 'Germany',
    alpha2: 'DE',
    flag: '🇩🇪',
    capital: 'Berlin',
    coordinates: [10.4515, 51.1657],
    popularCities: [
      { name: 'Berlin', lat: 52.5200, lon: 13.4050, description: 'Indie flea markets, parks & museum island' },
      { name: 'Munich', lat: 48.1351, lon: 11.5820, description: 'Bavarian beer gardens & English Garden surfing' },
      { name: 'Hamburg', lat: 53.5511, lon: 9.9937, description: 'Canal warehouse district & sparkling harbor' },
      { name: 'Frankfurt', lat: 50.1109, lon: 8.6821, description: 'River Main skyline, timbered squares & apple wine' },
      { name: 'Cologne', lat: 50.9375, lon: 6.9603, description: 'Twin-spire cathedral & Rhine river promenade' },
      { name: 'Stuttgart', lat: 48.7758, lon: 9.1829, description: 'Terraced vineyards, castles & automotive culture' },
      { name: 'Dusseldorf', lat: 51.2277, lon: 6.7735, description: 'Rhine promenade & Japanese quarter' },
      { name: 'Dresden', lat: 51.0504, lon: 13.7373, description: 'Baroque palaces & Elbe river vistas' },
      { name: 'Leipzig', lat: 51.3397, lon: 12.3731, description: 'Musical history, leafy parks & vibrant coffee' }
    ]
  },
  // United Arab Emirates
  '784': {
    id: '784',
    name: 'United Arab Emirates',
    alpha2: 'AE',
    flag: '🇦🇪',
    capital: 'Abu Dhabi',
    coordinates: [53.8478, 23.4241],
    popularCities: [
      { name: 'Dubai', lat: 25.2048, lon: 55.2708, description: 'Burj Khalifa, desert dunes & glittering marina' },
      { name: 'Abu Dhabi', lat: 24.4539, lon: 54.3773, description: 'Sheikh Zayed Mosque & Louvre Abu Dhabi' },
      { name: 'Sharjah', lat: 25.3463, lon: 55.4209, description: 'Cultural heart, museums & traditional souks' },
      { name: 'Al Ain', lat: 24.2075, lon: 55.7447, description: 'Garden city oasis, date palms & mountain Jebel Hafeet' },
      { name: 'Ras Al Khaimah', lat: 25.7895, lon: 55.9432, description: 'Terracotta desert dunes & mountain zip lines' },
      { name: 'Ajman', lat: 25.4052, lon: 55.5136, description: 'Tranquil coastal corniche & mangrove lagoons' },
      { name: 'Fujairah', lat: 25.1288, lon: 56.3265, description: 'Gulf of Oman coastline & rugged Hajar peaks' }
    ]
  },
  // Canada
  '124': {
    id: '124',
    name: 'Canada',
    alpha2: 'CA',
    flag: '🇨🇦',
    capital: 'Ottawa',
    coordinates: [-106.3468, 56.1304],
    popularCities: [
      { name: 'Toronto', lat: 43.6532, lon: -79.3832, description: 'CN Tower, Lake Ontario islands & multicultural eats' },
      { name: 'Vancouver', lat: 49.2827, lon: -123.1207, description: 'Pacific sea walls & snowcapped peaks' },
      { name: 'Montreal', lat: 45.5017, lon: -73.5673, description: 'Old cobblestones, bagels & cozy bistros' },
      { name: 'Calgary', lat: 51.0447, lon: -114.0719, description: 'Gateway to the Rockies & sunny prairie days' },
      { name: 'Ottawa', lat: 45.4215, lon: -75.6972, description: 'Parliament hill, Rideau canal & tulip festivals' },
      { name: 'Quebec City', lat: 46.8139, lon: -71.2080, description: 'Historic stone ramparts & Chateau Frontenac' },
      { name: 'Victoria', lat: 48.4284, lon: -123.3656, description: 'Vancouver Island gardens & ocean harbor' },
      { name: 'Banff', lat: 51.1784, lon: -115.5708, description: 'Turquoise glacial lakes & alpine peaks' }
    ]
  },
  // Australia
  '036': {
    id: '036',
    name: 'Australia',
    alpha2: 'AU',
    flag: '🇦🇺',
    capital: 'Canberra',
    coordinates: [133.7751, -25.2744],
    popularCities: [
      { name: 'Sydney', lat: -33.8688, lon: 151.2093, description: 'Opera House, coastal walks & Bondi waves' },
      { name: 'Melbourne', lat: -37.8136, lon: 144.9631, description: 'Laneway espresso, indie boutiques & street art' },
      { name: 'Brisbane', lat: -27.4698, lon: 153.0251, description: 'Sun-kissed riverfront, parklands & cafes' },
      { name: 'Perth', lat: -31.9505, lon: 115.8605, description: 'Indian Ocean sunsets & Kings Park bushland' },
      { name: 'Adelaide', lat: -34.9285, lon: 138.6007, description: 'Parkland rings, cellar doors & central market' },
      { name: 'Gold Coast', lat: -28.0167, lon: 153.4000, description: 'Golden surf breaks & subtropical canals' },
      { name: 'Cairns', lat: -16.9186, lon: 145.7781, description: 'Great Barrier Reef & tropical rainforests' },
      { name: 'Hobart', lat: -42.8821, lon: 147.3272, description: 'Tasmanian mountain backdrop & historic docks' }
    ]
  },
  // Egypt
  '818': {
    id: '818',
    name: 'Egypt',
    alpha2: 'EG',
    flag: '🇪🇬',
    capital: 'Cairo',
    coordinates: [30.8025, 26.8206],
    popularCities: [
      { name: 'Cairo', lat: 30.0444, lon: 31.2357, description: 'Nile feluccas, Pyramids & fragrant bazaars' },
      { name: 'Alexandria', lat: 31.2001, lon: 29.9187, description: 'Mediterranean breeze & historic corniche' },
      { name: 'Luxor', lat: 25.6872, lon: 32.6396, description: 'Valley of the Kings & ancient temple pillars' },
      { name: 'Aswan', lat: 24.0889, lon: 32.8998, description: 'Golden dunes meeting the deep blue Nile' },
      { name: 'Sharm El Sheikh', lat: 27.9158, lon: 34.3299, description: 'Red Sea coral reefs & sunny beach resorts' },
      { name: 'Hurghada', lat: 27.2579, lon: 33.8116, description: 'Crystal diving waters & desert safari' }
    ]
  },
  // Turkey
  '792': {
    id: '792',
    name: 'Turkey',
    alpha2: 'TR',
    flag: '🇹🇷',
    capital: 'Ankara',
    coordinates: [35.2433, 38.9637],
    popularCities: [
      { name: 'Istanbul', lat: 41.0082, lon: 28.9784, description: 'Bosphorus ferry, spice bazaar & friendly cats' },
      { name: 'Antalya', lat: 36.8969, lon: 30.7133, description: 'Turquoise Coast beaches & historic Kaleiçi' },
      { name: 'Cappadocia', lat: 38.6431, lon: 34.8289, description: 'Fairy chimneys & sunrise hot air balloons' },
      { name: 'Izmir', lat: 38.4237, lon: 27.1428, description: 'Aegean promenade, palm trees & sunset cafes' },
      { name: 'Ankara', lat: 39.9334, lon: 32.8597, description: 'Capital citadel, leafy parks & museums' },
      { name: 'Bodrum', lat: 37.0344, lon: 27.4305, description: 'Whitewashed marina, castle & Aegean coves' }
    ]
  },
  // Switzerland
  '756': {
    id: '756',
    name: 'Switzerland',
    alpha2: 'CH',
    flag: '🇨🇭',
    capital: 'Bern',
    coordinates: [8.2275, 46.8182],
    popularCities: [
      { name: 'Zurich', lat: 47.3769, lon: 8.5417, description: 'Crystal lake, old town guildhalls & artisan chocolates' },
      { name: 'Geneva', lat: 46.2044, lon: 6.1432, description: 'Lake fountain, floral clock & peaceful quays' },
      { name: 'Lucerne', lat: 47.0502, lon: 8.3093, description: 'Wooden Chapel Bridge & mountain Pilatus' },
      { name: 'Bern', lat: 46.9480, lon: 7.4474, description: 'Aare river loops & medieval sandstone arcades' },
      { name: 'Basel', lat: 47.5596, lon: 7.5886, description: 'Rhine ferries, contemporary art & red town hall' },
      { name: 'Interlaken', lat: 46.6863, lon: 7.8632, description: 'Between two turquoise alpine lakes' }
    ]
  },
  // Greece
  '300': {
    id: '300',
    name: 'Greece',
    alpha2: 'GR',
    flag: '🇬🇷',
    capital: 'Athens',
    coordinates: [21.8243, 39.0742],
    popularCities: [
      { name: 'Athens', lat: 37.9838, lon: 23.7275, description: 'Acropolis views, Plaka alleys & rooftop sunsets' },
      { name: 'Santorini', lat: 36.3932, lon: 25.4615, description: 'Whitewashed domes & turquoise caldera vistas' },
      { name: 'Mykonos', lat: 37.4467, lon: 25.3289, description: 'Windmills, sugar-cube houses & Aegean breezes' },
      { name: 'Thessaloniki', lat: 40.6401, lon: 22.9444, description: 'Seaside promenade, White Tower & pastry cafes' },
      { name: 'Rhodes', lat: 36.4349, lon: 28.2175, description: 'Medieval fortress street & sunlit beaches' }
    ]
  },
  // Morocco
  '504': {
    id: '504',
    name: 'Morocco',
    alpha2: 'MA',
    flag: '🇲🇦',
    capital: 'Rabat',
    coordinates: [-7.0926, 31.7917],
    popularCities: [
      { name: 'Marrakech', lat: 31.6295, lon: -7.9811, description: 'Jemaa el-Fnaa spices, riad gardens & mint tea' },
      { name: 'Casablanca', lat: 33.5731, lon: -7.5898, description: 'Hassan II mosque by the Atlantic & corniche' },
      { name: 'Fes', lat: 34.0181, lon: -5.0078, description: 'Ancient labyrinthine medina & artisan tanneries' },
      { name: 'Chefchaouen', lat: 35.1714, lon: -5.2697, description: 'Enchanting blue-painted mountain alleys' },
      { name: 'Tangier', lat: 35.7595, lon: -5.8340, description: 'Gateway to Gibraltar Strait & literary cafes' }
    ]
  },
  // India
  '356': {
    id: '356',
    name: 'India',
    alpha2: 'IN',
    flag: '🇮🇳',
    capital: 'New Delhi',
    coordinates: [78.9629, 20.5937],
    popularCities: [
      { name: 'New Delhi', lat: 28.6139, lon: 77.2090, description: 'Historic monuments, Mughal gardens & craft markets' },
      { name: 'Mumbai', lat: 19.0760, lon: 72.8777, description: 'Marine Drive sea breeze, chai & street snacks' },
      { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, description: 'Garden city, craft breweries & tech innovation' },
      { name: 'Jaipur', lat: 26.9124, lon: 75.7873, description: 'The Pink City, Amber fort & royal palaces' },
      { name: 'Kolkata', lat: 22.5726, lon: 88.3639, description: 'Colonial heritage, sweets & literary warmth' },
      { name: 'Goa', lat: 15.2993, lon: 74.1240, description: 'Golden beaches, coconut palms & relaxed vibes' }
    ]
  },
  // Thailand
  '764': {
    id: '764',
    name: 'Thailand',
    alpha2: 'TH',
    flag: '🇹🇭',
    capital: 'Bangkok',
    coordinates: [100.9925, 15.8700],
    popularCities: [
      { name: 'Bangkok', lat: 13.7563, lon: 100.5018, description: 'Golden temples, boat noodles & vibrant night markets' },
      { name: 'Chiang Mai', lat: 18.7883, lon: 98.9853, description: 'Mountain mist, lantern festivals & artisan coffee' },
      { name: 'Phuket', lat: 7.8804, lon: 98.3923, description: 'Andaman beaches, viewpoints & colorful Sino-Portuguese streets' },
      { name: 'Krabi', lat: 8.0863, lon: 98.9063, description: 'Limestone karsts & emerald island lagoons' },
      { name: 'Pattaya', lat: 12.9236, lon: 100.8825, description: 'Gulf coast beaches & tropical water sports' }
    ]
  },
  // China
  '156': {
    id: '156',
    name: 'China',
    alpha2: 'CN',
    flag: '🇨🇳',
    capital: 'Beijing',
    coordinates: [104.1954, 35.8617],
    popularCities: [
      { name: 'Beijing', lat: 39.9042, lon: 116.4074, description: 'Forbidden City, Summer Palace & cozy tea houses' },
      { name: 'Shanghai', lat: 31.2304, lon: 121.4737, description: 'The Bund riverfront, French Concession & dumplings' },
      { name: 'Guangzhou', lat: 23.1291, lon: 113.2644, description: 'Dim sum culinary cradle & Pearl River lights' },
      { name: 'Shenzhen', lat: 22.5431, lon: 114.0579, description: 'Modern skyline, lush parks & coastal breeze' },
      { name: 'Chengdu', lat: 30.5728, lon: 104.0668, description: 'Panda sanctuaries, spicy hotpot & relaxed alleys' },
      { name: 'Hangzhou', lat: 30.2741, lon: 120.1551, description: 'Serene West Lake, willow trees & Longjing tea' },
      { name: 'Xi\'an', lat: 34.3416, lon: 108.9398, description: 'Terracotta Army & ancient city walls' }
    ]
  },
  // Portugal
  '620': {
    id: '620',
    name: 'Portugal',
    alpha2: 'PT',
    flag: '🇵🇹',
    capital: 'Lisbon',
    coordinates: [-8.2245, 39.3999],
    popularCities: [
      { name: 'Lisbon', lat: 38.7223, lon: -9.1393, description: 'Yellow tram 28, pasteis de nata & miradouro sunsets' },
      { name: 'Porto', lat: 41.1579, lon: -8.6291, description: 'Douro river wine cellars & Ribeira tiles' },
      { name: 'Faro', lat: 37.0194, lon: -7.9304, description: 'Algarve coastline, golden cliffs & ocean lagoons' },
      { name: 'Sintra', lat: 38.8029, lon: -9.3817, description: 'Fairytale Pena palace nestled in foggy pine hills' },
      { name: 'Coimbra', lat: 40.2033, lon: -8.4103, description: 'Historic university library & riverfront cafes' }
    ]
  },
  // Netherlands
  '528': {
    id: '528',
    name: 'Netherlands',
    alpha2: 'NL',
    flag: '🇳🇱',
    capital: 'Amsterdam',
    coordinates: [5.2913, 52.1326],
    popularCities: [
      { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, description: 'Canal bicycles, blooming tulips & cozy brown cafés' },
      { name: 'Rotterdam', lat: 51.9244, lon: 4.4777, description: 'Futuristic architecture, Cube houses & grand port' },
      { name: 'The Hague', lat: 52.0705, lon: 4.3007, description: 'Peace palace, seaside Scheveningen pier & royal courts' },
      { name: 'Utrecht', lat: 52.0907, lon: 5.1214, description: 'Sunken canal quays & Dom tower bells' }
    ]
  },
  // Brazil
  '076': {
    id: '076',
    name: 'Brazil',
    alpha2: 'BR',
    flag: '🇧🇷',
    capital: 'Brasília',
    coordinates: [-51.9253, -14.2350],
    popularCities: [
      { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, description: 'Copacabana sands, Christ the Redeemer & samba' },
      { name: 'São Paulo', lat: -23.5505, lon: -46.6333, description: 'Art museums, gourmet culinary scene & skyline' },
      { name: 'Salvador', lat: -12.9777, lon: -38.5016, description: 'Pelourinho pastel colonial charm & afro-brazilian beats' },
      { name: 'Brasília', lat: -15.7975, lon: -47.8919, description: 'Oscar Niemeyer curves & grand modernist plazas' }
    ]
  },
  // Mexico
  '484': {
    id: '484',
    name: 'Mexico',
    alpha2: 'MX',
    flag: '🇲🇽',
    capital: 'Mexico City',
    coordinates: [-102.5528, 23.6345],
    popularCities: [
      { name: 'Mexico City', lat: 19.4326, lon: -99.1332, description: 'Coyoacán courtyards, street tacos & lush parks' },
      { name: 'Cancun', lat: 21.1619, lon: -86.8515, description: 'Caribbean turquoise waters & Mayan ruins' },
      { name: 'Guadalajara', lat: 20.6597, lon: -103.3496, description: 'Mariachi melodies, agave fields & colonial plazas' },
      { name: 'Oaxaca', lat: 17.0732, lon: -96.7266, description: 'Rich mole recipes, artisanal crafts & cobblestone streets' }
    ]
  },
  // South Korea
  '410': {
    id: '410',
    name: 'South Korea',
    alpha2: 'KR',
    flag: '🇰🇷',
    capital: 'Seoul',
    coordinates: [127.7669, 35.9078],
    popularCities: [
      { name: 'Seoul', lat: 37.5665, lon: 126.9780, description: 'Hanok tea houses, K-culture & river parks' },
      { name: 'Busan', lat: 35.1796, lon: 129.0756, description: 'Haeundae beach & seaside cliff temples' },
      { name: 'Incheon', lat: 37.4563, lon: 126.7052, description: 'Coastal island bridges & Chinatown dumplings' },
      { name: 'Jeju', lat: 33.4996, lon: 126.5312, description: 'Volcanic beaches, waterfalls & tangerine groves' }
    ]
  },
  // Norway
  '578': {
    id: '578',
    name: 'Norway',
    alpha2: 'NO',
    flag: '🇳🇴',
    capital: 'Oslo',
    coordinates: [8.4689, 60.4720],
    popularCities: [
      { name: 'Oslo', lat: 59.9139, lon: 10.7522, description: 'Fjord saunas, sculpture parks & serene harbor' },
      { name: 'Bergen', lat: 60.3913, lon: 5.3221, description: 'Wooden wharf houses & misty mountain funicular' },
      { name: 'Tromsø', lat: 69.6492, lon: 18.9553, description: 'Northern lights capital & Arctic cathedral' },
      { name: 'Trondheim', lat: 63.4305, lon: 10.3951, description: 'Colorful canal stilt warehouses & cathedral' }
    ]
  },
  // Sweden
  '752': {
    id: '752',
    name: 'Sweden',
    alpha2: 'SE',
    flag: '🇸🇪',
    capital: 'Stockholm',
    coordinates: [18.0686, 59.3293],
    popularCities: [
      { name: 'Stockholm', lat: 59.3293, lon: 18.0686, description: 'Baltic archipelago, Gamla Stan & cinnamon buns' },
      { name: 'Gothenburg', lat: 57.7089, lon: 11.9746, description: 'Canal bridges, seaside seafood & cozy cafes' },
      { name: 'Malmö', lat: 55.6050, lon: 13.0038, description: 'Turning Torso tower, seaside parks & cafes' }
    ]
  },
  // Austria
  '040': {
    id: '040',
    name: 'Austria',
    alpha2: 'AT',
    flag: '🇦🇹',
    capital: 'Vienna',
    coordinates: [14.5501, 47.5162],
    popularCities: [
      { name: 'Vienna', lat: 48.2082, lon: 16.3738, description: 'Imperial palaces, Sachertorte & classical concerts' },
      { name: 'Salzburg', lat: 47.8095, lon: 13.0550, description: 'Alpine fortress, Mozart birthplace & cobblestones' },
      { name: 'Innsbruck', lat: 47.2692, lon: 11.4041, description: 'Golden roof framed by jagged snow-covered Alps' }
    ]
  },
  // Ireland
  '372': {
    id: '372',
    name: 'Ireland',
    alpha2: 'IE',
    flag: '🇮🇪',
    capital: 'Dublin',
    coordinates: [-8.2439, 53.4129],
    popularCities: [
      { name: 'Dublin', lat: 53.3498, lon: -6.2603, description: 'Trinity College library, Grafton Street & warm pubs' },
      { name: 'Galway', lat: 53.2707, lon: -9.0568, description: 'Folk buskers, coastal air & colorful facades' },
      { name: 'Cork', lat: 51.8985, lon: -8.4756, description: 'English Market culinary delights & River Lee bridges' }
    ]
  },
  // Argentina
  '032': {
    id: '032',
    name: 'Argentina',
    alpha2: 'AR',
    flag: '🇦🇷',
    capital: 'Buenos Aires',
    coordinates: [-63.6167, -38.4161],
    popularCities: [
      { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816, description: 'San Telmo tango, European boulevards & alfajores' },
      { name: 'Mendoza', lat: -32.8895, lon: -68.8458, description: 'Vineyard valleys with snowy Andes backdrop' },
      { name: 'Bariloche', lat: -41.1335, lon: -71.3103, description: 'Patagonian alpine lakes & artisan chocolate' }
    ]
  },
  // New Zealand
  '554': {
    id: '554',
    name: 'New Zealand',
    alpha2: 'NZ',
    flag: '🇳🇿',
    capital: 'Wellington',
    coordinates: [174.8860, -40.9006],
    popularCities: [
      { name: 'Auckland', lat: -36.8485, lon: 174.7633, description: 'Harbor sailboats, volcanic cones & flat whites' },
      { name: 'Wellington', lat: -41.2865, lon: 174.7762, description: 'Windy capital, red cable car & coastal bays' },
      { name: 'Queenstown', lat: -45.0312, lon: 168.6626, description: 'Alpine peaks, mirror lakes & fresh mountain air' }
    ]
  },
  // Iceland
  '352': {
    id: '352',
    name: 'Iceland',
    alpha2: 'IS',
    flag: '🇮🇸',
    capital: 'Reykjavik',
    coordinates: [-18.5700, 64.9631],
    popularCities: [
      { name: 'Reykjavik', lat: 64.1466, lon: -21.9426, description: 'Thermal lagoons, colorful roofs & northern lights' },
      { name: 'Akureyri', lat: 65.6835, lon: -18.0878, description: 'Northern capital & fjord botanical garden' }
    ]
  },
  // Singapore
  '702': {
    id: '702',
    name: 'Singapore',
    alpha2: 'SG',
    flag: '🇸🇬',
    capital: 'Singapore',
    coordinates: [103.8198, 1.3521],
    popularCities: [
      { name: 'Singapore', lat: 1.3521, lon: 103.8198, description: 'Gardens by the Bay, hawker satay & Marina Bay' }
    ]
  }
};

// Fallback names for other ISO numeric codes
export const ISO_NUMERIC_TO_NAME: Record<string, { name: string; flag: string }> = {
  '004': { name: 'Afghanistan', flag: '🇦🇫' },
  '008': { name: 'Albania', flag: '🇦🇱' },
  '012': { name: 'Algeria', flag: '🇩🇿' },
  '024': { name: 'Angola', flag: '🇦🇴' },
  '032': { name: 'Argentina', flag: '🇦🇷' },
  '036': { name: 'Australia', flag: '🇦🇺' },
  '040': { name: 'Austria', flag: '🇦🇹' },
  '050': { name: 'Bangladesh', flag: '🇧🇩' },
  '056': { name: 'Belgium', flag: '🇧🇪' },
  '068': { name: 'Bolivia', flag: '🇧🇴' },
  '076': { name: 'Brazil', flag: '🇧🇷' },
  '100': { name: 'Bulgaria', flag: '🇧🇬' },
  '124': { name: 'Canada', flag: '🇨🇦' },
  '152': { name: 'Chile', flag: '🇨🇱' },
  '156': { name: 'China', flag: '🇨🇳' },
  '170': { name: 'Colombia', flag: '🇨🇴' },
  '208': { name: 'Denmark', flag: '🇩🇰' },
  '818': { name: 'Egypt', flag: '🇪🇬' },
  '246': { name: 'Finland', flag: '🇫🇮' },
  '250': { name: 'France', flag: '🇫🇷' },
  '276': { name: 'Germany', flag: '🇩🇪' },
  '300': { name: 'Greece', flag: '🇬🇷' },
  '352': { name: 'Iceland', flag: '🇮🇸' },
  '356': { name: 'India', flag: '🇮🇳' },
  '360': { name: 'Indonesia', flag: '🇮🇩' },
  '372': { name: 'Ireland', flag: '🇮🇪' },
  '380': { name: 'Italy', flag: '🇮🇹' },
  '392': { name: 'Japan', flag: '🇯🇵' },
  '404': { name: 'Kenya', flag: '🇰🇪' },
  '484': { name: 'Mexico', flag: '🇲🇽' },
  '504': { name: 'Morocco', flag: '🇲🇦' },
  '528': { name: 'Netherlands', flag: '🇳🇱' },
  '554': { name: 'New Zealand', flag: '🇳🇿' },
  '578': { name: 'Norway', flag: '🇳🇴' },
  '616': { name: 'Poland', flag: '🇵🇱' },
  '620': { name: 'Portugal', flag: '🇵🇹' },
  '682': { name: 'Saudi Arabia', flag: '🇸🇦' },
  '702': { name: 'Singapore', flag: '🇸🇬' },
  '710': { name: 'South Africa', flag: '🇿🇦' },
  '410': { name: 'South Korea', flag: '🇰🇷' },
  '724': { name: 'Spain', flag: '🇪🇸' },
  '752': { name: 'Sweden', flag: '🇸🇪' },
  '756': { name: 'Switzerland', flag: '🇨🇭' },
  '764': { name: 'Thailand', flag: '🇹🇭' },
  '792': { name: 'Turkey', flag: '🇹🇷' },
  '784': { name: 'United Arab Emirates', flag: '🇦🇪' },
  '826': { name: 'United Kingdom', flag: '🇬🇧' },
  '840': { name: 'United States', flag: '🇺🇸' },
  '704': { name: 'Vietnam', flag: '🇻🇳' }
};

// Quick featured world destinations pinned on the map
export const FEATURED_PINNED_DESTINATIONS = [
  { name: 'Jeddah', country: 'Saudi Arabia', flag: '🇸🇦', coordinates: [39.1728, 21.5433] as [number, number], temp: '32°C', icon: '☀️' },
  { name: 'Paris', country: 'France', flag: '🇫🇷', coordinates: [2.3522, 48.8566] as [number, number], temp: '22°C', icon: '🌤️' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', coordinates: [139.6503, 35.6762] as [number, number], temp: '21°C', icon: '🌸' },
  { name: 'New York', country: 'United States', flag: '🇺🇸', coordinates: [-74.0060, 40.7128] as [number, number], temp: '19°C', icon: '🗽' },
  { name: 'London', country: 'United Kingdom', flag: '🇬🇧', coordinates: [-0.1278, 51.5074] as [number, number], temp: '17°C', icon: '☕' },
  { name: 'Sydney', country: 'Australia', flag: '🇦🇺', coordinates: [151.2093, -33.8688] as [number, number], temp: '20°C', icon: '🌊' },
  { name: 'Reykjavik', country: 'Iceland', flag: '🇮🇸', coordinates: [-21.9426, 64.1466] as [number, number], temp: '9°C', icon: '❄️' },
  { name: 'Cairo', country: 'Egypt', flag: '🇪🇬', coordinates: [31.2357, 30.0444] as [number, number], temp: '28°C', icon: '🏜️' },
  { name: 'Rio de Janeiro', country: 'Brazil', flag: '🇧🇷', coordinates: [-43.1729, -22.9068] as [number, number], temp: '26°C', icon: '🏖️' }
];

export function getCountryByNumericId(numericId: string | number): CountryInfo | null {
  const code = String(numericId).padStart(3, '0');
  if (COUNTRIES_MAP[code]) {
    return COUNTRIES_MAP[code];
  }
  if (ISO_NUMERIC_TO_NAME[code]) {
    const basic = ISO_NUMERIC_TO_NAME[code];
    return {
      id: code,
      name: basic.name,
      alpha2: '',
      flag: basic.flag,
      capital: basic.name,
      coordinates: [0, 20],
      popularCities: [{ name: basic.name, lat: 20, lon: 0 }]
    };
  }
  return null;
}
