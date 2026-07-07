export const linearEquationsOneVariableContextPack = Object.freeze({
  target: Object.freeze({
    examId: 'sat',
    subjectId: 'sat-math',
    domainId: 'algebra',
    skillId: 'linear-equations-one-variable',
  }),
  label: 'Linear equations in one variable',
  materialNotice: 'Original sample material created for this prototype; not copied from an SAT or commercial practice test.',
  relevanceRules: Object.freeze({
    skillKeywords: Object.freeze([
      'linear', 'one variable', 'isolate', 'coefficient', 'equation', 'solve', 'both sides', 'word problem',
    ]),
    followUpPrefixes: Object.freeze([
      'why', 'how', 'can you', 'could you', 'show', 'explain', 'check', 'what about', 'another', 'is that', 'does that',
    ]),
    followUpTerms: Object.freeze(['that', 'it', 'this method', 'another method', 'alternative']),
  }),
  materials: Object.freeze([
    Object.freeze({
      id: 'original-sample-1',
      label: 'Original sample problem 1',
      problem: 'Solve 3x + 5 = 20.',
      explanation: 'Subtract $5$ from both sides to get $3x = 15$. Divide both sides by $3$: $$\\frac{3x}{3} = \\frac{15}{3}$$ Therefore, $x = 5$. Check: $3(5) + 5 = 20$.',
      alternativeMethod: 'Work backward from $20$: undo adding $5$, then undo multiplying by $3$.',
      keywords: Object.freeze(['3x', '20', 'solve', 'equation', 'subtract', 'divide']),
    }),
    Object.freeze({
      id: 'original-sample-2',
      label: 'Original sample problem 2',
      problem: 'A streaming plan costs $8 plus $3 per movie. The bill is $29. How many movies were rented?',
      explanation: 'Let $m$ be the number of movies. Write $8 + 3m = 29$. Subtract $8$ to get $3m = 21$, then divide by $3$: $$m = \\frac{21}{3} = 7$$ The answer is $7$ movies.',
      alternativeMethod: 'Remove the fixed $8 charge first. The remaining $21 represents equal $3 movie charges, so $21 \\div 3 = 7$.',
      keywords: Object.freeze(['streaming', 'movie', 'bill', 'cost', '29', 'word problem']),
    }),
    Object.freeze({
      id: 'original-sample-3',
      label: 'Original sample problem 3',
      problem: 'Solve 4(x - 2) = 2x + 10.',
      explanation: 'Distribute to get $4x - 8 = 2x + 10$. Subtract $2x$ from both sides, then add $8$: $2x = 18$. Divide by $2$: $$x = \\frac{18}{2} = 9$$',
      alternativeMethod: 'After distributing, collect variable terms on one side and constants on the other in whichever order feels clearest.',
      keywords: Object.freeze(['4(x', '2x', 'distribute', 'parentheses', 'equation', 'solve']),
    }),
  ]),
})
