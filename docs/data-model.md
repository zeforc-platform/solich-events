# Data model

`data/v1/<country>/` is the public feed for a country's national baseline.
Country uses ISO 3166-1 alpha-2, so `VN`, `JP`, and `KR` each have one root
manifest. When a country needs regional calendars, the ISO 3166-2 subdivision
is placed under `data/v1/<country>/subdivisions/<subdivision>/`; for example,
`data/v1/US/subdivisions/US-CA/`. Consumers merge the country root first, then
the selected subdivision feed.

## Three independent data layers

| File | Purpose | Change cadence |
| --- | --- | --- |
| `official/catalog.json` | Legal holidays and their stable solar/lunar rules | Only when the law changes |
| `observances/catalog.json` | Commemorations that are not statutory leave | Infrequent |
| `official/overrides/<year>.json` | Government-announced leave days, compensatory leave, and compensatory workdays | Per year |

The catalogue gives an app a date to display every year. It never guesses the
full time-off period for entries whose `leavePolicy.kind` is
`annual_schedule_required`. Those dates appear only after a source-backed
annual override is published.

Observance entries carry `observanceType` so consumers can offer useful filters
without confusing a remembrance day with a public holiday. The v1 values are
`national_commemoration`, `historical_commemoration`, `cultural_traditional`,
`religious_traditional`, `professional_commemoration`,
`family_social_observance`, and `international_observance`.

## Official override event types

- `official_holiday`: an explicit statutory holiday date when an annual notice
  needs to state it.
- `official_leave`: an announced leave day associated with a holiday.
- `compensatory_leave`: a day off in lieu of a holiday falling on a weekly rest
  day, or another official arrangement.
- `compensatory_workday`: a working Saturday/Sunday exchanged for a leave day.

Every published entry has `holidayId`, a stable ID from the official catalogue,
and at least one `sourceIds` reference. A `pending` file intentionally has no
entries and must not be presented as a complete leave schedule. Consumers must
also preserve `scheduleScope`: a `public_sector_schedule` is useful reference
data, but an employer can arrange its workers' schedule differently.

## Consumer rules

1. Fetch `manifest.json` first and validate it with `manifest.schema.json`.
2. Fetch and validate the requested catalogue(s), then calculate stable dates
   using the app's calendar engine (`@lichta/core` for lunar dates).
3. Fetch the year override only when the manifest marks it `published`; validate
   it with `official-overrides.schema.json`.
4. Combine catalogue dates and override entries in memory. Reference data must
   never be written to a user's event store or Drive document.

The schemas describe JSON at the CDN boundary. A Sổ Lịch adapter will map valid
records into the app's `HolidayDefinition` and calendar-event view models.
