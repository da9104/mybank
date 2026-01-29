import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { getWeatherIcon } from "@/utils/weatherIconMap";
import { Skeleton } from "@/components/ui/skeleton";

type Daily = { dayOffset: number; temp: number; icon: string };

type WeatherData = {
    currentTemp: number;
    high: number;
    low: number;
    icon: string;
    condition: string;
    city: string;
    daily: Daily[];
};

const dayLabel = (offset: number) =>
    new Date(Date.now() + offset * 24 * 60 * 60 * 1000)
        .toLocaleDateString("en-US", { weekday: "short" });


function WeatherIcon({ iconCode }: { iconCode: string }) {
    const Icon = getWeatherIcon(iconCode);
    return <Icon className="h-6 w-6" />;
}

export function WeatherCard() {
    const [data, setData] = useState<WeatherData | null>(null);

    useEffect(() => {
        console.log(data)
        // hard-code your coord or pass via props
        fetch(`/api/weather?lat=37.45&lon=126.73`)
            .then((r) => r.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) return <Card className="flex flex-col gap-4 aspect-video w-full h-[165px]">
        <CardHeader>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-[90px] w-full" />
        </CardContent>
    </Card>;

    return (
        <Card className="ring-0 border border-gray-100 w-full">
            <CardHeader className="flex flex-col">
                <CardDescription className="flex flex-row items-center justify-between w-full">
                    <div className="flex flex-row items-center">
                        <WeatherIcon iconCode={data.icon} />
                        <p className='pr-4 text-lg pl-2'> {data.currentTemp}° </p>
                    </div>
                    <div className="weather-condition">
                        <p className="font-roboto text-lg">
                            {data.city}
                        </p>
                    </div>
                </CardDescription>
                <div className="flex flex-col w-full">
                    <div className="flex flex-row items-center justify-between">
                        <p className="font-roboto">
                            Today {data.condition}
                        </p>
                        <p className="text-right">
                            H: {data.high}° &nbsp; L: {data.low}°
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap justify-between">
                {data.daily.map((d) => (
                    <div key={d.dayOffset} className="weather-day flex flex-col items-center">
                        <div className="weather-day-icon">
                            <WeatherIcon iconCode={d.icon} />
                        </div>
                        <div className="weather-day-temp">{d.temp}°</div>
                        <div className="weather-day-label">{dayLabel(d.dayOffset)}</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}


export default WeatherCard