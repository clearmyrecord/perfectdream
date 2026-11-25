# Perfect Dream Modular — AI planning pilot

The public planning page is intentionally a browser-only preliminary checklist and a user-initiated ChatGPT research handoff. No project data is saved or sent unless the visitor elects to share it.

The optional Node 22+ API in server.mjs uses the OpenAI Responses API with web search and source citations. It is a private pilot, not yet deployed or configured.

Deploy as a separate web service (not on RecordPathAI infrastructure), root directory planner-api, start command node server.mjs, health check /health. Configure OPENAI_API_KEY, a unique random PLANNER_ACCESS_TOKEN of at least 32 characters, optional OPENAI_MODEL, PLANNER_ALLOWED_ORIGINS, and PLANNER_DAILY_LIMIT. Never place credentials in GitHub, public HTML, URL query strings or logs. Use a dedicated API project with appropriate billing and usage monitoring. Node process memory throttling is only a pilot safeguard, not durable across replicas/restarts.

After confirming /health returns aiConfigured:true, test unauthorized and malformed requests and an authorized sample (no personal data). Verify cited sources, unknown parcel status and no approval claims. Then set the planner-api meta tag in planning.html to the HTTPS endpoint /api/planning. The UI displays an access-code-protected AI research button. Distribute the pilot code privately.

Before public release, replace shared-token access with authenticated sessions, durable rate limits and budget enforcement, abuse protection, privacy disclosure and retention review, jurisdiction-specific regression tests, and qualified professional review. Do not advertise verified zoning or permit eligibility until jurisdiction and source coverage have been validated.
