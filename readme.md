# Positive Vibrations

a cli downloader for the weekly KEXP Positive Vibrations show (or any show) for offline listening

## Usage

```
node index.js [options]

Options:
--dir           Path to download file || ./downloads
--weekday       Number of day of week to fetch || 1 (Saturday)
--hour          Hour of day in UTC to fetch || 17 (9am PST)
--title         Show title for filename || 'positive-vibrations'
--playlistPath  Optional path to M3U file to append
--version       Print out which version is running
--help          Print this help message
```

## Examples

Positive Vibrations:
```
node index.js --title positive-vibrations --hour 17 --weekday 1
```

Pacific Notions:
```
node index.js --title pacific-notions --hour 14 --weekday 7
```
