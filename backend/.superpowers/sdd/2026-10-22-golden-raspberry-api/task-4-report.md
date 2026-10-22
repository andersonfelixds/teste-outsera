# Task 4 Report: producerService

## 1. Código: `src/services/producerService.js`

```js
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
```

## 2. Teste manual com os dados reais (343 linhas, CSV carregado via loader)

- min: Bo Derek, intervalo 6 (1984 -> 1990)
- max: Matthew Vaughn, intervalo 13 (2002 -> 2015)

## 3. Casos sintéticos

Dados: A [2000, 2001, 2005], B [1990, 2000], C [2008, 2009], D vence 2010 (perde 2011), E vence só 1990.

- min: A (2000->2001 = 1) e C (2008->2009 = 1, não 0)
- max: B (1990->2000 = 10)
- D e E (uma vitória só) ficam de fora
- Banco vazio retorna `{ "min": [], "max": [] }`

## 4. Preocupações e desvios

- Nenhum desvio do brief.
- **Problema no Task 3 (não corrigido, fora do escopo):** o `csvLoader` separa produtores só por `', '`, mas o CSV tem 134 linhas com `' and '` (ex.: "Steven Perry and Joel Silver"). Esses nomes ficam como um produtor único. Efeito comprovado: Joel Silver tem vitórias em 1990 (junto com Steven Perry, não separado) e 1991, então o intervalo de 1 ano dele não aparece, e o min real sai como 6 (Bo Derek). Se o esperado for o min de 1 ano, o loader precisa separar também por `' and '`. Isto é dedução sobre a causa, confirmei só os dados acima.
- Se o mesmo produtor vence duas vezes no mesmo ano, o intervalo é 0 e entraria como min. Não ocorreu nos dados testados, mas não tratei.

## 5. Resumo

Testes manuais: 3/3 cenários OK (sintético, dados reais, banco vazio); sem testes automatizados jest nesta task.
