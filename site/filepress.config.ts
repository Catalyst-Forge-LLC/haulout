import { defineFilepressConfig } from "getfilepress";

const github = "https://github.com/Catalyst-Forge-LLC/haulout";

export default defineFilepressConfig({
	title: "HaulOut",
	description:
		"Pull the open ChatGPT, Claude, Gemini, Grok, or SuperGrok conversation off the site as Markdown or JSON. Local only.",
	tagline: "Haul out the thread.",
	lede: "Pull the open conversation off the chat site as Markdown or JSON. Nothing is uploaded.",
	url: "https://haulout.dev",
	author: "Catalyst Forge LLC",
	logo: null,
	homePage: "home",
	nav: [
		{ label: "Home", href: "/" },
		{ label: "Install", href: "/#install" },
		{ label: "Sample", href: "/example.md" },
		{ label: "Spec", href: "/spec" },
		{ label: "About", href: "/about" },
		{ label: "GitHub", href: github, icon: "github" },
	],
	footerLinks: [
		{ label: "Install", href: "/#install" },
		{ label: "Spec", href: "/spec" },
		{ label: "GitHub", href: github, icon: "github" },
		{ label: "Detangler", href: "https://detangler.dev" },
	],
});
