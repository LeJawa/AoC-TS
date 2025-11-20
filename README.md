# Advent of Code TypeScript Framework

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Set your Advent of Code session cookie in `.env`:
   ```env
   AOC_SESSION=your_session_cookie_here
   ```

## Usage

### Setup a New Day
```bash
pnpm run setup-day <day> <year> --open
```
- Downloads input for the given day (re-downloads if exists)
- Creates a new solution file from `src/template/day.ts` (does not overwrite if exists)
- Optionally opens the problem in your browser

### Run Solutions
```bash
pnpm ts-node src/runner.ts <day>
# or
pnpm ts-node src/runner.ts --all
```
- Prints each part’s answer and timing

## File Structure
- `src/days/` — Solution files (one per day)
- `inputs/` — Input files (one per day)
- `src/template/day.ts` — Modifiable template for new days
- `src/common.ts` — Shared utilities (timing, input download/read)

## Notes
- Both parts for each day are in the same file.
- Timing is shown in ms if <1s, otherwise in seconds (0.00s).
- The runner currently supports only one year, but is flexible for future years.
