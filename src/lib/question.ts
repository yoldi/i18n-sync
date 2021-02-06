const rlp = require('readline');

export function question(query: string): Promise<string> {
  const rl = rlp.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question(query, (answer: string) => resolve(answer));
  });
}
