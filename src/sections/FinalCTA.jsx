import React from 'react'

export default function FinalCTA({ onApps }) {
  return (
    <section className="final-cta" id="contact">
      <span>HAVE SOMETHING AMBITIOUS IN MIND?</span>
      <h2>
        Make your digital presence<br />
        <em>impossible to ignore.</em>
      </h2>
      <div>
        <div className="final-cta-contact">
          <a href="mailto:hello@llevell.in">hello@llevell.in ↗</a>
          <a href="tel:+919840314082">9840314082</a>
        </div>
        {/* Apps CTA hidden temporarily — code preserved for later.
        <button type="button" onClick={onApps}>Explore LLeveLL</button>
        */}
      </div>
    </section>
  )
}
