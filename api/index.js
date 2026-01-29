import { createServer, IncomingMessage, ServerResponse } from 'http'
import { app } from '../server.js'

// Vercel serverless handler
export default async function handler(req, res) {
  return new Promise((resolve) => {
    // Convert Vercel req to Node http.IncomingMessage
    const httpReq = req
    const httpRes = res

    app(httpReq, httpRes)

    httpRes.on('finish', () => resolve(undefined))
    httpRes.on('close', () => resolve(undefined))
  })
}