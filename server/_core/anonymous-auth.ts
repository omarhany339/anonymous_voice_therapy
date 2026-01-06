import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { nanoid } from "nanoid";

/**
 * Anonymous Authentication System
 * 
 * Provides a simple, production-safe login mechanism for anonymous users.
 * Each user gets a unique anonymous ID and a secure session token.
 */
export function registerAnonymousAuthRoutes(app: Express) {
  /**
   * GET /app-auth
   * 
   * Entry point for unauthenticated users.
   * Creates an anonymous session and redirects back to home.
   */
  app.get("/app-auth", async (req: Request, res: Response) => {
    try {
      // Generate a unique anonymous ID (numeric string)
      const anonymousId = nanoid(10);
      
      // Create or get anonymous user in database
      await db.upsertUser({
        openId: anonymousId,
        name: `Anonymous User ${anonymousId}`,
        email: null,
        loginMethod: "anonymous",
        lastSignedIn: new Date(),
      });

      // Create a session token for this anonymous user
      const sessionToken = await sdk.createSessionToken(anonymousId, {
        name: `Anonymous ${anonymousId}`,
        expiresInMs: ONE_YEAR_MS,
      });

      // Set the session cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { 
        ...cookieOptions, 
        maxAge: ONE_YEAR_MS,
        // Ensure cookie is sent over HTTPS and not accessible via JavaScript
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      });

      // Redirect to home page
      res.redirect(302, "/");
    } catch (error) {
      console.error("[Anonymous Auth] Failed to create session:", error);
      
      // Fallback: show error page instead of crashing
      res.status(500).send(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>Authentication Error</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                background: #f5f5f5;
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                max-width: 400px;
                text-align: center;
              }
              h1 {
                color: #d32f2f;
                margin-top: 0;
              }
              p {
                color: #666;
                line-height: 1.6;
              }
              a {
                color: #1976d2;
                text-decoration: none;
              }
              a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>⚠️ Authentication Error</h1>
              <p>We encountered an issue creating your session. Please try again.</p>
              <p><a href="/">← Back to Home</a></p>
            </div>
          </body>
        </html>
      `);
    }
  });

  /**
   * GET /app-auth/logout
   * 
   * Logout endpoint - clears the session cookie
   */
  app.get("/app-auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { 
      ...cookieOptions, 
      maxAge: -1,
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });
    res.redirect(302, "/");
  });
}
