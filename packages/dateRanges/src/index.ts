type Range = {
  startDate: Date;
  endDate: Date;
};

const dates = [
  { startDate: '2020-03-18T00:00:00.000Z', endDate: '2020-03-21T00:00:00.000Z' },
  { startDate: '2020-03-19T00:00:00.000Z', endDate: '2020-03-20T00:00:00.000Z' },
  { startDate: '2020-03-17T00:00:00.000Z', endDate: '2020-03-22T00:00:00.000Z' },
  { startDate: '2020-03-09T00:00:00.000Z', endDate: '2020-03-16T00:00:00.000Z' },
  { startDate: '2020-02-07T00:00:00.000Z', endDate: '2020-03-09T00:00:00.000Z' },
  { startDate: '2020-02-07T00:00:00.000Z', endDate: '2020-02-13T00:00:00.000Z' },
];

let state: Range[] = [];

export const getOverlaps = (newRange: Range): Range[] => state.filter((range: Range) => (
  (newRange.endDate <= range.endDate && newRange.endDate >= range.startDate)
  || (newRange.startDate <= range.endDate && newRange.startDate >= range.startDate)
  || (range.endDate <= newRange.endDate && range.endDate >= newRange.startDate)
  || (range.startDate <= newRange.endDate && range.startDate >= newRange.startDate)
));

export const add = (newRange: Range) => {
  const overlaps = getOverlaps(newRange);
  const combine = overlaps.reduce((acc, range: Range) => ({
    startDate: acc.startDate < range.startDate ? acc.startDate : range.startDate,
    endDate: acc.endDate > range.endDate ? acc.endDate : range.endDate,
  }), newRange);
  state = state.filter((range) => !overlaps.includes(range)).concat(combine);
};
export const includes = (newRange: Range) => (
  !!state.find((range) => newRange.startDate >= range.startDate && newRange.endDate <= range.endDate)
);

export const getAfter = (date: Date) => {
  const contain = state.find((range) => range.startDate <= date && range.endDate >= date);
  if (contain) return contain.endDate;
  return date;
};

export const get = () => state;

dates.forEach((range) => add({ startDate: new Date(range.startDate), endDate: new Date(range.endDate) }));

console.log(get());

console.log(includes({ startDate: new Date('2020-03-19T00:00:00.000Z'), endDate: new Date('2020-03-20T00:00:00.000Z') }));
console.log(includes({ startDate: new Date('2020-03-19T00:00:00.000Z'), endDate: new Date('2020-03-30T00:00:00.000Z') }));
console.log(getAfter(new Date('2020-03-12')));
console.log(getAfter(new Date('2020-07-12')));
