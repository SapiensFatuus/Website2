# AP Chemistry assessment pilot evidence

This workflow records only aggregate evidence about a fixed draft assessment. It does not store student submissions, names, account identifiers, chat text, IP addresses, or row-level event data.

Pilot evidence is editorial quality-control data, not a student score record. It cannot establish an AP score conversion, predict exam performance, or prove population-wide validity.

## Evidence boundary

One record may be added for each registered diagnostic, reassessment, or unit-test blueprint. A record contains:

- The exact assessment ID and assessment revision tested.
- Collection start and end dates.
- Aggregate counts of participants who started and completed the form.
- Aggregate median, 75th-percentile, and 90th-percentile completion times.
- Aggregate selected-response and FRQ self-review completion percentages.
- A count and non-identifying summary of reported accessibility barriers.
- An explicit privacy assertion.
- A calibration decision, rationale, limitations, and reviewer identifiers.

The validator recursively rejects fields named `name`, `email`, `uid`, `userId`, `studentId`, `ipAddress`, `rawResponse`, `responseText`, or `chat`. Do not evade those checks with alternate student-level fields. If a proposed field could identify a participant or reconstruct an individual response, it does not belong in this repository.

## Calibration workflow

1. Freeze the assessment revision before pilot use.
2. Obtain the appropriate consent, age-appropriate privacy review, and institutional authorization outside this repository.
3. Collect operational data in the approved system.
4. Aggregate it outside the repository and discard or retain source events according to the approved privacy policy.
5. Add one aggregate record to `apChemistryAssessmentPilotEvidence` in `site/content/assessmentPilotEvidence.js`.
6. Start with `calibrationDecision.status: "collecting"`, no reviewers, and `decidedAt: null`.
7. Have two independent assessment reviewers inspect completion, timing, accessibility, and limitations.
8. Record either `revise` or `accepted`, two distinct reviewer identifiers, a decision date, a specific rationale, and explicit limitations.
9. Run `npm run catalog:validate` and the unit readiness command.

The schema deliberately does not invent a universal minimum participant count or automatic timing cutoff. Those decisions require documented human judgment about the pilot population, assessment purpose, accommodations, and observed distribution. A record counts as timing-calibrated only after two independent reviewers accept it.

## Readiness interpretation

The readiness report now keeps three separate facts visible:

- `fixed-assessment-coverage`: diagnostic, reassessment, and unit-test blueprints exist.
- `aggregate-pilot-evidence`: each blueprint has one privacy-safe aggregate pilot record.
- `timing-calibration-approval`: each pilot record has an accepted decision from two independent reviewers.

Passing the first gate does not imply either of the latter two. Passing all three still does not replace chemistry review, accessibility evaluation, content approval, or production verification.
