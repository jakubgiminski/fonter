## Overview
When designing an interface, one of the first things we focus on is finding the perfect fonts that work great together and give our app a unique feel. 
However, going over countless fonts while displaying two fonts next to each other can be tedious and time consuming. 

Let's solve this problem by creating an app that allows users to iterate over font pairs while previewing them using different layouts and content.

### Layouts
Preview shows a combination of title, subtitle, and/or paragraphs, each using primary or secondary font face.
User is able to select one of the layouts:
- Hero
- Brief
- Essay
- Quote
See @layouts.md to get detailed display properties.

### Content
Each content snippet has title, subtitle, and 2 paragraphs. Each layout depends on content from a combination of title/subtitle/paragraphs.
User can select author's last name which updates content on the preview.
- Lucas
- Rowling
- Tolkien
- Meyer
- Martin
- Herbert
See @content.md to get title, subtitle, and 2 paragraphs for each snippet.

### Shuffling
Clicking "shuffle fonts" button loads a new pair of fonts into the preview.
User should be able to: 
- Lock one of the fonts, so that shuffling only changes the other one. Locking second font, unlocks the fisrt one (only one font can be locked at a time)

## Technical Requirements
- Use React and Typescript for this, creating a web app that works in the browser.
- We have to make it look and work great on both desktop wide viewports, as well as mobile narrow ones.
- Design of controls should be minimalistic and stable (it doesn't change, the user only changes the fonts in the font matching preview.)
- Don't use any vivid colors, we want to oscilate around white/beige/grey/almost black, enabling typography to be at the center.