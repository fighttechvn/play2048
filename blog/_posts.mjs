// Blog content. Rendered by scripts/gen-blog.mjs — see that file for the shape
// of a post and which fields are optional.
//
// Posts with `generate: false` are the older hand-written articles: their HTML
// on disk is authoritative and only the index card + sitemap line come from here.
//
// House style for the game posts: lead with the rules (that is the search
// intent — "how to play X"), then strategy someone can use on their next board,
// then what it trains, then an honest note on our version. No invented studies,
// no "scientifically proven", no claims about features we haven't shipped.

const PLAY = (id) => `../../play/?open=${id}`;

/** The standard closing CTA for a game post. */
const play = (id, name, line) => ({
  title: `Play ${name} now`,
  text: line,
  label: `▶ Play ${name}`,
  href: PLAY(id),
});

/** Free/offline/no-account line — true of every game in the hub. */
const FREE = "It runs in your browser, works offline once loaded, needs no account, and costs nothing.";

export const POSTS = [
  // ────────────────────────────────────────────────────────────────────────
  // Genre guides
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "all-games",
    generate: true,
    eyebrow: "Game Guide",
    title: "All 33 Games in Go Brain: The Complete List 🧠",
    seoTitle: "All 33 Free Brain Games in Go Brain — The Complete List",
    metaDesc:
      "Every game in the Go Brain hub, sorted by what it asks of you: logic puzzles, word games, memory and reaction training, arcade classics. All free, no sign-up.",
    excerpt:
      "Thirty-three games, one hub. Sorted by what each one actually asks of your brain — so you can find the right one for the ten minutes you have.",
    ogTitle: "All 33 Free Brain Games in Go Brain",
    date: "2026-08-10",
    readMin: 8,
    image: "kakuro",
    lead:
      "Go Brain is one app with thirty-three games in it. That is a lot of tiles on a screen, so here is the whole catalogue sorted by what each game actually asks of you — deduction, vocabulary, memory, reaction, or nothing more than a spare thumb.",
    toc: [
      { id: "logic", label: "Logic & deduction (12 games)" },
      { id: "word", label: "Word games (4 games)" },
      { id: "training", label: "Focus, memory & reaction (5 games)" },
      { id: "arcade", label: "Arcade & reflex (7 games)" },
      { id: "casual", label: "Casual puzzle & cards (3 games)" },
      { id: "brand", label: "Brandable games (2 games)" },
      { id: "pick", label: "Which one should I open?" },
    ],
    body: `
          <h2 id="logic">Logic &amp; deduction — 12 games</h2>
          <p>These are the ones with a single right answer that you can reach by reasoning alone. No guessing, no reflexes, no clock unless you want one. If you like the feeling of a board that clicks shut, start here.</p>
          <table>
            <thead><tr><th>Game</th><th>The rule in one line</th><th></th></tr></thead>
            <tbody>
              <tr><td><strong>Sudoku</strong></td><td>Every row, column and 3×3 box holds 1–9 once</td><td><a href="../sudoku-online-free/">Guide →</a></td></tr>
              <tr><td><strong>Kakuro</strong></td><td>Each run of white cells adds up to its clue, no digit twice</td><td><a href="../kakuro-online-free/">Guide →</a></td></tr>
              <tr><td><strong>Cages</strong></td><td>Sudoku, but each dotted cage must also hit a sum</td><td><a href="../killer-sudoku-cages/">Guide →</a></td></tr>
              <tr><td><strong>Crowns</strong></td><td>One crown per row, column and colour region — none touching</td><td><a href="../crowns-queens-puzzle/">Guide →</a></td></tr>
              <tr><td><strong>Nonogram</strong></td><td>Number clues tell you which cells to fill; a picture appears</td><td><a href="../nonogram-picross-online/">Guide →</a></td></tr>
              <tr><td><strong>Mines</strong></td><td>Read the numbers, flag the mines, clear the rest</td><td><a href="../minesweeper-no-guess/">Guide →</a></td></tr>
              <tr><td><strong>Tango</strong></td><td>Balance suns and moons across every row and column</td><td><a href="../tango-suns-moons-puzzle/">Guide →</a></td></tr>
              <tr><td><strong>Zip</strong></td><td>One path through every cell, hitting the numbers in order</td><td><a href="../zip-one-line-path-puzzle/">Guide →</a></td></tr>
              <tr><td><strong>Patch</strong></td><td>Cut the grid into rectangles that match each number</td><td><a href="../shikaku-patch-puzzle/">Guide →</a></td></tr>
              <tr><td><strong>Domino Fit</strong></td><td>Cover the whole board with dominoes, no overlaps</td><td><a href="../domino-fit-tiling-puzzle/">Guide →</a></td></tr>
              <tr><td><strong>Mend</strong></td><td>Mirror each broken tile back into symmetry</td><td><a href="../mend-mindful-symmetry/">Guide →</a></td></tr>
              <tr><td><strong>Wend</strong></td><td>Trace four hidden words through a grid, using every tile</td><td><a href="../wend-word-path-puzzle/">Guide →</a></td></tr>
            </tbody>
          </table>
          <p>Full breakdown: <a href="../logic-puzzle-games/">the logic puzzle guide</a>.</p>

          <h2 id="word">Word games — 4 games</h2>
          <p>Vocabulary, spelling and the particular satisfaction of a word appearing out of nothing.</p>
          <ul>
            <li><strong><a href="../five-letters-wordle-style/">Five Letters</a></strong> — six guesses, colour feedback, a fresh daily word plus unlimited practice.</li>
            <li><strong><a href="../wend-word-path-puzzle/">Wend</a></strong> — four words hidden in a grid of letters; every tile gets used exactly once.</li>
            <li><strong><a href="../4-pics-1-word-game/">4 Pics 1 Word</a></strong> — four photos share one word. Four languages.</li>
            <li><strong><a href="../brain-twist-lateral-puzzles/">Brain Twist</a></strong> — lateral-thinking riddles where the obvious answer is the trap.</li>
          </ul>
          <p>Full breakdown: <a href="../word-games/">the word game guide</a>.</p>

          <h2 id="training">Focus, memory &amp; reaction — 5 games</h2>
          <p>Short, timed, repeatable. These are the ones with a number at the end you can try to beat tomorrow.</p>
          <ul>
            <li><strong><a href="../schulte-table-scan-25/">Scan 25</a></strong> — find 1 to 25 in order, as fast as you can. A Schulte table.</li>
            <li><strong><a href="../stroop-test-game/">Color Clash</a></strong> — name the ink colour, not the word. The Stroop effect, gamified.</li>
            <li><strong><a href="../echo-memory-sequence-game/">Echo</a></strong> — repeat a sequence that grows by one every round.</li>
            <li><strong><a href="../reaction-time-test-game/">Reflex</a></strong> — tap the instant it turns green. Never on red.</li>
            <li><strong><a href="../math-sprint-mental-math/">Math Sprint</a></strong> — spot the wrong equation before the clock runs out.</li>
          </ul>
          <p>Full breakdown: <a href="../brain-training-games/">the brain training guide</a>.</p>

          <h2 id="arcade">Arcade &amp; reflex — 7 games</h2>
          <p>One thumb, no rules to learn, a score to chase.</p>
          <ul>
            <li><strong><a href="../snake-game-online/">Snake</a></strong> — the classic. Eat, grow, don't turn into yourself.</li>
            <li><strong><a href="../sky-jump-endless-jumper/">Sky Jump</a></strong> — bounce a blob up an endless tower.</li>
            <li><strong><a href="../bounce-brick-breaker/">Bounce</a></strong> — aim a volley of balls at a descending wall of bricks.</li>
            <li><strong><a href="../stacker-tower-game/">Stacker</a></strong> — tap to drop each block; sloppy stacks get narrower.</li>
            <li><strong><a href="../merge-drop-tile-merge-game/">Merge Drop</a></strong> — drop numbered tiles, chain the doubles.</li>
            <li><strong><a href="../flap-tap-to-fly-game/">Flap</a></strong> — tap to flap, thread the pipes.</li>
            <li><strong><a href="../bubbo-bubble-shooter/">Bubbo Bubbo</a></strong> — a bubble shooter with 60 levels.</li>
          </ul>
          <p>Full breakdown: <a href="../arcade-games/">the arcade guide</a>.</p>

          <h2 id="casual">Casual puzzle &amp; cards — 3 games</h2>
          <ul>
            <li><strong><a href="../water-sort-puzzle-pour/">Pour</a></strong> — sort coloured liquid tube by tube. Unwinding, not taxing.</li>
            <li><strong><a href="../block-fit-puzzle/">Block Fit</a></strong> — drop pieces on an 8×8 board and clear lines. No gravity, no rotation.</li>
            <li><strong><a href="../klondike-solitaire-online/">Solitaire</a></strong> — Klondike, draw one, endless deals.</li>
          </ul>

          <h2 id="brand">Brandable games — 2 games</h2>
          <p>These two are aimed at marketers rather than players: a memory match and an endless runner you can skin with your own products, mascot and colours for a campaign. See <a href="../brandable-games-for-marketers/">brandable games</a> or the <a href="../../sdk/">SDK</a>.</p>

          <h2 id="pick">Which one should I open?</h2>
          <table>
            <thead><tr><th>You have…</th><th>Try</th></tr></thead>
            <tbody>
              <tr><td>2 minutes and a queue</td><td>Scan 25, Reflex, Color Clash</td></tr>
              <tr><td>5 minutes and a coffee</td><td>Five Letters, Tango, Crowns</td></tr>
              <tr><td>20 minutes and a comfy chair</td><td>Kakuro, Nonogram, Cages, Solitaire</td></tr>
              <tr><td>No mental energy at all</td><td>Pour, Snake, Sky Jump</td></tr>
              <tr><td>Something to argue about</td><td>Brain Twist</td></tr>
            </tbody>
          </table>
          <p>Every game on this page is free, runs in the browser, keeps working offline once it has loaded, and does not ask for an account. Your progress stays on your device.</p>
`,
    faq: [
      {
        q: "Are all 33 games really free?",
        a: "Yes. Every game is playable in full with no payment and no account. There is an optional Plus upgrade for extras like the daily archive and a detailed skill breakdown, but no game or level is locked behind it.",
      },
      {
        q: "Do they work offline?",
        a: "Once a game has loaded it keeps working without a connection, and your progress is saved on your device.",
      },
      {
        q: "Do I need to install an app?",
        a: "No. Everything runs in a browser. There are iOS and Android builds if you prefer an icon on your home screen, but they are the same games.",
      },
    ],
    related: ["logic-puzzle-games", "brain-training-games", "arcade-games"],
    cta: {
      title: "Open the hub",
      text: "Thirty-three games, no sign-up, nothing to install. Pick one and see how it goes.",
      label: "▶ Play now",
      href: "../../play/",
    },
  },

  {
    slug: "logic-puzzle-games",
    eyebrow: "Puzzle Guide",
    title: "Logic Puzzle Games: A Guide to the 12 in Go Brain 🧠",
    seoTitle: "Logic Puzzle Games — 12 Free Deduction Puzzles Explained",
    metaDesc:
      "Sudoku, Kakuro, Nonogram, Crowns, Minesweeper and more: what each logic puzzle asks of you, which is hardest, and where to start if you're new to deduction games.",
    excerpt:
      "Sudoku, Kakuro, Nonogram, Crowns and eight more. What separates a real deduction puzzle from a guessing game, and which to start with.",
    date: "2026-08-10",
    readMin: 7,
    image: "crowns",
    lead:
      "A logic puzzle has one property that makes it worth your evening: the answer is reachable by reasoning, and only by reasoning. No luck, no dexterity, no vocabulary. Twelve of the games in Go Brain work that way. Here is what each one asks of you.",
    toc: [
      { id: "what", label: "What makes a puzzle 'logic'" },
      { id: "numbers", label: "Number puzzles" },
      { id: "grid", label: "Placement & constraint puzzles" },
      { id: "picture", label: "Drawing & tiling puzzles" },
      { id: "start", label: "Where to start" },
    ],
    body: `
          <h2 id="what">What makes a puzzle "logic"</h2>
          <p>Two things, really.</p>
          <p><strong>A unique solution.</strong> There is exactly one way the board can end up. That is what makes a deduction valid: if a cell can only be one value, it <em>is</em> that value, and you never have to hedge.</p>
          <p><strong>A guess-free path.</strong> A puzzle can have a unique solution and still be badly made — if the only way to progress is to try a value and see whether it explodes forty moves later. A well-made board always leaves at least one cell whose value follows from what you already know.</p>
          <p>We generate every level in these twelve games with a solver in the loop, and we verify uniqueness before a level ships. Minesweeper is the clearest example of why that matters: the classic version can force you into a coin flip, so ours only generates boards that never do.</p>

          <h2 id="numbers">Number puzzles</h2>
          <p>Digits, sums and the constraint that a number can't appear twice where it shouldn't.</p>
          <ul>
            <li><strong><a href="../sudoku-online-free/">Sudoku</a></strong> — the one everybody knows. 1–9 in every row, column and box. Four difficulties.</li>
            <li><strong><a href="../kakuro-online-free/">Kakuro</a></strong> — a crossword made of sums. Each run of white cells adds to its clue with no digit repeated, so a clue of 3 across two cells can only be 1+2. Under-rated and genuinely deep.</li>
            <li><strong><a href="../killer-sudoku-cages/">Cages</a></strong> — Killer Sudoku. Normal Sudoku rules plus dotted cages that must hit a sum. The cages give you a foothold before any digit is placed.</li>
            <li><strong><a href="../math-sprint-mental-math/">Math Sprint</a></strong> — not deduction, but it belongs in the same drawer: arithmetic under a clock.</li>
          </ul>

          <h2 id="grid">Placement &amp; constraint puzzles</h2>
          <p>Nothing to add up. You are working out where things can and cannot go.</p>
          <ul>
            <li><strong><a href="../crowns-queens-puzzle/">Crowns</a></strong> — one crown per row, per column and per colour region, and no two crowns touching, even diagonally. The "no touching" rule is what turns it from easy to interesting.</li>
            <li><strong><a href="../tango-suns-moons-puzzle/">Tango</a></strong> — fill a 6×6 with suns and moons: three of each per line, never three in a row, plus equals and cross clues between cells.</li>
            <li><strong><a href="../minesweeper-no-guess/">Mines</a></strong> — Minesweeper, with the coin flips engineered out. Every board is solvable by reasoning from the numbers.</li>
            <li><strong><a href="../zip-one-line-path-puzzle/">Zip</a></strong> — draw a single unbroken path that visits every cell and hits the numbered cells in order.</li>
          </ul>

          <h2 id="picture">Drawing &amp; tiling puzzles</h2>
          <p>The reward here is visual: a shape resolves out of the constraints.</p>
          <ul>
            <li><strong><a href="../nonogram-picross-online/">Nonogram</a></strong> — Picross. The numbers along each row and column describe runs of filled cells, and a picture emerges. The best entry point for anyone who finds number puzzles cold.</li>
            <li><strong><a href="../shikaku-patch-puzzle/">Patch</a></strong> — Shikaku. Cut the grid into rectangles so each contains exactly one number, and that number is its area.</li>
            <li><strong><a href="../domino-fit-tiling-puzzle/">Domino Fit</a></strong> — cover the entire board with dominoes. A parity argument kills most wrong starts instantly, once you learn to see it.</li>
            <li><strong><a href="../mend-mindful-symmetry/">Mend</a></strong> — restore a broken pattern by mirroring tiles back into symmetry. No timer, no failure state.</li>
            <li><strong><a href="../wend-word-path-puzzle/">Wend</a></strong> — half logic, half vocabulary: four words traced through a grid, every letter tile used once.</li>
          </ul>

          <h2 id="start">Where to start</h2>
          <p>If you have never done one of these seriously:</p>
          <ol>
            <li><strong>Nonogram</strong>, easy levels. The feedback is visual and the first ten levels teach the technique without telling you about it.</li>
            <li><strong>Crowns</strong>. One rule, immediately graspable, and the deduction chains get long fast.</li>
            <li><strong>Sudoku</strong> on Easy, then <strong>Cages</strong> when plain Sudoku stops resisting.</li>
            <li><strong>Kakuro</strong> when you want the deep end.</li>
          </ol>
          <p>All twelve have undo and a hint button. Using a hint is not cheating — on a hard board it is the difference between learning a technique and closing the tab.</p>
`,
    faq: [
      {
        q: "Which logic puzzle is hardest?",
        a: "Kakuro at the top of its ramp asks the most of you, because you are juggling sum combinations in two directions at once. Cages is a close second. Nonogram scales more gently than either.",
      },
      {
        q: "Do these puzzles ever require guessing?",
        a: "No. Every level is generated with a solver in the loop and verified to have exactly one solution, and Mines specifically only ships boards that can be cleared by reasoning alone.",
      },
      {
        q: "Are logic puzzles good for your brain?",
        a: "They are good practice at sustained attention and at holding several constraints in mind at once. We would not claim more than that — the research on puzzle games transferring to general intelligence is genuinely mixed.",
      },
    ],
    related: ["all-games", "brain-training-games", "word-games"],
    cta: {
      title: "Pick a puzzle",
      text: "Twelve logic puzzles, all free, all with a verified single solution. No account, no ads, works offline.",
      label: "▶ Play now",
      href: "../../play/",
    },
  },

  {
    slug: "word-games",
    eyebrow: "Puzzle Guide",
    title: "Word Games in Go Brain: Four Ways to Play With Letters 🧠",
    seoTitle: "Free Word Games Online — Wordle-Style, Word Search &amp; More",
    metaDesc:
      "Four free word games: a six-guess daily word, a word-path grid, a four-pictures riddle and lateral-thinking teasers. No sign-up, plays offline, four languages.",
    excerpt:
      "A daily five-letter word, a grid of hidden word paths, four photos with one answer, and riddles designed to fool you. Four very different ways to play with language.",
    date: "2026-08-10",
    readMin: 5,
    image: "word5",
    lead:
      "Word games split into two camps: the ones testing what you know, and the ones testing how you look at a problem. Go Brain has both. Here are the four, and what each is actually good for.",
    toc: [
      { id: "five", label: "Five Letters — the daily word" },
      { id: "wend", label: "Wend — word paths" },
      { id: "pics", label: "4 Pics 1 Word" },
      { id: "twist", label: "Brain Twist — lateral riddles" },
      { id: "which", label: "Which one suits you" },
    ],
    body: `
          <h2 id="five">Five Letters — the daily word</h2>
          <p>Six guesses to find a five-letter word. Green means right letter, right place; yellow means right letter, wrong place; grey means the letter isn't in the word at all.</p>
          <p>The skill is in guess two. Most people burn it chasing a yellow letter around, when the higher-information move is usually a completely fresh set of letters. You are not trying to win on guess two — you are trying to make guess four impossible to get wrong.</p>
          <p>There is a fresh word every day and an unlimited practice mode, so you never have to wait for tomorrow to play again. 2,500 answers in the pool. <a href="../five-letters-wordle-style/">Full guide →</a></p>

          <h2 id="wend">Wend — word paths</h2>
          <p>A grid of letter tiles hides four words. Trace each one by dragging through adjacent tiles — and every tile in the grid belongs to exactly one word, so the "use every letter" rule is itself a clue. When three words are found, the fourth is forced.</p>
          <p>99 levels. It sits somewhere between a word search and a logic puzzle, and the endgame is pure deduction. <a href="../wend-word-path-puzzle/">Full guide →</a></p>

          <h2 id="pics">4 Pics 1 Word</h2>
          <p>Four photographs, one word connecting them. Tap letters from a jumbled tray to spell it.</p>
          <p>The trick is that the connection is rarely the obvious category. Four pictures of things that are round is a weak puzzle; four pictures where the shared word is a pun or a second meaning is the real thing. Available in four languages. <a href="../4-pics-1-word-game/">Full guide →</a></p>

          <h2 id="twist">Brain Twist — lateral riddles</h2>
          <p>Barely a word game, and the odd one out here: these are lateral-thinking puzzles where the obvious reading of the question is the trap. The answer is fair every time — it just requires you to drop an assumption you didn't notice you'd made.</p>
          <p>Best played with somebody else in the room, honestly. <a href="../brain-twist-lateral-puzzles/">Full guide →</a> or read <a href="../what-is-a-lateral-thinking-puzzle/">what a lateral-thinking puzzle is</a>.</p>

          <h2 id="which">Which one suits you</h2>
          <table>
            <thead><tr><th>If you want…</th><th>Play</th></tr></thead>
            <tbody>
              <tr><td>A five-minute daily ritual</td><td>Five Letters</td></tr>
              <tr><td>Something to chip away at</td><td>Wend (99 levels)</td></tr>
              <tr><td>To play in a second language</td><td>4 Pics 1 Word</td></tr>
              <tr><td>To annoy a friend</td><td>Brain Twist</td></tr>
            </tbody>
          </table>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Is Five Letters the same as Wordle?",
        a: "It is the same six-guess, colour-feedback format that Wordle made popular. Ours adds an unlimited practice mode so you are not restricted to one word a day, and it works offline.",
      },
      {
        q: "What languages are supported?",
        a: "4 Pics 1 Word ships in four languages. The rest of the hub's interface covers 19 locales, though the word lists themselves are English.",
      },
    ],
    related: ["all-games", "logic-puzzle-games", "what-is-a-lateral-thinking-puzzle"],
    cta: {
      title: "Play a word game",
      text: "Four word games, free, no account. The daily word resets at midnight your time.",
      label: "▶ Play now",
      href: "../../play/",
    },
  },

  {
    slug: "brain-training-games",
    eyebrow: "Brain Training",
    title: "Brain Training Games: Focus, Memory and Reaction 🧠",
    seoTitle: "Free Brain Training Games — Focus, Memory &amp; Reaction Tests",
    metaDesc:
      "Five short brain training games: a Schulte table, a Stroop test, a memory sequence, a reaction-time test and mental arithmetic. Each takes about 60 seconds.",
    excerpt:
      "A Schulte table, a Stroop test, a memory sequence, a reaction timer and mental arithmetic — five games built around a number you can try to beat tomorrow.",
    date: "2026-08-10",
    readMin: 6,
    image: "scan",
    lead:
      "Five of the games in Go Brain are less puzzle than measurement: each takes about a minute and ends with a number. Four of them are adapted from tasks that psychologists have used for decades. Here is what each one measures, and an honest note about what that does and doesn't mean.",
    toc: [
      { id: "scan", label: "Scan 25 — the Schulte table" },
      { id: "stroop", label: "Color Clash — the Stroop test" },
      { id: "echo", label: "Echo — working memory" },
      { id: "reflex", label: "Reflex — reaction time" },
      { id: "math", label: "Math Sprint — mental arithmetic" },
      { id: "honest", label: "Does brain training work?" },
    ],
    body: `
          <h2 id="scan">Scan 25 — the Schulte table</h2>
          <p>Twenty-five numbers scattered in a 5×5 grid. Find them in order, 1 to 25, as fast as you can. That's the whole game.</p>
          <p>It is a Schulte table, a tool that has been used since the 1950s to measure visual search speed and peripheral attention. The trick is to keep your eyes near the centre and let your peripheral vision do the finding — people who scan cell-by-cell are always slower than people who soften their gaze.</p>
          <p>99 levels across 6 modes. <a href="../schulte-table-scan-25/">Full guide →</a></p>

          <h2 id="stroop">Color Clash — the Stroop test</h2>
          <p>The word <em>BLUE</em> written in red ink. You have to answer <strong>red</strong>. Sixty seconds of it.</p>
          <p>This is the Stroop effect, first published in 1935 and still one of the most reliable demonstrations in psychology: reading is so automatic that suppressing it costs you measurable time. Everyone is slower on mismatched trials. The game is watching how much slower.</p>
          <p><a href="../stroop-test-game/">Full guide →</a></p>

          <h2 id="echo">Echo — working memory</h2>
          <p>A sequence of tiles lights up. Repeat it. Then it gets one longer. Repeat that.</p>
          <p>Simon, essentially, and a close cousin of the digit-span tasks used to probe working memory. The grid grows from 3×3 to 4×4 as you climb, which stops the pattern from becoming spatial muscle memory. Most people stall somewhere between 7 and 10 steps, which is roughly where the classic estimate of short-term memory span sits.</p>
          <p><a href="../echo-memory-sequence-game/">Full guide →</a></p>

          <h2 id="reflex">Reflex — reaction time</h2>
          <p>Wait for green, tap. Tap on red and you lose a life. Three lives.</p>
          <p>A simple visual reaction-time test. Typical adult reaction to a visual cue lands around 250 ms; under 200 ms is quick, and anything under about 120 ms means you anticipated rather than reacted — the game counts that as a false start, because it is.</p>
          <p><a href="../reaction-time-test-game/">Full guide →</a></p>

          <h2 id="math">Math Sprint — mental arithmetic</h2>
          <p>Equations flash up and you decide whether each one is right. Sixty seconds, as many as you can.</p>
          <p>The interesting part is that you rarely need to compute the answer. <code>7 × 8 = 54</code> is wrong on sight, because the units digit can't be 4. Learning to reject fast is the whole skill. <a href="../math-sprint-mental-math/">Full guide →</a></p>

          <h2 id="honest">Does brain training work?</h2>
          <p>Worth being straight about this, because the category has a history of overclaiming.</p>
          <p>You will get better at these games. That part is not in doubt — practice on a specific task reliably improves performance on that task. What is genuinely contested is <strong>transfer</strong>: whether getting faster at a Schulte table makes you better at anything that isn't a Schulte table. The evidence for broad transfer to general cognitive ability is weak, and several large brain-training claims have been walked back or fined out of existence.</p>
          <p>So here is our pitch, without the lab coat: these are five well-made, sixty-second games with a number at the end that you can try to beat. That is a good reason to play them. If they also nudge your attention on a foggy morning, take it as a bonus rather than the point.</p>
`,
    faq: [
      {
        q: "How long does each game take?",
        a: "About a minute. Reflex and Color Clash are 60-second runs, Scan 25 is usually 20 to 60 seconds a level, and Echo lasts as long as you keep remembering.",
      },
      {
        q: "What is a good Schulte table time?",
        a: "For a 5×5 grid, under 30 seconds is solid and under 20 is fast. Your own trend over a week is far more meaningful than any published average, since screen size and input method change the numbers a lot.",
      },
      {
        q: "Do these games make you smarter?",
        a: "They make you better at these games. Evidence that training on tasks like these transfers to general intelligence is weak and contested, and we would rather say so than sell you otherwise.",
      },
    ],
    related: ["all-games", "logic-puzzle-games", "arcade-games"],
    cta: {
      title: "Take a 60-second test",
      text: "Five short games, each ending in a number. Free, no account, and your history stays on your device.",
      label: "▶ Play now",
      href: "../../play/",
    },
  },

  {
    slug: "arcade-games",
    eyebrow: "Game Guide",
    title: "Arcade Games in Go Brain: Seven One-Thumb Classics 🎮",
    seoTitle: "Free Arcade Games Online — Snake, Brick Breaker &amp; More",
    metaDesc:
      "Seven free arcade games you can play with one thumb: Snake, a doodle-jumper, brick breaker, block stacker, a 2048-style dropper, flappy and a bubble shooter.",
    excerpt:
      "Snake, a doodle-jumper, brick breaker, a stacker, a tile-merger, flappy and a bubble shooter. No rules to learn, just a score to beat.",
    date: "2026-08-10",
    readMin: 5,
    image: "snake",
    lead:
      "Sometimes you don't want to deduce anything. Seven of the games in Go Brain are pure arcade: one input, no instructions needed, a score that goes up until it doesn't.",
    toc: [
      { id: "list", label: "The seven" },
      { id: "why", label: "Why arcade games still work" },
      { id: "scores", label: "Chasing a score" },
    ],
    body: `
          <h2 id="list">The seven</h2>
          <p><strong><a href="../snake-game-online/">Snake</a></strong> — swipe to steer, eat to grow, don't hit yourself. A 17×17 grid, endless. The classic that shipped on every Nokia, and still one of the purest difficulty curves ever designed: the game gets harder because <em>you</em> got better.</p>
          <p><strong><a href="../sky-jump-endless-jumper/">Sky Jump</a></strong> — tilt or swipe to steer a blob bouncing up an endless tower of platforms. Three platform types, no ceiling.</p>
          <p><strong><a href="../bounce-brick-breaker/">Bounce</a></strong> — aim a volley of balls at a wall of bricks that creeps down one row per turn. The good shots are the ones that wedge a ball into a pocket and let it ricochet fifteen times.</p>
          <p><strong><a href="../stacker-tower-game/">Stacker</a></strong> — tap to drop a moving block onto the stack. Overhang gets sliced off, so a sloppy stack narrows until it's one pixel wide and hope is gone.</p>
          <p><strong><a href="../merge-drop-tile-merge-game/">Merge Drop</a></strong> — drop numbered tiles into five columns; equal tiles touching merge into their double, and the cascades chain. The arcade cousin of a sliding tile puzzle.</p>
          <p><strong><a href="../flap-tap-to-fly-game/">Flap</a></strong> — tap to flap, thread the gaps. Built on PixiJS. Still infuriating, in the way it was designed to be.</p>
          <p><strong><a href="../bubbo-bubble-shooter/">Bubbo Bubbo</a></strong> — a bubble shooter with 60 levels plus an endless mode, from the PixiJS open-games collection.</p>

          <h2 id="why">Why arcade games still work</h2>
          <p>The good ones share a shape: you understand the rules in under three seconds, the run is short enough that failure costs nothing, and the failure is always legibly your fault. Nobody loses at Snake and blames the game.</p>
          <p>That combination — instant comprehension, cheap failure, clear attribution — is why a design from 1976 still holds up on a phone in 2026. It is also why they're the right thing to open when you have four minutes and no appetite for learning anything.</p>

          <h2 id="scores">Chasing a score</h2>
          <p>Each of these tracks a personal best on your device, and several post to a shared leaderboard if you've set a name. There is no energy system, no wait timer, and no ad between runs — when you die you are back on the board immediately, which is the only correct way to build one of these.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Do the arcade games have ads between runs?",
        a: "No. There are no ads anywhere in the hub, and when a run ends you go straight back to the board.",
      },
      {
        q: "Can I play these with one hand?",
        a: "All seven are designed for one thumb — a tap, a swipe, or a drag. Snake and Sky Jump also take arrow keys on a desktop.",
      },
    ],
    related: ["all-games", "brain-training-games", "logic-puzzle-games"],
    cta: {
      title: "Beat a score",
      text: "Seven arcade games, no ads, no energy meter, instant restart. Free and offline-capable.",
      label: "▶ Play now",
      href: "../../play/",
    },
  },

  {
    slug: "casual-puzzle-card-games",
    eyebrow: "Game Guide",
    title: "Casual Puzzle &amp; Card Games: Pour, Block Fit, Solitaire 🃏",
    seoTitle: "Free Casual Puzzle Games — Water Sort, Block Fit &amp; Solitaire",
    metaDesc:
      "Three low-pressure games for when you want your hands busy and your brain idling: water sort, an 8×8 block fitter, and Klondike solitaire. Free, no sign-up.",
    excerpt:
      "Water sort, an 8×8 block fitter and Klondike solitaire — three games for when you want your hands busy and your brain mostly idle.",
    date: "2026-08-10",
    readMin: 4,
    image: "pour",
    lead:
      "Not everything has to be a workout. Three games in the hub are built for the state where you want something to do with your hands while you think about something else entirely.",
    toc: [
      { id: "pour", label: "Pour — water sort" },
      { id: "blocks", label: "Block Fit" },
      { id: "solitaire", label: "Solitaire" },
      { id: "why", label: "Why low-pressure games earn their place" },
    ],
    body: `
          <h2 id="pour">Pour — water sort</h2>
          <p>Tubes of coloured liquid, poured one into another until each tube holds a single colour. You can only pour onto a matching colour or into an empty tube.</p>
          <p>99 levels, and the difficulty comes entirely from how many spare tubes you have. With two spares it's a gentle shuffle; with one it becomes a real planning puzzle, because every pour you make forecloses another. Undo is unlimited. <a href="../water-sort-puzzle-pour/">Full guide →</a></p>

          <h2 id="blocks">Block Fit</h2>
          <p>An 8×8 board and three pieces at a time. Place them anywhere they fit — no gravity, no rotation — and clearing a full row or column removes it.</p>
          <p>The absence of rotation is the design decision that makes it. You can't wriggle out of a bad board with a clever spin; you have to have left the right hole open three moves ago. 21 piece shapes. <a href="../block-fit-puzzle/">Full guide →</a></p>

          <h2 id="solitaire">Solitaire</h2>
          <p>Klondike, draw one. Build four foundations from ace to king, endless deals.</p>
          <p>Draw-one is the forgiving variant, which is deliberate — this is the version you play while listening to something, not the version you play to suffer. Roughly four out of five Klondike deals are winnable in principle; whether <em>you</em> win them is another question. <a href="../klondike-solitaire-online/">Full guide →</a></p>

          <h2 id="why">Why low-pressure games earn their place</h2>
          <p>There's a real difference between a game that demands your full attention and one that gives your hands a job. The second kind is what most people actually want at 11pm, and pretending otherwise is how puzzle apps end up feeling like homework.</p>
          <p>None of these three have a timer. None of them can be failed in a way that costs you progress. Pour and Block Fit have unlimited undo; Solitaire deals you a new hand whenever you want one.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Is every water sort level solvable?",
        a: "Yes. Levels are generated by shuffling from a solved state, so a solution always exists — and undo is unlimited if you paint yourself into a corner.",
      },
      {
        q: "Which solitaire variant is this?",
        a: "Klondike with draw one, the most common and most forgiving variant.",
      },
    ],
    related: ["all-games", "logic-puzzle-games", "arcade-games"],
    cta: {
      title: "Unwind with one",
      text: "Three games with no timer and no way to lose progress. Free, no account, works offline.",
      label: "▶ Play now",
      href: "../../play/",
    },
  },

  {
    slug: "brandable-games-for-marketers",
    eyebrow: "For Brands",
    title: "Brandable Games: Turn a Campaign Into Something People Play 📣",
    seoTitle: "Brandable HTML5 Games for Marketing Campaigns — Go Brain SDK",
    metaDesc:
      "Two white-label HTML5 games you can skin with your products, mascot and colours: a memory match with coupon unlock, and an endless runner with a leaderboard.",
    excerpt:
      "Two white-label games built for campaigns rather than players: a memory match that ends in a coupon, and an endless runner with your mascot in it.",
    date: "2026-08-10",
    readMin: 4,
    image: "memory",
    lead:
      "Most of the hub is built for players. Two of the games are built for marketers: white-label HTML5 games you can skin with your own products, mascot and colours, drop into a landing page, and run for the length of a campaign.",
    toc: [
      { id: "memory", label: "Brand memory match" },
      { id: "runner", label: "Branded endless runner" },
      { id: "how", label: "How you'd actually ship one" },
      { id: "honest", label: "When this is the wrong idea" },
    ],
    body: `
          <h2 id="memory">Brand memory match</h2>
          <p>A card-flip memory game where the cards are your products. Players see each product two or three times while hunting for pairs, which is the entire point — it's product exposure disguised as a game people will voluntarily finish.</p>
          <p>Completing the board can unlock a coupon code, which gives you a natural place to ask for an email if you want one.</p>

          <h2 id="runner">Branded endless runner</h2>
          <p>Your mascot dashes, dodges obstacles and collects your product as pickups. Endless, score-based, with a leaderboard — which is the part that does the work, because a leaderboard is a reason to send the link to a colleague.</p>

          <h2 id="how">How you'd actually ship one</h2>
          <ol>
            <li>Send us your assets: product images, mascot, brand colours, and the copy for the win screen.</li>
            <li>We build the themed bundle. It's a self-contained HTML5 game — one folder, no server needed.</li>
            <li>Drop it on your own domain, or embed it in an existing page with an iframe. See the <a href="../../sdk/">SDK page</a> for the embed contract.</li>
            <li>Point your campaign at it. It works on any phone from roughly 2018 onwards, and keeps working on a bad conference-hall connection once it has loaded.</li>
          </ol>

          <h2 id="honest">When this is the wrong idea</h2>
          <p>Worth saying plainly: a branded game is not a growth strategy on its own. It works when you already have traffic to point at it — an event, a mailing list, a retail moment, a launch — and you want that traffic to spend ninety seconds with your product instead of three.</p>
          <p>It works badly as a standalone acquisition play. Nobody searches for your brand's memory game.</p>
          <p>If you have the traffic and want the ninety seconds, get in touch through <a href="../../support/">support</a> or read the <a href="../../sdk/">SDK docs</a>.</p>
`,
    faq: [
      {
        q: "Can the game be hosted on our own domain?",
        a: "Yes. Each game builds to a self-contained folder of static files — no server, no runtime dependency on us. Host it wherever you host anything else.",
      },
      {
        q: "Does it collect player data?",
        a: "Only what you configure. The memory match can gate a coupon behind an email if you want lead capture; leave that off and it collects nothing.",
      },
      {
        q: "How old a phone will it run on?",
        a: "The bundles target iOS 12 and equivalent Android, so roughly a 2018 device and newer.",
      },
    ],
    related: ["all-games", "arcade-games"],
    cta: {
      title: "Talk to us",
      text: "Tell us about the campaign and we'll tell you honestly whether a game fits it.",
      label: "Read the SDK docs",
      href: "../../sdk/",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // Logic & deduction
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "sudoku-online-free",
    eyebrow: "Brain Games",
    title: "Sudoku Online: How to Play and How to Get Faster 🔢",
    seoTitle: "Free Sudoku Online — 4 Difficulties, No Sign-Up, Plays Offline",
    metaDesc:
      "Play Sudoku free in your browser: four difficulties, pencil marks, unlimited undo and a hint that explains itself. No account, no ads, works offline.",
    excerpt:
      "Four difficulties, pencil marks, and a hint that teaches instead of just filling a square. Plus the three techniques that get you past Easy.",
    date: "2026-08-10",
    readMin: 6,
    image: "sudoku",
    lead:
      "Sudoku is the puzzle everyone has heard of and most people play slightly wrong — filling in the obvious cells, then stalling and guessing. The gap between stalling and solving is about three techniques. Here they are.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "technique", label: "Three techniques that unstick a board" },
      { id: "marks", label: "Pencil marks, properly" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>A 9×9 grid, split into nine 3×3 boxes. Fill every cell with a digit from 1 to 9 so that no digit repeats in any row, any column, or any box. That's it. There is exactly one valid completion of a well-made puzzle, and you never need to guess to find it.</p>

          <h2 id="technique">Three techniques that unstick a board</h2>
          <p><strong>1. Scanning (the one you already do).</strong> Pick a digit, say 7. Look at the three boxes in a band, cross out rows and columns that already contain a 7, and see whether any box has only one cell left. This clears Easy boards on its own and Medium boards partway.</p>
          <p><strong>2. The naked single vs the hidden single.</strong> These are different and the second one is where most people leave value on the table. A <em>naked</em> single is a cell where only one digit fits — you find it by looking at the cell. A <em>hidden</em> single is a digit that fits in only one cell of a row, column or box, even though that cell could also hold other digits. You find it by looking at the <em>unit</em>, not the cell. Most stalls happen because someone is only hunting naked singles.</p>
          <p><strong>3. The naked pair.</strong> If two cells in the same unit can only hold, say, {4,8} and {4,8}, then between them they use up both digits — so 4 and 8 can be eliminated from every other cell in that unit. You haven't placed anything, but you've often unlocked three placements elsewhere. This is the technique that takes you into Hard.</p>
          <p>Beyond this there are pointing pairs, box-line reduction and X-wings, but honestly: pairs plus disciplined hidden-single hunting will finish almost everything we ship below Expert.</p>

          <h2 id="marks">Pencil marks, properly</h2>
          <p>The mistake is marking everything everywhere. A grid with every candidate written in all 60 empty cells is unreadable, and you end up scanning your own notes instead of the board.</p>
          <p>Better: mark a unit only when you're actively working it. Fill in candidates for one row, find what it gives you, then move on. Notes are a tool for the deduction you are making right now, not a record you maintain.</p>

          <h2 id="ours">About our version</h2>
          <p>Four difficulties, from a board you'll finish over one coffee to one that will take a genuine sitting. Every puzzle is generated with a solver in the loop and verified to have exactly one solution — no board here can be finished two different ways, and none of them can only be finished by guessing.</p>
          <p>Notes mode, unlimited undo, mistake highlighting you can turn off, and a hint that shows you the cell and the reason rather than just dropping a digit in.</p>
          <p>${FREE} Your progress and your best times stay on your device.</p>
`,
    faq: [
      {
        q: "Is Sudoku maths?",
        a: "No. The digits are just nine distinct symbols — you could play with nine colours and nothing would change. There is no arithmetic in Sudoku at all.",
      },
      {
        q: "Does a Sudoku puzzle ever need guessing?",
        a: "A well-made one never does. Every board we ship is verified to have a single solution reachable by logic, so if you are guessing there is a deduction you haven't spotted yet.",
      },
      {
        q: "How long should a Sudoku take?",
        a: "Easy boards run five to ten minutes for most people, Hard ones twenty to forty. Speed comes from pattern recognition, so it drops fast over the first couple of weeks and then plateaus.",
      },
    ],
    related: ["killer-sudoku-cages", "kakuro-online-free", "logic-puzzle-games"],
    cta: play("sudoku", "Sudoku", "Four difficulties, verified single solutions, notes and undo. Free, no account."),
  },

  {
    slug: "kakuro-online-free",
    eyebrow: "Brain Games",
    title: "Kakuro: The Cross-Sum Puzzle Worth Learning 🔢",
    seoTitle: "Play Kakuro Online Free — 99 Levels, Cross-Sum Puzzle",
    metaDesc:
      "Kakuro is a crossword built from sums. Learn the rules, the magic combinations that crack a board open, and play 99 free levels with notes, hints and undo.",
    excerpt:
      "A crossword made of sums. Steeper than Sudoku, more satisfying, and the entire game opens up once you memorise about six number combinations.",
    date: "2026-08-10",
    readMin: 7,
    image: "kakuro",
    lead:
      "Kakuro is what happens when a crossword is made of numbers. It is more demanding than Sudoku and, for a lot of people who bounce off Sudoku's repetitiveness, considerably more interesting. It is also nearly unknown outside Japan, which is a shame.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "magic", label: "The magic combinations" },
      { id: "cross", label: "Working the intersections" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>You have a grid of black and white cells. Black cells carry clues — a number in the top-right for the run of white cells to its right, a number in the bottom-left for the run going down.</p>
          <p>Fill every white cell with a digit from <strong>1 to 9</strong> so that:</p>
          <ul>
            <li>each run of white cells adds up to its clue, and</li>
            <li><strong>no digit repeats within a run</strong>.</li>
          </ul>
          <p>That second rule is the engine of the whole game. Zero is never used.</p>

          <h2 id="magic">The magic combinations</h2>
          <p>Because digits can't repeat, some clues have exactly one possible set of digits. These are the footholds, and knowing about six of them changes the game completely:</p>
          <table>
            <thead><tr><th>Clue</th><th>Cells</th><th>Only possible digits</th></tr></thead>
            <tbody>
              <tr><td>3</td><td>2</td><td>1, 2</td></tr>
              <tr><td>4</td><td>2</td><td>1, 3</td></tr>
              <tr><td>16</td><td>2</td><td>7, 9</td></tr>
              <tr><td>17</td><td>2</td><td>8, 9</td></tr>
              <tr><td>6</td><td>3</td><td>1, 2, 3</td></tr>
              <tr><td>7</td><td>3</td><td>1, 2, 4</td></tr>
              <tr><td>23</td><td>3</td><td>6, 8, 9</td></tr>
              <tr><td>24</td><td>3</td><td>7, 8, 9</td></tr>
              <tr><td>10</td><td>4</td><td>1, 2, 3, 4</td></tr>
              <tr><td>30</td><td>4</td><td>6, 7, 8, 9</td></tr>
            </tbody>
          </table>
          <p>The pattern is simple enough to reconstruct rather than memorise: the smallest and largest few sums for any run length are forced, because there is only one way to be that extreme.</p>

          <h2 id="cross">Working the intersections</h2>
          <p>Every foothold is only useful where two runs cross. Suppose an across-run of 17 in two cells (so {8,9}) meets a down-run of 4 in two cells (so {1,3}). The shared cell has to be in both sets — and the sets don't overlap, which means you've proved that layout impossible and can look elsewhere.</p>
          <p>More usefully, when a 16-in-2 ({7,9}) crosses a 6-in-3 ({1,2,3}), the intersection is empty as well. When a 16-in-2 crosses a 23-in-3 ({6,8,9}), the shared cell must be 9. That is the whole game: two constraint sets, one shared cell, and whatever survives the intersection.</p>
          <p>From there you use the same eliminations you'd use in Sudoku. A digit that can only go in one cell of a run is placed, and a pair of cells that share the same two candidates locks those digits out of the rest of the run.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels on a curve that starts at 5×5 and grows to 10×10. Every level is generated with a solver in the loop and verified to have exactly one solution — when the generator finds a board with two, it promotes a differing cell into a clue and re-checks, which kills the rival solution rather than throwing the board away.</p>
          <p>Notes for candidate digits, unlimited undo, and hints. Six languages including Arabic with a right-to-left layout.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Is Kakuro harder than Sudoku?",
        a: "Steeper to start, yes, because you need the sum combinations before anything opens up. Once you have those, a mid-difficulty Kakuro plays at about the same level as a hard Sudoku.",
      },
      {
        q: "Can a digit repeat in Kakuro?",
        a: "Not within a single run. It can absolutely appear again in a different run, including one that crosses it — the no-repeat rule is per run, not per row of the whole grid.",
      },
      {
        q: "Do I need to be good at arithmetic?",
        a: "Barely. The sums are small and you'll end up recognising combinations rather than adding. It's a logic puzzle wearing arithmetic as a costume.",
      },
    ],
    related: ["sudoku-online-free", "killer-sudoku-cages", "logic-puzzle-games"],
    cta: play("kakuro", "Kakuro", "99 levels, verified single solutions, notes and hints. Free, no account, works offline."),
  },

  {
    slug: "killer-sudoku-cages",
    eyebrow: "Brain Games",
    title: "Cages: Killer Sudoku Explained (and How to Open One) 🔢",
    seoTitle: "Killer Sudoku Online Free — Cages, 99 Levels, No Sign-Up",
    metaDesc:
      "Killer Sudoku adds cages with sums to the classic rules. Learn the rule of 45, cage combinations, and play 99 free levels with notes, undo and hints.",
    excerpt:
      "Sudoku with sums bolted on. The cages look like extra work but they're a gift — they let you start deducing before a single digit is on the board.",
    date: "2026-08-10",
    readMin: 6,
    image: "cages",
    lead:
      "Killer Sudoku takes a Sudoku grid, removes almost all the starting digits, and replaces them with dotted cages that each have to add up to a number. It sounds harder. In practice the cages give you a way in that plain Sudoku never does.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "45", label: "The rule of 45" },
      { id: "combos", label: "Cage combinations" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>All the normal Sudoku rules apply: 1–9 once per row, column and 3×3 box. On top of that, the grid is divided into dotted <strong>cages</strong>. The digits in a cage must add up to the small number printed in its corner, and <strong>no digit repeats inside a cage</strong>.</p>

          <h2 id="45">The rule of 45</h2>
          <p>This is the technique that makes Killer Sudoku click, and it's almost too simple.</p>
          <p>Every row, column and box contains 1 through 9 exactly once. So every row, column and box sums to <strong>45</strong>.</p>
          <p>Now look at a box where three cages sit entirely inside it and a fourth cage pokes out by one cell. Add the three inside cages, add the poking cage, subtract 45, and you have the value of the cell sticking out. One arithmetic step, one placed digit, no candidate analysis at all.</p>
          <p>The same works across two or three boxes (sum 90 or 135), which is how you crack the hard boards.</p>

          <h2 id="combos">Cage combinations</h2>
          <p>Same idea as Kakuro: some cages have only one possible digit set.</p>
          <ul>
            <li><strong>3 in 2 cells</strong> → 1+2. <strong>4 in 2</strong> → 1+3. <strong>16 in 2</strong> → 7+9. <strong>17 in 2</strong> → 8+9.</li>
            <li><strong>6 in 3</strong> → 1+2+3. <strong>7 in 3</strong> → 1+2+4. <strong>23 in 3</strong> → 6+8+9. <strong>24 in 3</strong> → 7+8+9.</li>
          </ul>
          <p>A 17-in-2 cage sitting in a box immediately removes 8 and 9 from every other cell in that box, which is usually worth more than a placed digit.</p>
          <p>One more that catches people out: a cage that lies entirely within one row and one box can't repeat digits — but a cage that spans two boxes still can't repeat either, because the no-repeat rule is a property of the cage, not of the region it sits in.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels with a difficulty curve that grows the number of cages and shrinks the given digits. Notes, unlimited undo, hints, and cage sums that stay readable on a phone. Every board is verified to have exactly one solution.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What's the difference between Killer Sudoku and normal Sudoku?",
        a: "Killer Sudoku starts with almost no given digits. Instead it has dotted cages with target sums, and no digit may repeat inside a cage. All the usual row, column and box rules still apply.",
      },
      {
        q: "Can a digit repeat inside a cage?",
        a: "No, never — even if the cage spans two boxes.",
      },
      {
        q: "Where do I start on a Killer Sudoku?",
        a: "Look for two-cell cages with extreme sums (3, 4, 16, 17) and for boxes where the cages almost tile the box, so the rule of 45 gives you a cell outright.",
      },
    ],
    related: ["sudoku-online-free", "kakuro-online-free", "logic-puzzle-games"],
    cta: play("cages", "Cages", "Killer Sudoku, 99 levels, verified single solutions. Free, no account, plays offline."),
  },

  {
    slug: "crowns-queens-puzzle",
    eyebrow: "Brain Games",
    title: "Crowns: The One-Per-Region Puzzle You'll Finish in Five Minutes 👑",
    seoTitle: "Crowns Puzzle Online Free — One Crown Per Row, Column &amp; Region",
    metaDesc:
      "Place one crown in every row, column and colour region with none touching. Simple rule, deep deduction. 99 free levels with undo and hints, no sign-up.",
    excerpt:
      "One rule you can learn in ten seconds, and deduction chains that run five steps deep. The best entry point into logic puzzles we have.",
    date: "2026-08-10",
    readMin: 5,
    image: "crowns",
    lead:
      "If you want to know whether you like logic puzzles, play Crowns. The rule fits in one sentence, the first level takes a minute, and by level thirty you are doing genuine multi-step deduction without anyone having taught you a technique.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "how", label: "How to actually solve one" },
      { id: "touch", label: "The no-touching rule is the whole game" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>A grid split into coloured regions. Place crowns so that:</p>
          <ul>
            <li>every <strong>row</strong> has exactly one crown,</li>
            <li>every <strong>column</strong> has exactly one crown,</li>
            <li>every <strong>colour region</strong> has exactly one crown, and</li>
            <li><strong>no two crowns touch</strong> — not side by side, not diagonally.</li>
          </ul>

          <h2 id="how">How to actually solve one</h2>
          <p>The productive move is almost never "where does a crown go" — it's "where can a crown <em>not</em> go". Mark cells out aggressively.</p>
          <p><strong>Start with the small regions.</strong> A region that only occupies two rows must use one of them, which tells you something about the other rows before you've placed anything.</p>
          <p><strong>Then use the pigeonhole.</strong> If two regions together only touch two columns, those two regions consume both of those columns — so every other region can be marked out of them. This is the single highest-value pattern in the game, and it's the same argument as a naked pair in Sudoku wearing different clothes.</p>
          <p><strong>Then place.</strong> A region with only one unmarked cell left gets the crown, and placing it marks out its whole row, its whole column and all eight neighbours — which usually cascades.</p>

          <h2 id="touch">The no-touching rule is the whole game</h2>
          <p>Without it, this is a mildly interesting placement puzzle. With it, every crown you place removes up to eight extra cells, and it's the diagonal exclusions that produce the long chains. When you're stuck, check the diagonals — that's where the missed deduction usually is.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels growing from small grids to large ones with awkward region shapes. Tap once to mark a cell out, twice to place a crown. Unlimited undo, hints, and every board verified to have exactly one solution.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Is Crowns the same as the N-Queens problem?",
        a: "It's a cousin. N-Queens forbids sharing a diagonal at any distance; Crowns only forbids touching diagonally, and adds the colour-region constraint. That swap is what turns it from a maths exercise into a puzzle you can solve by hand.",
      },
      {
        q: "Can two crowns be diagonally adjacent?",
        a: "No. Crowns may not touch at all, including corner to corner.",
      },
      {
        q: "Is there always one solution?",
        a: "Yes. Every level is generated and verified to have exactly one valid arrangement, so you never need to guess.",
      },
    ],
    related: ["tango-suns-moons-puzzle", "logic-puzzle-games", "minesweeper-no-guess"],
    cta: play("crowns", "Crowns", "99 levels, one rule to learn, verified single solutions. Free and offline-capable."),
  },

  {
    slug: "nonogram-picross-online",
    eyebrow: "Brain Games",
    title: "Nonogram: How to Solve Picross Puzzles 🖼️",
    seoTitle: "Play Nonogram (Picross) Online Free — 99 Levels, No Sign-Up",
    metaDesc:
      "Nonogram puzzles turn number clues into pictures. Learn overlapping, edge forcing and line completion, then play 99 free levels with undo and hints.",
    excerpt:
      "Number clues along the edges, a picture hiding in the middle. Learn the overlap technique and you can start any board with confidence.",
    date: "2026-08-10",
    readMin: 6,
    image: "nonogram",
    lead:
      "Nonograms — also called Picross, Griddlers or Hanjie — are the friendliest way into logic puzzles, because the reward is visual. You are not filling in digits; you are developing a photograph one deduction at a time.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "overlap", label: "The overlap technique" },
      { id: "edges", label: "Edge forcing and completion" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Numbers run along the top and the left of the grid. They describe the <strong>runs of filled cells</strong> in that column or row, in order, with at least one blank between consecutive runs.</p>
          <p>A row clue of <code>4 2</code> in a 10-wide grid means: a block of four filled cells, then at least one blank, then a block of two. Your job is to work out where.</p>

          <h2 id="overlap">The overlap technique</h2>
          <p>This is the one that lets you start any board without guessing, and it's worth understanding properly.</p>
          <p>Take a row of 10 with the single clue <code>7</code>. Slide that block of seven as far left as it goes: it covers cells 1–7. Slide it as far right: it covers cells 4–10. Every position it could possibly occupy includes cells <strong>4, 5, 6 and 7</strong> — so those four are filled, no matter what.</p>
          <p>The rule generalises: <em>overlap = run length − (line length − sum of all clues and mandatory gaps)</em>. In practice you don't compute it, you just imagine the block pushed to each end and fill whatever both positions share. Any clue larger than half the line gives you something.</p>

          <h2 id="edges">Edge forcing and completion</h2>
          <p><strong>Edge forcing.</strong> If the first cell of a row is filled and the first clue is 3, then cells 1, 2 and 3 are filled and cell 4 is definitely blank. Anchoring at an edge removes all the ambiguity from that clue.</p>
          <p><strong>Completion.</strong> Once a line's runs are all placed, every remaining cell in it is blank — mark them. Marking blanks is not busywork; those crosses are what let the perpendicular lines resolve. Players who only fill cells and never mark blanks stall constantly.</p>
          <p><strong>Alternate directions.</strong> Work a row, then work the columns it just constrained, then come back. A nonogram unlocks in waves, and staying in one direction wastes them.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels growing from 5×5 to larger grids, each one an actual recognisable picture rather than noise. Tap to fill, long-press or switch mode to mark a blank. Unlimited undo, hints, and a solver-verified single solution on every board.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What's the difference between a nonogram and Picross?",
        a: "Nothing — they're the same puzzle. Picross is Nintendo's name for it, and Griddlers and Hanjie are two more. We call ours Nonogram.",
      },
      {
        q: "Do nonograms require guessing?",
        a: "Well-made ones don't. Every board here has a single solution reachable by logic; if you're stuck, there's a line where the overlap or a completed perpendicular gives you the next cell.",
      },
      {
        q: "Why should I mark the blank cells?",
        a: "Because the crosses are what let crossing lines resolve. A cell you know is empty is exactly as informative as a cell you know is filled, and skipping them is the most common reason people stall.",
      },
    ],
    related: ["shikaku-patch-puzzle", "logic-puzzle-games", "minesweeper-no-guess"],
    cta: play("nonogram", "Nonogram", "99 picture puzzles, undo and hints, verified single solutions. Free, no account."),
  },

  {
    slug: "minesweeper-no-guess",
    eyebrow: "Brain Games",
    title: "Minesweeper Without the Coin Flips 💣",
    seoTitle: "Play Minesweeper Online Free — No-Guess Boards, No Sign-Up",
    metaDesc:
      "Classic Minesweeper with the 50/50 guesses engineered out: every board is solvable by logic alone. Learn the 1-2-1 pattern and play free, no account needed.",
    excerpt:
      "Everyone has lost a Minesweeper game to a coin flip. Ours generates boards that can always be cleared by reasoning — plus the two patterns worth memorising.",
    date: "2026-08-10",
    readMin: 5,
    image: "mines",
    lead:
      "The great flaw in Minesweeper, the one that has quietly annoyed people since 1990, is that a board can back you into a genuine 50/50 guess after ten minutes of correct play. We took that out. Every board here is solvable by reasoning from the numbers.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "counting", label: "Counting, and the two patterns" },
      { id: "noguess", label: "What 'no-guess' actually means" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>A grid with mines hidden in it. Reveal a cell and it shows how many mines touch it, counting all eight neighbours. Reveal every safe cell to win; reveal a mine and it's over. Flag cells you've deduced are mines so you don't misclick them.</p>

          <h2 id="counting">Counting, and the two patterns</h2>
          <p>Two rules do almost all the work:</p>
          <ul>
            <li>If a number equals the count of unrevealed cells around it, <strong>all of them are mines</strong>. Flag them.</li>
            <li>If a number equals the count of flags already around it, <strong>every other neighbour is safe</strong>. Open them.</li>
          </ul>
          <p>Alternating these two clears most of a board. When they run out, two patterns are worth recognising on sight:</p>
          <p><strong>The 1-2-1.</strong> Three cells reading 1, 2, 1 along a revealed edge, with three unknowns below them. The mines are under the two 1s, and the cell under the 2 is safe. Every time.</p>
          <p><strong>The 1-1 reduction.</strong> Two adjacent 1s along an edge. The left 1 sees cells A and B; the right 1 sees B and C. The left 1's mine is in {A,B}. Since the right 1 also covers B, if the mine were at C the left 1 would be unsatisfied — so C is safe. This "subtract the shared cells" argument generalises to any two overlapping numbers and is the technique that separates people who finish Expert boards from people who don't.</p>

          <h2 id="noguess">What "no-guess" actually means</h2>
          <p>It doesn't mean the board is easy. It means that at every point in a correct playthrough, there exists at least one cell you can prove is safe. You may have to look hard for it — the proof might need three overlapping numbers — but it's there.</p>
          <p>We do this by running a solver against each candidate board as it's generated. If the solver reaches a point where no cell can be proven safe, the board is rejected and regenerated. So a loss here is genuinely a mistake, which is the whole point: the frustration should come from your reasoning, not from the dice.</p>

          <h2 id="ours">About our version</h2>
          <p>Multiple board sizes, flag mode for touchscreens, a first-click that is always safe, and a timer if you want one. Long-press to flag, or toggle the mode button if you prefer tapping.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Is Minesweeper solvable without guessing?",
        a: "The classic random version is not — it can produce genuine 50/50 situations. Ours rejects those boards at generation time, so every level here can be cleared by logic alone.",
      },
      {
        q: "Is the first click always safe?",
        a: "Yes. The board is arranged so your opening click never hits a mine.",
      },
      {
        q: "What is the 1-2-1 pattern?",
        a: "Three numbers reading 1, 2, 1 along a revealed edge with three unknown cells beneath. The mines sit under the two 1s and the middle cell is safe — one of the few patterns you can act on instantly.",
      },
    ],
    related: ["crowns-queens-puzzle", "nonogram-picross-online", "logic-puzzle-games"],
    cta: play("mines", "Mines", "No-guess boards, first click always safe, multiple sizes. Free, no account, plays offline."),
  },

  {
    slug: "tango-suns-moons-puzzle",
    eyebrow: "Brain Games",
    title: "Tango: The Suns and Moons Balance Puzzle ☀️🌙",
    seoTitle: "Tango Puzzle Online Free — Suns &amp; Moons Logic Game",
    metaDesc:
      "Fill a 6×6 grid with suns and moons: three of each per line, never three in a row. Learn the two core deductions and play 99 free levels, no sign-up.",
    excerpt:
      "Two symbols, two rules, and more depth than that has any right to produce. The binary-puzzle format at its most approachable.",
    date: "2026-08-10",
    readMin: 5,
    image: "tango",
    lead:
      "Tango belongs to the family of binary puzzles — grids where every cell is one of two symbols and the constraints do all the work. It is the fastest of our logic puzzles to learn and, on the later levels, far from the easiest to finish.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "core", label: "The two deductions you need" },
      { id: "clues", label: "Equals and cross clues" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Fill every cell of a 6×6 grid with a sun or a moon, so that:</p>
          <ul>
            <li>each row and column has <strong>three of each</strong>, and</li>
            <li>no <strong>three identical symbols in a row</strong>, horizontally or vertically.</li>
          </ul>
          <p>Some cells start filled, and some pairs of neighbouring cells carry a clue: <strong>=</strong> means they match, <strong>×</strong> means they differ.</p>

          <h2 id="core">The two deductions you need</h2>
          <p><strong>Sandwich.</strong> Two identical symbols with a gap between them — sun, blank, sun — force a moon in the gap. Three suns in a row is illegal, so the middle can't be a sun. This is the single most common move in the game.</p>
          <p><strong>Pair extension.</strong> Two identical symbols side by side force the opposite symbol at <em>both</em> ends. Sun-sun means the cell before and the cell after are both moons. People reliably remember one end and forget the other.</p>
          <p>Add the counting rule — once a line already has its three suns, every remaining cell in it is a moon — and you have everything the early levels need.</p>

          <h2 id="clues">Equals and cross clues</h2>
          <p>The clue markers are what make the harder boards work. An <strong>=</strong> between two cells means whatever you deduce about one applies immediately to the other, which effectively glues them into a single unit for the counting rule: an = pair uses up two of a line's three slots at once.</p>
          <p>A <strong>×</strong> pair always contributes exactly one sun and one moon to its line, which is often the deduction that finishes a row: if a row has one known sun and an × pair, the remaining free cells are forced.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels on a curve that reduces the number of starting cells and clue markers as you climb. Tap a cell to cycle sun, moon, empty. Unlimited undo, hints, and every board verified to have a single solution.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Can there be three suns in a row?",
        a: "Never — not horizontally and not vertically. Two in a row is fine, and in fact pairs are what most deductions hang off.",
      },
      {
        q: "What do the = and × symbols mean?",
        a: "They sit between two neighbouring cells. = means the two cells hold the same symbol; × means they hold different ones.",
      },
      {
        q: "Is Tango the same as Binairo or Takuzu?",
        a: "It's the same family. The three-of-each and no-three-in-a-row rules are shared; the = and × clue markers are what distinguish this variant.",
      },
    ],
    related: ["crowns-queens-puzzle", "logic-puzzle-games", "sudoku-online-free"],
    cta: play("tango", "Tango", "99 levels, two rules, verified single solutions. Free, no account, plays offline."),
  },

  {
    slug: "zip-one-line-path-puzzle",
    eyebrow: "Brain Games",
    title: "Zip: Draw One Line Through Every Cell 🧩",
    seoTitle: "Zip Puzzle Online Free — One-Line Path Through Every Cell",
    metaDesc:
      "Draw a single unbroken path that visits every cell and hits the numbers in order. Learn the corner and parity tricks, play 99 free levels, no sign-up.",
    excerpt:
      "One line, every cell, numbers in order. A Hamiltonian path puzzle that looks like doodling and plays like deduction.",
    date: "2026-08-10",
    readMin: 5,
    image: "zip",
    lead:
      "Zip asks for one continuous line that passes through every cell in the grid exactly once, touching the numbered cells in ascending order along the way. It looks like something you'd doodle in a margin. It is, underneath, a constraint problem with some very satisfying shortcuts.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "corners", label: "Start at the corners" },
      { id: "dead", label: "Dead ends and forced turns" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Drag from cell to cell to draw a path. It must:</p>
          <ul>
            <li>be a <strong>single unbroken line</strong>,</li>
            <li>pass through <strong>every cell exactly once</strong>, and</li>
            <li>reach the numbered cells in <strong>ascending order</strong>.</li>
          </ul>

          <h2 id="corners">Start at the corners</h2>
          <p>A corner cell has only two neighbours. Since the path has to enter it and leave it (unless it's an endpoint), <strong>both</strong> of those connections are forced. That's two free segments before you've thought about anything.</p>
          <p>The same logic runs along the edges: any cell where walls or already-used neighbours leave exactly two open sides has both of them forced. Working the boundary inward is almost always faster than starting from the middle.</p>

          <h2 id="dead">Dead ends and forced turns</h2>
          <p>Two eliminations do most of the remaining work.</p>
          <p><strong>Don't create an isolated cell.</strong> If a move would leave some cell with fewer than two available connections and it isn't an endpoint, that move is wrong. Scan for cells that are about to be orphaned — they veto moves several steps before the mistake becomes visible.</p>
          <p><strong>Don't close a loop early.</strong> Joining two ends of your own path before it covers every cell is fatal. On a long path this is the mistake people actually make, and it's why the undo button exists.</p>
          <p>There's also a parity argument available on rectangular grids: colour the cells like a chessboard, and a path visiting every cell alternates colours. If the two colour counts differ by more than one, no path exists at all — which tells you a great deal about where the endpoints must sit.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels, growing grids, with walls introduced partway through the curve to prune the search rather than expand it. Drag to draw, drag backwards to erase, unlimited undo. Every level is generated from a known valid path, so a solution always exists.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Does the path have to visit every single cell?",
        a: "Yes. Every cell exactly once, which is what mathematicians call a Hamiltonian path. Missing one cell means the board isn't finished.",
      },
      {
        q: "Can the path cross itself?",
        a: "No. Each cell is used once, so the line never crosses or overlaps.",
      },
      {
        q: "Where should I start?",
        a: "The corners. A corner has only two neighbours, so both of its connections are forced immediately, and the deductions spread inward from there.",
      },
    ],
    related: ["domino-fit-tiling-puzzle", "shikaku-patch-puzzle", "logic-puzzle-games"],
    cta: play("zip", "Zip", "99 path puzzles, drag to draw, unlimited undo. Free, no account, works offline."),
  },

  {
    slug: "shikaku-patch-puzzle",
    eyebrow: "Brain Games",
    title: "Patch: Shikaku, the Rectangle-Cutting Puzzle ▭",
    seoTitle: "Shikaku Puzzle Online Free — Divide the Grid Into Rectangles",
    metaDesc:
      "Cut the grid into rectangles so each holds one number equal to its area. Learn the prime-number and forced-shape tricks, play 99 free levels, no sign-up.",
    excerpt:
      "Divide the grid into rectangles, each containing one number equal to its area. Primes are your best friends here — and they tell you exactly where to start.",
    date: "2026-08-10",
    readMin: 5,
    image: "patch",
    lead:
      "Shikaku — we call it Patch — gives you a grid with numbers scattered in it and asks you to cut the whole thing into rectangles, one number per rectangle, each number equal to the area of its rectangle. It is one of the most elegant puzzle rules ever written, and it has a lovely opening move.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "primes", label: "Start with the primes" },
      { id: "squeeze", label: "Squeezing and the corner rule" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Divide the entire grid into rectangles so that:</p>
          <ul>
            <li>every rectangle contains <strong>exactly one number</strong>,</li>
            <li>that number equals the rectangle's <strong>area</strong> (width × height), and</li>
            <li>every cell belongs to exactly one rectangle — no gaps, no overlaps.</li>
          </ul>

          <h2 id="primes">Start with the primes</h2>
          <p>A number's factor pairs are its possible shapes. 12 could be 1×12, 2×6, 3×4, 4×3, 6×2 or 12×1 — six shapes, each placeable in several positions. Awful.</p>
          <p>But a <strong>prime</strong> like 7 can only be 1×7 or 7×1: a straight strip. And in a grid narrower than seven cells in one direction, even that collapses to a single orientation. Primes — 2, 3, 5, 7, 11, 13 — are where the board opens.</p>
          <p>A 2 is the best clue in the game: two cells, four possible placements, and usually a wall or a neighbouring number kills three of them.</p>

          <h2 id="squeeze">Squeezing and the corner rule</h2>
          <p><strong>The corner rule.</strong> Every corner cell of the grid must belong to some rectangle, and only a number that can reach it qualifies. Often exactly one can, which places a rectangle outright.</p>
          <p><strong>Squeezing.</strong> Two numbers near each other constrain one another, because no rectangle may contain a second number. If a 6 sits three cells from a 4 on the same row, neither can be the 1×6 or 1×4 strip that would swallow the other. Whenever you're stuck, look at pairs of numbers rather than at single ones.</p>
          <p><strong>Orphan cells.</strong> A cell that no remaining number can possibly reach means one of your placed rectangles is wrong. Checking for these catches errors early, before you've built ten rectangles on a bad foundation.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels growing from small grids to large ones. Drag to draw a rectangle, tap it to remove it, unlimited undo. Each level is generated by cutting a grid into rectangles and then deriving the clues, and verified to have a single solution.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Can a rectangle contain two numbers?",
        a: "No. Exactly one number per rectangle — that constraint is what makes nearby numbers squeeze each other into place.",
      },
      {
        q: "Do squares count as rectangles?",
        a: "Yes. A 9 can be a 3×3 square, and a 4 can be 2×2 as well as 1×4 or 4×1.",
      },
      {
        q: "Where do I start on a Shikaku?",
        a: "With the primes and with the grid's corners. Primes have only two possible shapes, and corner cells usually have exactly one number that can reach them.",
      },
    ],
    related: ["domino-fit-tiling-puzzle", "nonogram-picross-online", "logic-puzzle-games"],
    cta: play("patch", "Patch", "99 Shikaku levels, drag to cut, verified single solutions. Free, no account."),
  },

  {
    slug: "domino-fit-tiling-puzzle",
    eyebrow: "Brain Games",
    title: "Domino Fit: Tiling Puzzles and the Parity Trick 🁢",
    seoTitle: "Domino Fit Online Free — Tiling Puzzle, 99 Levels, No Sign-Up",
    metaDesc:
      "Cover the board with dominoes, no overlaps and no gaps. Learn the chessboard parity argument that kills wrong starts instantly. 99 free levels, no account.",
    excerpt:
      "Cover the board in dominoes with no gaps. There's a colouring argument that rules out half the board's dead ends before you place a single tile.",
    date: "2026-08-10",
    readMin: 5,
    image: "domino",
    lead:
      "Domino Fit is a tiling puzzle: cover a shaped board completely with 2×1 dominoes. It looks like a fitting exercise, and for the first twenty levels it is. Then it becomes a lesson in one of the prettiest arguments in recreational maths.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "parity", label: "The parity trick" },
      { id: "forced", label: "Forced cells" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Place 2×1 dominoes on the board — horizontally or vertically — until every open cell is covered. No overlaps, no gaps, no domino hanging off the edge or over a blocked cell.</p>

          <h2 id="parity">The parity trick</h2>
          <p>Colour the board like a chessboard, alternating light and dark. Every domino, wherever you put it, covers exactly <strong>one light cell and one dark cell</strong>. It cannot do otherwise.</p>
          <p>That gives you a free test: <strong>if the board doesn't have equal numbers of light and dark cells, it cannot be tiled at all.</strong> The classic demonstration is a chessboard with two opposite corners removed — both corners are the same colour, so the remaining 62 squares split 30/32 and no arrangement of 31 dominoes can cover it. No searching required; the colouring settles it.</p>
          <p>In play, you use it locally. When your placements have carved the remaining space into a region with unequal counts, that region is dead — undo back to the branch point rather than fiddling with it. Learning to <em>see</em> that imbalance is what makes the late levels tractable.</p>

          <h2 id="forced">Forced cells</h2>
          <p>The other technique is simpler: find any open cell with exactly one open neighbour. Its domino is forced. Place it, and often a new cell becomes forced next to it — these chains run surprisingly long, especially into the corners and dead-end arms of a shaped board.</p>
          <p>Between forced chains and parity checks, most levels resolve without any real trial and error.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels with boards that start rectangular and grow holes and awkward arms as you climb. Drag along two cells to place a domino, tap to remove, unlimited undo. Every board is generated from a valid tiling, so a solution always exists.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What is the parity trick in domino tiling?",
        a: "Colour the board like a chessboard. Every domino covers one light and one dark cell, so a region with unequal light and dark counts can never be tiled. It rules out dead ends instantly.",
      },
      {
        q: "Can dominoes be rotated?",
        a: "Yes — every domino can be placed horizontally or vertically. That's the only transformation there is.",
      },
      {
        q: "Is every board solvable?",
        a: "Yes. Each level is generated from a complete valid tiling and then presented to you, so a solution is guaranteed to exist.",
      },
    ],
    related: ["shikaku-patch-puzzle", "zip-one-line-path-puzzle", "block-fit-puzzle"],
    cta: play("domino", "Domino Fit", "99 tiling levels, drag to place, unlimited undo. Free, no account, plays offline."),
  },

  {
    slug: "wend-word-path-puzzle",
    eyebrow: "Word Games",
    title: "Wend: Four Hidden Words, Every Letter Used 🔤",
    seoTitle: "Wend Word Path Puzzle — Free Online, 99 Levels, No Sign-Up",
    metaDesc:
      "Trace four hidden words through a grid of letters, using every tile exactly once. Part word search, part deduction. 99 free levels, no account needed.",
    excerpt:
      "Four words snake through a grid of letters, and every single tile belongs to one of them. Find three and the fourth is forced.",
    date: "2026-08-10",
    readMin: 4,
    image: "wend",
    lead:
      "Wend looks like a word search and plays like a logic puzzle. Four words are hidden in the grid, traced as winding paths through adjacent tiles — and crucially, every tile in the grid belongs to exactly one of them.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "trick", label: "Why 'every tile' is the real clue" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Drag through adjacent letter tiles to trace a word. Paths can turn in any direction, including diagonally, but can't reuse a tile. Find all four words to clear the level.</p>
          <p>You're told how many words there are and how long each one is. You're not told what they are.</p>

          <h2 id="trick">Why "every tile" is the real clue</h2>
          <p>This is what separates Wend from a word search. In a word search, the leftover letters are filler. Here there is no filler — the four words tile the grid exactly.</p>
          <p>Which means: after you've found two words, the remaining letters are the <em>complete</em> raw material for the other two. A stray Q in the corner with only a U next to it tells you a great deal. And once three words are down, the fourth isn't a search at all — it's the only path left through the remaining tiles, and you can often read it off backwards.</p>
          <p>The practical strategy is to hunt for unusual letters first. J, X, Z, Q and V each appear in comparatively few words, and their neighbours constrain the path immediately.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels with grids that grow and words that get less common as you climb. Unlimited retries, a hint that reveals a first letter rather than a whole word, and no timer — this is a game to chip away at, not to race.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Can word paths go diagonally?",
        a: "Yes. A path may move to any of the eight neighbouring tiles, and may turn as often as it likes. It just can't reuse a tile.",
      },
      {
        q: "Do all the letters get used?",
        a: "Every tile in the grid belongs to exactly one of the four words. There are no filler letters, which is exactly why the last word is deducible rather than searchable.",
      },
    ],
    related: ["five-letters-wordle-style", "word-games", "4-pics-1-word-game"],
    cta: play("wend", "Wend", "99 word-path levels, no timer, hints that nudge instead of solving. Free, no account."),
  },

  // ────────────────────────────────────────────────────────────────────────
  // Word games
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "five-letters-wordle-style",
    eyebrow: "Word Games",
    title: "Five Letters: The Daily Word Game, Plus Unlimited Practice 🔤",
    seoTitle: "Five Letters — Free Wordle-Style Word Game, Daily + Unlimited",
    metaDesc:
      "Six guesses, colour feedback, a fresh word every day and an unlimited practice mode. Learn the opening-word strategy that actually works. Free, no sign-up.",
    excerpt:
      "Six guesses and colour feedback — plus an unlimited mode so you don't have to wait until tomorrow. And the guess-two mistake almost everyone makes.",
    date: "2026-08-10",
    readMin: 5,
    image: "word5",
    lead:
      "You know this format. Six guesses, five letters, green and yellow tiles. What most people don't have is a strategy for guess two, which is where the game is actually won or lost.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "opening", label: "Choosing an opening word" },
      { id: "two", label: "The guess-two mistake" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Guess a five-letter word. Each tile comes back <strong>green</strong> (right letter, right position), <strong>yellow</strong> (right letter, wrong position) or <strong>grey</strong> (not in the word). Six guesses.</p>

          <h2 id="opening">Choosing an opening word</h2>
          <p>A good opener maximises information, not the chance of a lucky hit. That means common letters and, ideally, a shape that splits the possible answers evenly.</p>
          <p>Words like CRANE, SLATE, TRACE and ADIEU are popular for good reason: they load up on E, A, R, T, S, N and the vowels. The exact choice matters much less than people argue about — anything with three common consonants and two vowels is within a fraction of optimal.</p>
          <p>What genuinely hurts is opening with a word containing a repeated letter. FLUFF spends three of its five slots learning about one letter.</p>

          <h2 id="two">The guess-two mistake</h2>
          <p>Here's the one that costs games. You open with SLATE and get a yellow A. Instinct says: play another word with A somewhere else, to pin it down.</p>
          <p>That's usually wrong. You already know the answer contains an A and that it isn't in position three — you'll find its position eventually. What you don't know is anything about the other twenty-one letters. The stronger play is a second word made almost entirely of <em>fresh</em> common letters — think ROUND after SLATE — so that by guess three you're choosing between two or three candidates instead of twelve.</p>
          <p>Chase certainty at guess four and five. Chase information at guess two.</p>

          <h2 id="ours">About our version</h2>
          <p>A fresh word every day, the same one for everybody, resetting at midnight in your own timezone. And an <strong>unlimited practice mode</strong> — because being locked out for 24 hours after a 90-second game is a decision that serves engagement metrics rather than players.</p>
          <p>2,500 answers in the pool, an on-screen keyboard that tracks which letters you've eliminated, and a streak counter.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What's the best starting word?",
        a: "Anything with three common consonants and two vowels — CRANE, SLATE and TRACE are all excellent. The difference between the top few dozen openers is small enough not to worry about.",
      },
      {
        q: "Can I play more than once a day?",
        a: "Yes. There's a daily word and an unlimited practice mode, so you can keep playing as long as you like.",
      },
      {
        q: "When does the daily word reset?",
        a: "At midnight in your device's timezone.",
      },
    ],
    related: ["wend-word-path-puzzle", "word-games", "4-pics-1-word-game"],
    cta: play("word5", "Five Letters", "A daily word plus unlimited practice. Free, no account, works offline."),
  },

  {
    slug: "4-pics-1-word-game",
    eyebrow: "Word Games",
    title: "4 Pics 1 Word: Four Photos, One Answer 🖼️",
    seoTitle: "4 Pics 1 Word Online Free — Play in 4 Languages, No Sign-Up",
    metaDesc:
      "Four photos share a single hidden word. Spot the connection, spell it from the letter tray. Free, four languages, works offline, no account needed.",
    excerpt:
      "Four photos, one word linking them. The trick is that the link is almost never the obvious category — it's usually a second meaning.",
    date: "2026-08-10",
    readMin: 4,
    image: "4pics1word",
    lead:
      "Four photographs appear. One word connects all of them. Spell it out from a tray of jumbled letters. The format is deceptively simple and occasionally maddening, and it's one of the best language-learning games nobody designed as one.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "solving", label: "How to spot the connection" },
      { id: "lang", label: "Playing in another language" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Four images, a row of blank slots showing the word's length, and a tray of letters — the right ones plus decoys. Tap letters to fill the slots, tap a filled slot to send it back.</p>

          <h2 id="solving">How to spot the connection</h2>
          <p>The instinct is to look for a category: all four are animals, all four are red. Those make weak puzzles, and good sets avoid them.</p>
          <p>What you're usually looking for is a word with more than one sense. A photo of a river bank, a photo of a savings bank, a photo of a plane banking, a photo of a snowbank — the connection isn't a category at all, it's a homonym. Once you start looking for the second meaning first, your hit rate goes up sharply.</p>
          <p>Two practical tactics: <strong>use the length</strong>, since a four-letter answer rules out most of what you were considering; and <strong>read the letter tray</strong>, because an unusual letter like a Z or an X in the tray narrows the field enormously — decoys are chosen to be plausible, so a strange letter is usually real.</p>

          <h2 id="lang">Playing in another language</h2>
          <p>This is quietly one of the best vocabulary exercises available, because it works the way vocabulary is actually stored: image to word, with no translation step in the middle. You're not learning "chien = dog", you're attaching a word directly to four pictures of a thing.</p>
          <p>The game ships in four languages, and switching is worth doing even if you only half-speak the second one.</p>

          <h2 id="ours">About our version</h2>
          <p>Hundreds of puzzles, four languages, and no lives, no timer and no waiting. If you're stuck on one, skip it and come back.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What languages can I play in?",
        a: "Four. You can switch at any time, and progress is tracked separately for each.",
      },
      {
        q: "Is there a time limit or a lives system?",
        a: "Neither. Take as long as you want, guess as often as you want, and skip anything that's not coming to you.",
      },
    ],
    related: ["five-letters-wordle-style", "word-games", "wend-word-path-puzzle"],
    cta: play("4pics1word", "4 Pics 1 Word", "Hundreds of puzzles in four languages. Free, no lives, no timer, no account."),
  },

  {
    slug: "brain-twist-lateral-puzzles",
    eyebrow: "Brain Teasers",
    title: "Brain Twist: Riddles Where the Obvious Answer Is the Trap 🌀",
    seoTitle: "Brain Twist — Free Lateral Thinking Puzzles &amp; Tricky Riddles",
    metaDesc:
      "Lateral-thinking puzzles where the obvious answer is wrong and the real one is always fair. Play free, no sign-up, with a cast of characters and daily teasers.",
    excerpt:
      "The answer is always fair. It just requires you to drop an assumption you never noticed you'd made.",
    date: "2026-08-10",
    readMin: 4,
    image: "twist",
    lead:
      "Brain Twist is the odd one out in the hub. There's no grid, no timer and no technique to learn. There's a question, a wrong answer that feels obviously right, and a real answer that was available the whole time.",
    toc: [
      { id: "what", label: "What makes a twist puzzle work" },
      { id: "better", label: "How to get better at them" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="what">What makes a twist puzzle work</h2>
          <p>A good lateral puzzle is built on an assumption you supply yourself. The question doesn't lie to you — it just describes a situation in a way that invites one reading, and you fill in the rest without noticing.</p>
          <p>That's the whole craft, and it's also the fairness test: when you hear the answer you should think "oh, of <em>course</em>", not "that's not fair". If the solution depends on information you were never given, it isn't a twist, it's a cheat. We write to that line and occasionally throw puzzles out for crossing it. There's more on this in <a href="../how-we-design-a-tricky-level/">how we design a tricky level</a>.</p>

          <h2 id="better">How to get better at them</h2>
          <p>Three habits do most of the work.</p>
          <p><strong>Ask what you assumed.</strong> Not "what's the answer" but "what did I add to the question that wasn't there". Nearly always something about time, quantity, or who's speaking.</p>
          <p><strong>Take the words literally.</strong> Twist puzzles reward the pedant. If it says "two coins that add up to 30¢, and one of them is not a nickel", note that only <em>one</em> of them isn't.</p>
          <p><strong>Say it out loud.</strong> Genuinely — reading a riddle aloud catches ambiguity that your eye smooths over. This is also why these are better with another person in the room.</p>

          <h2 id="ours">About our version</h2>
          <p>A growing set of puzzles with a cast of characters — you can <a href="../meet-twisty-brain-twist-characters/">meet Twisty and friends</a> — plus seasonal packs for holidays. Hints escalate gently rather than dumping the answer, and nothing is timed.</p>
          <p>New to the genre? Start with <a href="../what-is-a-lateral-thinking-puzzle/">what is a lateral-thinking puzzle</a>.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What is a lateral thinking puzzle?",
        a: "A riddle solved by questioning your assumptions rather than by reasoning forward from the facts. The information you need is always present — the difficulty is that you read it in the intended-to-mislead way.",
      },
      {
        q: "Are the answers fair?",
        a: "That's the standard we hold to: when you hear the solution it should feel obvious in hindsight. A puzzle needing information you were never given isn't clever, it's broken.",
      },
    ],
    related: ["what-is-a-lateral-thinking-puzzle", "word-games", "meet-twisty-brain-twist-characters"],
    cta: play("twist", "Brain Twist", "Lateral-thinking riddles with fair answers and gentle hints. Free, no account."),
  },

  // ────────────────────────────────────────────────────────────────────────
  // Focus, memory & reaction
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "schulte-table-scan-25",
    eyebrow: "Brain Training",
    title: "Scan 25: The Schulte Table, and How to Get Faster at It 👁️",
    seoTitle: "Schulte Table Online Free — Scan 25 Attention &amp; Speed Test",
    metaDesc:
      "Find 1 to 25 in order as fast as you can. A Schulte table trains visual search and peripheral attention. Play free in 6 modes, no sign-up, works offline.",
    excerpt:
      "Twenty-five numbers, one grid, find them in order. The people who go fast aren't looking harder — they're looking less.",
    date: "2026-08-10",
    readMin: 5,
    image: "scan",
    lead:
      "Scan 25 is a Schulte table: a 5×5 grid of shuffled numbers that you tap in order from 1 to 25, against the clock. It has been used since the 1950s to measure visual search speed, and it has one counter-intuitive technique that cuts most people's time by a third.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "technique", label: "The technique: stop looking" },
      { id: "times", label: "What counts as a good time" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Twenty-five numbers scattered in a 5×5 grid. Tap 1, then 2, then 3, all the way to 25, as fast as you can. Tapping the wrong number costs you time.</p>

          <h2 id="technique">The technique: stop looking</h2>
          <p>The instinct is to scan — eyes sweeping the grid cell by cell, hunting for the next number. That's the slow way, and almost everybody does it at first.</p>
          <p>The fast way is to <strong>fix your gaze near the centre of the grid and stop moving it</strong>. Let your peripheral vision do the finding. It feels wrong, and for the first few attempts you'll be worse — then something clicks and numbers start appearing without you having searched for them.</p>
          <p>The reason is that eye movements are expensive. Each saccade plus the fixation after it costs roughly 200–300 ms, so a search that takes eight jumps costs two seconds regardless of how quickly you recognise the digit. Peripheral vision resolves digits poorly, but well enough for a large high-contrast numeral — and it processes the whole grid at once instead of one cell at a time.</p>
          <p>Two smaller gains: <strong>don't verify</strong> (once you've tapped, move on — checking costs a fixation), and <strong>keep a soft focus</strong> rather than a hard stare, which widens the useful field.</p>

          <h2 id="times">What counts as a good time</h2>
          <p>For a 5×5 grid, most people land between 35 and 60 seconds on a first attempt. Under 30 is solid. Under 20 is fast. Practised players get into the low teens.</p>
          <p>Treat published averages sceptically, though — screen size, grid size, whether you tap or click, and even your distance from the screen move the numbers a lot. Your own trend across a week is the only comparison that means anything.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels across 6 modes, including reverse order, alternating colours and larger grids for when 5×5 stops being interesting. Your times are kept on your device so you can see the trend.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What is a Schulte table?",
        a: "A grid of shuffled numbers that you find in sequence as fast as possible. It's been used since the 1950s as a measure of visual search speed and attention distribution.",
      },
      {
        q: "What is a good Schulte table time?",
        a: "On a 5×5, under 30 seconds is solid and under 20 is fast. Practised players reach the low teens, but the comparison that matters is against your own previous times.",
      },
      {
        q: "Does a Schulte table improve peripheral vision?",
        a: "It trains you to use peripheral vision more effectively during a search task, and you will get measurably faster. Whether that transfers to reading speed or anything else outside the grid is not well supported, despite what speed-reading courses claim.",
      },
    ],
    related: ["stroop-test-game", "brain-training-games", "reaction-time-test-game"],
    cta: play("scan", "Scan 25", "6 modes, 99 levels, times kept on your device. Free, no account, works offline."),
  },

  {
    slug: "stroop-test-game",
    eyebrow: "Brain Training",
    title: "Color Clash: The Stroop Test as a 60-Second Game 🎨",
    seoTitle: "Stroop Test Game Online Free — Name the Colour, Not the Word",
    metaDesc:
      "The word BLUE printed in red — answer red. A 60-second Stroop test that measures how well you suppress automatic reading. Free, no sign-up, plays offline.",
    excerpt:
      "The word BLUE printed in red ink. You have to say red, and your brain will fight you the entire time. Ninety years of psychology, in sixty seconds.",
    date: "2026-08-10",
    readMin: 5,
    image: "stroop",
    lead:
      "Color Clash shows you a colour word printed in a different colour of ink, and asks for the ink. It sounds trivial. It is measurably not, and it has been reliably not since John Ridley Stroop published the effect in 1935.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "why", label: "Why it's hard" },
      { id: "better", label: "Getting better at it" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>A word appears — say <strong>BLUE</strong>, printed in red. Tap the answer matching the <strong>ink colour</strong>: red. Sixty seconds, as many as you can, and wrong answers cost you.</p>

          <h2 id="why">Why it's hard</h2>
          <p>Reading is automatic for a literate adult. You cannot look at the word BLUE and not read it — the meaning arrives before you've decided to want it. Naming a colour, by contrast, is a deliberate act.</p>
          <p>So on a mismatched trial you have two answers competing: the fast automatic one that's wrong, and the slow deliberate one that's right. Suppressing the first costs time, and that cost — a couple of hundred milliseconds, consistently — is the Stroop effect. It shows up in essentially everyone who can read, which is why the test has survived ninety years of methodological fashion.</p>
          <p>A nice consequence: people are much quicker in a language they read poorly. If you're bilingual, try it in your weaker language and watch the interference shrink.</p>

          <h2 id="better">Getting better at it</h2>
          <p>You can't stop reading. What you can do is stop <em>waiting</em> for the read to finish.</p>
          <p><strong>Defocus the word.</strong> Look slightly past it, or at its edge. A blurred word interferes less, because the automatic read is weaker when the letters aren't sharp.</p>
          <p><strong>Answer on colour, not on language.</strong> If you name the colour to yourself in words — "that's red" — you've routed the answer back through the verbal system that's already busy fighting you. Going straight from the ink to the button is faster.</p>
          <p><strong>Accept a small error rate.</strong> Going slow enough to be perfect scores worse than going fast and missing a couple. The scoring reflects that.</p>

          <h2 id="ours">About our version</h2>
          <p>Sixty-second runs, escalating difficulty as your streak grows, and a colour palette chosen to stay distinguishable for the most common forms of colour vision deficiency. Scores stay on your device.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What is the Stroop effect?",
        a: "The consistent slowdown when naming the ink colour of a word that spells a different colour. Reading is automatic, so suppressing it costs measurable time — typically a couple of hundred milliseconds per trial.",
      },
      {
        q: "Can you train away the Stroop effect?",
        a: "Not really. You get faster at the task with practice, but the gap between matched and mismatched trials is remarkably stubborn — which is exactly why it's such a durable measure.",
      },
      {
        q: "Is it playable with colour blindness?",
        a: "The palette is chosen to stay distinguishable for the most common forms of colour vision deficiency, and the answer buttons are labelled as well as coloured.",
      },
    ],
    related: ["schulte-table-scan-25", "brain-training-games", "reaction-time-test-game"],
    cta: play("stroop", "Color Clash", "60-second Stroop runs with a colourblind-safe palette. Free, no account."),
  },

  {
    slug: "echo-memory-sequence-game",
    eyebrow: "Brain Training",
    title: "Echo: How Long a Sequence Can You Hold? 🔊",
    seoTitle: "Echo Memory Game Online Free — Simon-Style Sequence Test",
    metaDesc:
      "A sequence lights up and grows by one every round. How far can you get? A memory-span game with growing grids. Free, no sign-up, works offline.",
    excerpt:
      "A sequence lights up, you repeat it, it gets one longer. Most people stall between 7 and 10 — and there's a trick to getting past that.",
    date: "2026-08-10",
    readMin: 4,
    image: "echo",
    lead:
      "Echo is Simon, essentially: tiles light up in a sequence, you repeat it, and each round adds one more step. It is also a fair approximation of the digit-span tasks psychologists use to probe working memory, which makes the point where you fail genuinely interesting.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "chunk", label: "Chunking: how to get past 7" },
      { id: "span", label: "Why everyone stalls around the same place" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Tiles flash in a sequence. Tap them back in the same order. Get it right and the next round adds a step. Get it wrong and the run ends.</p>

          <h2 id="chunk">Chunking: how to get past 7</h2>
          <p>You will not brute-force your way past about seven steps by trying harder. What works is <strong>chunking</strong> — recoding several items as one.</p>
          <p>Three approaches, in rough order of how well they hold up:</p>
          <p><strong>Spatial shapes.</strong> Don't remember "top-left, top-right, bottom-right" — remember a shape. An L, a zigzag, a clockwise sweep. Three items become one, and a nine-step sequence becomes three shapes.</p>
          <p><strong>Rhythm.</strong> Group the sequence into beats: <em>dum-dum-DUM, dum-DUM</em>. Motor and auditory memory are separate from visual working memory, so this gives you a second channel rather than crowding the first.</p>
          <p><strong>Naming.</strong> Assign each tile a syllable and hold the sequence as a nonsense word. Effective, but it collapses fastest under pressure.</p>
          <p>The reason chunking works isn't that your capacity grows — it's that capacity is measured in chunks, and you get to decide how big a chunk is.</p>

          <h2 id="span">Why everyone stalls around the same place</h2>
          <p>Most people fail somewhere between 7 and 10 steps, and that's not a coincidence — it's roughly where estimates of short-term memory span land. Miller's famous "seven, plus or minus two" from 1956 is the version everybody's heard; later work suggests the number for genuinely unchunkable items is closer to four.</p>
          <p>Which is another way of saying: if you're getting past ten, you are definitely chunking, whether or not you noticed doing it.</p>

          <h2 id="ours">About our version</h2>
          <p>The grid grows from 3×3 to 4×4 as you climb, which stops the sequence turning into pure muscle memory. Best runs are kept on your device.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What's a good score in a memory sequence game?",
        a: "Most people stall between 7 and 10 steps. Getting past 12 reliably means you've found a chunking strategy, whether or not you set out to.",
      },
      {
        q: "How do I remember longer sequences?",
        a: "Group them. Remember three tiles as a shape rather than three positions, or as a rhythm rather than a list. Capacity is measured in chunks, and you control how big a chunk is.",
      },
    ],
    related: ["reaction-time-test-game", "brain-training-games", "schulte-table-scan-25"],
    cta: play("echo", "Echo", "Growing sequences, growing grids, best runs saved locally. Free, no account."),
  },

  {
    slug: "reaction-time-test-game",
    eyebrow: "Brain Training",
    title: "Reflex: What's Your Reaction Time? ⚡",
    seoTitle: "Reaction Time Test Online Free — Tap When It Turns Green",
    metaDesc:
      "Wait for green, tap as fast as you can. A visual reaction time test with three lives and false-start detection. Free, no sign-up, works offline.",
    excerpt:
      "Wait for green, tap. Typical is around 250ms, good is under 200, and anything under 120 means you guessed — here's why.",
    date: "2026-08-10",
    readMin: 4,
    image: "reflex",
    lead:
      "Reflex is the simplest game in the hub and the hardest one to cheat. A panel turns green; you tap. The number it gives you is how long light took to become a finger movement.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "numbers", label: "What the numbers mean" },
      { id: "faster", label: "Getting faster (a little)" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Wait. When the panel turns green, tap as fast as you can. Tap while it's still red and you lose one of your three lives. The delay before green is randomised, so you can't time it.</p>

          <h2 id="numbers">What the numbers mean</h2>
          <table>
            <thead><tr><th>Time</th><th>What it means</th></tr></thead>
            <tbody>
              <tr><td>Under 120 ms</td><td>You anticipated. Counted as a false start.</td></tr>
              <tr><td>150–200 ms</td><td>Genuinely fast.</td></tr>
              <tr><td>200–270 ms</td><td>Typical adult range for a visual cue.</td></tr>
              <tr><td>270–350 ms</td><td>Tired, distracted, or a slow input path.</td></tr>
            </tbody>
          </table>
          <p>The 120 ms floor isn't arbitrary. Signal transduction in the retina, transmission to visual cortex, decision, motor command, and muscle contraction have irreducible costs — roughly 100 ms of it before the decision even begins. A "reaction" faster than that is a prediction that happened to land.</p>
          <p>Worth knowing: your device is in the measurement. Touchscreen sampling and display refresh add anywhere from 20 to 80 ms, so comparing your phone number to somebody's desktop number is comparing two different things.</p>

          <h2 id="faster">Getting faster (a little)</h2>
          <p>Reaction time is mostly not trainable — it's dominated by hardware you don't control. What <em>is</em> under your control is the overhead you add on top.</p>
          <p><strong>Rest your finger on the screen.</strong> Movement from a hovering finger costs 30–50 ms of travel.</p>
          <p><strong>Don't stare at the panel.</strong> A soft, wide gaze detects a full-screen colour change faster than a hard focal stare, because peripheral vision has faster luminance-change detection.</p>
          <p><strong>Don't try to predict.</strong> Anticipation feels fast and produces false starts, which cost you far more than the milliseconds they save.</p>
          <p>And the boring truth: sleep and caffeine move this number more than any technique. Your morning-versus-midnight difference will be bigger than anything else on this list.</p>

          <h2 id="ours">About our version</h2>
          <p>Three lives, randomised delays, false-start detection, and a running average rather than just a best — because a best score is a lucky sample and the average is the real one.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What is a good reaction time?",
        a: "For a visual cue, around 250 ms is typical for adults and under 200 ms is fast. Anything under about 120 ms means you anticipated rather than reacted.",
      },
      {
        q: "Why does my phone give a slower time than my computer?",
        a: "Touchscreen sampling and display refresh add real latency — often 20 to 80 ms. The test measures you plus your hardware, so only compare results from the same device.",
      },
      {
        q: "Can you train reaction time?",
        a: "Only slightly. Most of the number is neural transmission and motor delay you can't change. Removing overhead — finger already on the screen, relaxed gaze — helps more than practice does, and sleep helps most of all.",
      },
    ],
    related: ["echo-memory-sequence-game", "brain-training-games", "stroop-test-game"],
    cta: play("reflex", "Reflex", "Randomised delays, false-start detection, running average. Free, no account."),
  },

  {
    slug: "math-sprint-mental-math",
    eyebrow: "Brain Training",
    title: "Math Sprint: Spot the Wrong Equation in 60 Seconds ➗",
    seoTitle: "Math Sprint — Free Mental Maths Game, 60-Second Rounds",
    metaDesc:
      "Equations flash up; decide fast whether each is right. Learn the digit tricks that let you reject an answer without calculating it. Free, no sign-up.",
    excerpt:
      "Equations flash up and you judge them true or false. The secret is that you almost never need to work out the answer.",
    date: "2026-08-10",
    readMin: 4,
    image: "math",
    lead:
      "Math Sprint throws equations at you and asks whether each is correct. Sixty seconds, as many as you can. The people who score well are not calculating faster — they're mostly not calculating at all.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "tricks", label: "Rejecting without calculating" },
      { id: "why", label: "Why this is worth doing" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>An equation appears — <code>7 × 8 = 54</code>. Tap true or false. Sixty seconds, speed and accuracy both count.</p>

          <h2 id="tricks">Rejecting without calculating</h2>
          <p>Three checks will resolve most equations in well under a second.</p>
          <p><strong>The last digit.</strong> 7 × 8 must end in 6, because 7 × 8 = 56 and the units digit of a product depends only on the units digits. So <code>7 × 8 = 54</code> is wrong on sight — no multiplication performed. This one check catches a large share of false equations.</p>
          <p><strong>Rough size.</strong> <code>47 × 21</code> is about 50 × 20, so about 1,000. An answer of 587 or 2,410 is out before you've looked at the digits.</p>
          <p><strong>Odd and even.</strong> Odd × odd is odd. Anything × even is even. Odd + odd is even. <code>13 × 17 = 220</code> dies immediately — two odds can't multiply to an even.</p>
          <p>A fourth, if you like them: <strong>casting out nines</strong>. Add the digits of each side down to a single digit; if the two don't match, the equation is false. <code>123 × 4 = 492</code> → left is (1+2+3=6) × 4 = 24 → 6; right is 4+9+2 = 15 → 6. Consistent, so probably right. It never proves an equation correct, but it disproves a lot of them fast.</p>

          <h2 id="why">Why this is worth doing</h2>
          <p>Estimation and sanity-checking are more useful in real life than exact mental arithmetic, and they're what this game actually trains. Knowing instantly that a number is the wrong <em>size</em> is the skill that catches a misplaced decimal on an invoice.</p>
          <p>We're not going to claim it makes you better at maths generally. It makes you quicker at deciding whether a number is plausible, which is a genuinely useful and much narrower thing.</p>

          <h2 id="ours">About our version</h2>
          <p>Sixty-second rounds with difficulty that scales to your streak, covering all four operations. Scores stay on your device.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "How do I check an equation quickly?",
        a: "Check the last digit of a product, check the rough size, and check odd versus even. Between them they reject most wrong equations without any calculation at all.",
      },
      {
        q: "What is casting out nines?",
        a: "Sum the digits of each side down to one digit. If the two results differ, the equation is definitely false. If they match it's probably right — the check can disprove but not prove.",
      },
    ],
    related: ["brain-training-games", "kakuro-online-free", "schulte-table-scan-25"],
    cta: play("math", "Math Sprint", "60-second rounds, all four operations, difficulty that follows your streak. Free."),
  },

  // ────────────────────────────────────────────────────────────────────────
  // Arcade & reflex
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "snake-game-online",
    eyebrow: "Arcade",
    title: "Snake: Still the Best Difficulty Curve Ever Designed 🐍",
    seoTitle: "Play Snake Online Free — Classic Arcade Game, No Sign-Up",
    metaDesc:
      "The classic Snake game, free in your browser. Swipe or use arrow keys, eat to grow, don't hit yourself. Plus the coiling strategy that gets you past 50.",
    excerpt:
      "Snake gets harder because you got better. That single design idea has kept it alive for fifty years — and there's a strategy for surviving the late game.",
    date: "2026-08-10",
    readMin: 4,
    image: "snake",
    lead:
      "Snake has been on arcade cabinets since 1976 and on nearly every phone since 1997. It survives because of one idea most games never manage: the difficulty comes entirely from your own success. Every apple you eat makes the board smaller.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "coiling", label: "Coiling: how to survive the late game" },
      { id: "why", label: "Why the design still works" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>You control a snake moving continuously around a grid. Steer with swipes or arrow keys. Eat the apple to grow one segment and score. Hit a wall or your own body and it's over.</p>

          <h2 id="coiling">Coiling: how to survive the late game</h2>
          <p>Early on you can chase apples directly. Past about thirty segments, direct routes start trapping you — you reach the apple and discover your own tail has sealed the exit.</p>
          <p>The fix is to stop thinking about the apple and start thinking about <strong>the shape of the space you're leaving behind</strong>.</p>
          <p><strong>Hug the edges.</strong> A snake coiled around the perimeter leaves one large connected open region in the middle. A snake wandering through the middle cuts that region in two, and half of it becomes unreachable.</p>
          <p><strong>Follow your own tail.</strong> If you're stuck for a safe move, trailing your own tail is always survivable — the tail moves away as you advance, so the cell is free by the time you reach it. It buys time until the next apple spawns somewhere reachable.</p>
          <p><strong>Take the long way.</strong> When an apple is two cells away but taking it seals you in, take the twelve-cell route instead. There's no time pressure in Snake; the only thing that kills you is geometry.</p>
          <p>Serious players go further and follow a Hamiltonian cycle — a fixed route through every cell that can never self-intersect — which is unbeatable but takes the fun out of it.</p>

          <h2 id="why">Why the design still works</h2>
          <p>No lives, no upgrades, no ramp designed by anyone. The game has one variable, your length, and it's the same thing as your score. That means the challenge is always exactly calibrated to how well you've been playing, which is a property most games spend enormous effort faking.</p>

          <h2 id="ours">About our version</h2>
          <p>A 17×17 grid, endless, with swipe controls on touch and arrow keys on desktop. Your best length is kept on your device, and there's a shared leaderboard if you've set a name.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "How do you get a high score in Snake?",
        a: "Stay near the walls so the open space stays in one connected piece, follow your own tail when you have no safe move, and take longer routes to an apple whenever the short one would trap you.",
      },
      {
        q: "Can Snake be played on a keyboard?",
        a: "Yes — arrow keys or WASD on desktop, swipes on touch.",
      },
    ],
    related: ["sky-jump-endless-jumper", "arcade-games", "bounce-brick-breaker"],
    cta: play("snake", "Snake", "17×17 grid, endless, swipe or arrow keys, no ads between runs. Free, no account."),
  },

  {
    slug: "sky-jump-endless-jumper",
    eyebrow: "Arcade",
    title: "Sky Jump: Bounce Up an Endless Tower ☁️",
    seoTitle: "Sky Jump — Free Endless Jumper Game Online, No Sign-Up",
    metaDesc:
      "Bounce a blob up an endless tower of platforms. Three platform types, no ceiling, one thumb. Free in your browser, no account, works offline.",
    excerpt:
      "Up is the only direction. Three platform types, no ceiling, and the surprisingly deliberate skill of not rushing.",
    date: "2026-08-10",
    readMin: 3,
    image: "jump",
    lead:
      "Sky Jump is an endless vertical jumper: your blob bounces automatically, you only steer left and right, and the screen scrolls up forever. It's the game to open when you want something to do with your thumb and nothing to do with your brain.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "platforms", label: "The three platform types" },
      { id: "tips", label: "Going higher" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Your blob bounces on its own. Steer left and right by swiping or tilting. Land on platforms to keep climbing. Fall off the bottom of the screen and the run ends.</p>
          <p>Leaving one side of the screen wraps you to the other, which is the single most useful mechanic in the game.</p>

          <h2 id="platforms">The three platform types</h2>
          <ul>
            <li><strong>Solid</strong> — bounces you reliably, every time.</li>
            <li><strong>Moving</strong> — slides side to side. Land near the centre; catching one at the edge of its travel usually throws you off course.</li>
            <li><strong>Breakable</strong> — one bounce and it's gone. Fine when there's another platform above; fatal when it was your only option and you've drifted.</li>
          </ul>

          <h2 id="tips">Going higher</h2>
          <p><strong>Don't rush.</strong> The screen only scrolls when you climb, so there's no clock. Bouncing on the same solid platform three times while you line up the next jump costs nothing.</p>
          <p><strong>Use the wrap.</strong> A platform at the far right is often quicker to reach by going left off the edge. People forget this and make long horizontal traverses instead.</p>
          <p><strong>Look up, not down.</strong> Steer for where you want to be two platforms from now. Chasing the nearest platform is how you end up on a breakable one with nothing above it.</p>

          <h2 id="ours">About our version</h2>
          <p>Endless, no ceiling, tilt or swipe controls, and instant restart when you fall — no ad, no wait. Best height is saved on your device.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "How do you control Sky Jump?",
        a: "Swipe left and right, or tilt the device if you prefer. The jumping is automatic — you only steer.",
      },
      {
        q: "Is there an end?",
        a: "No. The tower is endless; the run ends when you fall off the bottom.",
      },
    ],
    related: ["snake-game-online", "arcade-games", "stacker-tower-game"],
    cta: play("jump", "Sky Jump", "Endless tower, tilt or swipe, instant restart. Free, no ads, no account."),
  },

  {
    slug: "bounce-brick-breaker",
    eyebrow: "Arcade",
    title: "Bounce: Aim One Shot, Watch Fifteen Ricochets 🎯",
    seoTitle: "Bounce — Free Brick Breaker Game Online, No Sign-Up",
    metaDesc:
      "Aim a volley of balls at a descending wall of bricks. Learn the pocket shot and the wall-hug angle. Free in your browser, no account, works offline.",
    excerpt:
      "One aim per turn, then physics does the rest. The good shots aren't the accurate ones — they're the ones that trap a ball where it can't escape.",
    date: "2026-08-10",
    readMin: 4,
    image: "bounce",
    lead:
      "Bounce is a turn-based brick breaker. You aim once, a whole volley of balls fires along that line, and then you watch. The wall creeps down one row per turn, and when it reaches the bottom you're finished.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "pocket", label: "The pocket shot" },
      { id: "angles", label: "Angles that pay" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Drag to aim, release to fire. Every ball you have travels along that line, bouncing off walls and bricks. Each hit knocks one off a brick's number; at zero it breaks. When all the balls return, the wall drops a row and you aim again.</p>

          <h2 id="pocket">The pocket shot</h2>
          <p>The instinct is to aim at whatever brick has the highest number. That's a one-hit shot.</p>
          <p>The high-value play is to find a <strong>pocket</strong> — a gap or channel between bricks where a ball entering at a shallow angle gets caught rattling back and forth. One ball in a good pocket lands ten or fifteen hits before it escapes, and with a volley of twenty balls, a pocket clears a whole section in a single turn.</p>
          <p>Pockets appear naturally as you break bricks unevenly, which means deliberately leaving an uneven wall is often better than clearing a tidy row.</p>

          <h2 id="angles">Angles that pay</h2>
          <p><strong>Shallow beats steep.</strong> A near-horizontal shot crosses the entire board and can hit twenty bricks along the way. A vertical shot hits one column and comes straight back.</p>
          <p><strong>Use the side walls.</strong> Bricks at the far left are often easier to reach by bouncing off the right wall, and the bounce adds hits along the way.</p>
          <p><strong>Aim at the ceiling gap.</strong> If there's an opening above the wall, a ball that gets through will bounce along the top of the bricks hitting them from above, repeatedly. This is the strongest single shot in the game.</p>

          <h2 id="ours">About our version</h2>
          <p>Endless, with a ball count that grows as you collect pickups and a wall that speeds up gradually. Aim guide included, and no ad between runs.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "What's the best strategy in a brick breaker?",
        a: "Look for pockets rather than targets. A ball that gets trapped in a channel between bricks racks up ten or more hits per turn, which is worth far more than a precise shot at one brick.",
      },
      {
        q: "Should I aim high or low?",
        a: "Shallow, near-horizontal shots travel further and hit more bricks. Steep shots come straight back and waste the turn.",
      },
    ],
    related: ["arcade-games", "stacker-tower-game", "snake-game-online"],
    cta: play("bounce", "Bounce", "Endless brick breaker with an aim guide and no ads. Free, no account."),
  },

  {
    slug: "stacker-tower-game",
    eyebrow: "Arcade",
    title: "Stacker: One Tap, and the Tower Gets Narrower 🏗️",
    seoTitle: "Stacker Tower Game Online Free — Tap to Drop, No Sign-Up",
    metaDesc:
      "Tap to drop each block onto the stack. Overhang gets sliced off, so sloppy stacks narrow to nothing. Free in your browser, no account, works offline.",
    excerpt:
      "Tap to drop a block. Miss slightly and the overhang is cut away — so your mistakes are permanent and cumulative, which is the entire game.",
    date: "2026-08-10",
    readMin: 3,
    image: "stacker",
    lead:
      "Stacker is one tap. A block slides back and forth above your tower; you tap to drop it. Whatever hangs over the edge gets sliced off, and the next block is that much narrower. Your errors don't cost you a life — they cost you the width you'll need for the rest of the run.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "timing", label: "Why you keep missing" },
      { id: "recover", label: "Recovering from a bad drop" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>A block moves horizontally above your stack. Tap to drop it. The part that overlaps the block below stays; the overhang falls away. Miss completely and the run ends. Land it perfectly and you keep your full width — and get a bonus.</p>

          <h2 id="timing">Why you keep missing</h2>
          <p>Because you're tapping when the block <em>looks</em> aligned, and by the time your tap lands it has moved on. There's a delay between deciding and the block dropping — your own reaction time plus a bit of touchscreen latency, so call it 200–300 ms — and the block travels during it.</p>
          <p>The fix is to <strong>tap early</strong>, before the block reaches the target, by roughly the distance it covers in a quarter of a second. That distance grows as the game speeds up, so the lead you need grows too. This is the entire skill.</p>

          <h2 id="recover">Recovering from a bad drop</h2>
          <p>You can't get width back — every slice is permanent. What you can do is stop compounding it. After a bad drop, the tower is narrower and the tolerance is tighter, so this is the moment to slow down and take a perfect drop rather than trying to make up ground.</p>
          <p>Most runs end two or three blocks after the first real miss, because people speed up out of frustration.</p>

          <h2 id="ours">About our version</h2>
          <p>Endless, speeding up gradually, with a perfect-drop bonus and instant restart. Best height is kept on your device.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Why do my blocks always land slightly off?",
        a: "You're tapping when it looks aligned, but there's roughly a quarter-second between your decision and the drop. Tap early by however far the block travels in that time.",
      },
      {
        q: "Can you get width back after a bad drop?",
        a: "No. Every slice is permanent, which is why the run after your first real miss is the one that matters.",
      },
    ],
    related: ["arcade-games", "sky-jump-endless-jumper", "bounce-brick-breaker"],
    cta: play("stacker", "Stacker", "One tap, endless, perfect-drop bonus, instant restart. Free, no account."),
  },

  {
    slug: "merge-drop-tile-merge-game",
    eyebrow: "Arcade",
    title: "Merge Drop: Chain the Doubles, Watch It Cascade 🔷",
    seoTitle: "Merge Drop — Free Tile Merging Game Online, No Sign-Up",
    metaDesc:
      "Drop numbered tiles into five columns; equal tiles merge into their double and cascade. Free in your browser, no account, works offline. Premium tile skins.",
    excerpt:
      "Drop numbered tiles, equal ones merge into their double, and a well-built column collapses in a chain. Tile-merging with gravity instead of a slide.",
    date: "2026-08-10",
    readMin: 4,
    image: "merge",
    lead:
      "If you've played one of the tile-merging puzzles where equal numbers combine into their double, Merge Drop is that idea with gravity. Instead of sliding a whole grid, you drop one tile at a time into five columns, and the merges cascade downward on their own.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "strategy", label: "Building a cascade" },
      { id: "skins", label: "Tile skins" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>A numbered tile waits at the top. Choose a column and drop it. When it lands on a tile of the same number, the two merge into their double — and if <em>that</em> matches what's underneath, the merge continues. Fill a column to the top and the run ends.</p>
          <p>You can see the next tile, which is more important than it sounds.</p>

          <h2 id="strategy">Building a cascade</h2>
          <p><strong>Sort by size, low at the top.</strong> The ideal column reads large at the bottom and small at the top — 32, 16, 8, 4 — because then a matching 4 dropped on top collapses the entire stack in one chain. Building the reverse gives you a column you can never clear.</p>
          <p><strong>Keep one column free.</strong> The most common way to lose isn't a full board, it's having nowhere to put a tile that doesn't match anything. A deliberately empty or low column is a release valve — the same idea as a free tube in a sorting puzzle.</p>
          <p><strong>Use the preview.</strong> If the next tile is a 2 and you have a lone 2 sitting on a 4, drop the current tile somewhere else and let the 2 land on it for a double merge.</p>
          <p><strong>Don't chase the big number.</strong> Working towards one enormous tile leaves the rest of the board full of orphaned small ones. Two mid-size clean columns outlive one impressive column and four disasters.</p>

          <h2 id="skins">Tile skins</h2>
          <p>Merge Drop is where the premium tile skins apply — Neon, Candy and Mono, alongside the default palette. They come with the Theme Pack, which you can buy with coins earned in the hub, or with Plus. It's a cosmetic change to the board colours and nothing else; there's no gameplay advantage to any of them.</p>

          <h2 id="ours">About our version</h2>
          <p>Five columns, endless, with a next-tile preview and instant restart. Best score is kept on your device and posts to the shared leaderboard if you've set a name.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "How do you get a high score in Merge Drop?",
        a: "Sort each column with large tiles at the bottom and small at the top, so a single well-placed tile collapses the whole stack. And keep one column relatively empty as a release valve.",
      },
      {
        q: "Do the tile skins change the gameplay?",
        a: "No. They change the board's colours and nothing else. There is no advantage to any of them.",
      },
    ],
    related: ["arcade-games", "block-fit-puzzle", "stacker-tower-game"],
    cta: play("merge", "Merge Drop", "Five columns, endless cascades, next-tile preview. Free, no ads, no account."),
  },

  {
    slug: "flap-tap-to-fly-game",
    eyebrow: "Arcade",
    title: "Flap: Tap to Fly, Thread the Gaps 🐦",
    seoTitle: "Flap — Free Tap-to-Fly Arcade Game Online, No Sign-Up",
    metaDesc:
      "Tap to flap, thread the gaps, try not to throw your phone. A one-button arcade game built on PixiJS. Free in your browser, no account, works offline.",
    excerpt:
      "One button. Gravity pulls you down, each tap pushes you up, and the gaps are exactly as forgiving as they need to be. Which is: not very.",
    date: "2026-08-10",
    readMin: 3,
    image: "flappybird",
    lead:
      "Flap is a one-button game, and the button does the same thing every time. Gravity is constant, the tap impulse is constant, and the gaps come at a constant rate. There is nothing random and nothing unfair, which is precisely what makes losing so annoying.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "rhythm", label: "It's rhythm, not reaction" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Tap to flap upwards. Don't tap and you fall. Fly through the gap between each pair of obstacles. Touch anything and the run ends.</p>

          <h2 id="rhythm">It's rhythm, not reaction</h2>
          <p>Most people play this as a reaction game: see the gap, react, tap. That's why most people score four.</p>
          <p>It's a <strong>rhythm</strong> game. The obstacles arrive at a fixed interval, and a steady tap tempo produces a steady sawtooth flight path. Once you find the tempo that keeps you roughly level, you're only making small adjustments for gap height rather than steering from scratch each time.</p>
          <p>Two things follow from that. <strong>Small, frequent taps</strong> beat big corrections — a stream of light taps keeps you near the middle where you have room in both directions. And <strong>aim for the bottom of a high gap</strong>, because you can always rise faster than you can fall; being below your target is recoverable, being above it is not.</p>
          <p>Also: your first ten deaths are the tutorial. Nobody is good at this in the first minute, and the difficulty never actually increases — you just get further before the same mistake happens.</p>

          <h2 id="ours">About our version</h2>
          <p>Built on PixiJS from the open-games collection, so it runs at a genuine 60fps even on older phones. Endless, instant restart, no ad between runs. Best score is kept on your device and posts to the shared leaderboard if you've set a name.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Does the game get faster?",
        a: "No. The speed, gravity and gap size are constant from the first obstacle to the hundredth. It feels harder later only because you have more to lose.",
      },
      {
        q: "Any tips for a higher score?",
        a: "Tap in a steady rhythm rather than reacting to each gap, keep the taps small and frequent, and aim slightly low — you can climb faster than you fall.",
      },
    ],
    related: ["arcade-games", "bubbo-bubble-shooter", "snake-game-online"],
    cta: play("flappybird", "Flap", "One button, 60fps, instant restart, no ads. Free, no account."),
  },

  {
    slug: "bubbo-bubble-shooter",
    eyebrow: "Arcade",
    title: "Bubbo Bubbo: Bubble Shooter With 60 Levels 🫧",
    seoTitle: "Bubbo Bubbo — Free Bubble Shooter Online, 60 Levels, No Sign-Up",
    metaDesc:
      "Match three bubbles to pop them, and drop everything hanging below. 60 levels plus endless mode. Free in your browser, no account, works offline.",
    excerpt:
      "Match three to pop — but the real scoring comes from cutting a cluster loose so everything under it falls at once.",
    date: "2026-08-10",
    readMin: 3,
    image: "bubbo-bubbo",
    lead:
      "Bubble shooters look like match-three games and score like demolition games. Popping three bubbles is fine. Severing the anchor that a dozen bubbles are hanging from is where the points are.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "drops", label: "Play for drops, not pops" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Aim and fire a coloured bubble at the cluster above. Three or more of the same colour touching will pop. Any bubbles left unattached to the ceiling fall too. Let the cluster reach the bottom and you lose.</p>

          <h2 id="drops">Play for drops, not pops</h2>
          <p><strong>Look for the anchors.</strong> The cluster hangs from the ceiling. Every bubble is connected upward through a chain, and some bubbles carry a lot of weight. Pop the three bubbles that a whole branch hangs from, and the entire branch drops — often twenty bubbles for one shot.</p>
          <p><strong>Use the walls.</strong> Bubble shooters have accurate bank shots, and they're how you reach a pocket tucked under an overhang. If you can't see a direct line, there's usually a wall angle that works.</p>
          <p><strong>Prune the edges.</strong> Clearing the left and right sides opens bank-shot angles into the middle. Attacking the centre first leaves you with a wide low wall and nowhere to aim.</p>
          <p><strong>Don't fire the awkward one.</strong> If the current bubble has nowhere good to go, park it somewhere harmless at the edge rather than adding it to the middle of the cluster.</p>

          <h2 id="ours">About our version</h2>
          <p>60 levels plus an endless mode, from the PixiJS open-games collection. Aim guide, and no lives system — a failed level restarts immediately.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "How do you score highly in a bubble shooter?",
        a: "Target the bubbles a whole cluster hangs from. Anything left unattached to the ceiling falls, so one well-placed pop can drop twenty bubbles.",
      },
      {
        q: "Is there a lives or energy system?",
        a: "No. Levels restart immediately, as many times as you like.",
      },
    ],
    related: ["arcade-games", "flap-tap-to-fly-game", "block-fit-puzzle"],
    cta: play("bubbo-bubbo", "Bubbo Bubbo", "60 levels plus endless, no lives system, instant restart. Free, no account."),
  },

  // ────────────────────────────────────────────────────────────────────────
  // Casual puzzle & cards
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "water-sort-puzzle-pour",
    eyebrow: "Puzzle",
    title: "Pour: The Water Sort Puzzle, and When to Use Your Spare Tube 🧪",
    seoTitle: "Water Sort Puzzle Online Free — 99 Levels, Unlimited Undo",
    metaDesc:
      "Pour coloured liquid between tubes until each holds one colour. 99 free levels with unlimited undo, no timer and no lives. Works offline, no sign-up.",
    excerpt:
      "Sort the colours tube by tube. Every level is solvable, undo is unlimited, and the only real decision is when to spend your empty tube.",
    date: "2026-08-10",
    readMin: 4,
    image: "pour",
    lead:
      "Water sort is the puzzle equivalent of tidying a drawer. Tubes of layered colour, pour one into another, finish when every tube is a single colour. It asks almost nothing of you until it suddenly asks quite a lot.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "spare", label: "The spare tube is the whole puzzle" },
      { id: "tips", label: "Three habits that help" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Tap a tube to pick up its top colour, tap another to pour. You can only pour onto a matching colour, or into an empty tube, and only if there's room. Finish when every tube holds one colour or nothing.</p>
          <p>One detail people miss: pouring moves <strong>all</strong> the consecutive units of that colour at the top, not just one. Stacking three of a colour before you pour makes a move three times as efficient.</p>

          <h2 id="spare">The spare tube is the whole puzzle</h2>
          <p>An empty tube can accept anything. That makes it the most valuable thing on the board, and spending it is the only decision that ever really matters.</p>
          <p>The rule of thumb: <strong>only empty into a spare tube if doing so immediately frees a colour you can consolidate.</strong> Dumping a colour into your last empty tube to "get it out of the way" is how levels become unwinnable — you've converted your flexible resource into another blocked tube.</p>
          <p>Conversely, if pouring into the spare exposes a colour that then lets you unite three tubes, that's a good trade. Look one move past the pour, not at the pour itself.</p>

          <h2 id="tips">Three habits that help</h2>
          <p><strong>Finish tubes completely.</strong> A tube with all four units of one colour is done and out of play. Two tubes each half-full of the same colour are still two problems.</p>
          <p><strong>Work from the top down.</strong> Look at what's exposed right now, not at the buried colour you want. The buried one becomes available on its own once you clear above it.</p>
          <p><strong>Undo freely.</strong> There's no penalty and no move counter. Undo is a planning tool here, not an admission of failure — try a line, see where it goes, wind it back.</p>

          <h2 id="ours">About our version</h2>
          <p>99 levels, each generated by shuffling from a solved state so a solution always exists. Unlimited undo, no timer, no lives, no ad when you restart.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Is every water sort level solvable?",
        a: "Yes. Levels are generated by shuffling backwards from a completed state, so a valid sequence of pours always exists.",
      },
      {
        q: "Can you get stuck?",
        a: "You can reach a position with no legal moves, but undo is unlimited so it costs you nothing but a rewind.",
      },
      {
        q: "When should I use an empty tube?",
        a: "Only when the pour immediately exposes a colour you can then consolidate. Emptying into your last spare just to clear a top layer is the usual way a level goes wrong.",
      },
    ],
    related: ["block-fit-puzzle", "casual-puzzle-card-games", "klondike-solitaire-online"],
    cta: play("pour", "Pour", "99 levels, unlimited undo, no timer and no lives. Free, no account, works offline."),
  },

  {
    slug: "block-fit-puzzle",
    eyebrow: "Puzzle",
    title: "Block Fit: No Gravity, No Rotation, No Excuses 🧱",
    seoTitle: "Block Fit Puzzle Online Free — 8×8 Block Game, No Sign-Up",
    metaDesc:
      "Place blocks on an 8×8 board and clear lines. No gravity, no rotation — so you have to leave the right holes. Free, no account, works offline.",
    excerpt:
      "Three pieces at a time on an 8×8 board. You can't rotate them, which means bad boards are always something you did three moves ago.",
    date: "2026-08-10",
    readMin: 4,
    image: "blocks",
    lead:
      "Block Fit gives you three pieces and an 8×8 board. Place them anywhere they fit; complete a row or column and it clears. There's no falling and no timer — and crucially, no rotation, which is the constraint that turns it from a placement game into a planning one.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "norotate", label: "Why no rotation changes everything" },
      { id: "tips", label: "How to survive longer" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Three pieces are offered at a time. Drag each onto the board anywhere it fits. Fill a complete row or column and it clears. When none of your three pieces fit anywhere, the run ends.</p>

          <h2 id="norotate">Why no rotation changes everything</h2>
          <p>In a falling-block game you can spin a piece to fit whatever hole you left. Here you can't. A 1×5 horizontal bar needs five cells in a row, and if you don't have them anywhere, that piece is unplaceable and the game is over.</p>
          <p>So the game is not about placing well — it's about <strong>the shape of the holes you leave</strong>. And because you must place all three pieces before the next set arrives, a bad first placement can make the second and third unplaceable.</p>

          <h2 id="tips">How to survive longer</h2>
          <p><strong>Place the biggest piece first.</strong> If a 3×3 square is in your set, find its home before anything else. Small pieces fit in many places; large ones fit in few, and you want to know early whether this set is survivable.</p>
          <p><strong>Protect one long line.</strong> Keep at least one full row and one full column clear of stray single cells. That's your landing zone for a 5-long bar, and running out of them is the most common death.</p>
          <p><strong>Fill from the edges inward.</strong> Holes in the middle are reachable from more directions than holes in a corner, so use up the awkward corner space while you still have small pieces to do it with.</p>
          <p><strong>Never leave single-cell gaps.</strong> One orphaned empty cell in the middle of a row blocks every clear through it. A 1×1 piece to fill it may not come for a long time.</p>

          <h2 id="ours">About our version</h2>
          <p>An 8×8 board with 21 piece shapes, no timer, and a score that rewards multi-line clears. Best score is kept on your device.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Can you rotate the pieces?",
        a: "No. Every piece must be placed in the orientation you're given, which is exactly what makes the game a planning problem rather than a fitting one.",
      },
      {
        q: "When does the game end?",
        a: "When none of your three offered pieces can be placed anywhere on the board.",
      },
      {
        q: "What's the most common mistake?",
        a: "Leaving single empty cells scattered through rows. They block every line clear through them, and the 1×1 piece that would fix it may not arrive for a while.",
      },
    ],
    related: ["domino-fit-tiling-puzzle", "casual-puzzle-card-games", "water-sort-puzzle-pour"],
    cta: play("blocks", "Block Fit", "8×8 board, 21 piece shapes, no timer. Free, no account, works offline."),
  },

  {
    slug: "klondike-solitaire-online",
    eyebrow: "Cards",
    title: "Solitaire: Klondike, Draw One, Endless Deals 🃏",
    seoTitle: "Play Klondike Solitaire Online Free — Draw One, No Sign-Up",
    metaDesc:
      "Classic Klondike solitaire with draw one, unlimited undo and endless deals. Learn which pile to empty first. Free, no account, works offline.",
    excerpt:
      "Klondike, draw one, endless deals. Plus the two rules that decide most games: work the biggest pile, and don't rush an ace.",
    date: "2026-08-10",
    readMin: 4,
    image: "solitaire",
    lead:
      "Solitaire is the game everyone has played and few people have thought about. Klondike rewards a small amount of discipline enormously — the difference between playing greedily and playing deliberately is worth a lot of extra wins.",
    toc: [
      { id: "rules", label: "The rules" },
      { id: "strategy", label: "Two rules that decide most games" },
      { id: "odds", label: "Are all deals winnable?" },
      { id: "ours", label: "About our version" },
    ],
    body: `
          <h2 id="rules">The rules</h2>
          <p>Seven tableau piles, four foundations, a stock. Build the foundations up from ace to king by suit. Build the tableau down in alternating colours. Only a king can move into an empty column. Turn cards from the stock when you're stuck.</p>

          <h2 id="strategy">Two rules that decide most games</h2>
          <p><strong>1. Always uncover from the biggest pile first.</strong> Every face-down card is information you don't have. The seven-card pile hides six of them; the two-card pile hides one. When you have a choice of moves, take the one that turns over a card in the deepest pile — the payoff compounds, because the cards you reveal open further moves.</p>
          <p><strong>2. Don't send cards to the foundation too early.</strong> This is the counter-intuitive one. A 5 sitting in the tableau can accept a black 4, which might unlock a column. The same 5 on the foundation is inert. Send aces and twos up immediately, since nothing builds on them — but hold mid-range cards in the tableau while they're still doing work.</p>
          <p>Two smaller ones: <strong>empty a column only if you have a king ready to fill it</strong>, since an empty column with no king is a wasted asset; and when moving a stack to expose a card, check whether the same card is available more cheaply elsewhere.</p>

          <h2 id="odds">Are all deals winnable?</h2>
          <p>No. In draw-one Klondike roughly 80% of random deals are winnable by a player with perfect information — that is, if you could see every face-down card. Playing blind, as you actually do, real win rates for good players sit considerably lower, somewhere in the 40–50% range depending on how much you're willing to undo.</p>
          <p>So losing a hand doesn't mean you played it badly. Some deals genuinely cannot be won.</p>

          <h2 id="ours">About our version</h2>
          <p>Klondike with draw one — the more forgiving variant — unlimited undo, endless deals, and a running win count. No ads, no timer unless you want one.</p>
          <p>${FREE}</p>
`,
    faq: [
      {
        q: "Are all solitaire games winnable?",
        a: "No. With draw one, around 80% of deals are theoretically winnable if you could see every hidden card, and real win rates playing blind are well below that. Some hands are simply lost from the deal.",
      },
      {
        q: "Should I move cards to the foundation as soon as I can?",
        a: "Not always. Aces and twos, yes. Mid-range cards are often more useful in the tableau, where they can accept a card of the opposite colour and unlock a column.",
      },
      {
        q: "Which pile should I work on first?",
        a: "The biggest one. Face-down cards are hidden information, and the deepest pile hides the most — uncovering there opens up more of the board than anywhere else.",
      },
    ],
    related: ["casual-puzzle-card-games", "water-sort-puzzle-pour", "all-games"],
    cta: play("solitaire", "Solitaire", "Klondike draw one, unlimited undo, endless deals, no ads. Free, no account."),
  },

  // ────────────────────────────────────────────────────────────────────────
  // Existing hand-written articles — index + sitemap only.
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "what-is-a-lateral-thinking-puzzle",
    generate: false,
    eyebrow: "Brain Teasers",
    title: "What Is a Lateral-Thinking Puzzle? A Beginner's Guide 🧠",
    metaDesc:
      "The obvious answer is usually the wrong one. Here's what lateral-thinking brain teasers are, why they fool us every time, and how to get better at solving them.",
    date: "2026-07-13",
    readMin: 5,
  },
  {
    slug: "meet-twisty-brain-twist-characters",
    generate: false,
    eyebrow: "Behind the Game",
    title: "Meet Twisty & the Brain Twist Characters 🧠",
    metaDesc:
      "Behind every tricky puzzle is a cast of troublemakers. Meet Twisty and friends — and why a friendly cast makes a brain-teaser game feel alive.",
    date: "2026-07-13",
    readMin: 4,
  },
  {
    slug: "how-we-design-a-tricky-level",
    generate: false,
    eyebrow: "Behind the Game",
    title: "How We Design a Tricky Level 🧠",
    metaDesc:
      "Setting the trap, hiding the clue fairly, and the fine line between clever and cheap — a peek inside the craft of building a tricky puzzle.",
    date: "2026-07-13",
    readMin: 6,
  },
  {
    slug: "seasonal-brain-teasers-puzzles-for-every-holiday",
    generate: false,
    eyebrow: "Puzzle Packs",
    title: "Seasonal Brain Teasers: Puzzles for Every Holiday 🧠",
    metaDesc:
      "From spooky Halloween riddles to cosy winter teasers, seasonal puzzle packs keep a tricky puzzle game fresh all year. Here's why holiday brain puzzles work.",
    date: "2026-07-13",
    readMin: 5,
  },
  {
    slug: "brain-twist-vs-the-classics-genre-guide",
    generate: false,
    eyebrow: "Puzzle Guide",
    title: "Brain Twist vs the Classics: A Genre Guide 🧠",
    metaDesc:
      "How does a tricky puzzle game compare to Sudoku, crosswords, and match-3? A friendly guide to the genres and which brain workout each one gives you.",
    date: "2026-07-13",
    readMin: 6,
  },
  {
    slug: "mend-mindful-symmetry",
    generate: false,
    eyebrow: "Brain Games",
    title: "Mend: The Calm Symmetry Puzzle That Heals Your Focus 🧠",
    metaDesc:
      "No timer, no losing, no ads. Restore broken mandalas by completing their symmetry — a mindful, anti-doomscroll brain game you can play in 3 minutes.",
    date: "2026-06-26",
    readMin: 4,
  },
  {
    slug: "why-sudoku-web-games",
    generate: false,
    eyebrow: "Brain Games",
    title: "Sudoku Online: Your 5-Minute Brain Flex 🧠",
    metaDesc:
      "Got five minutes? Open a tab, grab a grid, flex your brain. No app, no sign-up, no nonsense — here's why browser Sudoku just hits different.",
    date: "2026-06-24",
    readMin: 3,
  },
];

export { play, FREE, PLAY };
