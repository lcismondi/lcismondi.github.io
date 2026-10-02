# English Home — local version for review

The English Home is available at `/en/` and shares the Spanish Home's CSS, images, contact handler and analytics preferences. The ES / EN selector and reciprocal hreflang links connect the two versions. Internal article links remain in Spanish and are marked ES; those pages are outside this translation's scope.

Edit reviewed translations in `content/home-en-translations.json`, then run `node scripts/render-home-en.cjs` after changing the Spanish Home. Review newly added text for missing translations. The renderer keeps Spanish anchors so the shared navigation styling and analytics events continue to work. Sitemap generation includes `/en/`; the publication builder includes the `en` folder.

Validated locally: package with 65 HTML pages; English layout at 320/360/390/768/1024/1440 px; English form error, submission and recovery messages with a local POST target; English analytics panel; canonical and language declaration; Spanish contact form regression checks. No real messages were sent.

Not yet published. Google Forms / Apps Script automatic emails remain in Spanish; translating email delivery is separate from the Home interface. Privacy and cookies pages remain in Spanish and are labeled accordingly.
