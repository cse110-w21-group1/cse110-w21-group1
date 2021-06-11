/**
 * @jest-environment puppeteer
 */

//import {router} from '../scripts/router';
//import {script} from '../scripts/script';

describe('Basic user flow for SPA ', () => {
    beforeAll(async () => {
      await page.goto('http://localhost:5500/source/index.html');
      await page.waitForTimeout(1000);
    }, 10000);

    // Check if calendar button works
    it('Test 1: Check Calendar Button', async () => {
        await page.click('img[id="calendar"]');
        expect(page.mainFrame().url()).toContain('#calendar');
    });

    // Check if new note appends new button to list
    it('Test 2: Check New Note appends new note', async () => {
        await page.click('img[id="home"]');
        await page.click('button[class="newNotesButton"]');
        const newLength = (await page.$$('ul[id="noteslist"]')).length;
        expect(newLength).toEqual(1);
    }, 10000);

    it('Test 3: Notes save properly', async() => {
        await page.click('input#title');
        await page.keyboard.type('Test Note');
        await page.click('button.save');
        await page.click('button.newNotesButton');
        await page.click('ul#noteslist > button:first-child');
        const noteTitleElem = await page.$('input#title');
        const noteTitle = await page.evaluate((textField) => textField.value, noteTitleElem);
        expect(noteTitle).toMatch('Test Note');
    }, 10000);

    it('Test 4: Check events tag and reminders page when event is within week', async() => {
        await page.click('input#title');
        await page.keyboard.type('Test Note 2');
        await page.select('select#tag', 'Event');
        await page.click('#date1');
        await page.keyboard.type('06112021');
        await page.click('#date2');
        await page.keyboard.type('06142021');
        await page.click('#time1');
        await page.keyboard.type('0504p');
        await page.click('#time2');
        await page.keyboard.type('0705p');
        await page.click('button.save');

        const time = await page.$('#date1');
        expect(time).toEqual('2021-06-14');

        const remindersLength = (await page.$$('ul[id="eventsList"] > li')).length;
        // expect(remindersLength).toEqual(1);
    }, 10000);

    it('Test 5: Check if calendar updated with event', async () =>{
        await page.click('img[id="calendar"]');
        const harness = await page.$('td[data-date="2021-06-11"] div.fc-daygrid-event-harness');
        expect(harness).toBeDefined();
    });

    it('Test 6: Check events tag and reminders page when event is within week', async() => {
        await page.click('img[id="home"]');
        await page.click('button.newNotesButton');
        await page.click('input#title');
        await page.keyboard.type('Test Note 3');
        await page.select('select#tag', 'Event');
        await page.click('#date1');
        await page.keyboard.type('06212021');
        await page.click('#date2');
        await page.keyboard.type('06242021');
        await page.click('#time1');
        await page.keyboard.type('0504p');
        await page.click('#time2');
        await page.keyboard.type('0705p');
        await page.click('button.save');
        
        const remindersLength = (await page.$$('ul[id="eventsList"] > li')).length;
        expect(remindersLength).toEqual(1);
    }, 10000);

    it('Test 7: Check that to-do list works', async() => {
        await page.click('#input-task');
        await page.keyboard.type('Test Task 1');
        await page.click('#add-task-btn');
        await page.click('#input-task');
        await page.keyboard.type('Test Task 2');
        await page.click('#add-task-btn');
        const taskLength = (await page.$$('ul[id="tasks"] > li')).length;
        expect(taskLength).toEqual(2);
    }, 10000);
    

    it('Test 8: Check if filtering, displays the correct notes', async () =>{
        await page.click('input#title');
        await page.keyboard.type('Test Note');
        
        await page.select('select#tag', 'Notes');
        await page.click('button.save');
        await page.click('button.newNotesButton');
        await page.click('select#Notes', 'Notes');
        const filteredLength = (await page.$$('ul[id="noteslist"] > button[style*="display: block]"')).length;
        // await page.click('ul#noteslist > button:first-child');
        // const noteTitleElem = await page.$('input#title');
        // const noteTitle = await page.evaluate((textField) => textField.value, noteTitleElem);
        expect(filteredLength).toEqual(1);
    });
});
