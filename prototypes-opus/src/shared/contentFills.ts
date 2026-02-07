import type { ContentFillKey, LayoutType } from "./types";

interface ContentFill {
  primary: string;
  secondary: string;
}

type ContentFillMap = Record<ContentFillKey, ContentFill>;
type LayoutContentMap = Record<LayoutType, ContentFillMap>;

export const CONTENT_FILLS: LayoutContentMap = {
  "title-subtitle": {
    "fill-1": {
      primary: "It was the best of times, it was the worst of times",
      secondary: "A Tale of Two Cities by Charles Dickens",
    },
    "fill-2": {
      primary: "All happy families are alike; each unhappy family is unhappy in its own way",
      secondary: "Anna Karenina by Leo Tolstoy",
    },
    "fill-3": {
      primary: "In the beginning God created the heaven and the earth",
      secondary: "The Book of Genesis",
    },
  },
  "title-paragraph": {
    "fill-1": {
      primary: "A Midsummer's Reverie",
      secondary:
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
    },
    "fill-2": {
      primary: "The Wanderer's Journal",
      secondary:
        "Call me Ishmael. Some years ago, never mind how long precisely, having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.",
    },
    "fill-3": {
      primary: "Letters from the Observatory",
      secondary:
        "Many years later, as he faced the firing squad, Colonel Aureliano Buendia was to remember that distant afternoon when his father took him to discover ice. At that time Macondo was a village of twenty adobe houses, built on the bank of a river of clear water that ran along a bed of polished stones.",
    },
  },
  "hero-card": {
    "fill-1": {
      primary: "The Great Gatsby",
      secondary:
        "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. Whenever you feel like criticizing anyone, he told me, just remember that all the people in this world haven't had the advantages that you've had.",
    },
    "fill-2": {
      primary: "One Hundred Years",
      secondary:
        "The world was so recent that many things lacked names, and in order to indicate them it was necessary to point. Every year during the month of March a family of ragged gypsies would set up their tents near the village.",
    },
    "fill-3": {
      primary: "Invisible Cities",
      secondary:
        "Kublai Khan does not necessarily believe everything Marco Polo says when he describes the cities visited on his expeditions, but the emperor of the Tartars does continue listening to the young Venetian with greater attention and curiosity than he shows any other messenger or explorer of his.",
    },
  },
  editorial: {
    "fill-1": {
      primary: "The Art of War & Peace",
      secondary:
        "Well, Prince, so Genoa and Lucca are now just family estates of the Buonapartes. But I warn you, if you don't tell me that this means war, if you still try to defend the infamies and horrors perpetrated by that Antichrist, I really believe he is Antichrist, I will have nothing more to do with you.",
    },
    "fill-2": {
      primary: "Portrait of a Lady",
      secondary:
        "Under certain circumstances there are few hours in life more agreeable than the hour dedicated to the ceremony known as afternoon tea. There are circumstances in which, whether you partake of the tea or not, some people of course never do, the situation is in itself delightful.",
    },
    "fill-3": {
      primary: "Notes from the Underground",
      secondary:
        "I am a sick man. I am a spiteful man. I am an unattractive man. I believe my liver is diseased. However, I know nothing at all about my disease, and do not know for certain what ails me. I don't consult a doctor for it, and never have, though I have a respect for medicine and doctors.",
    },
  },
  "split-screen": {
    "fill-1": {
      primary: "Metamorphosis",
      secondary:
        "One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly.",
    },
    "fill-2": {
      primary: "The Stranger",
      secondary:
        "Mother died today. Or maybe yesterday, I don't know. I had a telegram from the home: Mother passed away. Funeral tomorrow. Yours sincerely. That doesn't mean anything. It may have been yesterday.",
    },
    "fill-3": {
      primary: "The Trial",
      secondary:
        "Someone must have slandered Josef K., for one morning, without having done anything truly wrong, he was arrested. His landlady's cook, who always brought him his breakfast at eight o'clock, failed to appear on this occasion.",
    },
  },
};
