import { ActivityRecommendation, CurrentWeatherResponse, WeatherMood, OutfitSuggestion } from '../types';

interface WeatherContext {
  temp: number;
  feelsLike: number;
  conditionId: number;
  main: string;
  description: string;
  humidity: number;
  windSpeed: number; // m/s
  rainProb: number; // 0..100
  isDay: boolean;
  cityName: string;
  countryName?: string;
}

export function generateCityActivities(
  weather: CurrentWeatherResponse,
  cityName: string,
  countryName?: string,
  rainProbability = 0
): ActivityRecommendation[] {
  const temp = weather.main.temp;
  const conditionId = weather.weather[0]?.id || 800;
  const main = weather.weather[0]?.main || 'Clear';
  const description = weather.weather[0]?.description || 'clear sky';
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind.speed;
  const isRain = conditionId < 600 || main.toLowerCase().includes('rain') || rainProbability > 40;
  const isSnow = (conditionId >= 600 && conditionId < 700) || main.toLowerCase().includes('snow');
  const isThunder = conditionId < 300 || main.toLowerCase().includes('thunder');
  const isHot = temp >= 31;
  const isPleasant = temp >= 17 && temp < 30 && !isRain && !isSnow;
  const isCold = temp < 14;
  const isVeryWindy = windSpeed > 8; // > ~30 km/h

  const normalizedCity = cityName.toLowerCase().trim();

  // 1. Check for specific known city highlights
  if (normalizedCity.includes('jeddah')) {
    return [
      isHot || humidity > 70 ? {
        id: 'jed-mall',
        title: '🛍️ Red Sea Mall & Indoor Haven',
        tagline: 'Cool air-conditioned coastal relaxation',
        description: `With temperatures at ${Math.round(temp)}°C, duck into Jeddah’s premier seaside mall for refreshing iced cardamom latte, boutique browsing, and indoor entertainment.`,
        suitability: 'Perfect match',
        type: 'Indoor',
        bestTime: '1:00 PM – 5:00 PM',
        category: 'shopping',
        cityHighlight: true
      } : {
        id: 'jed-corniche',
        title: '🌊 Jeddah Corniche Promenade',
        tagline: 'Breezy stroll by the Red Sea & King Fahd Fountain',
        description: `Take a scenic seaside stroll along the Corniche with gentle Red Sea breezes, catching sunset over the iconic fountain and snacking on warm roasted corn.`,
        suitability: isVeryWindy ? 'Great alternative' : 'Perfect match',
        type: 'Outdoor',
        bestTime: '5:00 PM – 8:30 PM',
        category: 'nature',
        cityHighlight: true
      },
      {
        id: 'jed-balad',
        title: '☕ Historic Al-Balad Café Hopping',
        tagline: 'Ancient coral-stone alleys & specialty coffee',
        description: `Wander through UNESCO-listed Al-Balad’s whimsical wooden Roshan balconies, stopping by cozy artisan roasteries for Gahwa with dates.`,
        suitability: 'Perfect match',
        type: 'Semi-sheltered',
        bestTime: '4:30 PM – 9:00 PM',
        category: 'culture',
        cityHighlight: true
      },
      {
        id: 'jed-beach',
        title: '🏖️ Red Sea Beach & Marina Dip',
        tagline: 'Turquoise waters & coral reef vibes',
        description: isHot ? 'Hit private beach clubs in Obhur for a cooling afternoon swim and iced hibiscus cooler.' : 'Enjoy the relaxed coastal waters and catamaran breezes along the Obhur inlet.',
        suitability: isRain || isVeryWindy ? 'Great alternative' : 'Perfect match',
        type: 'Outdoor',
        bestTime: '9:00 AM – 12:00 PM or 4:00 PM – 7:00 PM',
        category: 'relaxation',
        cityHighlight: true
      },
      {
        id: 'jed-aquarium',
        title: '🐠 Fakieh Aquarium & Red Sea Wonders',
        tagline: 'Magical underwater walk through local marine life',
        description: `Delight in colorful clownfish, stingrays, and sea turtles native to the Red Sea coral reefs in a serene, temperature-controlled tunnel.`,
        suitability: 'Weather proof',
        type: 'Indoor',
        bestTime: 'Anytime throughout the day',
        category: 'culture',
        cityHighlight: true
      }
    ];
  }

  if (normalizedCity.includes('paris')) {
    return [
      isRain || isCold ? {
        id: 'par-museum',
        title: '🏛️ Musée d’Orsay & Louvre Treasures',
        tagline: 'Impressionist masterpieces & sheltered halls',
        description: `Rain or chilly breeze outside? Lose yourself in Monet’s water lilies and Van Gogh’s starry skies beneath Orsay’s vaulted glass arches.`,
        suitability: 'Perfect match',
        type: 'Indoor',
        bestTime: '10:00 AM – 2:00 PM',
        category: 'culture',
        cityHighlight: true
      } : {
        id: 'par-gardens',
        title: '🌳 Tuileries & Luxembourg Garden Stroll',
        tagline: 'Plein-air daydreaming & green chairs',
        description: `At ${Math.round(temp)}°C and clear skies, pull up a classic green garden chair by the Medici fountain with a fresh strawberry tart.`,
        suitability: 'Perfect match',
        type: 'Outdoor',
        bestTime: '2:30 PM – 6:00 PM',
        category: 'nature',
        cityHighlight: true
      },
      {
        id: 'par-cafe',
        title: '🥐 Sidewalk Café & People Watching',
        tagline: 'Warm café au lait & flaky pain au chocolat',
        description: isRain ? 'Cozy up under the striped heated awning of a Saint-Germain bistro while listening to raindrops on Parisian zinc rooftops.' : 'Savor a warm cappuccino on an open-air wicker terrace in Le Marais, watching the city drift by.',
        suitability: 'Perfect match',
        type: isRain ? 'Semi-sheltered' : 'Outdoor',
        bestTime: '9:00 AM – 11:30 AM',
        category: 'food',
        cityHighlight: true
      },
      {
        id: 'par-passages',
        title: '📖 19th-Century Covered Passages',
        tagline: 'Antique bookshops, wooden storefronts & glass skylights',
        description: `Stroll through Passage des Panoramas and Galerie Vivienne—whimsical covered arcades lined with vintage print shops and fragrant tearooms.`,
        suitability: 'Weather proof',
        type: 'Indoor',
        bestTime: '1:00 PM – 4:30 PM',
        category: 'shopping',
        cityHighlight: true
      },
      {
        id: 'par-seine',
        title: '🚢 Sunset Seine River Cruise',
        tagline: 'Gilded bridges & sparkling Eiffel Tower',
        description: isRain ? 'Board a glass-canopied boat to view Notre-Dame and Pont Alexandre III without getting a single drop wet.' : 'Feel the evening breeze as you drift beneath 37 historical bridges during golden hour.',
        suitability: isVeryWindy ? 'Great alternative' : 'Perfect match',
        type: isRain ? 'Semi-sheltered' : 'Outdoor',
        bestTime: '6:30 PM – 8:30 PM',
        category: 'relaxation',
        cityHighlight: true
      }
    ];
  }

  if (normalizedCity.includes('tokyo')) {
    return [
      isRain ? {
        id: 'tok-ramen',
        title: '🍜 Steaming Ramen & Shinjuku Food Alley',
        tagline: 'Warm broth, handmade noodles & cozy wooden nooks',
        description: `Drizzle outside is the ultimate excuse to slide into a tiny 8-seat ramen bar for a piping-hot bowl of rich tonkotsu or comforting miso broth.`,
        suitability: 'Perfect match',
        type: 'Indoor',
        bestTime: '12:00 PM – 2:00 PM or 6:30 PM – 9:00 PM',
        category: 'food',
        cityHighlight: true
      } : {
        id: 'tok-park',
        title: '🌸 Shinjuku Gyoen or Meiji Shrine Walk',
        tagline: 'Whispering cedar groves & peaceful zen pavilions',
        description: `With gentle ${Math.round(temp)}°C weather, wander through sprawling botanical gardens, moss paths, and traditional wooden teahouses.`,
        suitability: 'Perfect match',
        type: 'Outdoor',
        bestTime: '10:00 AM – 1:30 PM',
        category: 'nature',
        cityHighlight: true
      },
      {
        id: 'tok-indoor',
        title: '🎮 Akihabara & Retro Arcade Exploration',
        tagline: 'Claw machines, anime treasures & neon wonderland',
        description: `Dive into multi-story retro game centers, gashapon capsule halls, and themed novelty cafés entirely shielded from the weather.`,
        suitability: 'Weather proof',
        type: 'Indoor',
        bestTime: '2:00 PM – 7:00 PM',
        category: 'adventure',
        cityHighlight: true
      },
      {
        id: 'tok-teamlab',
        title: '✨ teamLab Planets Digital Art Universe',
        tagline: 'Wade barefoot through water and holographic flowers',
        description: `Immerse yourself in world-renowned mirror rooms and digital botanical waterfalls where every room responds interactively to your steps.`,
        suitability: 'Perfect match',
        type: 'Indoor',
        bestTime: 'Morning or late afternoon',
        category: 'culture',
        cityHighlight: true
      },
      {
        id: 'tok-ginza',
        title: '🛍️ Ginza & Depachika Gourmet Food Basements',
        tagline: 'Artisan strawberry sandwiches & matcha parfaits',
        description: `Explore the underground food paradises beneath Tokyo’s luxury department stores, tasting delicate wagashi sweets and melon pan.`,
        suitability: 'Weather proof',
        type: 'Indoor',
        bestTime: '3:00 PM – 6:00 PM',
        category: 'shopping',
        cityHighlight: true
      }
    ];
  }

  // 2. Intelligent Dynamic Generator for ANY searched city
  const activities: ActivityRecommendation[] = [];

  if (isRain || isThunder) {
    activities.push({
      id: 'gen-museum',
      title: `🏛️ Cultural Museums & Art Galleries in ${cityName}`,
      tagline: 'Inspiring exhibits, warm lighting & rainy-day calm',
      description: `Today’s ${description} makes it a dreamy day to wander quiet exhibit halls, admiring local history and fine art without rush.`,
      suitability: 'Perfect match',
      type: 'Indoor',
      bestTime: '11:00 AM – 3:30 PM',
      category: 'culture'
    });
    activities.push({
      id: 'gen-cafe',
      title: `☕ Cozy Artisan Café & Book Reading in ${cityName}`,
      tagline: 'Freshly brewed roast, cinnamon pastry & window drizzle',
      description: `Find an inviting local café with plush seating, warm lighting, and a steaming cappuccino while watching raindrops dance on the window.`,
      suitability: 'Perfect match',
      type: 'Indoor',
      bestTime: '2:00 PM – 5:30 PM',
      category: 'food'
    });
    activities.push({
      id: 'gen-shopping',
      title: `🛍️ Local Covered Arcade & Boutique Browsing`,
      tagline: 'Handcrafted souvenirs & sheltered shopping',
      description: `Stay dry while exploring covered shopping passages, artisan specialty shops, and finding unique tokens from ${cityName}.`,
      suitability: 'Weather proof',
      type: 'Indoor',
      bestTime: '1:00 PM – 6:00 PM',
      category: 'shopping'
    });
    activities.push({
      id: 'gen-cinema',
      title: `🎬 Cinema & Treat Tasting Afternoon`,
      tagline: 'Buttery snacks & captivating storytelling',
      description: `Treat yourself to an afternoon screening at an indie or grand theatre in ${cityName}, paired with local sweet treats.`,
      suitability: 'Cozy choice',
      type: 'Indoor',
      bestTime: '4:00 PM – 7:30 PM',
      category: 'relaxation'
    });
  } else if (isSnow) {
    activities.push({
      id: 'gen-snow-cafe',
      title: `🍫 Hot Cocoa & Warm Hearthside Lounge in ${cityName}`,
      tagline: 'Thick hot chocolate, marshmallows & cozy warmth',
      description: `At ${Math.round(temp)}°C with snowflakes falling, nothing beats a snug fireside nook with spiced hot chocolate and gingerbread.`,
      suitability: 'Perfect match',
      type: 'Indoor',
      bestTime: '1:30 PM – 5:30 PM',
      category: 'relaxation'
    });
    activities.push({
      id: 'gen-snow-walk',
      title: `❄️ Magical Winter Landscape Walk`,
      tagline: 'Crisp snowy air, crunching paths & cozy coat',
      description: `Bundle up in your wool scarf for a short, scenic stroll through ${cityName}’s snow-dusted parks and historical monuments.`,
      suitability: 'Cozy choice',
      type: 'Outdoor',
      bestTime: '11:00 AM – 2:00 PM',
      category: 'nature'
    });
    activities.push({
      id: 'gen-indoor-gallery',
      title: `🎨 Historic Heritage Landmark Tour`,
      tagline: 'Heated interior galleries & architecture',
      description: `Explore ${cityName}’s cathedral, palace, or civic museum to marvel at historical architecture comfortably protected from the winter chill.`,
      suitability: 'Weather proof',
      type: 'Indoor',
      bestTime: '11:00 AM – 3:30 PM',
      category: 'culture'
    });
  } else if (isHot) {
    activities.push({
      id: 'gen-mall-escape',
      title: `❄️ Air-Conditioned Promenade & Shopping in ${cityName}`,
      tagline: 'Chilled atmosphere, ice cream & modern boutiques',
      description: `Temperatures have reached ${Math.round(temp)}°C! Stay refreshed inside premier air-conditioned spaces with chilled fruit smoothies.`,
      suitability: 'Perfect match',
      type: 'Indoor',
      bestTime: '12:00 PM – 4:30 PM',
      category: 'shopping'
    });
    activities.push({
      id: 'gen-aquatic',
      title: `🌊 Coastal Breeze or Poolside Lounge`,
      tagline: 'Cool water dips, shade & iced refreshments',
      description: `Beat the sun with a refreshing swim or breezy waterfront lounge, keeping hydrated with fresh lime soda under a wide sun umbrella.`,
      suitability: 'Perfect match',
      type: 'Semi-sheltered',
      bestTime: '4:30 PM – 7:30 PM',
      category: 'relaxation'
    });
    activities.push({
      id: 'gen-sunset-stroll',
      title: `🌅 Sunset Golden Hour Walk in ${cityName}`,
      tagline: 'Cooling evening dusk & glowing horizons',
      description: `Wait for the midday heat to subside, then head outside as golden hues paint the city skyline and the gentle evening breeze picks up.`,
      suitability: 'Perfect match',
      type: 'Outdoor',
      bestTime: '6:00 PM – 8:30 PM',
      category: 'nature'
    });
  } else {
    // Pleasant / Sunny / Mild weather
    activities.push({
      id: 'gen-park-picnic',
      title: `🧺 Scenic Park Picnic & Stroll in ${cityName}`,
      tagline: 'Sun-dappled lawns, fresh fruit & gentle breeze',
      description: `At a delightful ${Math.round(temp)}°C with ${description}, spread out a pastel blanket in a local botanical garden with fresh bakery treats.`,
      suitability: 'Perfect match',
      type: 'Outdoor',
      bestTime: '12:00 PM – 4:00 PM',
      category: 'nature'
    });
    activities.push({
      id: 'gen-sightseeing',
      title: `🚶 Neighborhood Walking & Architecture Safari`,
      tagline: 'Cobblestone lanes, hidden courtyards & photo spots',
      description: `Great visibility makes this the ideal day to explore ${cityName} on foot, uncovering secret alleyways, charming murals, and historic squares.`,
      suitability: 'Perfect match',
      type: 'Outdoor',
      bestTime: '10:00 AM – 2:30 PM',
      category: 'adventure'
    });
    activities.push({
      id: 'gen-outdoor-cafe',
      title: `☀️ Open-Air Terrace Café & People Watching`,
      tagline: 'Sunny patio table, iced spritz & fresh pastries',
      description: `Soak up gentle sunshine at an outdoor café table, enjoying the local pace of life in ${cityName} with an afternoon iced tea.`,
      suitability: 'Perfect match',
      type: 'Outdoor',
      bestTime: '2:30 PM – 5:30 PM',
      category: 'food'
    });
    activities.push({
      id: 'gen-biking',
      title: `🚲 Riverside or Promenade Bicycle Ride`,
      tagline: 'Mild wind in your hair & panoramic views',
      description: `Rent a cruiser bike or scooter to glide effortlessly along ${cityName}’s scenic waterfronts, greenways, or city parks.`,
      suitability: isVeryWindy ? 'Great alternative' : 'Perfect match',
      type: 'Outdoor',
      bestTime: '3:30 PM – 6:30 PM',
      category: 'adventure'
    });
  }

  return activities;
}

