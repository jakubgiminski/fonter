## Project Overview
When designing an interface, one of the first things we focus on is finding the perfect fonts that work great together and give our app a unique feel. 
However, going over countless fonts while displaying two fonts next to each other can be tedious and time consuming. 

Let's solve this problem by creating an app that allows users to iterate over font pairs while previewing them in common configurations, such as title/subtitle, title/paragraph, and so on. 
The user should be able to:
- Select a preview layout and iterate over different font pairs displayed on the layout. 
- Change the layout at any time
- Configure current layout in terms of primary/secondary font size, weight, and line height. Configuration must be preserved across font shuffles.

Each layout should come with a set of content fills - snippets from classical literature. User should be able to select from a set of 3 content fills within given layout. The user should not be able to edit the content fills or provide custom text.

Clicking "shuffle fonts" button should load a new pair of fonts into the preview.
User should be able to: 
- lock one of the fonts, so that shuffling only changes the other one.
- save a font pair with given layout configuration (take snapshot)
## Technical Requirements
- Use React and Typescript for this, creating a web app that works in the browser.
- We have to make it look and work great on both desktop wide viewports, as well as mobile narrow ones.
- Design of controls should be minimalistic and stable (it doesn't change, the user only changes the fonts in the preview that we're matching.)

