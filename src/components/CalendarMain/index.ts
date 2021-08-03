import {
  ShellHTML,
  createComponent,
  useGlobalState,
  setGlobalState,
  EventType,
} from 'shell-html';
import styleSheet from './style.scss';

class Calendar extends ShellHTML {
  connectedCallback() {
    this.enrollObserving('dateInfo');
  }

  disconnectedCallback() {
    this.releaseObserving('dateInfo');
  }

  changeMonthHandler(value: number) {
    return () => {
      const dateInfo = useGlobalState('dateInfo');
      const newDate = new Date(
        dateInfo.date.setMonth(dateInfo.date.getMonth() + value)
      );
      setGlobalState('dateInfo', { ...dateInfo, date: newDate });
    };
  }

  render() {
    const { date } = useGlobalState('dateInfo');

    return {
      html: `
        <div id="container">
          <header>
            <div class="top">
              <h2 class="title">Calendar</h2>
              <div class="date-nav">
                <button class="back-btn"><</button>
                <div class="date">
                  <span class="year">${date.getFullYear()}</span>
                  <span class="month">${date.getMonth() + 1}월</span>
                </div>
                <button class="ahead-btn">></button>
              </div>
              <button class="add-btn">+</button>
            </div>
          </header>
        </div>
      `,
      css: styleSheet,
      eventFuncs: [
        {
          className: 'back-btn',
          func: this.changeMonthHandler(-1),
          type: EventType.click,
        },
        {
          className: 'ahead-btn',
          func: this.changeMonthHandler(1),
          type: EventType.click,
        },
      ],
    };
  }
}

createComponent('calendar-main', Calendar);
