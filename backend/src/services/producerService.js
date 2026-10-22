export function getProducerIntervals(db) {
  const rows = db
    .prepare(
      'SELECT producer, year FROM movies WHERE winner = 1 ORDER BY producer, year ASC'
    )
    .all();

  const winsByProducer = new Map();
  for (const { producer, year } of rows) {
    if (!winsByProducer.has(producer)) winsByProducer.set(producer, []);
    winsByProducer.get(producer).push(year);
  }

  const intervals = [];
  for (const [producer, years] of winsByProducer) {
    if (years.length < 2) continue;
    for (let i = 1; i < years.length; i++) {
      intervals.push({
        producer,
        interval: years[i] - years[i - 1],
        previousWin: years[i - 1],
        followingWin: years[i],
      });
    }
  }

  if (intervals.length === 0) return { min: [], max: [] };

  let minValue = Infinity;
  let maxValue = -Infinity;
  for (const { interval } of intervals) {
    if (interval < minValue) minValue = interval;
    if (interval > maxValue) maxValue = interval;
  }

  return {
    min: intervals.filter((i) => i.interval === minValue).sort((a, b) => a.interval - b.interval),
    max: intervals.filter((i) => i.interval === maxValue).sort((a, b) => b.interval - a.interval),
  };
}
