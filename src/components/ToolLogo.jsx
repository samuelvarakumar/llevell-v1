import React from 'react'
import figmaBrandLogo from '../assets/tool-logos/figma.svg'
import sketchBrandLogo from '../assets/tool-logos/sketch.svg'
import principleBrandLogo from '../assets/tool-logos/principle.png'
import miroBrandLogo from '../assets/tool-logos/miro.svg'
import envatoBrandLogo from '../assets/tool-logos/envato.svg'
import adobeBrandLogo from '../assets/tool-logos/adobe.svg'

function InitialMark({ letters, rounded = 8, children }) {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <rect x="3" y="3" width="42" height="42" rx={rounded} fill="currentColor" />
      {children ?? (
        <text
          x="24"
          y="29"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="15"
          fontWeight="700"
        >
          {letters}
        </text>
      )}
    </svg>
  )
}

function FigmaLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="M11 4h9v14h-9a7 7 0 0 1 0-14Z" fill="#f24e1e" />
      <path d="M20 4h9a7 7 0 1 1 0 14h-9V4Z" fill="#ff7262" />
      <path d="M11 18h9v14h-9a7 7 0 1 1 0-14Z" fill="#a259ff" />
      <circle cx="29" cy="25" r="7" fill="#1abcfe" />
      <path d="M11 32h9v7a7 7 0 1 1-7-7h-2Z" fill="#0acf83" />
    </svg>
  )
}

function SketchLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="m24 4 14 5 7 10-21 25L3 19l7-10 14-5Z" fill="#fdb300" />
      <path d="M10 9h28l7 10H3L10 9Z" fill="#ffd36a" />
      <path d="m10 9 7 10L24 4 10 9Zm28 0-7 10L24 4l14 5Z" fill="#ffec9d" />
      <path d="M3 19h42L24 44 3 19Z" fill="#ea6c00" opacity=".5" />
      <path d="m17 19 7 25 7-25H17Z" fill="#ffb900" />
    </svg>
  )
}

function MiroLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <rect x="3" y="3" width="42" height="42" rx="8" fill="#ffd02f" />
      <path d="M14 34 25 12m-5 22 11-22m-5 22 11-22" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}


function PrincipleLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="principle-gradient" x1="8" y1="7" x2="40" y2="41" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9d7cff" />
          <stop offset="1" stopColor="#5b36d6" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="11" fill="url(#principle-gradient)" />
      <path d="M17 36V12h10.5a8 8 0 0 1 0 16H17" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="29" cy="20" r="2.1" fill="#fff" />
    </svg>
  )
}

function EnvatoLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <rect x="3" y="3" width="42" height="42" rx="11" fill="#82b541" />
      <path d="M32.9 10.2c-8.1 3.4-16.6 10.8-17.7 19.5-.4 3.6 1.8 7.4 6.2 7.9 7.3.8 12.7-7.2 12.9-15.8.1-4.1-.5-8-1.4-11.6Z" fill="#fff" />
      <path d="M15.2 29.8c2.8 1.1 5.6 1.2 8.5.4" fill="none" stroke="#dff2ca" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function AdobeLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <rect x="3" y="3" width="42" height="42" rx="9" fill="#ff0000" />
      <path d="M11 36 22 12h6l10 24h-7l-2.2-5.5h-8.9L17.5 36H11Zm11.2-11h4.4l-2.1-6.1-2.3 6.1Z" fill="#fff" />
    </svg>
  )
}


function AngularLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="m24 3 18 6.5-2.8 25.8L24 44 8.8 35.3 6 9.5 24 3Z" fill="#dd0031" />
      <path d="M24 3v41l15.2-8.7L42 9.5 24 3Z" fill="#c3002f" />
      <path d="m24 11-11 24h4.2l2.2-5.4h9.1l2.2 5.4H35L24 11Zm3 15h-6l3-7.2L27 26Z" fill="#fff" />
    </svg>
  )
}

function ThreeJsLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="M7 7 42 16 17 42 7 7Z" fill="none" stroke="#f4f5ef" strokeWidth="2.1" strokeLinejoin="round" />
      <path d="m16 14 17 5-12 13-5-18Zm5 7 8 2-6 6-2-8Z" fill="none" stroke="#f4f5ef" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function CloudLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="M15 37h21a8 8 0 0 0 1-15.9A13 13 0 0 0 12.5 17 10 10 0 0 0 15 37Z" fill="none" stroke="#f3f4ef" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 31V20m0 0-5 5m5-5 5 5" fill="none" stroke="#a9ff4f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ReactLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <circle cx="24" cy="24" r="4" fill="#61dafb" />
      <g fill="none" stroke="#61dafb" strokeWidth="2.3">
        <ellipse cx="24" cy="24" rx="19" ry="7.5" />
        <ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(60 24 24)" />
        <ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(120 24 24)" />
      </g>
    </svg>
  )
}

function NextLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="#050505" />
      <path d="M15 33V14l18 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31 14v18" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

function NodeLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="m24 3 18 10.5v21L24 45 6 34.5v-21L24 3Z" fill="#539e43" />
      <text x="24" y="29" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="700">JS</text>
    </svg>
  )
}

function PhpLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <ellipse cx="24" cy="24" rx="21" ry="13" fill="#777bb4" />
      <text x="24" y="28" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontStyle="italic" fontWeight="700">php</text>
    </svg>
  )
}

function FlutterLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="m28 4 9 9-20 20-9-9L28 4Z" fill="#54c5f8" />
      <path d="m24 28 9-9 9 9-9 9-9-9Z" fill="#29b6f6" />
      <path d="m24 28 9 9-9 9-9-9 9-9Z" fill="#01579b" />
    </svg>
  )
}

function AndroidLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <g fill="#3ddc84">
        <path d="M13 20h22v15a5 5 0 0 1-5 5H18a5 5 0 0 1-5-5V20Z" />
        <path d="M13 19a11 11 0 0 1 22 0H13Z" />
        <rect x="8" y="21" width="4" height="15" rx="2" />
        <rect x="36" y="21" width="4" height="15" rx="2" />
        <rect x="17" y="36" width="4" height="9" rx="2" />
        <rect x="27" y="36" width="4" height="9" rx="2" />
      </g>
      <path d="m17 10-4-6m18 6 4-6" stroke="#3ddc84" strokeWidth="2" strokeLinecap="round" />
      <circle cx="19" cy="15" r="1.3" fill="#0a0c0a" />
      <circle cx="29" cy="15" r="1.3" fill="#0a0c0a" />
    </svg>
  )
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="M31 9c2-2 3-5 3-7-3 0-6 2-8 4-2 2-3 5-3 7 3 0 6-2 8-4Z" fill="currentColor" />
      <path d="M37 25c0-6 5-9 5-9-3-4-7-4-9-4-4 0-7 3-9 3s-5-3-8-3C9 12 3 18 3 27c0 5 2 11 5 15 2 3 5 6 8 6 3 0 5-2 8-2s5 2 8 2c4 0 6-3 8-6 2-3 3-6 4-9-4-2-7-4-7-8Z" fill="currentColor" transform="scale(.82) translate(5 3)" />
    </svg>
  )
}

function FirebaseLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="m8 39 8-32 8 15 5-10 11 27-16 7L8 39Z" fill="#ffca28" />
      <path d="m8 39 16-17 16 17-16 7-16-7Z" fill="#ffa000" />
      <path d="m24 22 5-10 11 27-16-17Z" fill="#f57c00" />
    </svg>
  )
}

function MongoLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="M25 3c9 10 13 18 10 27-2 7-7 12-11 15-4-4-10-10-11-18C12 18 18 10 25 3Z" fill="#47a248" />
      <path d="M24 7v35" stroke="#2f6f33" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function WordpressLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="#21759b" />
      <circle cx="24" cy="24" r="16" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M12 17h6m13 0h5M15 17l7 19m10-19-7 19m-7-19 7 19m7-19-7 19" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

function ShopifyLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="m10 13 25-5 5 31-25 5-5-31Z" fill="#95bf47" />
      <path d="M18 13c1-7 8-9 12-3" fill="none" stroke="#5e8e3e" strokeWidth="2.5" strokeLinecap="round" />
      <text x="25" y="32" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fontWeight="700">S</text>
    </svg>
  )
}

function GithubLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="#181717" />
      <path d="M24 10a14 14 0 0 0-4 27c1 .2 1.4-.4 1.4-1v-3c-5.6 1.2-6.8-2.4-6.8-2.4-.9-2.4-2.3-3-2.3-3-1.9-1.3.1-1.3.1-1.3 2.1.2 3.2 2.1 3.2 2.1 1.9 3.2 5 2.3 6.2 1.8.2-1.4.7-2.3 1.3-2.8-4.5-.5-9.2-2.3-9.2-10A7.8 7.8 0 0 1 16 17a7.3 7.3 0 0 1 .2-5.6s1.7-.6 5.8 2.1a20 20 0 0 1 10.5 0c4-2.7 5.8-2.1 5.8-2.1a7.3 7.3 0 0 1 .2 5.6 7.8 7.8 0 0 1 2.1 5.5c0 7.7-4.7 9.5-9.2 10 .8.7 1.4 2 1.4 4V36c0 .7.4 1.2 1.4 1A14 14 0 0 0 24 10Z" fill="#fff" transform="scale(.88) translate(3.3 2.8)" />
    </svg>
  )
}

function VercelLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="#fff" />
      <path d="m24 11 15 26H9l15-26Z" fill="#000" />
    </svg>
  )
}

function DockerLogo() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <g fill="#2496ed">
        {[10,18,26,34].map((x) => <rect key={x} x={x} y="19" width="6" height="6" rx="1" />)}
        {[18,26,34].map((x) => <rect key={x} x={x} y="12" width="6" height="6" rx="1" />)}
        <path d="M4 27h37c-1 10-8 16-19 16S6 37 4 27Z" />
        <path d="M39 24c3-4 6-3 8-1-2 3-5 5-9 5l1-4Z" />
      </g>
      <circle cx="12" cy="31" r="1.4" fill="#fff" />
    </svg>
  )
}

const BRAND_IMAGE_LOGOS = {
  figma: figmaBrandLogo,
  sketch: sketchBrandLogo,
  principle: principleBrandLogo,
  miro: miroBrandLogo,
  envato: envatoBrandLogo,
  adobe: adobeBrandLogo,
}

const LOGOS = {
  xd: (props) => <InitialMark letters="Xd" {...props} />,
  photoshop: (props) => <InitialMark letters="Ps" {...props} />,
  illustrator: (props) => <InitialMark letters="Ai" {...props} />,
  react: ReactLogo,
  angular: AngularLogo,
  threejs: ThreeJsLogo,
  cloud: CloudLogo,
  next: NextLogo,
  node: NodeLogo,
  typescript: (props) => <InitialMark letters="TS" rounded={5} {...props} />,
  laravel: (props) => <InitialMark letters="L" {...props} />,
  php: PhpLogo,
  flutter: FlutterLogo,
  android: AndroidLogo,
  apple: AppleLogo,
  expo: (props) => <InitialMark letters="EX" {...props} />,
  firebase: FirebaseLogo,
  wordpress: WordpressLogo,
  shopify: ShopifyLogo,
  woocommerce: (props) => <InitialMark letters="Woo" {...props} />,
  mongodb: MongoLogo,
  mysql: (props) => <InitialMark letters="My" {...props} />,
  postgresql: (props) => <InitialMark letters="Pg" {...props} />,
  analytics: (props) => <InitialMark letters="GA" {...props} />,
  lighthouse: (props) => <InitialMark letters="LH" {...props} />,
  github: GithubLogo,
  vercel: VercelLogo,
  cloudflare: (props) => <InitialMark letters="CF" {...props} />,
  docker: DockerLogo,
}

export default function ToolLogo({ id, label }) {
  const imageSource = BRAND_IMAGE_LOGOS[id]

  if (imageSource) {
    return (
      <img
        className={`tool-brand-logo tool-brand-logo--${id}`}
        src={imageSource}
        alt=""
        aria-hidden="true"
        draggable="false"
      />
    )
  }

  const Logo = LOGOS[id] ?? ((props) => (
    <InitialMark letters={label?.slice(0, 2) ?? '?'} {...props} />
  ))

  return <Logo />
}
