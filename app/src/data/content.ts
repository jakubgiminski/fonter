export interface ContentSnippet {
  author: string;
  title: string;
  subtitle: string;
  paragraph1: string;
  paragraph2: string;
}

export const contentSnippets: Record<string, ContentSnippet> = {
  Lucas: {
    author: "Lucas",
    title: "Echoes of the Force",
    subtitle: "The Lost Hope",
    paragraph1:
      "A tremor rippled through the Force as the twin suns dipped below the horizon of Tatooine, signaling the end of another harsh day. Rey stood atop the ridge, listening to the whispered echoes only she could hear. Somewhere in the vastness of the galaxy, hidden shadows stirred \u2014 remnants of an old conflict that refused to die. The weight of the legacy she carried pressed heavily on her, even as new strands of possibility shimmered on the edge of tomorrow.",
    paragraph2:
      "Across the void, distant stars glowed with ancient promise. Rey\u2019s mind reached out, searching for a beacon of guidance. The Force \u2014 ever enigmatic \u2014 seethed with both light and darkness, reminding her that balance was not a destination but a journey. In her heart, a fragile hope ignited, urging her onward into the unknown reaches where destiny awaited.",
  },
  Rowling: {
    author: "Rowling",
    title: "The Silver Quill",
    subtitle: "Secrets Beneath the Library",
    paragraph1:
      "The restricted section of the Hogwarts library held more than dusty tomes; it held the whispered secrets of centuries. Hermione Granger crossed her arms, eyes fixed on a gilded quill that hovered over a leather-bound book. It shimmered faintly, as though eager to reveal what it knew \u2014 but only to those brave enough to decipher its riddles. Shadows danced across the high shelves, teasing secrets that beckoned both wisdom and danger.",
    paragraph2:
      "Ron and Harry stood at her side, hearts pounding with a mix of curiosity and dread. Together, they watched the quill scrawl words in silver ink, revealing fragments of spells long thought lost. Each phrase seemed to breathe with life, hinting at truths that could reshape their understanding of magic\u2026 and of the very war they fought. A chill settled over them, but in that moment, they knew they had uncovered something that might change everything.",
  },
  Tolkien: {
    author: "Tolkien",
    title: "The Whispering Leaves",
    subtitle: "Journey Through Fangorn",
    paragraph1:
      "Under the ancient boughs of Fangorn Forest, the leaves seemed to murmur in voices older than the hills. Merry and Pippin followed the winding path, their boots sinking into moss that felt as soft as time itself. Sunlight pierced the emerald canopy in shards, and with each step, they felt the forest\u2019s watchful gaze \u2014 patient, wise, indifferent, or perhaps something more.",
    paragraph2:
      "The wind carried a whispered cadence, like a lullaby sung in ages past. Every rustle of leaf and creak of branch hinted at life unseen. Deep within these woods, the boundaries between the known and the mysterious blurred; trees stood not merely as wood and leaf, but as keepers of memory. Here, the hobbits sensed that the fate of their journey might depend not on sword or shield, but on understanding the quiet language of the earth itself.",
  },
  Meyer: {
    author: "Meyer",
    title: "Crimson Twilight",
    subtitle: "Heartbeats in the Dark",
    paragraph1:
      "The forest breathed with life, yet beneath the hush of evening, an eeriness lingered like a half-remembered dream. Bella stood at the edge of the trees, twilight casting long shadows across her path. The cool air rustled her hair, but it was the unseen presence beside her that made her pulse quicken. Edward\u2019s eyes gleamed not with menace, but with a protectiveness that seemed older than the stars overhead.",
    paragraph2:
      "A scent \u2014 unfamiliar yet intoxicating \u2014 drifted through the pines. Bella felt a shiver trace her spine, torn between fear and fascination. In the fading light, the world felt suspended between reality and dream, each heartbeat echoing like distant thunder. Whatever waited in the dark was drawn to them, sensing life in a way no ordinary creature ever could. Yet Bella stood tall, anchored by the quiet strength she had discovered within herself.",
  },
  Martin: {
    author: "Martin",
    title: "The Winter Herald",
    subtitle: "Fires Beyond the Wall",
    paragraph1:
      "Snow fell in great, soft spirals as Jon Snow stood atop the icy ramparts, staring into the white wilderness that stretched beyond all maps. Cold cut through his cloak like a blade, yet even the bitter wind couldn\u2019t chill the fire burning in his chest. Stories of what lay ahead were as varied as the stars above \u2014 some spoke of myth, others of terror \u2014 but Jon knew the truth would be more complex than legend or fear.",
    paragraph2:
      "Far ahead, the sky glowed with an otherworldly shimmer. It was not the warm pulse of hearthfire, but something harsher \u2014 stark and unrelenting. With every beat of his heart, Jon felt the weight of expectation settle upon him, as heavy as Valyrian steel. Somewhere out there, allies and adversaries alike awaited, their fates entangled in the cracking ice and flickering flame. The cold wind whispered of trials yet to come, but Jon\u2019s resolve remained unbroken.",
  },
  Herbert: {
    author: "Herbert",
    title: "Sands of Prophecy",
    subtitle: "The Voice of Arrakis",
    paragraph1:
      "Arrakis was a storm of gold and heat, an ocean of sand where every grain seemed to hold a secret. Paul Atreides stood on the crest of a shifting dune, eyes narrowed against the bright glare of the sun. The rhythmic howl of the wind carried ancient echoes \u2014 whispers of destiny and dread. He felt the pulse of the desert as though it were a living thing, a heartbeat that both challenged and guided him.",
    paragraph2:
      "Beneath his feet, the sands seemed to shift with purpose, urging him forward into the heart of a world that defied all logic. The Fremen watched from the shadows, their eyes reflecting the fire of a thousand suns, seeing in Paul something both daunting and divine. In that vast expanse of heat and echoing silence, he sensed the fragile balance of fate: a burden of leadership, survival, and an unknown future that shimmered like heat on the horizon.",
  },
};

export const authorKeys = Object.keys(contentSnippets) as Array<keyof typeof contentSnippets>;
