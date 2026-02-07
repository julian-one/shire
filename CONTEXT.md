# Shire

The browser-facing context for julian-one.com: it renders the site and holds the client half of moria's auth
protocol.

## Language

**Session Token**:
The secret moria mints at login. Shire keeps it in the Session Cookie, forwards it on moria calls, and holds it
nowhere else.
_Avoid_: session_id, token string

**Session Cookie**:
The browser cookie carrying the Session Token. Its name, flags, and lifetime have exactly one home.
_Avoid_: TOKEN (as a scattered literal)

**Identity**:
The answer to "who is this request from": authenticated (a known user), anonymous, or unavailable.
_Avoid_: loggedIn, auth state, user/session pair

**Unavailable**:
The Identity when moria could not answer: not anonymous, the session is preserved, and every reader must handle it
explicitly.
_Avoid_: logged out, degraded (for the identity itself)

**MoriaClient**:
The one module that speaks to moria: every call, every parse, and every error mode crosses this seam.
_Avoid_: fetch wrapper, api helper
