
# Project Notes

## Assumptions

- The group uses GHS as its only currency.
- Every member owes the same fixed contribution each week.
- A member's name must be unique, ignoring letter case and surrounding spaces.
- Members receive numeric IDs based on their joining order.
- Members may pay their weekly contribution in multiple instalments.
- A week can close only when every registered member has paid in full.
- The payout goes to the next member in joining order.
- Each successful payout advances the current week.
- The pot equals the weekly contribution multiplied by the number of members.
- Money is stored internally as integer hundredths to avoid floating-point errors.

## Limitations and Possible Improvements

- The program currently runs in memory; data is lost when the program stops.
- The group contribution is set in the source code rather than entered when creating a group.
- Member registration and payments are currently function calls, not a user-facing menu.
- Numeric IDs based on the member count would need reconsideration if member deletion were introduced.
- Future improvements could include persistent storage, a command-line menu, input prompts, and clearer error handling.
