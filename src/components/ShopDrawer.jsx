import React from 'react'
import { X } from 'lucide-react'
import ProductRing from './ProductRing'

export default function ShopDrawer({ open, onClose }) {
  return (
    <div className={`shop-layer ${open ? 'shop-layer--open' : ''}`} aria-hidden={!open}>
      <button className="shop-backdrop" onClick={onClose} aria-label="Close shop" />
      <aside className="shop-drawer" data-lenis-prevent role="dialog" aria-modal="true" aria-label="Shop LLeveLL ring">
        <button className="icon-button shop-close" onClick={onClose} aria-label="Close"><X /></button>
        <div className="shop-visual"><ProductRing dark /></div>
        <span className="kicker kicker--light">FIRST EDITION</span>
        <h2>LLeveLL Ring One</h2>
        <p>Advanced sleep, recovery and heart insights. No monthly subscription.</p>
        <div className="shop-price"><strong>₹29,999</strong><span>Launching soon</span></div>
        <label>Email for early access</label>
        <div className="shop-form">
          <input type="email" placeholder="you@example.com" />
          <button className="button button--light">Join waitlist</button>
        </div>
        <small>Demo form only. Connect this to your Laravel or Node backend.</small>
      </aside>
    </div>
  )
}
