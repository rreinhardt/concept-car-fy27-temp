import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

export default function feedbackPlugin(): Plugin {
  const feedbackDir = path.resolve(__dirname, 'feedback')
  const screenshotsDir = path.join(feedbackDir, 'screenshots')

  return {
    name: 'prototype-feedback',
    configureServer(server) {
      server.middlewares.use('/api/feedback', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }

        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const { text, url, screenshot } = data as {
              text: string
              url: string
              screenshot?: string
            }

            // Ensure dirs exist
            fs.mkdirSync(screenshotsDir, { recursive: true })

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
            const id = `fb-${timestamp}`
            let screenshotPath = ''

            // Save screenshot if provided
            if (screenshot) {
              const base64Data = screenshot.replace(/^data:image\/png;base64,/, '')
              const filename = `${id}.png`
              fs.writeFileSync(
                path.join(screenshotsDir, filename),
                Buffer.from(base64Data, 'base64')
              )
              screenshotPath = `screenshots/${filename}`
            }

            // Append to feedback log
            const feedbackFile = path.join(feedbackDir, 'feedback-log.md')
            const entry = [
              `## ${id}`,
              `- **Date:** ${new Date().toLocaleString()}`,
              `- **URL:** \`${url}\``,
              `- **Status:** pending`,
              screenshot ? `- **Screenshot:** ![](${screenshotPath})` : '',
              '',
              `### Notes`,
              text || '_No text provided_',
              '',
              '---',
              '',
            ]
              .filter(Boolean)
              .join('\n')

            // Create file with header if it doesn't exist
            if (!fs.existsSync(feedbackFile)) {
              fs.writeFileSync(
                feedbackFile,
                '# Prototype Feedback Log\n\nFeedback items collected during prototype review sessions.\n\n---\n\n'
              )
            }

            fs.appendFileSync(feedbackFile, entry)

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, id }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: String(e) }))
          }
        })
      })
    },
  }
}
