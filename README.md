# susu-savings-group
A JavaScript and Node.js project for managing a rotating susu savings group, with weekly contributions, member tracking, and payouts.


# Susu Savings Group

A JavaScript program that manages a rotating weekly savings group.

## Features

- Register members with unique names and numeric IDs.
- Record full or partial weekly contributions.
- Prevent invalid payments and overpayments.
- Calculate outstanding balances.
- Display member payment status and payout history.
- Prevent a week from closing until all members have paid in full.
- Rotate payouts in member joining order.
- Use integer hundredths internally to maintain accurate money calculations.

## Requirements

- Node.js

## Getting Started

1. Clone the repository.
2. Open the project directory in your terminal.
3. Run the program's automated tests:

   ```bash
   node --test script.test.js
   ```

## Project Files

- `script.js` — core savings-group functionality.
- `script.test.js` — automated tests using Node.js's built-in test runner.
- `NOTES.md` — assumptions, limitations, and possible improvements.

## Currency

The group uses Ghanaian cedis (GHS). Amounts are entered and displayed in GHS, while internal calculations use integer hundredths to avoid floating-point errors.
