import React, { useEffect, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'

const projectTypes = [
  'Website / Digital Experience',
  'Product / App',
  'Branding',
  'Marketing / Growth',
  'Something else',
]

export default function ContactPanel({ open, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    project: projectTypes[0],
    idea: '',
  })

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submit = (event) => {
    event.preventDefault()

    const subject = `New LLeveLL project enquiry — ${form.project}`
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Project: ${form.project}`,
      '',
      'The idea:',
      form.idea,
    ].join('\n')

    window.location.href = `mailto:hello@llevell.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div
      className={`contact-brief-layer ${open ? 'contact-brief-layer--open' : ''}`}
      aria-hidden={!open}
    >
      <button
        className="contact-brief-backdrop"
        type="button"
        aria-label="Close contact form"
        onClick={onClose}
      />

      <div className="contact-brief-stage" role="dialog" aria-modal="true" aria-label="Start a project with LLeveLL">
        <div className="contact-brief-ghost contact-brief-ghost--lime" aria-hidden="true" />
        <div className="contact-brief-ghost contact-brief-ghost--pink" aria-hidden="true" />

        <section className="contact-brief-card" data-lenis-prevent>
          <div className="contact-brief-card__topline">
            <span>NEW PROJECT / 001</span>
            <button type="button" onClick={onClose} aria-label="Close contact form">
              <X size={19} strokeWidth={1.7} />
            </button>
          </div>

          <div className="contact-brief-card__intro">
            <span>START SOMETHING</span>
            <h2>
              Tell us what<br />
              <em>you want to make.</em>
            </h2>
            <p>A few details are enough. We’ll take it from there.</p>
          </div>

          <form className="contact-brief-form" onSubmit={submit}>
            <label className="contact-brief-field">
              <span><b>01</b> YOUR NAME</span>
              <input
                name="name"
                value={form.name}
                onChange={update}
                placeholder="What should we call you?"
                autoComplete="name"
                required
              />
            </label>

            <label className="contact-brief-field">
              <span><b>02</b> EMAIL</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="contact-brief-field">
              <span><b>03</b> WHAT ARE WE MAKING?</span>
              <select name="project" value={form.project} onChange={update}>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="contact-brief-field contact-brief-field--idea">
              <span><b>04</b> TELL US THE IDEA</span>
              <textarea
                name="idea"
                value={form.idea}
                onChange={update}
                placeholder="What are you trying to build, change or grow?"
                rows="3"
                required
              />
            </label>

            <div className="contact-brief-actions">
              <a href="mailto:hello@llevell.com">hello@llevell.com</a>
              <button type="submit">
                <span>Send the spark</span>
                <ArrowUpRight size={18} strokeWidth={1.8} />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
