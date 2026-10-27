// Add a full https:// URL to href when a case has its own demo page.
// An empty href opens the existing product demo for the given role.
export const demoCases = [
  {
    id:'hand-review', role:'coach', category:'HAND REVIEW', title:'Find the decision that mattered.',
    description:'Take a closer look at a hand, one decision at a time.',
    image:'assets/stories/coach.jpg', imageAlt:'Fisher hand review demo',
    color:'#143b61', angle:-5, href:'',
  },
  {
    id:'strategy-adjustment', role:'solver', category:'SOLVER', title:'Put your read to the test.',
    description:'Explore how a different opponent strategy changes the spot.',
    image:'assets/stories/solver.jpg', imageAlt:'Fisher exploitative strategy demo',
    color:'#3f3d6e', angle:2, href:'',
  },
  {
    id:'solver-spot', role:'analyst', category:'STRATEGY EXPLORER', title:'See a spot from every angle.',
    description:'Explore a solved spot, from ranges to individual combinations.',
    image:'assets/stories/analyst.jpg', imageAlt:'Fisher solver spot exploration demo',
    color:'#164b52', angle:-2, href:'',
  },
  {
    id:'study-plan', role:'training', category:'STUDY PLAN', title:'Give your study a direction.',
    description:'Turn a learning goal into a focused poker study plan.',
    image:'assets/stories/training.jpg', imageAlt:'Fisher training plan demo',
    color:'#4c3b4d', angle:5, href:'',
  },
];

export const pokerPrompts = [
  {
    id:'review', rank:'A', suit:'♠', category:'HAND REVIEW',
    text:'Help me understand the key decision in this hand.',
    prompt:'Help me review this hand. Identify the key decision, compare my options, and explain the reasoning behind the strategy.',
  },
  {
    id:'range', rank:'K', suit:'♥', category:'RANGE EXPLORER',
    text:'Show me what this range is trying to do.',
    prompt:'Walk me through the range in this spot. Explain which hands want to bet, check, or fold, and what they have in common.',
  },
  {
    id:'node-lock', rank:'Q', suit:'♣', category:'NODE LOCKING',
    text:'What changes if my opponent folds too much?',
    prompt:'Help me use Node Lock to explore an opponent who folds more than the baseline strategy in this spot. Compare the strategies and explain the main adjustments.',
  },
  {
    id:'equity', rank:'J', suit:'♦', category:'EQUITY',
    text:'Who has the range advantage on this board?',
    prompt:'Compare the equity distributions of both ranges on this board. Explain who has the range advantage and which hands drive the difference.',
  },
  {
    id:'sizing', rank:'A', suit:'♥', category:'BET SIZING',
    text:'Why does the solver prefer this bet size?',
    prompt:'Explain the solver’s bet sizing choices in this spot. Compare the available sizes, the hands that use them, and the trade-offs between betting and checking.',
  },
  {
    id:'board', rank:'K', suit:'♣', category:'BOARD TEXTURE',
    text:'Which turn cards should I pay attention to?',
    prompt:'Help me study the possible turn cards in this spot. Group them by how they affect the board texture and explain which changes in strategy I should look for.',
  },
  {
    id:'concept', rank:'J', suit:'♠', category:'POKER CONCEPTS',
    text:'Explain blockers with an example I can follow.',
    prompt:'Explain how blockers influence a poker decision. Use a simple example, compare two candidate hands, and show why removing certain combinations matters.',
  },
  {
    id:'bluffs', rank:'10', suit:'♣', category:'BLUFF SELECTION',
    text:'Which hands make the best bluffs here?',
    prompt:'Help me study bluff selection in this spot. Compare candidate hands using blockers, equity, and future playability, and explain why some work better than others.',
  },
  {
    id:'bluff-catch', rank:'9', suit:'♦', category:'BLUFF CATCHING',
    text:'What makes this hand a good bluff-catcher?',
    prompt:'Explain the qualities of a good bluff-catcher in this spot. Compare my hand with alternatives, considering the opponent’s value range, potential bluffs, and blockers.',
  },
  {
    id:'value', rank:'8', suit:'♠', category:'VALUE BETTING',
    text:'Which worse hands can call my value bet?',
    prompt:'Help me examine a possible value bet in this spot. Identify the worse hands that could call, the better hands that continue, and how the bet size changes those ranges.',
  },
  {
    id:'checking', rank:'7', suit:'♥', category:'CHECKING RANGE',
    text:'Which strong hands belong in my check range?',
    prompt:'Explain how to build a checking range in this spot. Show which strong hands check alongside weaker hands and how those choices affect later streets.',
  },
  {
    id:'c-betting', rank:'7', suit:'♣', category:'C-BET STRATEGY',
    text:'Why does this board favor frequent c-bets?',
    prompt:'Help me investigate continuation betting on this board. Compare the ranges, nut advantage, and equity distribution before explaining the betting frequency.',
  },
  {
    id:'hand-comparison', rank:'5', suit:'♣', category:'HAND COMPARISON',
    text:'Compare two hands with similar equity.',
    prompt:'Compare two hands with similar equity in this spot. Explain how blockers, equity realization, and future playability can lead them to take different actions.',
  },
];
