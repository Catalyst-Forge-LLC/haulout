import { defineFilepressConfig } from "getfilepress";

const github = "https://github.com/Catalyst-Forge-LLC/haulout";

export default defineFilepressConfig({
	title: "HaulOut",
	description: "Save the AI conversation you have open as Markdown or JSON, with speaker labels and available metadata. HaulOut downloads a copy you can read, search, or keep with the project.",
	tagline: "Haul out the thread.",
	lede: "Browser userscript for exporting AI conversations",
	url: "https://haulout.dev",
	author: "Catalyst Forge LLC",
	logo: "/logo.png",
	homePage: "home",
	nav: [
		{ label: "Home", href: "/" },
		{ label: "Install", href: "/#install" },
		{ label: "Sample", href: "/sample/example.md" },
		{ label: "Spec", href: "/spec" },
		{ label: "About", href: "/about" },
		{ label: "GitHub", href: github, icon: "github" },
	],
	footerLinks: [
		{ label: "See the rest of the Catalyst Forge shelf.", href: "https://catalystforge.com/tools/" },
		{ label: "Install", href: "/#install" },
		{ label: "Spec", href: "/spec" },
		{ label: "GitHub", href: github, icon: "github" },
		{ label: "Detangler", href: "https://detangler.dev" },
	],
	paths: [{ url: "/sample", dir: "sample" }],
});