export function generateWeatherMood(weather: CurrentWeatherResponse): WeatherMood {
  const temp = weather.main.temp;
  const conditionId = weather.weather[0]?.id || 800;
  const main = weather.weather[0]?.main || 'Clear';
  const isRain = conditionId < 600 || main.toLowerCase().includes('rain');
  const isSnow = conditionId >= 600 && conditionId < 700;
  const isThunder = conditionId < 300;

  if (isThunder) {
    return {
      title: 'Dramatic Novelist Mood ⚡',
      emoji: '⛈️',
      quote: '“Listening to thunder roll while wrapped in a blanket with warm spiced tea.”',
      vibe: 'Mysterious, cinematic & poetic',
      vibeRating: 88,
      color: 'from-indigo-100 to-purple-100 border-purple-200'
    };
  }

  if (isRain) {
    return {
      title: 'Cozy Inside Day 🌧️',
      emoji: '🌧️',
      quote: '“Pitter-patter raindrops, lo-fi beats, warm cinnamon coffee and woolen socks.”',
      vibe: 'Reflective, nostalgic & ultra-snug',
      vibeRating: 92,
      color: 'from-blue-100 to-sky-100 border-sky-200'
    };
  }

  if (isSnow) {
    return {
      title: 'Fairytale Snowglobe Mood ❄️',
      emoji: '❄️',
      quote: '“Soft silent flakes floating outside while hot cocoa steam curls into the air.”',
      vibe: 'Magical, calm & storybook cozy',
      vibeRating: 95,
      color: 'from-sky-50 to-indigo-100 border-indigo-200'
    };
  }

  if (temp >= 31) {
    return {
      title: 'Stay Cool & Glow Day 🔥',
      emoji: '🌴',
      quote: '“Sunglasses on, icy hibiscus tea in hand, and chasing air-conditioned sanctuaries.”',
      vibe: 'Sun-drenched, chill & tropical breeze',
      vibeRating: 85,
      color: 'from-amber-100 to-orange-100 border-amber-200'
    };
  }

  if (temp >= 20 && temp < 31 && (main === 'Clear' || conditionId === 800)) {
    return {
      title: 'Main Character Day ☀️',
      emoji: '✨',
      quote: '“Golden sunlight, floral breeze, and that unmistakable feeling that today is going to be wonderful.”',
      vibe: 'Radiant, romantic & joyful',
      vibeRating: 98,
      color: 'from-amber-100 to-rose-100 border-rose-200'
    };
  }

  if (main === 'Clouds' || conditionId > 800) {
    return {
      title: 'Slow & Chill Day ☁️',
      emoji: '☁️',
      quote: '“Soft cloud cover, gentle muted colors, and taking things one peaceful step at a time.”',
      vibe: 'Gentle, introspective & unhurried',
      vibeRating: 89,
      color: 'from-slate-100 to-sky-100 border-slate-200'
    };
  }

  return {
    title: 'Let’s Go Outside Day 🌤️',
    emoji: '🌸',
    quote: '“Fresh air, pleasant breeze, and new corners of the world waiting to be explored.”',
    vibe: 'Adventurous, cheerful & lighthearted',
    vibeRating: 94,
    color: 'from-emerald-100 to-teal-100 border-teal-200'
  };
}

