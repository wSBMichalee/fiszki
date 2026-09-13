function getWeightedShuffle(cards, unlearnedWeight = 3) {
  return [...cards].sort((a, b) => {
    const weightA = a.learned ? 1 : unlearnedWeight;
    const weightB = b.learned ? 1 : unlearnedWeight;
    
    // Sort descending by random key: Math.random() ** (1 / weight)
    const keyA = Math.pow(Math.random(), 1 / weightA);
    const keyB = Math.pow(Math.random(), 1 / weightB);
    
    return keyB - keyA;
  });
}

const cards = [
  { id: 1, learned: true },
  { id: 2, learned: true },
  { id: 3, learned: false },
  { id: 4, learned: false },
  { id: 5, learned: true },
  { id: 6, learned: true },
  { id: 7, learned: true },
  { id: 8, learned: true },
];

const counts = { false: 0, true: 0 };
for(let i=0; i<10000; i++) {
  const shuffled = getWeightedShuffle(cards);
  // check first element
  counts[shuffled[0].learned]++;
}
console.log(counts);
