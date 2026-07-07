export const linearFunctionsContextPack = Object.freeze({
  target: Object.freeze({
    examId: 'sat',
    subjectId: 'sat-math',
    domainId: 'algebra',
    skillId: 'linear-functions',
  }),
  label: 'Linear functions',
  materialNotice: 'Original sample material created for this prototype; not copied from an SAT or commercial practice test.',
  relevanceRules: Object.freeze({
    skillKeywords: Object.freeze([
      'linear function', 'slope', 'intercept', 'rate of change', 'y =', 'table', 'graph', 'function value',
    ]),
    followUpPrefixes: Object.freeze([
      'why', 'how', 'can you', 'could you', 'show', 'explain', 'check', 'what about', 'another', 'is that', 'does that',
    ]),
    followUpTerms: Object.freeze(['that', 'it', 'this method', 'another method', 'alternative']),
  }),
  materials: Object.freeze([
    Object.freeze({
      id: 'linear-functions-original-1',
      label: 'Original linear-functions sample 1',
      problem: 'For the linear function f(x) = 3x - 4, what are the slope and y-intercept?',
      explanation: 'Compare $f(x) = 3x - 4$ with slope-intercept form $y = mx + b$. The coefficient of $x$ is the slope, so $m = 3$. The constant is the y-intercept, so $b = -4$ and the graph crosses the y-axis at $(0,-4)$.',
      alternativeMethod: 'Evaluate $f(0)$ to find the y-intercept: $f(0) = -4$. Then compare two inputs one unit apart; the outputs increase by $3$, confirming the slope.',
      keywords: Object.freeze(['3x', '- 4', 'slope', 'y-intercept', 'intercept', 'f(x)']),
    }),
    Object.freeze({
      id: 'linear-functions-original-2',
      label: 'Original linear-functions sample 2',
      problem: 'A table contains the points (1, 5), (3, 11), and (5, 17). Write the linear function represented by the table.',
      explanation: 'Between consecutive points, $x$ increases by $2$ while $y$ increases by $6$, so the slope is $m = \\frac{6}{2} = 3$. Substitute $(1,5)$ into $y = 3x + b$: $5 = 3(1) + b$, so $b = 2$. The function is $f(x) = 3x + 2$.',
      alternativeMethod: 'Check the proposed rule directly: $3(1)+2=5$, $3(3)+2=11$, and $3(5)+2=17$.',
      keywords: Object.freeze(['table', '(1, 5)', '(3, 11)', '(5, 17)', 'write', 'function', 'rate of change']),
    }),
    Object.freeze({
      id: 'linear-functions-original-3',
      label: 'Original linear-functions sample 3',
      problem: 'A tank contains 50 liters of water and fills at 8 liters per minute. Model the amount of water after t minutes.',
      explanation: 'The initial amount is $50$ liters, and the constant rate of change is $8$ liters per minute. Therefore the linear model is $W(t) = 50 + 8t$.',
      alternativeMethod: 'Build the model as initial value plus rate times time: $W(t) = 50 + (8)(t)$.',
      keywords: Object.freeze(['tank', '50', '8 liters', 'minute', 'model', 'initial', 'rate']),
    }),
  ]),
})
