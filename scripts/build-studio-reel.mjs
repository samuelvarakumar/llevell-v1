// Optional: rebuild the silent sample reel from the project's existing GIFs.
// Requires ffmpeg and a TrueType/OpenType font; it is not part of npm run build.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const media = join(root, 'public/media')
const scratch = mkdtempSync(join(tmpdir(), 'llevell-reel-'))
const font = process.env.LLEVELL_REEL_FONT || '/usr/share/fonts/opentype/urw-base35/NimbusSans-Regular.otf'
if (!existsSync(font)) throw new Error('Set LLEVELL_REEL_FONT to an installed .ttf or .otf font.')
mkdirSync(media, { recursive: true })

const shots = [
  { file: 'verdant', brand: 'VERDANT', lines: ['Ideas.', 'Made real.'] },
  { file: 'remedia', brand: 'REMEDIA', lines: ['Clarity.', 'By design.'] },
  { file: 'kalyani', brand: 'KALYANI MUDUMBA', lines: ['Character.', 'In every detail.'] },
  { file: 'asr', brand: 'ASR', lines: ['One studio.', 'Many possibilities.'] },
]

const run = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
const escapeFilter = (value) => value.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "'\\''")
const text = (value, x, y, size, color) => `drawtext=fontfile='${escapeFilter(font)}':text='${escapeFilter(value)}':x=${x}:y=${y}:fontsize=${size}:fontcolor=${color}`

for (const [index, shot] of shots.entries()) {
  const filters = [
    '[1:v]fps=24,scale=688:330:flags=lanczos,setsar=1,format=rgba[screen]',
    '[2:v]scale=174:-2,format=rgba[logo]',
    '[0:v]drawbox=x=498:y=186:w=704:h=350:color=0xffffff@0.16:t=1,drawbox=x=502:y=543:w=696:h=1:color=0xc8ff45@0.4:t=fill[base]',
    '[base][screen]overlay=506:196:eof_action=repeat[work]',
    '[work][logo]overlay=78:58:eof_action=repeat[brand]',
    '[brand]' + [
      text('SELECTED DIGITAL WORK', 78, 145, 15, '0xa6b09c'),
      text(shot.lines[0], 74, 237, 66, '0xf3f3e9'),
      text(shot.lines[1], 78, 317, shot.lines[1].length > 14 ? 33 : 45, '0xc8ff45'),
      text(`0${index + 1} / ${shot.brand}`, 78, 531, 20, '0xe7ebdf'),
      text('STRATEGY   /   DESIGN   /   DEVELOPMENT', 78, 638, 15, '0xa6b09c'),
      text('LLeveLL', 1110, 637, 17, '0xe7ebdf'),
      'format=yuv420p',
    ].join(',') + '[out]',
  ].join(';')

  run([
    '-f', 'lavfi', '-i', 'color=c=0x11150f:s=1280x720:r=24:d=5.2',
    '-ignore_loop', '0', '-i', join(root, `public/projects/${shot.file}-preview.gif`),
    '-loop', '1', '-i', join(root, 'public/llevell-final-white.svg'),
    '-filter_complex_threads', '1', '-filter_complex', filters,
    '-map', '[out]', '-t', '5.2', '-an', '-r', '24',
    '-c:v', 'libx264', '-threads', '2', '-preset', 'medium', '-crf', '21',
    '-pix_fmt', 'yuv420p', join(scratch, `${index}.mp4`),
  ])
}

run([
  ...shots.flatMap((_, index) => ['-i', join(scratch, `${index}.mp4`)]),
  '-filter_complex_threads', '1', '-filter_complex',
  '[0:v][1:v]xfade=transition=fade:duration=0.4:offset=4.8[a];[a][2:v]xfade=transition=fade:duration=0.4:offset=9.6[b];[b][3:v]xfade=transition=fade:duration=0.4:offset=14.4,format=yuv420p[out]',
  '-map', '[out]', '-an', '-c:v', 'libx264', '-threads', '2', '-preset', 'medium', '-crf', '22',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(media, 'studio-reel.mp4'),
])
run(['-ss', '1', '-i', join(media, 'studio-reel.mp4'), '-frames:v', '1', '-q:v', '3', join(media, 'studio-reel-poster.jpg')])
console.log('Created public/media/studio-reel.mp4 and studio-reel-poster.jpg')
