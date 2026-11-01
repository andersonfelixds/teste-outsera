export function getProducerIntervals(db) {
  const rows = db
    .prepare(
      'SELECT producer, year FROM movies WHERE winner = 1 ORDER BY producer, year ASC'
    )
    .all();

  const winsByProducer = new Map();
  const intervals = [];
  let minValue = Infinity;
  let maxValue = -Infinity;

  for (const { producer, year } of rows) {
    if (!winsByProducer.has(producer)) winsByProducer.set(producer, []);
    const years = winsByProducer.get(producer);
    years.push(year);

    if (years.length >= 2) {
      const interval = year - years[years.length - 2];
      const record = {
        producer,
        interval,
        previousWin: years[years.length - 2],
        followingWin: year,
      };
      intervals.push(record);
      if (interval < minValue) minValue = interval;
      if (interval > maxValue) maxValue = interval;
    }
  }

  if (intervals.length === 0) return { min: [], max: [] };

  return {
    min: intervals.filter((i) => i.interval === minValue),
    max: intervals.filter((i) => i.interval === maxValue),
  };
}
