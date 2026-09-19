import React, { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Captions, Maximize2, Minimize2, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { studioFilm } from '../studioFilmConfig'
import './StudioFilm.css'

export function filmTime(value) {
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
}

export function shouldPlayFilm({ active, visible, pageVisible, userPaused, userStarted, reducedMotion, saveData }) {
  return Boolean(active && visible && pageVisible && !userPaused && (userStarted || (!reducedMotion && !saveData)))
}

export default function StudioFilm({ active = true }) {
  const sectionRef = useRef(null)
  const cinemaRef = useRef(null)
  const videoRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches)
  const [saveData, setSaveData] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [userStarted, setUserStarted] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [revealComplete, setRevealComplete] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(true)
  const [captionsEnabled, setCaptionsEnabled] = useState(false)
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [status, setStatus] = useState('')

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 85, damping: 27, mass: .5 })
  const aperture = useTransform(progress, [0, .62], ['inset(27% 5% 27% 52% round 160px)', 'inset(0% 0% 0% 0% round 18px)'])
  const copyOpacity = useTransform(progress, [0, .35], [1, 0])
  const copyY = useTransform(progress, [0, .4], [0, -26])
  const open = expanded || compact || reducedMotion || fullscreen

  useMotionValueEvent(progress, 'change', (value) => setRevealComplete(value >= .6))

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    const connection = navigator.connection
    const updateScreen = () => setCompact(query.matches)
    const updateData = () => setSaveData(Boolean(connection?.saveData))
    const updateVisibility = () => {
      setPageVisible(!document.hidden)
      if (document.hidden) videoRef.current?.pause()
    }
    const updateFullscreen = () => setFullscreen(document.fullscreenElement === cinemaRef.current)
    updateScreen()
    updateData()
    updateVisibility()
    setFullscreenAvailable(Boolean(document.fullscreenEnabled && cinemaRef.current?.requestFullscreen))
    query.addEventListener('change', updateScreen)
    connection?.addEventListener?.('change', updateData)
    document.addEventListener('visibilitychange', updateVisibility)
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => {
      query.removeEventListener('change', updateScreen)
      connection?.removeEventListener?.('change', updateData)
      document.removeEventListener('visibilitychange', updateVisibility)
      document.removeEventListener('fullscreenchange', updateFullscreen)
    }
  }, [])

  useEffect(() => {
    const target = cinemaRef.current
    if (!target) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true)
      setVisible(true)
      return undefined
    }
    const preloadObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true)
        preloadObserver.disconnect()
      }
    }, { rootMargin: '300px 0px' })
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= .35)
      if (!entry.isIntersecting || entry.intersectionRatio < .35) videoRef.current?.pause()
    }, { threshold: [0, .35] })
    preloadObserver.observe(target)
    visibilityObserver.observe(target)
    return () => {
      preloadObserver.disconnect()
      visibilityObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad) return undefined
    const shouldPlay = !mediaError && shouldPlayFilm({ active, visible: visible || fullscreen, pageVisible, userPaused, userStarted, reducedMotion: reducedMotion !== false, saveData })
    if (!shouldPlay) {
      video.pause()
      return undefined
    }
    let cancelled = false
    video.play().catch((error) => {
      if (!cancelled && error.name !== 'AbortError') setStatus('Press play to start the reel.')
    })
    return () => {
      cancelled = true
      video.pause()
    }
  }, [active, visible, fullscreen, pageVisible, userPaused, userStarted, reducedMotion, saveData, shouldLoad, mediaError])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    for (const track of video.textTracks) {
      if (track.kind === 'captions') track.mode = captionsEnabled ? 'showing' : 'disabled'
    }
  }, [captionsEnabled])

  const play = () => {
    setShouldLoad(true)
    setUserPaused(false)
    setUserStarted(true)
    setExpanded(true)
    setStatus('')
    // Use the click's user activation when media is already attached (mobile).
    const video = videoRef.current
    if (video?.getAttribute('src')) {
      video.play().catch((error) => {
        if (error.name !== 'AbortError') setStatus('Press play to start the reel.')
      })
    }
  }

  const togglePlay = () => {
    if (playing) {
      setUserPaused(true)
      videoRef.current?.pause()
    } else play()
  }

  const replay = () => {
    if (videoRef.current && duration > 0) videoRef.current.currentTime = 0
    setCurrentTime(0)
    play()
  }

  const seek = (event) => {
    if (!videoRef.current || !Number.isFinite(duration) || duration <= 0) return
    const time = Math.min(duration, Math.max(0, Number(event.target.value)))
    if (!Number.isFinite(time)) return
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === cinemaRef.current) await document.exitFullscreen()
      else {
        setExpanded(true)
        await cinemaRef.current?.requestFullscreen()
      }
    } catch {
      setStatus('Full-screen viewing is unavailable in this browser.')
    }
  }

  const toggleSound = () => {
    const next = !muted
    if (videoRef.current) videoRef.current.muted = next
    setMuted(next)
  }

  const retry = () => {
    setMediaError(false)
    setStatus('')
    setShouldLoad(true)
    videoRef.current?.load()
    play()
  }

  const readDuration = () => {
    const value = videoRef.current?.duration
    setDuration(Number.isFinite(value) && value > 0 ? value : 0)
  }

  return (
    <section className={`studio-film${reducedMotion ? ' studio-film--reduced' : ''}`} id="studio-film" ref={sectionRef} aria-labelledby="studio-film-title">
      <div className="studio-film__cinema" ref={cinemaRef}>
        <div className="studio-film__topline">
          <span>THE STUDIO, IN MOTION</span>
          <span>FILM <b>01</b></span>
        </div>

        <div className="studio-film__stage">
          <motion.div className="studio-film__copy" style={{ opacity: compact || reducedMotion ? 1 : open ? 0 : copyOpacity, y: open ? 0 : copyY }}>
            <h2 id="studio-film-title">Ideas,<br /><em>in motion.</em></h2>
            <p>A glimpse of what we make.</p>
          </motion.div>

          <motion.div className="studio-film__aperture" style={{ clipPath: open || mediaError ? 'inset(0% 0% 0% 0% round 18px)' : aperture }}>
            <video
              ref={videoRef}
              id="studio-reel-video"
              className="studio-film__video"
              src={shouldLoad ? studioFilm.src : undefined}
              poster={studioFilm.poster}
              preload={saveData ? 'none' : 'metadata'}
              muted={muted}
              loop={studioFilm.loop}
              playsInline
              aria-label={studioFilm.title}
              aria-describedby="studio-film-description"
              onPlay={() => { setPlaying(true); setStatus('') }}
              onPause={() => setPlaying(false)}
              onEnded={() => { setPlaying(false); setUserPaused(true) }}
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onLoadedMetadata={readDuration}
              onDurationChange={readDuration}
              onError={() => { setMediaError(true); setPlaying(false); setStatus('The reel could not be loaded. You can retry or keep exploring.') }}
            >
              {studioFilm.captions && <track kind="captions" src={studioFilm.captions} srcLang={studioFilm.captionsLanguage} label="Captions" />}
            </video>

            {mediaError && (
              <div className="studio-film__error">
                <strong>The film is taking a moment.</strong>
                <button type="button" onClick={retry}>Try again <RotateCcw size={17} aria-hidden="true" /></button>
              </div>
            )}
          </motion.div>

          {!open && !revealComplete && !mediaError && (
            <button className="studio-film__open" type="button" onClick={play} aria-controls="studio-reel-video">
              Open the film <ArrowUpRight size={19} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="studio-film__transport" role="group" aria-label="Studio reel controls">
          <button className="studio-film__play" type="button" onClick={togglePlay} disabled={mediaError} aria-label={playing ? 'Pause studio reel' : 'Play studio reel'} aria-controls="studio-reel-video">
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>

          <div className="studio-film__timeline">
            <input
              className="studio-film__scrubber"
              type="range"
              min="0"
              max={duration || 1}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              onChange={seek}
              disabled={!duration || mediaError}
              aria-label="Reel playback position"
              aria-controls="studio-reel-video"
              aria-valuetext={`${filmTime(currentTime)} of ${filmTime(duration)}`}
              style={{ '--film-played': `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
            <span className="studio-film__time" aria-hidden="true">{filmTime(currentTime)}<i>/</i>{filmTime(duration)}</span>
          </div>

          <div className="studio-film__actions">
            <button type="button" onClick={replay} disabled={!duration || mediaError} aria-label="Replay studio reel" title="Replay"><RotateCcw size={18} aria-hidden="true" /></button>
            {studioFilm.hasAudio && <button type="button" onClick={toggleSound} aria-label={muted ? 'Enable reel sound' : 'Mute reel sound'} title={muted ? 'Sound on' : 'Sound off'}>{muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}</button>}
            {studioFilm.captions && <button type="button" onClick={() => setCaptionsEnabled((value) => !value)} aria-pressed={captionsEnabled} aria-label="Captions" title="Captions"><Captions size={18} aria-hidden="true" /></button>}
            {fullscreenAvailable && <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit cinema view' : 'Enter cinema view'} title="Cinema view">{fullscreen ? <Minimize2 size={18} aria-hidden="true" /> : <Maximize2 size={18} aria-hidden="true" />}</button>}
          </div>
        </div>

        <div className="studio-film__bottomline">
          <p className="studio-film__status" role="status">{status || (studioFilm.hasAudio ? 'SOUND ON YOUR TERMS' : 'A SILENT STUDIO REEL')}</p>
          <a href="#fitness">Keep exploring <ArrowDown size={15} aria-hidden="true" /></a>
        </div>
        <p id="studio-film-description" className="studio-film__description">{studioFilm.description}</p>
      </div>
    </section>
  )
}
