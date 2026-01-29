import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'

export const createClient = (req: any, res: any) => {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL and Key must be provided!')
    }

    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    // Ensure the cookie header is a string, providing an empty string if undefined.
                    // parseCookieHeader expects a string input.
                    // Also ensure mapped values are strings for Supabase client.
                    return parseCookieHeader(req.headers.cookie ?? '').map((c) => ({
                        name: c.name,
                        value: c.value ?? '',
                    }))
                },
                setAll(cookiesToSet) {
                    if (res.headersSent) return;
                    cookiesToSet.forEach(({ name, value, options }) =>
                        // Ensure the cookie value is a string, providing an empty string if undefined,
                        // as serializeCookieHeader expects a string value.
                        res.append('Set-Cookie', serializeCookieHeader(name, value ?? '', options))
                    )
                },
            },
        }
    )
}