# Backyard Ultra Tracker

## What's a Backyard Ultra?

A backyard ultra is one of the most brutal formats in ultrarunning. Every hour, on the hour, you run a 6.706km loop — a precise distance that works out to exactly 100 miles per 24 hours. There's no finish line. You keep running until you're the last person standing. Miss a start, take too long, or decide you're done — and you're out. The winner is whoever completes one more loop than everyone else.

## Why This Exists

When people found out I was racing, the first question was: *how do I follow along?*

I didn't have a great answer. So on my flight home from [Imagine Innovators](https://edgeimpulse.com/imagine-innovators-europe), two days before race day, I vibe coded this entire app — including this README — so friends and family could follow along in real time.

## The App

A live race tracker that displays loop completions, elapsed time, total distance, and a countdown to the next loop start. Video updates from the course are pulled automatically from a YouTube playlist and displayed in a grid as they're posted.

The admin panel (password protected) lets me log a completed loop in one tap, adjust the race config, and manage the YouTube playlist link.

The display page auto-refreshes every 30 seconds so viewers always see current data without needing to reload.

## Stack

- **Framework:** Next.js 16 (App Router, server components)
- **Deployment:** Vercel
- **Database:** Upstash Redis (KV store)
- **Video:** YouTube Data API v3
- **Fonts:** Barlow + Atkinson Hyperlegible
