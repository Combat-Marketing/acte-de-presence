import Image from "next/image";

const backgrounds = {
    spring: {
        src: "/admin/backgrounds/spring.jpeg", 
        alt: "Spring",
        width: 1920,
        height: 1080,
    },
    summer: {
        src: "/admin/backgrounds/summer.jpeg",
        alt: "Summer",
        width: 1920,
        height: 1080,
    },
    autumn: {
        src: "/admin/backgrounds/autumn.jpeg",
        alt: "Autumn",
        width: 1920,
        height: 1080,
    },
    winter: {
        src: "/admin/backgrounds/winter.jpeg",
        alt: "Winter",
        width: 1920,
        height: 1080,
    },

}

type BackgroundImage = {
    src: string;
    alt: string;
    width: number;
    height: number;
};

type Season = keyof typeof backgrounds;

export default function Background({blur, customBackground}: {blur: boolean, customBackground?: BackgroundImage}) {
    const now = new Date();
    let season: Season = "spring";
    switch(now.getMonth()) {
        case 2:
        case 3:
        case 4:
            season = "spring";
            break;
        case 5:
        case 6:
        case 7:
            season = "summer";
            break;
        case 8:
        case 9:
        case 10:
            season = "autumn";
            break;
        case 11:
        case 0:
        case 1:
            season = "winter";
            break;
    }
    const background = customBackground || backgrounds[season];

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
            <Image
                src={background.src}
                alt={background.alt}
                width={background.width}
                height={background.height}
                className={`object-cover ${blur ? "blur-sm" : ""} w-full h-full object-center`}
            />
        </div>
    )
}
