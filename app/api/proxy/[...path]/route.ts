import { API_URL } from '@/constants'
import { cookies } from 'next/headers'

type ProxyParams = Promise<{ path: string[] }> | { path: string[] }

const resolvePathSegments = async (params: ProxyParams) => {
  const resolved = await Promise.resolve(params)
  return resolved.path
}

const buildTargetUrl = async (req: Request, params: ProxyParams) => {
  const segments = await resolvePathSegments(params)
  const search = new URL(req.url).search
  return `${API_URL}/${segments.join('/')}${search}`
}

const buildForwardHeaders = async (req: Request) => {
  const token = (await cookies()).get('access_token')?.value
  const headers = new Headers()

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const contentType = req.headers.get('content-type')
  if (contentType) {
    headers.set('Content-Type', contentType)
  }

  const accept = req.headers.get('accept')
  if (accept) {
    headers.set('Accept', accept)
  }

  return headers
}

const proxyFetch = async (
  req: Request,
  params: ProxyParams,
  method: string,
  includeBody: boolean,
) => {
  const url = await buildTargetUrl(req, params)
  const headers = await buildForwardHeaders(req)

  const init: RequestInit = { method, headers }

  if (includeBody) {
    const body = await req.arrayBuffer()
    if (body.byteLength > 0) {
      init.body = body
    }
  }

  return fetch(url, init)
}

const toClientResponse = async (backendRes: Response) => {
  if (backendRes.status === 204 || backendRes.status === 205) {
    return new Response(null, { status: backendRes.status })
  }

  const contentType = backendRes.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const text = await backendRes.text()
    if (!text) {
      return new Response(null, { status: backendRes.status })
    }
    try {
      const data = JSON.parse(text) as unknown
      return Response.json(data, { status: backendRes.status })
    } catch {
      return new Response(text, {
        status: backendRes.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  const buf = await backendRes.arrayBuffer()
  return new Response(buf, {
    status: backendRes.status,
    headers: {
      'Content-Type': contentType || 'application/octet-stream',
    },
  })
}

export async function GET(req: Request, ctx: { params: ProxyParams }) {
  const res = await proxyFetch(req, ctx.params, 'GET', false)
  return toClientResponse(res)
}

export async function POST(req: Request, ctx: { params: ProxyParams }) {
  const res = await proxyFetch(req, ctx.params, 'POST', true)
  return toClientResponse(res)
}

export async function PUT(req: Request, ctx: { params: ProxyParams }) {
  const res = await proxyFetch(req, ctx.params, 'PUT', true)
  return toClientResponse(res)
}

export async function PATCH(req: Request, ctx: { params: ProxyParams }) {
  const res = await proxyFetch(req, ctx.params, 'PATCH', true)
  return toClientResponse(res)
}

export async function DELETE(req: Request, ctx: { params: ProxyParams }) {
  const res = await proxyFetch(req, ctx.params, 'DELETE', true)
  return toClientResponse(res)
}

export async function HEAD(req: Request, ctx: { params: ProxyParams }) {
  const res = await proxyFetch(req, ctx.params, 'HEAD', false)
  return new Response(null, {
    status: res.status,
    headers: res.headers,
  })
}
