/* dependencies */
import { getByTestId } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

import SubnavHome from '../SubnavHome';
import { getToday } from '@Utils/calcDate';

let subnav: SubnavHome;
let subnavComponent: HTMLElement;

describe('SubnavHome Component test', () => {
  beforeEach(() => {
    subnav = new SubnavHome();
    if (subnav.shadowRoot?.childNodes[0]) {
      subnavComponent = (subnav.shadowRoot as unknown) as HTMLElement;
    }
  });

  it('check date', () => {
    const [hour, minute, year, month, day, dow] = getToday();

    const dateHTML = getByTestId(subnavComponent, 'date').innerHTML;
    expect(dateHTML).toContain(year);
    expect(dateHTML).toContain(month);
    expect(dateHTML).toContain(day);

    const dowHTML = getByTestId(subnavComponent, 'dow').innerHTML;
    expect(dowHTML).toContain(dow);

    const timeHTML = getByTestId(subnavComponent, 'time').innerHTML;
    expect(timeHTML).toContain(hour);
    expect(timeHTML).toContain(minute);
  });
});
