// icons/weatherIconMap.ts
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  Snowflake,
  Wind,
} from "lucide-react";

type LucideIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const iconMap: Record<string, LucideIconComponent> = {
  // 01 - clear sky
  "01d": Sun,
  "01n": Moon,

  // 02 - few clouds
  "02d": CloudSun,
  "02n": CloudMoon,

  // 03 - scattered clouds
  "03d": Cloud,
  "03n": Cloud,

  // 04 - broken/overcast clouds
  "04d": Cloud,
  "04n": Cloud,

  // 09 - shower rain
  "09d": CloudDrizzle,
  "09n": CloudDrizzle,

  // 10 - rain
  "10d": CloudRainWind,
  "10n": CloudRainWind,

  // 11 - thunderstorm
  "11d": CloudLightning,
  "11n": CloudLightning,

  // 13 - snow
  "13d": CloudSnow,
  "13n": CloudSnow,

  // 50 - mist, fog, haze
  "50d": CloudFog,
  "50n": CloudFog,
};

export function getWeatherIcon(code: string): LucideIconComponent {
  return iconMap[code] ?? Wind; // fallback icon
}
