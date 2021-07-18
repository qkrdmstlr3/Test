import { ShellHTML, createComponent } from 'shell-html';
import styleSheet from './style.scss';

class Calendar extends ShellHTML {
  render() {
    return {
      html: `
        <div id="container">
          <header>
            <div class="top">
              <h2 class="title">Calendar</h2>
              <div class="date-nav">
                <button class="back-btn"><</button>
                <div class="date">
                  <span class="year">2021</span>
                  <span class="month">3월</span>
                </div>
                <button class="ahead-btn">></button>
              </div>
              <button class="add-btn">+</button>
            </div>
          </header>
        </div>
      `,
      css: styleSheet,
      eventFuncs: [],
    };
  }
}

createComponent('calendar-main', Calendar);
