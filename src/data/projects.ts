import celebrenImage from "../assests/celebren.webp";
import Jump2BotImage from "../assests/Jump2Bot.jpg";
import tecopayImage from "../assests/tecopay.png";
import dashboardImage from "../assests/dashboard.webp";
import NoxImage from "../assests/Nox1.webp";
import DissauImage from "../assests/Dissau.webp";
import CupMakes from "../assests/Cupmakes.webp";

import ReactNative from "../components/icons/skills/ReactNative.astro";
import TailwindIcon from "../components/icons/skills/TailwindIcon.astro";
import ReduxIcon from "../components/icons/skills/ReduxIcon.astro";
import TypescriptIcon from "../components/icons/skills/TypescriptIcon.astro";
import FlutterIcon from "../components/icons/skills/Fultter.astro";
import NodeIcon from "../components/icons/skills/Node.astro";
import PostreSQL from "../components/icons/skills/PostgreSQL.astro";
import MongoDBIcon from "../components/icons/skills/MongoDb.astro";
import ReactjsIcon from "../components/icons/skills/React.astro";
import StripeIcon from "../components/icons/skills/Stripe.astro";
import WooIcon from "../components/icons/skills/Woocomerce.astro";

type Tag = { name: string; icon: any };

const Tags: Record<string, Tag> = {
  REACT: { name: "React.js", icon: ReactjsIcon },
  Native: { name: "React Native", icon: ReactNative },
  Tailwind: { name: "Tailwind.css", icon: TailwindIcon },
  Redux: { name: "Redux Toolkit", icon: ReduxIcon },
  Type: { name: "TypeScript", icon: TypescriptIcon },
  Flutter: { name: "Flutter", icon: FlutterIcon },
  Node: { name: "Nodejs", icon: NodeIcon },
  PostgreSQL: { name: "PostGreSQL", icon: PostreSQL },
  MongoDB: { name: "MongoDB", icon: MongoDBIcon },
  Stripe: { name: "Stripe", icon: StripeIcon },
  Woocommerce: { name: "Woocommerce", icon: WooIcon },
};

export type ProjectItem = {
  key: string;
  title: string;
  description: string;
  longDescription?: string; // <—— nuevo
  link?: string;
  repo?: string;
  image: string;
  tags: Tag[];
  isAnApp: boolean;
  TypeProductions: "Repo" | "Live";
  isLargeMobile: boolean;

};


export const projects: ProjectItem[] = [
  {
    key: "nox",
    title: "Nox Cookies Bar",
    description:
      "A full-stack e-commerce project with a built-in web editor, a Stripe payment gateway, and a powerful dashboard for data.",
    link: "https://nox.dissau.online/",
    image: NoxImage.src,
    longDescription:"Nox Cookies Bar is a full-stack project designed to boost sales for Nox. It's more than just a modern e-commerce site; it includes a Stripe payment gateway and an advanced dashboard with charts and metrics for data analysis. The project also features a built-in web editor using GrapesJS, allowing for easy drag-and-drop customization.",
    isAnApp:false,
    isLargeMobile:false,
    TypeProductions:"Live",
    tags: [Tags.REACT, Tags.Node, Tags.Stripe, Tags.PostgreSQL],
  },
  {
    key: "cupmakes",
    title: "Cupmakes",
    description:
      "A React Native e-commerce platform for a California business. Uses Stripe and WooCommerce for fast, secure sales.",
    link: "https://github.com/mauriciogaraco/Cupmakes-APP",
    longDescription:"Cupmakes Apps is a modern e-commerce platform for the Cupmakes business in California. This React Native app uses Stripe as its payment gateway and the WooCommerce API to ensure a fast development experience and seamless user transactions.",
    image: CupMakes.src,
    isAnApp:true,
    isLargeMobile:true,
    TypeProductions: "Repo",
    tags: [Tags.Native, Tags.Node, Tags.Stripe, Tags.Woocommerce],
  },
  {
    key: "jump2bot",
    title: "Jump 2 bot",
    description:
      "Automate the forwarding of messages from your cell phone directly to Telegram, simplifying your daily life like never before.",
    link: "https://jump2bot.com",
    longDescription:"Jump to Bot is a proposal to automate SMS forwarding. It's for anyone who needs to receive their text messages on Telegram when their mobile phone isn't with them.",
    image: Jump2BotImage.src,
    isAnApp:true,
    isLargeMobile:true,
    TypeProductions:"Live",
    tags: [Tags.Flutter, Tags.Node, Tags.Stripe, Tags.PostgreSQL],
  },
  {
    key: "dissau",
    title: "Dissau Admin",
    description:
      "A mobile project to support Dissau LLC clients. Users can create support tickets and access company documentation.",
    link: "https://github.com/mauriciogaraco/Dissau-App",
    longDescription:"Dissau App is a project designed to support Dissau LLC customers. Users can create support tickets and access documentation about the various services our company offers",
    image: DissauImage.src,
    isAnApp:true,
    isLargeMobile:true,
    TypeProductions:"Repo",
    tags: [Tags.Native, Tags.Node, Tags.MongoDB, Tags.Type],
  },
  {
    key: "celebren",
    title: "Celebren",
    description:
      "It is an wonderfull online store where you can find a wide variety of products and receive them at home",
    longDescription:"Celebren is a React Native e-commerce app designed to bring essential products closer to the people of Havana. It's an all-in-one marketplace for all occasions, offering everything from food and drinks to clothes, shoes, perfumes, and gifts.",
    link: "https://github.com/mauriciogaraco/Celebren-App",
    image: celebrenImage.src,
    isAnApp:true,
     isLargeMobile:false,
     TypeProductions:"Repo",
    tags: [Tags.Native, Tags.Redux, Tags.Type],
  },
  {
    key: "tecopay_app",
    title: "Tecopay-App",
    description:
      "It is a modern app where the user can request point cards, carry out payment operations via QR code or through NFC",
      longDescription:"Tecopay is an innovative React Native app designed to improve customer retention through a modern credit system. Users can create accounts and manage virtual or physical cards.Through the app, users can transfer points between accounts, request a physical card, and make payments at associated stores using NFC or QR code scanning. Security is a top priority; therefore, in addition to standard authentication, transfers and payments require biometric data verification.Tecopay's purpose is to modernize commerce and customer retention in Havana.",
    link: "https://play.google.com/store/apps/details?id=com.tecopay.tecopayapp",
    image: tecopayImage.src,
    isAnApp:true,
     isLargeMobile:false,
     TypeProductions:"Live",
    tags: [Tags.Native, Tags.Redux, Tags.Type],
  },
  {
    key: "tecopay_web",
    title: "Tecopay-Web",
    description:
      "An advanced admin dashboard to manage the Tecopay system. Features include user roles, store management, and data analysis.",
    link: "https://github.com/mauriciogaraco/Tecopay-Web",
    image: dashboardImage.src,
    longDescription:"Tecopay Web is an advanced administrative dashboard designed to manage the Tecopay system. The admin user can assign roles to other users and add or edit associated stores. The dashboard also includes charts and data to track active users, points in circulation, and more.",
    isAnApp:false,
     isLargeMobile:false,
     TypeProductions:"Repo",
    tags: [Tags.REACT, Tags.Type, Tags.Tailwind],
  },
];