export function generateOutfitSuggestion(weather: CurrentWeatherResponse): OutfitSuggestion {
  const temp = weather.main.temp;
  const conditionId = weather.weather[0]?.id || 800;
  const main = weather.weather[0]?.main || 'Clear';
  const isRain = conditionId < 600 || main.toLowerCase().includes('rain');
  const isSnow = conditionId >= 600 && conditionId < 700;
  const isWindy = weather.wind.speed > 6;

  if (isRain) {
    return {
      headline: 'Waterproof Chic & Drizzle Defense 🌧️',
      summary: 'Keep delightfully dry with layered moisture protection and a sturdy pastel umbrella.',
      items: [
        { name: 'Waterproof Trench or Rain Jacket', icon: '🧥', badge: 'Must-have' },
        { name: 'Cute Compact Umbrella', icon: '☂️', badge: 'Essential' },
        { name: 'Water-resistant Ankle Boots', icon: '🥾', badge: 'Comfy' },
        { name: 'Soft Light Knit Sweater', icon: '🧶', badge: 'Cozy' }
      ],
      quickTip: 'Carry a small waterproof tote bag to protect your travel journal or electronics!'
    };
  }

  if (isSnow || temp < 5) {
    return {
      headline: 'Fluffy Winter Cocoon ❄️',
      summary: 'Insulating thermal layers, soft woolens, and warm weather-proof footwear.',
      items: [
        { name: 'Down Puffer or Wool Peacoat', icon: '🧥', badge: 'Warmth' },
        { name: 'Chunky Knit Scarf & Beanie', icon: '🧣', badge: 'Snug' },
        { name: 'Thermal Base Layer', icon: '🧤', badge: 'Core' },
        { name: 'Fleece-lined Walking Boots', icon: '🥾', badge: 'Grip' }
      ],
      quickTip: 'Layering is key—unbutton your heavy coat once entering heated indoor cafés!'
    };
  }

  if (temp < 16) {
    return {
      headline: 'Light Jacket & Comfy Walking Shoes ☁️',
      summary: 'Breezy transition weather calls for versatile mid-weight layers.',
      items: [
        { name: 'Denim or Corduroy Jacket', icon: '🧥', badge: 'Layer' },
        { name: 'Soft Cotton Long-sleeve', icon: '👕', badge: 'Breathable' },
        { name: 'Comfortable Walking Sneakers', icon: '👟', badge: 'Explore' },
        { name: 'Lightweight Silk Scarf', icon: '🧣', badge: 'Breeze' }
      ],
      quickTip: 'A light windbreaker makes exploring breezy parks so much more comfortable.'
    };
  }

  if (temp >= 28) {
    return {
      headline: 'Breezy Linen Clothes & Sun Protection ☀️',
      summary: 'Ultra-breathable airy silhouettes, UV shades, lightweight shorts or relaxed pants, and SPF hydration.',
      items: [
        { name: 'Breezy Linen Clothes & Lightweight Tops', icon: '👕', badge: 'Cooling' },
        { name: 'UV Sunglasses', icon: '🕶️', badge: 'Eye care' },
        { name: 'Mineral Sunscreen (SPF 50)', icon: '🧴', badge: 'Skin' },
        { name: 'Breathable Sun Hat or Cap', icon: '🧢', badge: 'Shade' }
      ],
      quickTip: 'Pack a refillable insulated water bottle to stay happily hydrated throughout the afternoon!'
    };
  }

  // 16 to 27°C Pleasant
  return {
    headline: 'Effortless Everyday Layers 🌸',
    summary: 'The dreamiest temperatures! Light casual layers that transition effortlessly from day to evening.',
    items: [
      { name: 'Breathable Cotton T-shirt or Lightweight Shirt', icon: '👕', badge: 'Light' },
      { name: 'Light Cardigan or Casual Overshirt', icon: '🧥', badge: 'Evening' },
      { name: 'Comfortable City Walking Shoes', icon: '👟', badge: 'All-day' },
      { name: 'UV Sunglasses', icon: '🕶️', badge: 'Shine' }
    ],
    quickTip: 'Slip an overshirt into your daypack for breezy shaded alleys or evening strolls.'
  };
}
