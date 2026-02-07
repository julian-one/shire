# Only a 401 from moria clears the session cookie

The auth hook used to treat any non-OK answer from `/me` — including 404s from a misconfigured base URL and network
failures — as "anonymous" and delete the TOKEN cookie, so an operator error destroyed every visitor's session
unrecoverably. We decided that only a true 401 (moria affirmatively rejecting the token) clears the cookie; every
other failure resolves the Identity to `unavailable`, which preserves the session and renders as a degraded state
rather than a logout.
