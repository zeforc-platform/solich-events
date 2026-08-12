# Source policy

Official calendar data is published only from an authoritative primary source:
the National Assembly, Government, Office of Government, or the competent
ministry. Each entry in a published data file must identify its source through
`sourceIds`.

Do not treat a news article, a proposed bill, a social post, or an employer's
announcement as an official nationwide holiday schedule. Put a proposed change
into the catalogue only after the enacting document is public and its effective
year is known.

For annual leave schedules, add the original Government/Office of Government
document to `sources`, change that file's `status` to `published`, and add the
specific `official_leave`, `compensatory_leave`, and `compensatory_workday`
entries it announces.
