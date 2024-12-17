export const SOCIALS = [
    {
        name: 'GitHub',
        url: 'https://github.com/valeriocomo',
        icon: 'i-uil-github',
    },
    {
        name: 'Twitter',
        url: 'https://www.twitter.com/valeriocomo',
        icon: 'i-uil-twitter',
    },
    {
        name: 'Linkedin',
        url: 'https://www.linkedin.com/in/valeriocomo',
        icon: 'i-uil-linkedin',
    },
] as const;


const { BASE_URL: baseUrl, NODE_ENV } = import.meta.env;

const urlBuilder = (path: string) => {
    if (NODE_ENV === "production" && baseUrl !== "/") {
        return `${baseUrl}/${path}`;
    } else {
        return path ? `${baseUrl}${path}` : `${baseUrl}`;
    }
};

export const HOME_URL = urlBuilder("");
export const EVENTS_URL = urlBuilder("events");

export const BLOG_URL = 'https://medium.com/@valeriocomo'
export const REPO_URL = 'https://github.com/valeriocomo/valeriocomo.dev'