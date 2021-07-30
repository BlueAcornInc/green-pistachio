/**
 * This file is copied directly from the http-proxy-middleware package
 * https://github.com/chimurai/http-proxy-middleware/blob/master/src/handlers/response-interceptor.ts
 * 
 * Only changes were added @ts-ignore declarations to allow compilation to pass. Eventually, this
 * file should be removed once webpack-dev-server and http-proxy-middleware have versions that allow
 * for this kind of support.
 */

import type * as http from 'http';
import * as zlib from 'zlib';

type Interceptor = (
  buffer: Buffer,
  proxyRes: http.IncomingMessage,
  req: http.IncomingMessage,
  res: http.ServerResponse
) => Promise<Buffer | string>;

/**
 * Intercept responses from upstream.
 * Automatically decompress (deflate, gzip, brotli).
 * Give developer the opportunity to modify intercepted Buffer and http.ServerResponse
 *
 * NOTE: must set options.selfHandleResponse=true (prevent automatic call of res.end())
 */
export function responseInterceptor(interceptor: Interceptor) {
  return async function proxyRes(
    proxyRes: http.IncomingMessage,
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    const originalProxyRes = proxyRes;
    let buffer = Buffer.from('', 'utf8');

    // decompress proxy response
    // @ts-ignore
    const _proxyRes = decompress(proxyRes, proxyRes.headers['content-encoding']);

    // concat data stream
    _proxyRes.on('data', (chunk) => (buffer = Buffer.concat([buffer, chunk])));

    _proxyRes.on('end', async () => {
      // copy original headers
      copyHeaders(proxyRes, res);

      // call interceptor with intercepted response (buffer)
      const interceptedBuffer = Buffer.from(await interceptor(buffer, originalProxyRes, req, res));

      // set correct content-length (with double byte character support)
      res.setHeader('content-length', Buffer.byteLength(interceptedBuffer, 'utf8'));

      res.write(interceptedBuffer);
      res.end();
    });

    _proxyRes.on('error', (error) => {
      res.end(`Error fetching proxied request: ${error.message}`);
    });
  };
}

/**
 * Streaming decompression of proxy response
 * source: https://github.com/apache/superset/blob/9773aba522e957ed9423045ca153219638a85d2f/superset-frontend/webpack.proxy-config.js#L116
 */
function decompress(proxyRes: http.IncomingMessage, contentEncoding: string) {
  let _proxyRes = proxyRes;
  let decompress;

  switch (contentEncoding) {
    case 'gzip':
      decompress = zlib.createGunzip();
      break;
    case 'br':
      decompress = zlib.createBrotliDecompress();
      break;
    case 'deflate':
      decompress = zlib.createInflate();
      break;
    default:
      break;
  }

  if (decompress) {
    _proxyRes.pipe(decompress);
    // @ts-ignore
    _proxyRes = decompress;
  }

  return _proxyRes;
}

/**
 * Copy original headers
 * https://github.com/apache/superset/blob/9773aba522e957ed9423045ca153219638a85d2f/superset-frontend/webpack.proxy-config.js#L78
 */
function copyHeaders(originalResponse: http.IncomingMessage, response: http.ServerResponse) {
  // @ts-ignore
  response.statusCode = originalResponse.statusCode;
  // @ts-ignore
  response.statusMessage = originalResponse.statusMessage;

  if (response.setHeader) {
    let keys = Object.keys(originalResponse.headers);

    // ignore chunked, brotli, gzip, deflate headers
    keys = keys.filter((key) => !['content-encoding', 'transfer-encoding'].includes(key));

    keys.forEach((key) => {
      let value = originalResponse.headers[key];

      if (key === 'set-cookie') {
        // remove cookie domain
        // @ts-ignore
        value = Array.isArray(value) ? value : [value];
        // @ts-ignore
        value = value.map((x: string) => x.replace(/Domain=[^;]+?/i, ''));
      }

      // @ts-ignore
      response.setHeader(key, value);
    });
  } else {
    // @ts-ignore
    response.headers = originalResponse.headers;
  }
}