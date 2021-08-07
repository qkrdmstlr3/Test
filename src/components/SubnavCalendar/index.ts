import {
  ShellHTML,
  createComponent,
  RenderType,
  useGlobalState,
} from 'shell-html';
import styleSheet from './style.scss';

class SubnavCalendar extends ShellHTML {
  connectedCallback(): void {
    this.enrollObserving('dateInfo');
  }

  disconnectedCallback(): void {
    this.releaseObserving('dateInfo');
  }
  render(): RenderType {
    const { selectedYear, selectedMonth, selectedDay } = useGlobalState(
      'dateInfo'
    );
    return {
      html: `
      <nav class="nav">
        ${
          selectedYear
            ? `
            <div class="date-container">
              <h4>${selectedYear} / ${selectedMonth + 1}</h4>
              <h2>${selectedDay}</h2>
            </div>
            `
            : ''
        }
      </nav>
      `,
      css: styleSheet,
      eventFuncs: [],
    };
  }
}

createComponent('subnav-calendar', SubnavCalendar);

export default SubnavCalendar;
