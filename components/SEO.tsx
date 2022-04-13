import {NextSeo} from "next-seo";
import {useRouter} from "next/router";

export default function SEO({
                                  title = "Threader: Take notes in threads",
                                  description = "Threader is a notetaking app that lets you take notes in threads, like a private Twitter or Slack.",
                                  imgUrl = null,
                                  noindex = false,
                              }: { title?: string, description?: string, imgUrl?: string, authorUsername?: string, publishedDate?: string, noindex?: boolean }) {
    const router = useRouter();
    const fullTitle = title + (router.asPath === "/" ? "" : " | Threader");

    let openGraph = {
        title: fullTitle,
        description: description,
        url: "https://threader.vercel.app" + router.asPath,
        images: imgUrl ? [
            { url: imgUrl }
        ] : [
            { url: "https://threader.vercel.app/logo.png" }
        ],
    };

    let twitter = {
        site: "@wwsalmon",
        cardType: imgUrl ? "summary_large_image" : "summary",
    };

    return (
        <NextSeo
            title={fullTitle}
            description={description}
            openGraph={openGraph}
            twitter={twitter}
            noindex={noindex}
        />
    );
}
